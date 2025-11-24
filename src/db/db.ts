import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

// Create adapter for any PostgreSQL (local or Neon)
const adapter = new PrismaPg({
  connectionString,
  //   ssl: process.env.NODE_ENV === "production", // Neon requires SSL
});

const db = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"], // only errors in production
});

export { db };
