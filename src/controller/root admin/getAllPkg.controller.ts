import { asyncHandler } from "../../uitls/asyncHandler.js";
import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllPkg = asyncHandler(async (req: Request, res: Response) => {
  const allPkg = await db.bb_travelPackage.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      pricePerPerson: true,
      discountPercentage: true,
      gstPercentage: true,
      packageApprovedStatus: true,
      PackageBannerImage: {
        select: {
          id: true,
          imageUrl: true,
          fileId: true,
        },
      },
      packagesImages: {
        select: {
          id: true,
          imageUrl: true,
          fileId: true,
        },
      },
      agent: {
        select: {
          companyName: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, allPkg, "Successfully retrieved all packages"));
});

export { getAllPkg };