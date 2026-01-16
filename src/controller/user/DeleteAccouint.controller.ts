import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { ApiError } from "../../uitls/apiError.js";
import { db } from "../../db/db.js";
import { validENV } from "../../validator/env.validator.js";
const deleteAccout = asyncHandler(async (req: Request, res: Response) => {
  const delRes = await db.bb_user.update({
    where: {
      id: req.userId!,
    },
    data: {
      isDeleted: true,
    },
  });

  const userId = req.userId;

  // clear refresh token from database
  if (userId) {
    await db.bb_user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  // clear the cookies
  res.clearCookie("accesstoken", {
    httpOnly: true,
    sameSite: validENV.NODE_ENV === "production" ? "none" : "lax",
    secure: validENV.NODE_ENV === "production" ? true : false,
    path: "/",
  });
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    sameSite: validENV.NODE_ENV === "production" ? "none" : "lax",
    secure: validENV.NODE_ENV === "production" ? true : false,
    path: "/",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Account deleted successfully"));
});

export { deleteAccout };
