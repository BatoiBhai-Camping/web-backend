import { Router } from "express";
import {
  createOrder,
  verifyPaymetn,
} from "../controller/payement/payment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.route("/create-order").post(authMiddleware, createOrder);
paymentRouter.route("/verify-payment").post(authMiddleware, verifyPaymetn);

export { paymentRouter };
