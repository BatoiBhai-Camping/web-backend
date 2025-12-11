import { Router } from "express";
import { adminRegister } from "../controller/admin/admin.controller.js";
import {
  rootAdminLogin,
  approveAgent,
} from "../controller/root admin/rootAdmin.controller.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sendAccountVerificationLink } from "../controller/user/userSendAccountVerificationLink.controller.js";
import { userAccountVerification } from "../controller/user/userAccountVerification.controller.js";
const adminRouter = Router();

adminRouter.route("/register").post(adminRegister);
adminRouter
  .route("/verify-account")
  .post(authMiddleware, userAccountVerification);
adminRouter
  .route("/send-verification-link")
  .post(authMiddleware, sendAccountVerificationLink);
adminRouter.route("/login").post(rootAdminLogin);
adminRouter.route("/approve-agent").post(adminMiddleware, approveAgent);

export { adminRouter };
