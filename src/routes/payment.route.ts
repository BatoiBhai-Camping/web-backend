import { Router } from "express";
import { createOrder } from "../controller/payement/payment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.route("/create-order").post(authMiddleware, createOrder);

export { paymentRouter };
