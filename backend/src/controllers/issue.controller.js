import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Issue } from "../models/issue.model.js";
import { IssueMedia } from "../models/issue_media.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  notifyReporter,
  notifyReporterOnStatusUpdate,
  notifyUsersOnResolution,
} from "./notification.controller.js";
import {
  verifyIssueAI,
  getVerificationResult
} from "./ai.controller.js";

// Citizen creates issue
const createIssue = asyncHandler(async (req, res) => {

  const { title, description, category, lat, lng, address, assignedTo = [] } = req.body;

  if (!title || !lat || !lng) {
    throw new ApiError(400, "Title and location (lat, lng) are required");
  }


  const issue = await Issue.create({
    userId: req.user._id,
    reportedBy: req.user._id, 
    title,
    description,
    category,
    location: { lat, lng },
    address,
    media: [], 
    assignedTo,
  });

  // 3. Handle media uploads if files exist
  if (req.files?.length > 0) {
    const mediaPromises = req.files.map(async (file) => {
      const uploaded = await uploadOnCloudinary(file.path);
      const mediaDoc = await IssueMedia.create({
        issueId: issue._id,
        fileUrl: uploaded.url,
        mediaType: file.mimetype.startsWith("video") ? "video" : "image",
      });
      return mediaDoc._id;
    });

    const mediaIds = await Promise.all(mediaPromises);
    issue.media = mediaIds;
    await issue.save();
  }

  // Notify the reporter that the issue has been created
  await notifyReporter(issue);
  // Trigger AI verification if media is present
  if (issue.media.length > 0) {
     verifyIssueAI(issue._id);
  }
  // Send a single, final success response
  return res
    .status(201)
    .json(new ApiResponse(201, issue, "Issue reported successfully"));
});

// Delete the issue
const deleteIssue = asyncHandler(async (req, res) => {
  const { issueId } = req.params;

  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }


  await Issue.findByIdAndDelete(issueId);

  res.status(200).json(new ApiResponse(200, {}, "Issue deleted successfully"));
});

// Get all issues 
const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find()
    .populate("userId", "fullName role")
    .populate("media");
  return res.status(200).json(new ApiResponse(200, issues, "All issues fetched"));
});

// Get single issue
const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate("reportedBy", "fullName avatar")
    .populate("media");
  if (!issue) throw new ApiError(404, "Issue not found");
  return res.status(200).json(new ApiResponse(200, issue, "Issue fetched"));
});

// Update issue status
const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    throw new ApiError(400, "Status field is required");
  }

  // Find and update the issue in one atomic operation
  const updatedIssue = await Issue.findByIdAndUpdate(
    id,
    { status },
    { new: true } 
  );

  if (!updatedIssue) {
    throw new ApiError(404, "Issue not found");
  }

  // Send notifications based on the new status
  await notifyReporterOnStatusUpdate(updatedIssue);

  if (updatedIssue.status === 'resolved') {
    // Notify everyone involved
    await notifyUsersOnResolution(updatedIssue);
  }

  // Send the final success response
  return res.status(200).json(new ApiResponse(200, updatedIssue, "Issue status updated"));
});

export { createIssue, deleteIssue, getAllIssues, getIssueById, updateIssueStatus };