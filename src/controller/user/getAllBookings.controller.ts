import { db } from "../../db/db.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllbookings = asyncHandler(async (req: Request, res: Response) => {
  const allBookings = await db.bb_booking.findMany({
    where: {
      userId: req.userId!,
    },
    select: {
      id: true,
      bookingCode: true,
      packageId: true,
      numberOfTravelers: true,
      status: true,
      paymentStatus: true,
      totalAmount: true,
      baseAmount: true,
      taxAmount: true,
      discountAmount: true,
      createdAt: true,
      travelPackage: {
        select: {
          id: true,
          title: true,
          description: true,
          destination: true,
          durationDays: true,
          startDate: true,
          endDate: true,
          PackageBannerImage: {
            select: {
              imageUrl: true,
              fileId: true,
            },
          },
          packagesImages: {
            select: {
              imageUrl: true,
              fileId: true,
            },
          },
          agent: {
            select: {
              id: true,
              companyName: true,
              user: {
                select: {
                  fullName: true,
                  profileImage: {
                    select: {
                      imageUrl: true,
                      fileId: true,
                    },
                  },
                },
              },
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
      new ApiResponse(200, { allBookings }, "Bookings fetched successfully"),
    );
});

export { getAllbookings };
