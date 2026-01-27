import type { Request, Response } from "express";

import bcrypt from "bcryptjs";
import { type JwtPayload } from "jsonwebtoken";
import { db } from "../../db/db.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../helper/createAccessRefreshAndVerificationToken.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { validENV } from "../../validator/env.validator.js";
import { userLoginValidator } from "../../validator/user.validator.js";

interface VerificationPayload extends JwtPayload {
  email: string;
}

const agentLogIn = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;
  const validRes = userLoginValidator.safeParse(userData);
  if (!validRes.success) {
    throw new ApiError(
      400,
      validRes.error.message || "Provided data field are invalid",
    );
  }
  const data = validRes.data;
  // check the user is exist or not
  const user = await db.bb_user.findUnique({
    where: {
      email: data.email,
      isDeleted: false,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true
    },
  });

  if (!user) {
    throw new ApiError(
      400,
      "Provided email is not found kindly register or try with another email",
    );
  }
  if(user.role != "AGENT"){
    throw new ApiError(400,"The email is not registerd as agent")
  }

  // check the pass
  const passCheck: boolean = await bcrypt.compare(
    data.password,
    user.password as string,
  );

  if (!passCheck) {
    throw new ApiError(400, "Provided password is not match");
  }

  // create and set the new access and refresh token in the cookie and db
  const accessToken = await createAccessToken({
    userId: user.id,
    email: user.email,
  });
  const refreshToken = await createRefreshToken(user.id);

  res.cookie("accesstoken", `Bearer ${accessToken}`, {
    httpOnly: true,
    sameSite: validENV.NODE_ENV === "production" ? "none" : "lax",
    secure: validENV.NODE_ENV === "production" ? true : false,
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    path: "/",
  });
  res.cookie("refreshtoken", `Bearer ${refreshToken}`, {
    httpOnly: true,
    sameSite: validENV.NODE_ENV === "production" ? "none" : "lax",
    secure: validENV.NODE_ENV === "production" ? true : false,
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    path: "/",
  });

  await db.bb_user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: refreshToken,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User loggedin successfully"));
});

export { agentLogIn };
