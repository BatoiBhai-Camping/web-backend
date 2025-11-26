// this controller handel the following
// 1. user register
// 2. user login
// 3. user account verification
// 4. user account update
// 5. user account delete

import { asyncHandler } from "../uitls/asyncHandler.js";
import { userRegisterValidator } from "../validator/user.validator.js";
import type { userRegisterValidatorType } from "../validator/user.validator.js";
import { ApiError } from "../uitls/apiError.js";
import { db } from "../db/db.js";

const userRegister = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;

  // validate the data
  const validRes = userRegisterValidator.safeParse(userData);
  if (!validRes.success) {
    throw new ApiError(400, validRes.error.message || "Provided data are invalid");
  }

  // check email exist or not
  const userExists = await db.user.findFirst({
    where:{
        email: validRes.data.email
    }
  });

  if(userExists){
    throw new ApiError(400,"User email already exist, try another email or loging");
  }
  // create the access and refresh token
  
});
