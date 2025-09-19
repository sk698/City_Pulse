import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Issue } from "../models/issue.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ✅ Citizen creates issue
const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, lat, lng, address } = req.body;

  if (!title || !category || !lat || !lng) {
    throw new ApiError(400, "Missing required fields");
  }

  const mediaUploads = [];
  if (req.files?.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path);
      mediaUploads.push({ fileUrl: uploaded.url, mediaType: "image" });
    }
  }

  const issue = await Issue.create({
    userId: req.user._id,
    title,
    description,
    category,
    location: { lat, lng },
    address,
    media: mediaUploads
  });

  return res.status(201).json(new ApiResponse(201, issue, "Issue reported successfully"));
});

// ✅ Get all issues (admin dashboard)
const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find().populate("userId", "fullName role");
  return res.status(200).json(new ApiResponse(200, issues, "All issues fetched"));
});

// ✅ Get single issue
const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("userId", "fullName role");
  if (!issue) throw new ApiError(404, "Issue not found");
  return res.status(200).json(new ApiResponse(200, issue, "Issue fetched"));
});

// ✅ Update issue status
const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!issue) throw new ApiError(404, "Issue not found");
  return res.status(200).json(new ApiResponse(200, issue, "Issue status updated"));
});

export { createIssue, getAllIssues, getIssueById, updateIssueStatus };
