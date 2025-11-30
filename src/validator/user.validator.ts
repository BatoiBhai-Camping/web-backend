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
  veriryToken: z.string("Verify token is required"),
});
export { userRegisterValidator, userLoginValidator, verifyAccountValidator };
