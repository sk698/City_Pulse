import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js';
import issueRoutes from "./routes/issue.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import aiRoutes from "./routes/ai.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/issues", issueRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/ai", aiRoutes);

// http://localhost:3000/api/v1/users/register

export { app }