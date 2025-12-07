import { Router } from "express";
import { adminRegister } from "../controller/admin.controller.js";
const adminRouter = Router();

adminRouter.route("/register").post(adminRegister);
