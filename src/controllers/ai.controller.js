import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AIVerification } from "../models/aiVerification.model.js";

// ✅ Run AI verification
const verifyIssueAI = asyncHandler(async (req, res) => {
  const { issueId } = req.params;
  // Dummy AI logic (replace with ML model integration)
  const verification = await AIVerification.create({
    issueId,
    verified: true,
    confidenceScore: 90
  });
  return res.status(201).json(new ApiResponse(201, verification, "AI verification done"));
});

// ✅ Get AI result
const getVerificationResult = asyncHandler(async (req, res) => {
  const { issueId } = req.params;
  const verification = await AIVerification.findOne({ issueId });
  if (!verification) throw new ApiError(404, "No verification found");
  return res.status(200).json(new ApiResponse(200, verification, "AI verification fetched"));
});

export { verifyIssueAI, getVerificationResult };
