import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string("Database url is needed."),
  PORT: z.coerce.number(),
  ACCESS_TOKEN_SECRET: z.string("Access token secreate is required."),
  ACCESS_TOKEN_EXPIRY: z.coerce.number("Access token expire is required"),
  REFRESH_TOKEN_SECRET: z.string("Refresh token secreate is required."),
  REFRESH_TOKEN_EXPIRY: z.coerce.number("Refresh token expire is required"),
  VERIFICATION_TOKEN_SECRET: z.string("verification token secret is required"),
  VERIFICATION_TOKEN_EXPIRY: z.coerce.number(
    "Verification token expire is required",
  ),
  GMAIL: z
    .string("An gmail is required for send mail through smtp")
    .email("This is not a valid gamil"),
  APP_PASSWORD: z.string("An app passoword required for sending the email"),
  CLOUDINARY_CLOUD_NAME: z.string("Cloudinary cloud name is required for store the assets"),
  CLOUDINARY_API_KEY: z.string("cloudinary api key is reqired for strore assets"),
CLOUDINARY_API_SECRET: z.string("cloudinary api secret is required for the store assets")
});

export const validENV = envSchema.parse(process.env);
