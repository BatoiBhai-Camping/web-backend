import type { Request, Response } from "express";
import { asyncHandler } from "../uitls/asyncHandler.js";
import { uploadToCloudinary } from "../uitls/cloudinary.js";
import { ApiError } from "../uitls/apiError.js";
import { ApiResponse } from "../uitls/apiResponse.js";

const uploadAsset = asyncHandler(async (req: Request, res: Response) => {
  // Check if file was uploaded
  if (!req.file) {
    throw new ApiError(400, "No file uploaded. Please select a file to upload");
  }

  const cloudinaryRes = await uploadToCloudinary(req.file.path);

  if (!cloudinaryRes) {
    throw new ApiError(400, "Image not uploaded to the cloudianry");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: cloudinaryRes.fileUrl,
        fileId: cloudinaryRes.fileId,
      },
      "file uploded successfuly to the cloude",
    ),
  );
});

export { uploadAsset };
