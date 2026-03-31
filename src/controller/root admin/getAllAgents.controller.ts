import { asyncHandler } from "../../uitls/asyncHandler.js";
import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { publicUseDataUser } from "../../uitls/publicSharedDataUser.js";
import { count } from "console";

const getAllAgents = asyncHandler(async (req: Request, res: Response) => {
  const allAgents = await db.bb_user.findMany({
    where: {
      role: "AGENT",
    },
    select: {
      ...publicUseDataUser,
      agentProfile: {
        select: {
          id: true,
          companyName: true,
          description: true,
          aadharNumber: true,
          panNumber: true,
          gstNumber: true,
          bannerImage: {
            select: {
              id: true,
              imageUrl: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      },
      address: {
        select: {
          id: true,
          addressType: true,
          country: true,
          state: true,
          district: true,
          pin: true,
          city: true,
          longitude: true,
          latitude: true,
        },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, allAgents, "Successfully get all the agents"));
});

export { getAllAgents };
