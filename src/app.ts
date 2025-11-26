import express from "express";
import { healthRoute } from "./routes/health.route.js";
import { userRouter } from "./routes/user.route.js";
import { globalErrorHandler } from "./uitls/globalErrorHandeller.js";
import cookieParser from "cookie-parser";
const app = express();

// app.set("trust proxy", 1); //enebale only in production

// middleware for cookie
app.use(cookieParser());
//access body middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", healthRoute);
app.use("/api/v1/user", userRouter);

//global error handler
app.use(globalErrorHandler);

export { app };
