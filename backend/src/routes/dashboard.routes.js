import { Router } from "express";
import { 
    getDashboardStats,
    getRecentIssues,
    getRecentNotifications,
    getIssuesByCategory,
    getLeaderboard
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/stats", verifyJWT, getDashboardStats);
router.get("/recent-issues", verifyJWT, getRecentIssues);
router.get("/notifications", verifyJWT, getRecentNotifications);
router.get("/issues-by-category", verifyJWT, getIssuesByCategory);
router.get("/leaderboard", verifyJWT, getLeaderboard);

export default router;