import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { validateAdmin } from "../../validator/rootAdmin.validator.js";
import { adminAccountApprovedMail } from "../../helper/sendMail.js";
import { validENV } from "../../validator/env.validator.js";
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
    select: {
      fullName: true,
      email: true,
    },
  });

  if (approvedStatus) {
    adminAccountApprovedMail({
      reciverName: approvedStatus.fullName,
      reciverGamil: approvedStatus.email,
      loginLink: `${validENV.FRONTEND_URL_AGENT}`,
    });
  }

  // send the success response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Agent account verifye successfully"));
});

export { approveAgent };
