import type { Request, Response } from "express";
import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { ApiResponse } from "../../uitls/apiResponse.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { validateAdmin } from "../../validator/rootAdmin.validator.js";
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

export { approveSubAdmin };
