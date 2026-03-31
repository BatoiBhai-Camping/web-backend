import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { db } from "../../db/db.js";
import { BookingStatus } from "../../generated/prisma/client.js";
import { z } from "zod";

const cancelBookingValidator = z.object({
  bookingId: z.string("Booking ID is required"),
  reason: z
    .string("Cancellation reason is required")
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters")
    .optional(),
});

const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const validRes = cancelBookingValidator.safeParse(req.body);
  if (!validRes.success) {
    throw new ApiError(400, "Invalid input", validRes.error.issues);
  }

  const { bookingId, reason } = validRes.data;
  const userId = req.userId;

  // Verify booking exists and belongs to user
  const booking = await db.bb_booking.findFirst({
    where: {
      id: bookingId,
      userId: userId!,
    },
    include: {
      travelPackage: true,
      payments: {
        where: {
          status: "SUCCESS",
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if booking can be cancelled
  if (booking.status === BookingStatus.CANCELLED) {
    throw new ApiError(400, "Booking has already been cancelled");
  }

  if (booking.status === BookingStatus.COMPLETED) {
    throw new ApiError(400, "Cannot cancel a completed booking");
  }

  // Cancel booking and handle refund in transaction
  const result = await db.$transaction(async (tx) => {
    // Update booking status
    const updatedBooking = await tx.bb_booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        updatedAt: new Date(),
      },
    });

    // Return available seats to package
    await tx.bb_travelPackage.update({
      where: { id: booking.packageId },
      data: {
        seatsAvailable: {
          increment: booking.numberOfTravelers,
        },
        seatsBooked: {
          decrement: booking.numberOfTravelers,
        },
      },
    });

    // If payment was successful, create refund payment record
    if (booking.payments.length > 0) {
      const successfulPayment = booking.payments[0]!;
      await tx.bb_payment.create({
        data: {
          bookingId: bookingId,
          status: "PENDING",
          amount: successfulPayment.amount,
          currency: "INR",
          paymentRef: `REFUND-${bookingId}-${Date.now()}`,
          method: successfulPayment.method,
          metadata: {
            originalPaymentId: successfulPayment.id,
            refundReason: reason || "User requested cancellation",
            isRefund: true,
          },
        },
      });
    }

    return updatedBooking;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { booking: result },
        "Booking cancelled successfully",
      ),
    );
});

export { cancelBooking };
