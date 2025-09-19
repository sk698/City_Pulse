import { Router } from "express";
import { 
    addFeedback, 
    getFeedbackForIssue 
} from "../controllers/feedback.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Citizen adds feedback on issue
router.post("/:issueId", verifyJWT, addFeedback);

// Get all feedback for an issue
router.get("/:issueId", verifyJWT, getFeedbackForIssue);

export default router;
