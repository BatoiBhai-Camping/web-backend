import { Router } from "express";

// as the admin and root admin registration process is same we use the same register funciton to register the sub admin
import { adminRegister } from "../controller/admin/admin.controller.js";
import {
  approveSubAdmin,
  rejectSubAdmin,
  rootAdminLogin,
  approveAgent,
  approvePackage
} from "../controller/root admin/rootAdmin.controller.js";
import { rootAdminMiddleware } from "../middleware/rootAdmin.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userAccountVerification } from "../controller/user/userAccountVerification.controller.js";

import { logout, deleteAccout } from "../controller/user/user.controller.js";

const rootAdminRouter = Router();

rootAdminRouter.route("/register").post(adminRegister);
rootAdminRouter
  .route("/verify-account")
  .post(authMiddleware, userAccountVerification);
rootAdminRouter.route("/login").post(rootAdminLogin);
rootAdminRouter.route("/logout").delete(authMiddleware, logout);
rootAdminRouter
  .route("/approve-sub-admin")
  .post(rootAdminMiddleware, approveSubAdmin);
rootAdminRouter
  .route("/reject-sub-admin")
  .post(rootAdminMiddleware, rejectSubAdmin);
rootAdminRouter.route("/approve-agent").post(rootAdminMiddleware, approveAgent);
rootAdminRouter.route("/approve-pkg").post(rootAdminMiddleware, approvePackage);
rootAdminRouter.route("/delete-acc").delete(rootAdminMiddleware, deleteAccout);

export { rootAdminRouter };
