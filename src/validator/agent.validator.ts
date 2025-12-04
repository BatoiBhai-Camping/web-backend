import { z } from "zod";

const agentRegisterValidator = z.object({
  fullName: z.string("Name is required"),
  email: z.string("Email is required").email("Enter a valid emai address"),
  password: z
    .string("Password is required")
    .min(6, { message: "password is too short" }),
  phone: z.string("phone number is required"),
  profileImageUrl: z.string("Profile image url is required"),
  profileImageFileId: z.string("Profile image fileId is required"),
  companyName: z.string("Company name is required and it has to be string"),
  description: z.string(
    "company description is required and it has to be a sting",
  ),
  aadharNumber: z.string("Addahar number is requred"),
  panNumber: z.string("Pan number is need to an string").optional(),
  gstNumber: z.string("Gst number needs to be an stirng").optional(),
  bannerImageUrl: z.string("Banner imag is required and it has to be string"),
  bannerImageFileId: z.string(
    "Baner image id required and it need to be an string",
  ),
  addressType: z.enum(["PERMANENT", "CURRENT", "TRAVEL"]),
  country: z.string("Country name is required"),
  state: z.string("State name is required"),
  district: z.string("Discrit name is required"),
  pin: z.string("pin number is required"),
  city: z.string("City name is required"),
  longitude: z.string("Longitute is need to be string").optional(),
  latitude: z.string("Latitute is need to be string").optional(),
  aadharDocumentUrl: z.string("Aadhar document is required"),
  aadharDocumentFileId: z.string("aadhar doucment file id is required"),
  panDocumentUrl: z
    .string("Pan doucment url is need to be a stirng")
    .optional(),
  panDocumentFileId: z
    .string("pan doucment file is is need to be an stirng")
    .optional(),
});

export { agentRegisterValidator };
