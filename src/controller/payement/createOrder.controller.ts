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
  PaymentType,
  ProviderType,
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
      discountAmount: true,
      discountPercentage: true,
      withTax: true,
      taxPercentage: true,
      seatsAvailable: true,
      isBookingActive: true,
      bookingActiveFrom: true,
      bookingEndAt: true,
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

  // Check booking date validity
  const now = new Date();
  if (travelPackage.bookingActiveFrom > now) {
    throw new ApiError(400, "Booking has not started yet", [
      {
        field: "bookingActiveFrom",
        message: `Booking opens on ${travelPackage.bookingActiveFrom.toISOString()}`,
      },
    ]);
  }

  if (travelPackage.bookingEndAt < now) {
    throw new ApiError(400, "Booking period has ended", [
      {
        field: "bookingEndAt",
        message: "This package is no longer accepting bookings",
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

  // Calculate amounts
  const baseAmount = travelPackage.pricePerPerson * numberOfTravelers;

  // Calculate discount
  let discountAmount = 0;
  if (
    travelPackage.discountPercentage &&
    travelPackage.discountPercentage > 0
  ) {
    discountAmount = (baseAmount * travelPackage.discountPercentage) / 100;
  } else if (travelPackage.discountAmount && travelPackage.discountAmount > 0) {
    discountAmount = travelPackage.discountAmount * numberOfTravelers;
  }

  const amountAfterDiscount = baseAmount - discountAmount;

  // Calculate tax
  let taxAmount = 0;
  if (
    travelPackage.withTax &&
    travelPackage.taxPercentage &&
    travelPackage.taxPercentage > 0
  ) {
    taxAmount = (amountAfterDiscount * travelPackage.taxPercentage) / 100;
  }

  const totalAmount = amountAfterDiscount + taxAmount;

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
    // Create booking record
    const booking = await tx.bb_booking.create({
      data: {
        bookingCode,
        userId,
        packageId,
        numberOfTravelers,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        baseAmount,
        taxAmount,
        discountAmount,
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
        seatBooked: {
          increment: numberOfTravelers,
        },
      },
    });

    // Create payment record
    const payment = await tx.bb_payment.create({
      data: {
        bookingId: booking.id,
        type: PaymentType.BOOKING,
        status: PaymentStatus.PENDING,
        amount: totalAmount,
        currency: "INR",
        provider: ProviderType.RAZORPAY,
        providerRef: razorpayOrder.id,
        isRefund: false,
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
          taxAmount,
          totalAmount,
        },
        razorpayKeyId: validENV.RAZORPAY_KEY_ID, // Frontend needs this to initialize Razorpay
      },
      "Order created successfully",
    ),
  );
});

export { createOrder };
