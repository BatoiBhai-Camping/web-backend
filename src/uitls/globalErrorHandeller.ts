import { ApiError } from "./apiError.js";
import type { Request, Response, NextFunction } from "express";
const globalErrorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Unexpected runtime error
  if (process.env.NODE_ENV === "development") {
    console.error(" Runtime Error:", err);
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export { globalErrorHandler };
