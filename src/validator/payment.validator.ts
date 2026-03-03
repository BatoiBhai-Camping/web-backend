import { z } from "zod";

/**
 * Validator for creating a Razorpay payment order
 * Required fields based on Bb_booking and Bb_payment schema:
 * - packageId: ID of the travel package to book
 * - numberOfTravelers: Number of travelers for the booking
 */
export const createOrderValidator = z.object({
  packageId: z
    .string("Package id must need")
    .min(1, "Package ID cannot be empty"),

  numberOfTravelers: z
    .number("Number of travellers must need")
    .int("Number of travelers must be an integer")
    .positive("Number of travelers must be at least 1")
    .min(1, "Number of travelers must be at least 1"),
});

export type CreateOrderInput = z.infer<typeof createOrderValidator>;
