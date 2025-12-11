import type { Request, Response } from "express";
import { asyncHandler } from "../../uitls/asyncHandler.js";

const publishPackage = asyncHandler(async (req: Request, res: Response) => {
  return res.json("package published successfully");
});

export { publishPackage };
