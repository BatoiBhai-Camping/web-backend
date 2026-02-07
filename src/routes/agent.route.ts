import {
  agentRegister,
  publishPackage,
  agentLogIn,
  getAllPackages,
  getProfile,
  updateProfile
} from "../controller/agent/agent.controller.js";
import {
  userAccountVerification,
  sendAccountVerificationLink,
  logout,
  deleteAccout,
} from "../controller/user/user.controller.js";
import { agentMiddleware } from "../middleware/agent.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { Router } from "express";

const agentRouter = Router();

agentRouter.route("/register").post(agentRegister);
// as we use the same email and pass for login we use the same user login here
agentRouter.route("/login").post(agentLogIn);
agentRouter.route("/logout").delete(authMiddleware, logout);
// we use the same user account verification as both have same workflow
agentRouter
  .route("/verify-account")
  .post(authMiddleware, userAccountVerification);
// we use the same user account verificaton mail sending function as agent and user are same
agentRouter
  .route("/send-verification-link")
  .post(authMiddleware, sendAccountVerificationLink);
agentRouter.route("/publish-package").post(agentMiddleware, publishPackage);
agentRouter.route("/delete-acc").delete(agentMiddleware, deleteAccout);
agentRouter.route("/get-all-packages").get(agentMiddleware,getAllPackages);
agentRouter.route("/get-profile").get(agentMiddleware,getProfile);
agentRouter.route("/get-all-pkgs").get(agentMiddleware,getAllPackages);
agentRouter.route("/update-profile").post(agentMiddleware,updateProfile)
export { agentRouter };
