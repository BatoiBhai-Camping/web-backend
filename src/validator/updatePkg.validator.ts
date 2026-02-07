import { z } from "zod";

export const updateMealSchema = z.object({
  id: z.string().optional(), // for updating existing meal
  type: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
  mealDescription: z.string().optional(),
});

export const updateHotelStaySchema = z.object({
  id: z.string().optional(), // for updating existing hotel stay
  hotelName: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  address: z.string().optional(),
  wifi: z.boolean().optional(),
  tv: z.boolean().optional(),
  attachWashroom: z.boolean().optional(),
  acRoom: z.boolean().optional(),
  kitchen: z.boolean().optional(),
});

export const updateTransportSchema = z.object({
  id: z.string().optional(), // for updating existing transport
  fromLocation: z.string().optional(),
  toLocation: z.string().optional(),
  mode: z
    .enum(["BUS", "TRAIN", "CAR", "FLIGHT", "BOAT", "WALK", "OTHER"])
    .optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const updateVisitPlaceSchema = z.object({
  id: z.string().optional(), // for updating existing visit place
  name: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  visitTime: z.string().optional(),
});

export const updateItineraryDaySchema = z.object({
  id: z.string().optional(), // for updating existing itinerary day
  dayNumber: z.number().min(1).optional(),
  title: z.string().optional(),
  description: z.string().optional(),

  hotelStay: updateHotelStaySchema.optional(),
  transports: z.array(updateTransportSchema).optional(),
  visits: z.array(updateVisitPlaceSchema).optional(),
  meals: z.array(updateMealSchema).optional(),

  // IDs of nested items to delete
  deleteTransportIds: z.array(z.string()).optional(),
  deleteVisitIds: z.array(z.string()).optional(),
  deleteMealIds: z.array(z.string()).optional(),
  deleteHotelStay: z.boolean().optional(), // flag to delete hotel stay
});

export const updatePackageValidator = z.object({
  packageId: z.string(), // Required to identify which package to update

  title: z.string().optional(),
  description: z.string().optional(),
  pricePerPerson: z.number().optional(),

  totalSeats: z.number().min(1).optional(),

  discountAmount: z.number().optional(),
  discountPercentage: z.number().optional(),
  withTax: z.boolean().optional(),
  taxPercentage: z.number().optional(),

  destination: z.string().optional(),
  durationDays: z.number().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bookingActiveFrom: z.string().optional(),
  bookingEndAt: z.string().optional(),

  packagePolicies: z.string().optional(),
  cancellationPolicies: z.string().optional(),

  bannerImageUrl: z.string().optional(),
  bannerImageFileId: z.string().optional(),

  packageImages: z
    .array(
      z.object({
        id: z.string().optional(), // for updating existing image
        imageUrl: z.string(),
        fileId: z.string().optional(),
      }),
    )
    .optional(),

  itineraryDays: z.array(updateItineraryDaySchema).optional(),

  // IDs of items to delete
  deleteImageIds: z.array(z.string()).optional(),
  deleteItineraryDayIds: z.array(z.string()).optional(),
});
