import { Router } from "express";
import { 
    assignIssue, 
    getAssignmentsByUser 
} from "../controllers/assignment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Assign issue to worker (admin only)
router.post("/", verifyJWT, assignIssue);

// Worker sees their own assignments
router.get("/my", verifyJWT, getAssignmentsByUser);

export default router;
