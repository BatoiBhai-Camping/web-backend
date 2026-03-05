import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import {
  platformReviewValidator,
  idValidator,
} from "../../validator/user.validator.js";
import { ApiError } from "../../uitls/apiError.js";
import { db } from "../../db/db.js";
import { ApiResponse } from "../../uitls/apiResponse.js";

const packageReview = asyncHandler(async (req: Request, res: Response) => {});

const agentReview = asyncHandler(async (req: Request, res: Response) => {});

const platformReview = asyncHandler(async (req: Request, res: Response) => {
  const validRes = await platformReviewValidator.safeParse(req.body);
  if (!validRes.success) {
    throw new ApiError(400, "Inputs are invalie", validRes.error.issues);
  }
  const { rating, comment } = validRes.data;
  // create the review
  const reviewRes = await db.bb_platformReview.upsert({
    where: {
      userId: req.userId!,
    },
    update: {
      rating: rating,
      comment: comment,
    },
    create: {
      rating: rating,
      comment: comment,
      userId: req.userId!,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
    },
  });
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: reviewRes.id,
        rating: reviewRes.rating,
        comment: reviewRes.comment,
      },
      "Successfully created the review",
    ),
  );
});

const deletePlatformReview = asyncHandler(
  async (req: Request, res: Response) => {
    const validRes = idValidator.safeParse(req.body);
    if (!validRes.success) {
      throw new ApiError(400, "Invlid data", validRes.error.issues);
    }
    const { id } = validRes.data;

    // delete the review
    const deleteRes = await db.bb_platformReview.delete({
      where: {
        id: id,
      },
    });
   

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Review deleted successfully"));
  },
);

export { packageReview, agentReview, platformReview, deletePlatformReview };
