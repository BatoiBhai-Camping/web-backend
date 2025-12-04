import { agentRegister } from "../controller/agent.controller.js";
import { Router } from "express";

const agentRouter = Router();

agentRouter.route("/register").post(agentRegister);

export { agentRouter };
