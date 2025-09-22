import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";

//  Add feedback
const addFeedback = asyncHandler(async (req, res) => {
  const { rating, comments } = req.body;
  const { issueId } = req.params;

  if (!rating) throw new ApiError(400, "Rating is required");

  const feedback = await Feedback.create({
    issueId,
    userId: req.user._id,
    rating,
    comments
  });

  return res.status(201).json(new ApiResponse(201, feedback, "Feedback added"));
});

//  Get feedback for issue
const getFeedbackForIssue = asyncHandler(async (req, res) => {
  const { issueId } = req.params;
  const feedback = await Feedback.find({ issueId }).populate("userId", "fullName role");
  return res.status(200).json(new ApiResponse(200, feedback, "Feedback fetched"));
});

export { addFeedback, getFeedbackForIssue };
