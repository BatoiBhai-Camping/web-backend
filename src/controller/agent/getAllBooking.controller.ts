import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
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

  const allBookings = await db.bb_booking.findMany({
    where: {
      travelPackage: {
        agentId: agentProfile.id,
      },
    },
    select: {
      id: true,
      bookingCode: true,
      packageId: true,
      userId: true,
      numberOfTravelers: true,
      status: true,
      paymentStatus: true,
      totalAmount: true,
      baseAmount: true,
      taxAmount: true,
      discountAmount: true,
      refundableAmount: true,
      cancellationReason: true,
      cancelledAt: true,
      cancelledBy: true,
      createdAt: true,
      travelPackage: {
        select: {
          id: true,
          title: true,
          destination: true,
          startDate: true,
          endDate: true,
          PackageBannerImage: {
            select: {
              imageUrl: true,
              fileId: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          profileImage: {
            select: {
              imageUrl: true,
              fileId: true,
            },
          },
        },
      },
      payments: {
        select: {
          id: true,
          type: true,
          status: true,
          amount: true,
          currency: true,
          provider: true,
          providerRef: true,
          isRefund: true,
          createdAt: true,
        },
      },
    },
   
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { allBookings }, "Bookings fetched successfully"),
    );
});

export { getAllBookings };
