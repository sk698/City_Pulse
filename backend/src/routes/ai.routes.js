import { Router } from "express";
import { 
    verifyIssueAI, 
    getVerificationResult 
} from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Run AI verification on an issue
router.post("/:issueId", verifyJWT, verifyIssueAI);

// Get verification result
router.get("/:issueId", verifyJWT, getVerificationResult);

export default router;
