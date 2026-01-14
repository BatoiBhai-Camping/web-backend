import { z } from "zod";

export const mealSchema = z.object({
  type: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
  mealDescription: z.string().optional(),
});

export const hotelStaySchema = z.object({
  hotelName: z.string(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  address: z.string().optional(),
  wifi: z.boolean().optional(),
  tv: z.boolean().optional(),
  attachWashroom: z.boolean().optional(),
  acRoom: z.boolean().optional(),
  kitchen: z.boolean().optional(),
});

export const transportSchema = z.object({
  fromLocation: z.string(),
  toLocation: z.string(),
  mode: z.enum(["BUS", "TRAIN", "CAR", "FLIGHT", "BOAT", "WALK", "OTHER"]),
  startTime: z.string(),
  endTime: z.string(),
});

export const visitPlaceSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  description: z.string().optional(),
  visitTime: z.string().optional(),
});

export const itineraryDaySchema = z.object({
  dayNumber: z.number().min(1),
  title: z.string(),
  description: z.string().optional(),

  hotelStay: hotelStaySchema.optional(),
  transports: z.array(transportSchema).min(1),
  visits: z.array(visitPlaceSchema).min(1),

  meals: z.array(mealSchema).optional(),
});

export const publishPackageValidator = z.object({
  title: z.string(),
  description: z.string(),
  pricePerPerson: z.number(),

  totalSeats: z.number().min(1),

  discountAmount: z.number().optional(),
  discountPercentage: z.number().optional(),
  withTax: z.boolean().optional(),
  taxPercentage: z.number().optional(),

  destination: z.string(),
  durationDays: z.number().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bookingActiveFrom: z.string(),
  bookingEndAt: z.string(),

  packagePolicies: z.string().optional(),
  cancellationPolicies: z.string().optional(),

  bannerImageUrl: z.string(),
  bannerImageFileId: z.string(),

  packageImages: z
    .array(
      z.object({
        imageUrl: z.string(),
        fileId: z.string().optional(),
      }),
    )
    .optional(),

  itineraryDays: z.array(itineraryDaySchema).min(1),
});
