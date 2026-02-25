import { db } from "../../db/db.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import {
  publicUseDataUser,
  address,
} from "../../uitls/publicSharedDataUser.js";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getRootAdminProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const rootAdmin = await db.bb_user.findUnique({
      where: {
        id: req.userId!,
        email: req.userEmail!,
      },
      select: {
        ...publicUseDataUser,
        profileImage: {
          select: {
            userProfile: true,
          },
        },
        address: {
          select: {
            ...address,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          rootAdmin,
          "successfully get the root admin profile",
        ),
      );
  },
);

export { getRootAdminProfile };
