import { ApiError } from "../uitls/apiError.js";
import { ApiResponse } from "../uitls/apiResponse.js";
import { asyncHandler } from "../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { z } from "zod";

const health = asyncHandler(async (req: Request, res: Response) => {
  //extract the body and find what to send error or success
  const { restype } = req.query; //send success or fail in type to get the health status, ex-> type=success or type=fail
  if (!restype) {
    throw new ApiError(400, "Response type is required success or false");
  } else if (restype === "success") {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Api is working perfectly"));
  } else if (restype === "fail") {
    throw new ApiError(400, "Api is sending the error as per request");
  } else {
    const a: any = null;
    a.foo(); // ❌ runtime error
  }
});

export { health };
