import { Router } from "express";
import { adminRegister } from "../controller/admin.controller.js";
import {
  rootAdminLogin,
  approveAgent,
} from "../controller/rootAdmin.controller.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
const adminRouter = Router();

adminRouter.route("/register").post(adminRegister);
adminRouter.route("/login").post(rootAdminLogin);
adminRouter.route("/approve-agent").post(adminMiddleware, approveAgent);

export { adminRouter };
