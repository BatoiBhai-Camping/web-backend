import type { Request, Response } from "express";

import { asyncHandler } from "../../uitls/asyncHandler.js";
import {
  userRegisterValidator,
  
} from "../../validator/user.validator.js";
import { ApiError } from "../../uitls/apiError.js";
import { db } from "../../db/db.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  createVerificationToken,
} from "../../helper/createAccessRefreshAndVerificationToken.js";
import { validENV } from "../../validator/env.validator.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { sendAccountVerificationMail } from "../../helper/sendMail.js";
import { type JwtPayload } from "jsonwebtoken";

interface VerificationPayload extends JwtPayload {
  email: string;
}

const adminRegister = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;

  // validate the data
  const validRes = userRegisterValidator.safeParse(userData);
  if (!validRes.success) {
    throw new ApiError(
      400,
      validRes.error.message || "Provided data are invalid",
    );
  }
  const data = validRes.data;
  // check email exist or not
  const userExists = await db.bb_user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (userExists) {
    throw new ApiError(
      400,
      "User email already exist, try another email or loging",
    );
  }
  //hash the password
  const hashedPass = await bcrypt.hash(data.password, 10);
  //create the user
  const user = await db.bb_user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashedPass,
      role: "ADMIN",
      roleStatus: "PENDING",
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      emailVerified: true,
      role: true,
      roleStatus: true,
      phone: true,
      createdAt: true,
      profileImage:{
        select:{
          imageUrl: true,
        }
      },
      address:{
        select:{
          addressType: true,
          city: true,
          country: true,
          district: true,
          pin: true, 
          state: true,

        }
      }
    },
  });

  // create an verification token and store it with the user db
  const verificationToken = await createVerificationToken(user.email);
  await db.bb_user.update({
    where: {
      id: user.id,
    },
    data: {
      verifyToken: verificationToken,
    },
  });

  // send the verification code to the user for account verificaton
  sendAccountVerificationMail({
    reciverGamil: user.email,
    reciverName: user.fullName,
    verificationLink: verificationToken, //the verification link is a frontend url which contain the verification token
  });

  // create and set the new access and refresh token in the cookie and db
  const accessToken = await createAccessToken({
    userId: user.id,
    email: user.email,
  });
  const refreshToken = await createRefreshToken(user.id);

  await db.bb_user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: refreshToken,
    },
  });
  res.cookie("accesstoken", `Bearer ${accessToken}`, {
    httpOnly: true,
    sameSite: validENV.NODE_ENV === "production" ? "none" : "lax",
    secure: validENV.NODE_ENV === "production" ? true : false,
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    path: "/",
  });
  res.cookie("refreshtoken", `Bearer ${refreshToken}`, {
    httpOnly: true,
    sameSite: validENV.NODE_ENV === "production" ? "none" : "lax",
    secure: validENV.NODE_ENV === "production" ? true : false,
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    path: "/",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "User registerd success fully kindly verify your email",
      ),
    );
});

export { adminRegister };
