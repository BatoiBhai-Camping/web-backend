import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { updateAgentProfileSchema } from "../../validator/updataAgentProfile.validator.js";

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  // Validate request body
  const validatedData = updateAgentProfileSchema.parse(req.body);

  // Check if agent profile exists
  const existingProfile = await db.bb_agentProfile.findUnique({
    where: {
      userId: userId!,
    },
  });

  if (!existingProfile) {
    throw new ApiError(404, "Agent profile not found");
  }

  // Separate user fields and agent profile fields
  const { fullName, phone, profileImageId, ...agentFields } = validatedData;

  // Update both user and agent profile in a transaction
  const result = await db.$transaction(async (tx) => {
    // Update user fields if provided
    if (fullName || phone !== undefined || profileImageId) {
      await tx.bb_user.update({
        where: {
          id: userId!,
        },
        data: {
          ...(fullName && { fullName }),
          ...(phone !== undefined && { phone }),
          ...(profileImageId && { profileImageId }),
        },
      });
    }

    // Update agent profile fields
    const updatedProfile = await tx.bb_agentProfile.update({
      where: {
        userId: userId!,
      },
      data: {
        ...(agentFields.companyName && {
          companyName: agentFields.companyName,
        }),
        ...(agentFields.description !== undefined && {
          description: agentFields.description,
        }),
        ...(agentFields.aadharNumber && {
          aadharNumber: agentFields.aadharNumber,
        }),
        ...(agentFields.panNumber && { panNumber: agentFields.panNumber }),
        ...(agentFields.gstNumber && { gstNumber: agentFields.gstNumber }),
        ...(agentFields.bannerImageId && {
          bannerImageId: agentFields.bannerImageId,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            roleStatus: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        documents: true,
        bannerImage: true,
        _count: {
          select: {
            packages: true,
            reviews: true,
          },
        },
      },
    });

    return updatedProfile;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Profile updated successfully"));
});

export { updateProfile };
