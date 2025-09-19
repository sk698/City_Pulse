import { Router } from "express";
import { 
    getMyNotifications 
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get current user’s notifications
router.get("/", verifyJWT, getMyNotifications);

export default router;
