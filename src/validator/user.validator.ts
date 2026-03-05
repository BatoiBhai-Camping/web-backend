import { z } from "zod";
const userRegisterValidator = z.object({
  fullName: z.string("User's full name is required"),
  email: z
    .string("User's email is required")
    .email("Enter a valid email address"),
  password: z
    .string("Password is required")
    .min(6, { message: "Password is too short" }),
});

const userLoginValidator = z.object({
  email: z
    .string("User's email is required")
    .email("Enter a valid email address"),
  password: z
    .string("Password is required")
    .min(6, { message: "Password is too short" }),
});

const verifyAccountValidator = z.object({
  verifyToken: z.string("Verify token is required"),
});

const idValidator = z.object({
  id: z.string("id is required"),
});

const cancelBookigValidator = z.object({
  bookingId: z.string("Booking id is required"),
});

const platformReviewValidator = z.object({
  rating: z.number("rating is requierd").min(1).max(5),
  comment: z.string("comment is equired"),
});

const agentReviewValidator = z.object({
  agentId: z.string("agent id is required"),
  rating: z.number("rating is requierd").min(1).max(5),
  comment: z.string("comment is equired"),
});

const packageReviewValidator = z.object({
  packageId: z.string("package id is required"),
  rating: z.number("rating is requierd").min(1).max(5),
  comment: z.string("comment is equired"),
});

export {
  userRegisterValidator,
  userLoginValidator,
  verifyAccountValidator,
  idValidator,
  cancelBookigValidator,
  platformReviewValidator,
  agentReviewValidator,
  packageReviewValidator,
};
