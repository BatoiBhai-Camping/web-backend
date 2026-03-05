import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";

const cancelBooking = asyncHandler(async (req: Request, res: Response) => {});

export { cancelBooking };
