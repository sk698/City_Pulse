import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: ["https://city-pulse-indol.vercel.app","http://localhost:5173"], // your Vercel frontend
    credentials: true, // allow cookies/auth
    methods: ["GET","POST","PUT","DELETE","OPTIONS"], // allow all necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"] // allow these headers
}));


app.use(express.json({limit: "16kb"}))
// app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js';
import issueRoutes from "./routes/issue.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import campaignRoutes from "./routes/campaign.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/issue", issueRoutes);
app.use("/api/v1/assignment", assignmentRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/campaign", campaignRoutes);
app.use("/api/v1/dashboard", dashboardRoutes); 

// http://localhost:8000/api/v1/

export { app }
