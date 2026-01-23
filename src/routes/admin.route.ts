import { Router } from "express";
import { adminRegister } from "../controller/admin/admin.controller.js";
import {
  rootAdminLogin,
  approveAgent,
  approvePackage
} from "../controller/root admin/rootAdmin.controller.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  sendAccountVerificationLink,
  userAccountVerification,
  logout,
  deleteAccout,
} from "../controller/user/user.controller.js";
const adminRouter = Router();

adminRouter.route("/register").post(adminRegister);
adminRouter
  .route("/verify-account")
  .post(authMiddleware, userAccountVerification);
adminRouter
  .route("/send-verification-link")
  .post(authMiddleware, sendAccountVerificationLink);
adminRouter.route("/login").post(rootAdminLogin);
adminRouter.route("/logout").delete(authMiddleware, logout);
adminRouter.route("/approve-agent").post(adminMiddleware, approveAgent);
adminRouter.route("/approve-pkg").post(adminMiddleware,approvePackage);
adminRouter.route("/delete-acc").delete(adminMiddleware, deleteAccout);
export { adminRouter };
