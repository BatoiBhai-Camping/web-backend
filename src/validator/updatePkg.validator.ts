import { z } from "zod";

export const updateItineraryDaySchema = z.object({
  id: z.string().optional(), // If provided, updates existing day; if not, creates new
  dayNumber: z.number().min(1).optional(),
  title: z.string().optional(),
  description: z.string().nullable().optional(),
});

export const updateAddressSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  pin: z.string().optional(),
  city: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
});

export const updatePackageValidator = z.object({
  packageId: z.string(),

  // Basic package info
  title: z.string().optional(),
  description: z.string().optional(),

  // Pricing
  pricePerPerson: z.number().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  gstPercentage: z.number().min(0).max(100).optional(),

  // Seats
  totalSeats: z.number().min(1).optional(),

  // Destination & Duration
  destination: z.string().optional(),
  durationDays: z.number().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  // Package address (one-to-one relationship)
  packageAddress: updateAddressSchema.optional(),

  // Banner image
  bannerImageUrl: z.string().optional(),
  bannerImageFileId: z.string().optional(),

  // Package images
  packageImages: z
    .array(
      z.object({
        id: z.string().optional(), // existing image ID
        imageUrl: z.string(),
        fileId: z.string().optional(),
      }),
    )
    .optional(),
  deleteImageIds: z.array(z.string()).optional(),

  // Itinerary days (simplified - no nested details)
  itineraryDays: z.array(updateItineraryDaySchema).optional(),
  deleteItineraryDayIds: z.array(z.string()).optional(),
});
