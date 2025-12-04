import { agentRegister } from "../controller/agent.controller.js";
import {
  userLogIn,
  userAccountVerification,
  sendAccountVerificationLink,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { Router } from "express";

const agentRouter = Router();

agentRouter.route("/register").post(agentRegister);
// as we use the same email and pass for login we use the same user login here
agentRouter.route("/login").post(userLogIn);
// we use the same user account verification as both have same workflow
agentRouter.route("/verify-account").post(authMiddleware,userAccountVerification);
// we use the same user account verificaton mail sending function as agent and user are same
agentRouter
  .route("/send-verification-link")
  .post(authMiddleware, sendAccountVerificationLink);

export { agentRouter };
