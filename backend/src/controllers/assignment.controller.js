import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Assignment } from "../models/assignment.model.js";

// ✅ Assign issue to worker
const assignIssue = asyncHandler(async (req, res) => {
  const { issueId, assignedTo } = req.body;
  if (!issueId || !assignedTo) throw new ApiError(400, "Missing fields");

  const assignment = await Assignment.create({
    issueId,
    assignedTo,
    assignedBy: req.user._id
  });

  return res.status(201).json(new ApiResponse(201, assignment, "Issue assigned"));
});

// ✅ Get assignments by current user
const getAssignmentsByUser = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ assignedTo: req.user._id }).populate("issueId");
  return res.status(200).json(new ApiResponse(200, assignments, "Assignments fetched"));
});

export { assignIssue, getAssignmentsByUser };
