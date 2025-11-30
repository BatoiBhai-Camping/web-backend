// this controller handel the following
// 1. user register
// 2. user login
// 3. user account verification
// 4. user account update
// 5. user account delete
import type { Request, Response } from "express";

import { asyncHandler } from "../uitls/asyncHandler.js";
import {
  userRegisterValidator,
  userLoginValidator,
  verifyAccountValidator,
} from "../validator/user.validator.js";
import { ApiError } from "../uitls/apiError.js";
import { db } from "../db/db.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  createVerificationToken,
} from "../helper/createAccessRefreshAndVerificationToken.js";
import { validENV } from "../validator/env.validator.js";
import { ApiResponse } from "../uitls/apiResponse.js";
import { sendAccountVerificationMail } from "../helper/sendMail.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface VerificationPayload extends JwtPayload {
  email: string;
}

const userRegister = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;

  // validate the data
  const validRes = userRegisterValidator.safeParse(userData);
  if (!validRes.success) {
    throw new ApiError(
      400,
      validRes.error.message || "Provided data are invalid",
    );
  }

  // check email exist or not
  const userExists = await db.user.findFirst({
    where: {
      email: validRes.data.email,
    },
  });

  if (userExists) {
    throw new ApiError(
      400,
      "User email already exist, try another email or loging",
    );
  }
  //hash the password
  const hashedPass = await bcrypt.hash(validRes.data.password, 10);
  //create the user
  const user = await db.user.create({
    data: {
      fullName: validRes.data.fullName,
      email: validRes.data.email,
      password: hashedPass,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });

  // create an verification token and store it with the user db
  const verificationToken = await createVerificationToken(user.email);
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      verifyToken: verificationToken,
    },
  });

  // send the verification code to the user for account verificaton
  sendAccountVerificationMail({
    reciverGamil: user.email,
    reciverName: user.fullName,
    verificationLink: verificationToken, //the verification link is a frontend url which contain the verification token
  });

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

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: refreshToken,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "User registerd success fully kindly verify your email",
      ),
    );
});

const userAccountVerification = asyncHandler(
  async (req: Request, res: Response) => {
    // check user is verifyed or not

    const isVerifyedUser = await db.user.findFirst({
      where: {
        id: req.userId as string,
        verified: true,
      },
    });

    if (isVerifyedUser) {
      throw new ApiError(400, "User is already verifyed");
    }
    const validateRes = verifyAccountValidator.safeParse(req.body);
    if (!validateRes.success) {
      throw new ApiError(400, "No verifify token is provided");
    }
    const verifyToken = validateRes.data.veriryToken;
    // verify the token
    const tokenData = jwt.verify(
      verifyToken,
      validENV.VERIFICATION_TOKEN_SECRET,
    ) as VerificationPayload;
    const email = req.userEmail;

    if (!(email === tokenData.email)) {
      throw new ApiError(
        400,
        "Invalid verification token, token payload doesnot match",
      );
    }

    //update the db

    const updateUser = await db.user.update({
      where: {
        id: req.userId as string,
      },
      data: {
        verified: true,
        verifyToken: null,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "User account verifyed successfully"));
  },
);

const userLogIn = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;
  const validRes = userLoginValidator.safeParse(userData);
  if (!validRes.success) {
    throw new ApiError(
      400,
      validRes.error.message || "Provided data field are invalid",
    );
  }
  // check the user is exist or not
  const user = await db.user.findUnique({
    where: {
      email: validRes.data.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ApiError(
      400,
      "Provided email is not found kindly register or try with another email",
    );
  }

  // check the pass
  const passCheck: boolean = await bcrypt.compare(
    validRes.data.password,
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

  await db.user.update({
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

export { userRegister, userLogIn, userAccountVerification };
