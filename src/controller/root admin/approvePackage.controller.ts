import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { validatePackage } from "../../validator/rootAdmin.validator.js";

const approvePackage = asyncHandler(async (req: Request, res: Response) => {
  const validRes = validatePackage.safeParse(req.body);

  if (!validRes.success) {
    throw new ApiError(400, "Invalid input data for package id");
  }
  const data = validRes.data;

  const TPackage = await db.bb_travelPackage.findUnique({
    where: {
      id: data.packageId,
      isDeleted: false,
    },
  });

  if (!TPackage) {
    throw new ApiError(404, "Travel package is not found with the provided id");
  }

  // check if package is already active
  if (TPackage.packageApprovedStatus == "APPROVED") {
    throw new ApiError(400, "Package is already approved");
  }

  // update the package booking active status
  const approvedPackage = await db.bb_travelPackage.update({
    where: {
      id: TPackage.id,
    },
    data: {
      packageApprovedStatus: "APPROVED",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Travel package approved successfully"));
});

export { approvePackage };
