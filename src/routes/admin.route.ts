import { Router } from "express";
import { adminRegister } from "../controller/admin/admin.controller.js";
import {
  rootAdminLogin,
  approveAgent,
  approvePackage,
  rejectPckage,
  getAllAgents,
  getAllPayments,
  getAllUser,
  getAllPkg,
  getAllPkgOfAgent,
  getRootAdminProfile,
} from "../controller/root admin/rootAdmin.controller.js";
import {
  adminMiddlewareOperation,
  adminMiddlewareSelfOperation,
} from "../middleware/admin.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  sendAccountVerificationLink,
  userAccountVerification,
  logout,
  deleteAccout,
  updateUserProfile,
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
adminRouter
  .route("/approve-agent")
  .post(adminMiddlewareOperation, approveAgent);
adminRouter
  .route("/approve-pkg")
  .post(adminMiddlewareOperation, approvePackage);
adminRouter.route("/reject-pkg").post(adminMiddlewareOperation, rejectPckage);
adminRouter.route("/get-all-agent").get(adminMiddlewareOperation, getAllAgents);
adminRouter
  .route("/get-all-payments")
  .get(adminMiddlewareOperation, getAllPayments);
adminRouter.route("/get-all-user").get(adminMiddlewareOperation, getAllUser);
adminRouter.route("/get-all-pkg").get(adminMiddlewareOperation, getAllPkg);
adminRouter
  .route("/get-agent-pkg")
  .post(adminMiddlewareOperation, getAllPkgOfAgent);
adminRouter.route("/delete-acc").delete(adminMiddlewareOperation, deleteAccout);
adminRouter
  .route("/update-profile")
  .post(adminMiddlewareSelfOperation, updateUserProfile);
adminRouter.route("/get-profile").get(authMiddleware, getRootAdminProfile);
export { adminRouter };
