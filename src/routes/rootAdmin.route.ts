import { Router } from "express";

// as the admin and root admin registration process is same we use the same register funciton to register the sub admin
import { adminRegister } from "../controller/admin.controller.js";
import {approveSubAdmin, rejectSubAdmin} from "../controller/rootAdmin.controller.js"
import { rootAdminMiddleware } from "../middleware/rootAdmin.middleware.js";

const rootAdminRouter = Router();

rootAdminRouter.route("/register").post(adminRegister);
rootAdminRouter.route("/approve-sub-admin").post(rootAdminMiddleware,approveSubAdmin)
rootAdminRouter.route("/reject-sub-admin").post(rootAdminMiddleware,rejectSubAdmin)

export { rootAdminRouter };
