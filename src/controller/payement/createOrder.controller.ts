import { razorpayInstance } from "../../app.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { validENV } from "../../validator/env.validator.js";
import { createOrderValidator } from "../../validator/payment.validator.js";
import {
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
} from "../../generated/prisma/client.js";

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = createOrderValidator.safeParse(req.body);

  if (!validationResult.success) {
    throw new ApiError(400, "Validation failed", validationResult.error.issues);
  }

  const { packageId, numberOfTravelers } = validationResult.data;
  const userId = req.userId;

  if (!userId) {
    throw new ApiError(401, "Authentication required", [
      { field: "userId", message: "User not authenticated" },
    ]);
  }

  // Fetch the travel package with all necessary details
  const travelPackage = await db.bb_travelPackage.findUnique({
    where: { id: packageId, isDeleted: false },
    select: {
      id: true,
      title: true,
      pricePerPerson: true,
      discountPercentage: true,
      gstPercentage: true,
      seatsAvailable: true,
      isBookingActive: true,
    },
  });

  if (!travelPackage) {
    throw new ApiError(404, "Travel package not found", [
      {
        field: "packageId",
        message: "Package does not exist or has been deleted",
      },
    ]);
  }

  // Check if booking is active
  if (!travelPackage.isBookingActive) {
    throw new ApiError(400, "Booking is not active for this package", [
      {
        field: "isBookingActive",
        message: "This package is not currently accepting bookings",
      },
    ]);
  }

  // Check seat availability
  if (travelPackage.seatsAvailable < numberOfTravelers) {
    throw new ApiError(400, "Insufficient seats available", [
      {
        field: "seatsAvailable",
        message: `Only ${travelPackage.seatsAvailable} seats available, but ${numberOfTravelers} requested`,
      },
    ]);
  }

  // Calculate amounts based on pricing snapshot
  const baseAmount = travelPackage.pricePerPerson * numberOfTravelers;

  // Calculate discount
  const discountAmount = travelPackage.discountPercentage
    ? Math.round((baseAmount * travelPackage.discountPercentage) / 100)
    : 0;

  const amountAfterDiscount = baseAmount - discountAmount;

  // Calculate GST
  const gstAmount = travelPackage.gstPercentage
    ? Math.round((amountAfterDiscount * travelPackage.gstPercentage) / 100)
    : 0;

  const totalAmount = amountAfterDiscount + gstAmount;

  // Generate unique booking code
  const bookingCode = `BK${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Create Razorpay order
  const razorpayOrder = await razorpayInstance.orders.create({
    amount: Math.round(totalAmount * 100), // Convert to paise (smallest currency unit)
    currency: "INR",
    receipt: bookingCode,
    notes: {
      packageId: packageId,
      packageTitle: travelPackage.title,
      userId: userId,
      numberOfTravelers: numberOfTravelers.toString(),
      bookingCode: bookingCode,
    },
  });

  // Create booking and payment records in a transaction
  const result = await db.$transaction(async (tx) => {
    // Create booking record with pricing snapshot
    const booking = await tx.bb_booking.create({
      data: {
        bookingCode,
        userId,
        packageId,
        numberOfTravelers,
        status: BookingStatus.PENDING,
        // Pricing snapshots
        pricePerPerson: travelPackage.pricePerPerson,
        discountPercentage: travelPackage.discountPercentage || 0,
        gstPercentage: travelPackage.gstPercentage || 0,
        // Calculated amounts
        baseAmount,
        discountAmount,
        gstAmount,
        totalAmount,
      },
    });

    // Update package seat availability
    await tx.bb_travelPackage.update({
      where: { id: packageId },
      data: {
        seatsAvailable: {
          decrement: numberOfTravelers,
        },
        seatsBooked: {
          increment: numberOfTravelers,
        },
      },
    });

    // Create payment record
    const payment = await tx.bb_payment.create({
      data: {
        bookingId: booking.id,
        status: PaymentStatus.PENDING,
        amount: totalAmount,
        currency: "INR",
        paymentRef: razorpayOrder.id,
        method: PaymentMethod.CARD,
        metadata: {
          razorpayOrderId: razorpayOrder.id,
        },
      },
    });

    return { booking, payment };
  });

  // Return order details to frontend
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        bookingId: result.booking.id,
        bookingCode: result.booking.bookingCode,
        paymentId: result.payment.id,
        packageTitle: travelPackage.title,
        numberOfTravelers,
        breakdown: {
          baseAmount,
          discountAmount,
          gstAmount,
          totalAmount,
        },
        razorpayKeyId: validENV.RAZORPAY_KEY_ID, // Frontend needs this to initialize Razorpay
      },
      "Order created successfully",
    ),
  );
});

export { createOrder };
