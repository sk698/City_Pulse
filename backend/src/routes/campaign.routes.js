import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  joinCampaign,
  updateCampaignStatus,
  deleteCampaign
} from "../controllers/campaign.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route 
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);

// Protected routes (users must be logged in)
router.post("/", verifyJWT, createCampaign);
router.post("/:id/join", verifyJWT, joinCampaign);
router.patch("/:id/status", verifyJWT, updateCampaignStatus);
router.get("/:id/status", verifyJWT, getCampaignById)
router.delete("/:id", verifyJWT, deleteCampaign);

export default router;
