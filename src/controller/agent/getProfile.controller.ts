import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  const agentProfile = await db.bb_agentProfile.findUnique({
    where: {
      userId: userId!,
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
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          packages: true,
          reviews: true,
        },
      },
    },
  });

  if (!agentProfile) {
    throw new ApiError(400, "Agent profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, agentProfile, "Agent profile get successfully"));
});

export { getProfile };
