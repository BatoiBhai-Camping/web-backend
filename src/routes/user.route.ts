import { Router } from "express";
import { userRegister, userLogIn, userAccountVerification } from "../controller/user.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js"
const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/verify-account").post(authMiddleware,userAccountVerification)
userRouter.route("/login").post(userLogIn);

export { userRouter };
