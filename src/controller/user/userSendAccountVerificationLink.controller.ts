import type { Request, Response } from "express";

import { type JwtPayload } from "jsonwebtoken";
import { db } from "../../db/db.js";
import { createVerificationToken } from "../../helper/createAccessRefreshAndVerificationToken.js";
import { sendAccountVerificationMail } from "../../helper/sendMail.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { validENV } from "../../validator/env.validator.js";

interface VerificationPayload extends JwtPayload {
  email: string;
}

const sendAccountVerificationLink = asyncHandler(
  async (req: Request, res: Response) => {
    // check user is verifyed or not
    // if not then create a vifify token store it in the db and send the mail alogn with it
    // // send the response that user is verifyed
    const user = await db.bb_user.findFirst({
      where: {
        id: req.userId as string,
        emailVerified: true,
      },
    });

    if (user) {
      throw new ApiError(400, "User account is already verifyed");
    }
    // create an verification token and store it with the user db

    // get the user for the db
    const dbuser = await db.bb_user.findFirst({
      where: {
        id: req.userId as string,
      },
      select: {
        fullName: true,
        id: true,
        email: true,
        role: true,
      },
    });
    if (!dbuser) {
      throw new ApiError(400, "No user is found kindly register");
    }
    const verificationToken = await createVerificationToken(dbuser.email);
    await db.bb_user.update({
      where: {
        id: dbuser.id,
      },
      data: {
        verifyToken: verificationToken,
      },
    });

    // send the verification code to the user for account verificaton according to the user
    if (dbuser.role === "TRAVELER") {
      sendAccountVerificationMail({
        reciverGamil: dbuser.email,
        reciverName: dbuser.fullName,
        verificationLink: `${validENV.FRONTEND_URL_USER}/verify-email?verifyToken=${verificationToken}`, //the verification link is a frontend url which contain the verification token
      });
    } else if (dbuser.role === "AGENT") {
      sendAccountVerificationMail({
        reciverGamil: dbuser.email,
        reciverName: dbuser.fullName,
        verificationLink: `${validENV.FRONTEND_URL_AGENT}/verify-email?verifyToken=${verificationToken}`, //the verification link is a frontend url which contain the verification token
      });
    } else {
      sendAccountVerificationMail({
        reciverGamil: dbuser.email,
        reciverName: dbuser.fullName,
        verificationLink: `${validENV.FRONTEND_URL_ADMIN}/verify-email?verifyToken=${verificationToken}`, //the verification link is a frontend url which contain the verification token
      });
    }

    // send the response that mail is send
    return res
      .status(200)
      .json(new ApiResponse(200, "verification mail is send successfully"));
  },
);

export { sendAccountVerificationLink };
