import { ApiError } from "../uitls/apiError.js";
import { validENV } from "../validator/env.validator.js";
import jwt from "jsonwebtoken";

type accessTokenType = {
  userId: string;
  email: string;
};
const createAccessToken = async (userInfo: accessTokenType) => {
  try {
    const accessToken = jwt.sign(userInfo, validENV.ACCESS_TOKEN_SECRET, {
      expiresIn: `${validENV.ACCESS_TOKEN_EXPIRY}d`,
    });
    return accessToken;
  } catch (error: any) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while generating access token",
    );
  }
};

const createRefreshToken = async (userId: string) => {
  try {
    const refreshToken = jwt.sign(
      { userId: userId },
      validENV.REFRESH_TOKEN_SECRET,
      {
        expiresIn: `${validENV.REFRESH_TOKEN_EXPIRY}d`,
      },
    );
    return refreshToken;
  } catch (error: any) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while generating Refresh token",
    );
  }
};

export { createAccessToken, createRefreshToken };
