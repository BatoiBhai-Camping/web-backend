import { z } from "zod";

const addressSchema = z.object({
  id: z.string().optional(), // if provided, update existing address
  addressType: z.enum(["PERMANENT", "CURRENT", "TRAVEL"]).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  pin: z.string().min(6, "PIN must be at least 6 characters").optional(),
  city: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
});

export const updateAgentProfileSchema = z.object({
  // User fields
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Phone number must contain only valid characters")
    .optional(),
  profileImageUrl: z.string().url("Invalid profile image URL").optional(),
  profileFileId: z.string().optional(),
  addresses: z.array(addressSchema).optional(),

  // Agent profile fields
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must not exceed 200 characters")
    .optional(),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhar number must contain only digits")
    .optional(),
  panNumber: z
    .string()
    .length(10, "PAN number must be 10 characters")
    .regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Invalid PAN number format")
    .optional(),
  gstNumber: z
    .string("gst number is required")
    .optional(),
  bannerImageUrl: z.string().url("Invalid banner image URL").optional(),
  bannerFileId: z.string().optional(),
});
