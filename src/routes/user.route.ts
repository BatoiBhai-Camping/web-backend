import { Router } from "express";
import {
  userRegister,
  userLogIn,
  userAccountVerification,
  sendAccountVerificationLink,
  logout,
  deleteAccout,
  getUserProfile,
  updateUserProfile,
  getAllbookings,
  platformReview,
  deletePlatformReview,
  agentReview,
  deleteAgentReview,
  packageReview,
  deletePackageReview,
} from "../controller/user/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/verify-account").post(userAccountVerification);
userRouter
  .route("/send-verification-link")
  .post(authMiddleware, sendAccountVerificationLink);
userRouter.route("/login").post(userLogIn);
userRouter.route("/logout").delete(authMiddleware, logout);
userRouter.route("/get-profile").get(authMiddleware, getUserProfile);
userRouter.route("/delete-acc").delete(authMiddleware, deleteAccout);
userRouter.route("/update-profile").post(authMiddleware, updateUserProfile);
userRouter.route("/get-all-bookings").get(authMiddleware, getAllbookings);
userRouter.route("/platform-review").post(authMiddleware, platformReview);
userRouter
  .route("/delete-platform-review")
  .post(authMiddleware, deletePlatformReview);
userRouter.route("/agent-review").post(authMiddleware, agentReview);
userRouter
  .route("/delete-agent-review")
  .post(authMiddleware, deleteAgentReview);
userRouter.route("/package-review").post(authMiddleware, packageReview);
userRouter
  .route("/delete-package-review")
  .post(authMiddleware, deletePackageReview);

export { userRouter };
