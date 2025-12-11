import { Router } from "express";

// as the admin and root admin registration process is same we use the same register funciton to register the sub admin
import { adminRegister } from "../controller/admin/admin.controller.js";
import {
  approveSubAdmin,
  rejectSubAdmin,
  rootAdminLogin,
  approveAgent,
} from "../controller/root admin/rootAdmin.controller.js";
import { rootAdminMiddleware } from "../middleware/rootAdmin.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userAccountVerification } from "../controller/user/userAccountVerification.controller.js";

const rootAdminRouter = Router();

rootAdminRouter.route("/register").post(adminRegister);
rootAdminRouter
  .route("/verify-account")
  .post(authMiddleware, userAccountVerification);
rootAdminRouter.route("/login").post(rootAdminLogin);
rootAdminRouter
  .route("/approve-sub-admin")
  .post(rootAdminMiddleware, approveSubAdmin);
rootAdminRouter
  .route("/reject-sub-admin")
  .post(rootAdminMiddleware, rejectSubAdmin);
rootAdminRouter.route("/approve-agent").post(rootAdminMiddleware, approveAgent);

export { rootAdminRouter };
