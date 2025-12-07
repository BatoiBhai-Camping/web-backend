import type { Request, Response } from "express";
import { asyncHandler } from "../uitls/asyncHandler.js";
import { validateAdmin } from "../validator/rootAdmin.validator.js";
import { ApiError } from "../uitls/apiError.js";
import { db } from "../db/db.js";
import { ApiResponse } from "../uitls/apiResponse.js";
import { userLoginValidator } from "../validator/user.validator.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
} from "../helper/createAccessRefreshAndVerificationToken.js";
import { validENV } from "../validator/env.validator.js";

// approve the sub admin

const rootAdminLogin = asyncHandler(async (req: Request, res: Response) => {
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
      role: {
        in: ["ADMIN", "ROOTADMIN"],
      },
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
      "Provided email is not found or this is not a  admin email",
    );
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

const approveSubAdmin = asyncHandler(async (req: Request, res: Response) => {
  // get the admin user id from the body
  const validRes = validateAdmin.safeParse(req.body);
  if (!validRes.success) {
    throw new ApiError(
      400,
      validRes.error.message || "Invalid input for admin approbal request",
    );
  }

  const data = validRes.data;

  // get the user with this id which type is admin and update its status
  const adminStatusUpdate = await db.bb_user.update({
    where: {
      id: data.id,
      role: "ADMIN",
    },
    data: {
      roleStatus: "APPROVED",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully approved the admin"));
});

const rejectSubAdmin = asyncHandler(async (req: Request, res: Response) => {
  // get the admin user id from the body
  const validRes = validateAdmin.safeParse(req.body);
  if (!validRes.success) {
    throw new ApiError(
      400,
      validRes.error.message || "Invalid input for sub admin approbal request",
    );
  }

  const data = validRes.data;

  // get the user with this id which type is admin and update its status
  const adminStatusUpdate = await db.bb_user.update({
    where: {
      id: data.id,
      role: "ADMIN",
    },
    data: {
      roleStatus: "REJECTED",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully Rejected the sub admin"));
});

const approveAgent = asyncHandler(async (req: Request, res: Response) => {
  // get the agent by id check its mail verifiation status
  const validRes = validateAdmin.safeParse(req.body);

  if (!validRes.success) {
    throw new ApiError(400, "Invalid inpu data for agent id");
  }
  const data = validRes.data;
  // check agent is esist or not
  const agent = await db.bb_user.findUnique({
    where: {
      id: data.id,
      role: "AGENT",
    },
  });
  if (!agent) {
    throw new ApiError(400, "Agent profile is not found with the id");
  }
  // check mail is verifyed or not
  const mailVerifyRes = await db.bb_user.findUnique({
    where: {
      id: agent.id,
      role: agent.role,
      emailVerified: true,
    },
  });
  if (!mailVerifyRes) {
    // creat the notification for the user
    const notificationEntry = await db.bb_notification.create({
      data: {
        title: "Verify the email",
        message:
          "Kindly verify the account email in order to approve the user acount",
        type: "SYSTEM_MESSAGE",
        userId: data.id,
      },
    });
    throw new ApiError(
      400,
      "Agent email is not verifyed, notify the user to verify the email",
    );
  }

  // update the agent approved status
  const approvedStatus = await db.bb_user.update({
    where: {
      id: agent.id,
    },
    data: {
      roleStatus: "APPROVED",
    },
  });

  // send the success response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Agent account verifye successfully"));
});

export { approveSubAdmin, rejectSubAdmin, rootAdminLogin, approveAgent };
