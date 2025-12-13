import { z } from "zod";
const validateAdmin = z.object({
  id: z.string("admin id is required"),
});

const validatePackage = z.object({
  packageId: z.string("package id is required"),
});

export { validateAdmin, validatePackage };
