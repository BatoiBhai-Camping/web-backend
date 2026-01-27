import { db } from "../../db/db.js";
import { ApiError } from "../../uitls/apiError.js";
import { asyncHandler } from "../../uitls/asyncHandler.js";
import { publicUseDataUser } from "../../uitls/publicSharedDataUser.js";
import { idValidator } from "../../validator/user.validator.js";
const getAgentProfile = asyncHandler(async (req: Request, res: Response) => {
  const validRes = idValidator.safeParse(req.body);

  if (!validRes.success) {
    throw new ApiError(
      400,
      validRes.error.message || "Invalid user id or user id not provided",
    );
  }

  const data = validRes.data;
  // get the user data with the agent profile data as well

  const userData = await db.bb_user.findUnique({
    where: {
      id: data.id,
      role: "AGENT",
    },
    select: {
      ...publicUseDataUser,
      profileImage: {
        select: {
          userProfile: true,
        },
      },
    },
  });
});

export { getAgentProfile };
