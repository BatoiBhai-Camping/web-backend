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
});

export const validENV = envSchema.parse(process.env);
