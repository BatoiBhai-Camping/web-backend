import express, { type Request, type Response } from "express";
import { healthRoute } from "./routes/health.route.js";
import { userRouter } from "./routes/user.route.js";
import { agentRouter } from "./routes/agent.route.js";
import { adminRouter } from "./routes/admin.route.js";
import { appRoute } from "./routes/app.route.js";
import { globalErrorHandler } from "./uitls/globalErrorHandeller.js";
import cookieParser from "cookie-parser";
import { assetsRouter } from "./routes/assets.route.js";
import { rootAdminRouter } from "./routes/rootAdmin.route.js";
import { ApiError } from "./uitls/apiError.js";
import cors from "cors";
import { validENV } from "./validator/env.validator.js";
const app = express();

// app.set("trust proxy", 1); //enebale only in production

// middleware for cookie
app.use(cookieParser());
//access body middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// for serve the file form the public folder
app.use(express.static("public"));

app.use(
  cors({
    origin: [validENV.FRONTEND_URL],
    credentials: true,
  }),
);

const apiVersion = "/api/v1";

app.use(`${apiVersion}`, healthRoute);
app.use(`${apiVersion}/user`, userRouter);
app.use(`${apiVersion}/agent`, agentRouter);
app.use(`${apiVersion}/assets`, assetsRouter);
app.use(`${apiVersion}/root-admin`, rootAdminRouter);
app.use(`${apiVersion}/admin`, adminRouter);
app.use(`${apiVersion}`, appRoute);

app.use((req: Request, res: Response) => {
  throw new ApiError(400, "api location not found");
});

//global error handler
app.use(globalErrorHandler);

export { app };
