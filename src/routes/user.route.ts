import { Router } from "express";
import {
  userRegister,
  userLogIn,
  userAccountVerification,
  sendAccountVerificationLink,
} from "../controller/user/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter
  .route("/verify-account")
  .post(authMiddleware, userAccountVerification);
userRouter
  .route("/send-verification-link")
  .post(authMiddleware, sendAccountVerificationLink);
userRouter.route("/login").post(userLogIn);

export { userRouter };
