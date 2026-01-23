import { asyncHandler } from "../../uitls/asyncHandler.js";
import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllPayments = asyncHandler(async (req: Request, res: Response) => {
  const allPayments = await db.bb_payment.findMany();

  return res
    .status(200)
    .json(
      new ApiResponse(200, allPayments, "Successfully get all the payments"),
    );
});

export { getAllPayments };
