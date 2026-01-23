import { asyncHandler } from "../../uitls/asyncHandler.js";
import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllSubAdmin = asyncHandler(async (req: Request, res: Response) => {
  const allSubAdmins = await db.bb_user.findMany({
    where: {
      role: "ADMIN",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, allSubAdmins, "Successfully get all the sub admins"),
    );
});

export { getAllSubAdmin };
