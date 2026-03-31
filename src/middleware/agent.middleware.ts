import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../uitls/asyncHandler.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../uitls/apiError.js";
import { validENV } from "../validator/env.validator.js";
import { db } from "../db/db.js";
interface accessTokenPayload extends JwtPayload {
  userId: string;
  email: string;
}
const agentMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accesstoken;
    if (!token) {
      throw new ApiError(
        400,
        "Access denied, authenication required as agent",
        [
          {
            field: "token",
            message: "No access token is found",
          },
        ],
      );
    }

    // check the token is in right format or not
    if (!token.startsWith("Bearer")) {
      throw new ApiError(400, "Access denied, authenication requiredas agent", [
        {
          field: "Invalid token format",
          message: "Invalid token type, expecting an Bearer token",
        },
      ]);
    }
    // extract the verification token
    const accessToken = token.split(" ")[1];
    if (!accessToken) {
      throw new ApiError(
        400,
        "Access denied, authenication required as  agent",
        [
          {
            field: "access token",
            message: "No token found with Bearer",
          },
        ],
      );
    }

    // vefiy the token
    const verifyAccessToken = jwt.verify(
      accessToken,
      validENV.ACCESS_TOKEN_SECRET,
    ) as accessTokenPayload;
    if (!verifyAccessToken.userId || !verifyAccessToken.email) {
      throw new ApiError(
        400,
        "Access denied, authenication required as  agent",
        [
          {
            field: "token payload",
            message: "Reqired data is not present in the token",
          },
        ],
      );
    }

    // find the user in db
    const dbUser = await db.bb_user.findFirst({
      where: {
        id: verifyAccessToken.userId,
        email: verifyAccessToken.email,
        isDeleted: false,

        role: "AGENT",
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        roleStatus: true,
      },
    });

    if (!dbUser) {
      throw new ApiError(
        400,
        "Access denied, authenication required as  agent",
        [
          {
            field: "Invalid user token",
            message:
              "Provided token data is not found in db with the constrains, id, email , emailVerified, role, rolestatus",
          },
        ],
      );
    }
    if (!dbUser.emailVerified) {
      throw new ApiError(
        400,
        "Access denied, authenication required as  agent",
        [
          {
            field: "Email is not verifyed",
            message: "Email is not verifyed kindly verify the email",
          },
        ],
      );
    }

    if (dbUser.roleStatus != "APPROVED") {
      throw new ApiError(
        400,
        "Access denied, authenication required as  agent",
        [
          {
            field: "Account not approved",
            message:
              "Account is not approved by admin, kindly contact the admin",
          },
        ],
      );
    }

    // now get the agent profile
    const agentProfile = await db.bb_agentProfile.findUnique({
      where: {
        userId: dbUser.id,
      },
      select: {
        id: true,
      },
    });

    if (!agentProfile) {
      throw new ApiError(400, "Provided user doesnot have any agent profile", [
        {
          field: "Agent profile",
          message: "This user doesnot have any agent profile",
        },
      ]);
    }
    // set the userId, agentId and email to the request object in order to use it further reoutes which need authentication
    req.userId = dbUser.id;
    req.agentId = agentProfile.id;
    req.userEmail = dbUser.email;

    next();
  },
);

export { agentMiddleware };
