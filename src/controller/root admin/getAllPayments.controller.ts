import { asyncHandler } from "../../uitls/asyncHandler.js";
import { db } from "../../db/db.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllPayments = asyncHandler(async (req: Request, res: Response) => {
  const allPayments = await db.bb_payment.findMany({
    include: {
      booking: {
        select: {
          id: true,
          bookingCode: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          travelPackage: {
            select: {
              id: true,
              title: true,
              destination: true,
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
    .json(
      new ApiResponse(200, allPayments, "Successfully retrieved all payments"),
    );
});

export { getAllPayments };
