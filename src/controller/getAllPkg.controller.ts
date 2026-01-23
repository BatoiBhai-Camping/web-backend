import { asyncHandler } from "../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { ApiResponse } from "../uitls/apiResponse.js";
const getAllPkg = asyncHandler(async (req: Request, res: Response) => {
  const pkgs = await db.bb_travelPackage.findMany({
    where: {
      isBookingActive: true,
      isDeleted: false,
      packageApprovedStatus: "APPROVED",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, pkgs, "Successfully get all the available packages"),
    );
});

export { getAllPkg };
