import { asyncHandler } from "../../uitls/asyncHandler.js";
import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllPkg = asyncHandler(async (req: Request, res: Response) => {
  const allPkg = await db.bb_travelPackage.findMany();

  return res
    .status(200)
    .json(new ApiResponse(200, allPkg, "Successfully get all the users"));
});

export { getAllPkg };
