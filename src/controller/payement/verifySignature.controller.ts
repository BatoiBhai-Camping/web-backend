import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { db } from "../../db/db.js";
import { BookingStatus, PaymentStatus } from "../../generated/prisma/client.js";
import { verifyPaymentValidator } from "../../validator/payment.validator.js";
import { validENV } from "../../validator/env.validator.js";
import crypto from "crypto";

const verifyPaymetn = asyncHandler(async (req: Request, res: Response) => {
  const validRes = verifyPaymentValidator.safeParse(req.body);
  console.log(validRes, validRes.data);
  if (!validRes.success) {
    throw new ApiError(
      400,
      "Invalid data to verify the payment",
      validRes.error.issues,
    );
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
    paymentId,
  } = validRes.data;

  const userId = req.userId;

  // Verify Razorpay signature
  const generatedSignature = crypto
    .createHmac("sha256", validENV.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature", [
      {
        field: "razorpay_signature",
        message: "Payment verification failed - signature mismatch",
      },
    ]);
  }

  const result = await db.$transaction(async (tx) => {
    // Update payment status
    const updatedPayment = await tx.bb_payment.update({
      where: { id: paymentId as string },
      data: {
        status: PaymentStatus.SUCCESS,
      },
    });

    // Update booking status
    const updatedBooking = await tx.bb_booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.SUCCESS,
        updatedAt: new Date(),
      },
      include: {
        travelPackage: {
          select: {
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    return { updatedPayment, updatedBooking };
  });

  // Return success response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Payment verified successfully and booking confirmed",
      ),
    );
});

export { verifyPaymetn };
