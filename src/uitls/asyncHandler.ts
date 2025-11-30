import type { Request, Response, NextFunction } from "express";
import { validENV } from "../validator/env.validator.js";
const asyncHandler =
  (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      if (validENV.NODE_ENV === "development") {
        console.log(error);
      }
      next(error);
    }
  };
export { asyncHandler };
