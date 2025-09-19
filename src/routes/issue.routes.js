import { Router } from "express";
import { 
    createIssue, 
    getAllIssues, 
    getIssueById, 
    updateIssueStatus 
} from "../controllers/issue.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Citizen reports an issue
router.post("/", verifyJWT, upload.array("media", 5), createIssue);

// Get all issues (admin/dashboard)
router.get("/", verifyJWT, getAllIssues);

// Get single issue by ID
router.get("/:id", verifyJWT, getIssueById);

// Update issue status (admin/worker)
router.patch("/:id/status", verifyJWT, updateIssueStatus);

export default router;
