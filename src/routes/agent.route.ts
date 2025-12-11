import {
  agentRegister,
  publishPackage,
} from "../controller/agent/agent.controller.js";
import {
  userLogIn,
  userAccountVerification,
  sendAccountVerificationLink,
  logout
} from "../controller/user/user.controller.js";
import { agentMiddleware } from "../middleware/agent.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { Router } from "express";

const agentRouter = Router();

agentRouter.route("/register").post(agentRegister);
// as we use the same email and pass for login we use the same user login here
agentRouter.route("/login").post(userLogIn);
agentRouter.route("/logout").delete(authMiddleware,logout)
// we use the same user account verification as both have same workflow
agentRouter
  .route("/verify-account")
  .post(authMiddleware, userAccountVerification);
// we use the same user account verificaton mail sending function as agent and user are same
agentRouter
  .route("/send-verification-link")
  .post(authMiddleware, sendAccountVerificationLink);
agentRouter.route("/publish-package").post(agentMiddleware, publishPackage);

export { agentRouter };
