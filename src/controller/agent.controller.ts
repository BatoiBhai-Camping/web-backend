import bcrypt from "bcryptjs";
import { db } from "../db/db.js";
import { ApiError } from "../uitls/apiError.js";
import { asyncHandler } from "../uitls/asyncHandler.js";
import { agentRegisterValidator } from "../validator/agent.validator.js";
import type { Request, Response } from "express";
import {
  createAccessToken,
  createRefreshToken,
  createVerificationToken,
} from "../helper/createAccessRefreshAndVerificationToken.js";
import { validENV } from "../validator/env.validator.js";
import { sendAccountVerificationMail } from "../helper/sendMail.js";

const agentRegister = asyncHandler(async (req: Request, res: Response) => {
  const valid = agentRegisterValidator.safeParse(req.body);
  if (!valid.success) {
    throw new ApiError(400, valid.error.message);
  }

  const data = valid.data;

  // Check if email exists
  const existing = await db.bb_user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new ApiError(400, "Email already registered");

  const hashedPass = await bcrypt.hash(data.password, 10);

  //start the transaction
  const agentAccountRes = await db.$transaction(async (tx) => {
    // 1. Create user
    const user = await tx.bb_user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: hashedPass,
        role: "AGENT",
        phone: data.phone,
      },
    });

    // 2. Create address
    await tx.bb_address.create({
      data: {
        userId: user.id,
        addressType: data.addressType,
        country: data.country,
        state: data.state,
        district: data.district,
        pin: data.pin,
        city: data.city,
        longitude: data.longitude ?? null,
        latitude: data.latitude ?? null,
      },
    });

    // 3. Create profile image
    const profileImage = await tx.bb_image.create({
      data: {
        imageUrl: data.profileImageUrl,
        fileId: data.profileImageFileId,
      },
    });

    // 4. Attach profile image to user
    await tx.bb_user.update({
      where: { id: user.id },
      data: { profileImageId: profileImage.id },
    });

    // 5. Create agent profile (no banner yet)
    const agent = await tx.bb_agentProfile.create({
      data: {
        userId: user.id,
        companyName: data.companyName,
        description: data.description,
        aadharNumber: data.aadharNumber,
        panNumber: data.panNumber ?? null,
        gstNumber: data.gstNumber ?? null,
      },
    });

    // 6. Create banner image
    const banner = await tx.bb_image.create({
      data: {
        imageUrl: data.bannerImageUrl,
        fileId: data.bannerImageFileId,
      },
    });

    // Attach banner to agent
    await tx.bb_agentProfile.update({
      where: { id: agent.id },
      data: { bannerImageId: banner.id },
    });

    // 7. Create AADHAR document
    await tx.bb_document.create({
      data: {
        documentType: "AADHAR",
        documentUrl: data.aadharDocumentUrl,
        documentFileId: data.aadharDocumentFileId,
        agentId: agent.id,
      },
    });

    // 8. Create PAN document (optional)
    if (data.panDocumentUrl) {
      await tx.bb_document.create({
        data: {
          documentType: "PAN",
          documentUrl: data.panDocumentUrl,
          documentFileId: data.panDocumentFileId ?? null,
          agentId: agent.id,
        },
      });
    }

    return { user };
  }); // transaction end

  // Create access and refresh token
  const accessToken = await createAccessToken({
    userId: agentAccountRes.user.id,
    email: agentAccountRes.user.email,
  });

  const refreshToken = await createRefreshToken(agentAccountRes.user.id);

  await db.bb_user.update({
    where: { id: agentAccountRes.user.id },
    data: { refreshToken },
  });

  const verifyToken = await createVerificationToken(agentAccountRes.user.email);

  await db.bb_user.update({
    where: { id: agentAccountRes.user.id },
    data: { verifyToken },
  });

  // Set cookies
  res.cookie("accesstoken", `Bearer ${accessToken}`, {
    httpOnly: true,
    secure: validENV.NODE_ENV === "production",
    sameSite: validENV.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshtoken", `Bearer ${refreshToken}`, {
    httpOnly: true,
    secure: validENV.NODE_ENV === "production",
    sameSite: validENV.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });

  // Send verification email
  await sendAccountVerificationMail({
    reciverGamil: agentAccountRes.user.email,
    reciverName: agentAccountRes.user.fullName,
    verificationLink: verifyToken,
  });

  return res.status(201).json({
    success: true,
    message: "Agent account created successfully. Please verify your email.",
  });
});

export { agentRegister };
