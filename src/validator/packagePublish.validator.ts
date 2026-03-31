import { z } from "zod";

export const itineraryDaySchema = z.object({
  dayNumber: z.number().min(1),
  title: z.string(),
  description: z.string().optional(),
});

export const addressSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  pin: z.string().optional(),
  city: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
});

export const publishPackageValidator = z.object({
  title: z.string(),
  description: z.string(),
  pricePerPerson: z.number().min(0),

  totalSeats: z.number().min(1),

  discountPercentage: z.number().min(0).max(100).default(0),
  gstPercentage: z.number().min(0).max(100).default(0),

  destination: z.string(),
  durationDays: z.number().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

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

  packageAddress: addressSchema.optional(),

  itineraryDays: z.array(itineraryDaySchema).min(1),
});
