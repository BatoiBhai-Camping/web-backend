import { db } from "../../db/db.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { publicUseDataUser } from "../../uitls/publicSharedDataUser.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { ApiError } from "../../uitls/apiError.js";
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await db.bb_user.findUnique({
    where: {
      id: req.userId!,
      email: req.userEmail!,
      role: "TRAVELER",
    },
    select: {
      ...publicUseDataUser,
      address: {
        select: {
          id: true,
          addressType: true,
          city: true,
          country: true,
          district: true,
          latitude: true,
          longitude: true,
          pin: true,
          state: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(400, "Can't get the user profile");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Successfully get the user data"));
});

export { getUserProfile };
