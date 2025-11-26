import { Router } from "express";
import { health } from "../controller/health.controller.js";

const healthRoute = Router();

healthRoute.route("/health-status").get(health);

export { healthRoute };
