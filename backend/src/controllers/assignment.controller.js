import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Assignment } from "../models/assignment.model.js";
import { User } from "../models/user.model.js";
import { Issue } from "../models/issue.model.js";


const assignIssue = asyncHandler(async (req, res) => {
  const { assignedTo, title } = req.body;

  if (!assignedTo || !title) throw new ApiError(400, "Missing fields");

  // Find issue by title
  const issue = await Issue.findOne({ title: title });
  if (!issue) throw new ApiError(404, "Issue not found with this title");

  // Find user by username
  const user = await User.findOne({ username: assignedTo });
  if (!user) throw new ApiError(404, "User not found with this username");

  const assignment = await Assignment.create({
    issueId: issue._id,
    assignedTo: user._id,
    assignedBy: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, assignment, "Issue assigned"));
});



// Get assignments assigned to the current logged-in user
const getAssignmentsByUser = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ assignedTo: req.user._id })
    .populate("issueId")
    .populate("assignedBy", "name email"); 

  return res
    .status(200)
    .json(new ApiResponse(200, assignments, "Assignments fetched"));
});


//searchAssignments
const searchAssignments = asyncHandler(async (req, res) => {
  const username = req.query?.username || req.body?.username;
  const issueDescription = req.query?.issueDescription || req.body?.issueDescription;
  const title = req.query?.title || req.body?.title;

  if (!username && !issueDescription && !title) {
    throw new ApiError(400, "No search fields provided");
  }

  const filter = {};

  if (username) {
    const user = await User.findOne({ name: { $regex: new RegExp(username, "i") } });
    if (user) filter.assignedTo = user._id;
    else filter.assignedTo = null; 
  }


  let assignmentsQuery = Assignment.find(filter)
    .populate({
      path: "issueId",
      match: {
        ...(issueDescription ? { description: { $regex: new RegExp(issueDescription, "i") } } : {}),
        ...(title ? { title: { $regex: new RegExp(title, "i") } } : {})
      }
    })
    .populate("assignedTo", "name");

  const assignments = await assignmentsQuery.exec();

  const filteredAssignments = assignments.filter(a => a.issueId !== null);

  return res
    .status(200)
    .json(new ApiResponse(200, filteredAssignments, "Assignments search results"));
});


export { assignIssue, getAssignmentsByUser, searchAssignments };
