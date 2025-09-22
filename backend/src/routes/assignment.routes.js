import { Router } from "express";
import { 
    assignIssue, 
    getAssignmentsByUser, 
    searchAssignments
} from "../controllers/assignment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Assign issue to worker (admin only)
router.post("/", verifyJWT, assignIssue);

// Worker sees their own assignments
router.get("/my", verifyJWT, getAssignmentsByUser);

// Search assignments by username or issue description
router.get("/search", verifyJWT, searchAssignments);

export default router;
