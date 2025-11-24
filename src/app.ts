import express from "express"
import { healthRoute } from "./routes/health.route.js";
import { globalErrorHandler } from "./uitls/globalErrorHandeller.js";
const app = express();

//access body middleware
app.use(express.json())


app.use("/api/v1",healthRoute)

//global error handler
app.use(globalErrorHandler)

export {app}