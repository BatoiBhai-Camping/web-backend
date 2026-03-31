import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { idValidator } from "../../validator/user.validator.js";

const getPackageBookings = asyncHandler(async (req: Request, res: Response) => {
  const validRes = idValidator.safeParse(req.body);
  if (!validRes.success) {
    throw new ApiError(400, "Invalid input", validRes.error.issues);
  }

  const { id } = validRes.data;

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

  const travelPackage = await db.bb_travelPackage.findFirst({
    where: {
      id: id,
      agentId: agentProfile.id,
      isDeleted: false,
    },
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
  });

  if (!travelPackage) {
    throw new ApiError(
      404,
      "No package found with this id or you do not have access to this package",
    );
  }

  const allBookingsOfPackage = await db.bb_booking.findMany({
    where: {
      packageId: id,
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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        travelPackage,
        allBookingsOfPackage,
      },
      "Package bookings fetched successfully",
    ),
  );
});

export { getPackageBookings };
