import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";

const getAllPackages = asyncHandler(async (req: Request, res: Response) => {
  const agentProfile = await db.bb_agentProfile.findUnique({
    where: {
      userId: req.userId!,
    },
    select: {
      id: true,
    },
  });

  if (!agentProfile) {
    throw new ApiError(400, "Agent profile not found");
  }

  const allPkgs = await db.bb_travelPackage.findMany({
    where: {
      agentId: agentProfile.id,
      isDeleted: false,
    },
    include: {
      agent: {
        select: {
          id: true,
          companyName: true,
        },
      },
      PackageBannerImage: true,
      packagesImages: {
        where: {
          isDeleted: false,
        },
      },
      address: true,
      itinerary: {
        orderBy: {
          dayNumber: "asc",
        },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(
    new ApiResponse(200, allPkgs, "Successfully get all the packatges"),
  );
});

export { getAllPackages };
