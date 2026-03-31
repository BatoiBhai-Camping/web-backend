import type { Request, Response } from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { validENV } from "../../validator/env.validator.js";
import { verifyAccountValidator } from "../../validator/user.validator.js";

interface VerificationPayload extends JwtPayload {
  email: string;
}

const userAccountVerification = asyncHandler(
  async (req: Request, res: Response) => {
    // check user is verifyed or not
    const validateRes = verifyAccountValidator.safeParse(req.body);
    if (!validateRes.success) {
      throw new ApiError(
        400,
        "No verifify token is provided",
        validateRes.error.issues,
      );
    }

    const verifyToken = validateRes.data.verifyToken;
    // verify the token
    const tokenData = jwt.verify(
      verifyToken,
      validENV.VERIFICATION_TOKEN_SECRET,
    ) as VerificationPayload;

    const user = await db.bb_user.findFirst({
      where: {
        email: tokenData.email,
      },
      select: {
        emailVerified: true,
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.emailVerified) {
      throw new ApiError(400, "User is already verified");
    }

    const updateUser = await db.bb_user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        verifyToken: null,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "User account verifyed successfully"));
  },
);

export { userAccountVerification };
