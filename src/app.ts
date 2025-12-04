import express from "express";
import { healthRoute } from "./routes/health.route.js";
import { userRouter } from "./routes/user.route.js";
import { agentRouter } from "./routes/agent.route.js";
import { globalErrorHandler } from "./uitls/globalErrorHandeller.js";
import cookieParser from "cookie-parser";
import { assetsRouter } from "./routes/assets.route.js";
const app = express();

// app.set("trust proxy", 1); //enebale only in production

// middleware for cookie
app.use(cookieParser());
//access body middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// for serve the file form the public folder
app.use(express.static("public"));

app.use("/api/v1", healthRoute);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/agent", agentRouter);
app.use("/api/v1/assets", assetsRouter);

//global error handler
app.use(globalErrorHandler);

export { app };
