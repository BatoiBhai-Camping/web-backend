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
      pricePerPerson: true,
      discountPercentage: true,
      gstPercentage: true,
      baseAmount: true,
      discountAmount: true,
      gstAmount: true,
      totalAmount: true,
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
          paymentRef: true,
          status: true,
          amount: true,
          currency: true,
          method: true,
          processedAt: true,
          createdAt: true,
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
      new ApiResponse(200, { allBookings }, "Bookings fetched successfully"),
    );
});

export { getAllBookings };
