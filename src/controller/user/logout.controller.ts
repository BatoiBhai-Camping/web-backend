import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { validENV } from "../../validator/env.validator.js";

const logout = asyncHandler(async (req: Request, res: Response) => {
  // get user id from req.user (set by auth middleware)
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
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export { logout };
