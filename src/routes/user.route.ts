import { Router } from "express";
import { userRegister, userLogIn } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogIn);

export { userRouter };
