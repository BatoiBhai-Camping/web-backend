import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import {
  platformReviewValidator,
  idValidator,
  agentReviewValidator,
} from "../../validator/user.validator.js";
import { ApiError } from "../../uitls/apiError.js";
import { db } from "../../db/db.js";
import { ApiResponse } from "../../uitls/apiResponse.js";

const packageReview = asyncHandler(async (req: Request, res: Response) => {});

const agentReview = asyncHandler(async (req: Request, res: Response) => {
  const validRes = agentReviewValidator.safeParse(req.body);
  if (!validRes.success) {
    throw new ApiError(400, "Invalid inputs", validRes.error.issues);
  }
  const { agentId, comment, rating } = validRes.data;
  // get the agent id
  const agentProfile = await db.bb_agentProfile.findUnique({
    where: {
      id: agentId,
    },
    select: null,
  });
  console.log("here is the atent profie", agentProfile);
  if (!agentProfile) {
    throw new ApiError(400, "Not a valid agent profile");
  }
  const revewRes = await db.bb_agentReview.upsert({
    where: {
      agentId_userId: {
        userId: req.userId!,
        agentId: agentId,
      },
    },
    update: {
      rating: rating,
      comment: comment,
    },
    create: {
      rating: rating,
      comment: comment,
      agentId: agentId,
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
        id: revewRes.id,
        rating: revewRes.rating,
        comment: revewRes.comment,
      },
      "Review successfull",
    ),
  );
});

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

const deleteAgentReview = asyncHandler(async (req: Request, res: Response) => {
  const validRes = idValidator.safeParse(req.body);
  if (!validRes.success) {
    throw new ApiError(400, "Invalid input", validRes.error.issues);
  }
  const { id } = validRes.data;
  // delte teh review
  const delRes = await db.bb_agentReview.delete({
    where: {
      id: id,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfuly delete the review"));
});

const deletePackageReview = asyncHandler(
  async (req: Request, res: Response) => {},
);

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

export {
  packageReview,
  agentReview,
  platformReview,
  deletePlatformReview,
  deleteAgentReview,
  deletePackageReview,
};
