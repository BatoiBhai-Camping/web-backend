import { Router } from "express";
import {
  userRegister,
  userLogIn,
  userAccountVerification,
  sendAccountVerificationLink,
  logout,
  deleteAccout,
  getUserProfile,
  updateUserProfile
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
userRouter.route("/logout").delete(authMiddleware, logout);
userRouter.route("/get-profile").get(authMiddleware,getUserProfile)
userRouter.route("/delete-acc").delete(authMiddleware, deleteAccout);
userRouter.route("/update-profile").post(authMiddleware,updateUserProfile);
export { userRouter };
