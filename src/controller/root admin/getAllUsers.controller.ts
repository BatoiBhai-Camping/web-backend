import { asyncHandler } from "../../uitls/asyncHandler.js";
import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const allUsers = await db.bb_user.findMany({
    where: {
      role: "TRAVELER",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, allUsers, "Successfully get all the users"));
});

export { getAllUser };
