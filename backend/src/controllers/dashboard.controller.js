import { asyncHandler } from "../utils/asyncHandler.js";
import { Issue } from "../models/issue.model.js";
import { User } from "../models/user.model.js";
import { getUserNotifications } from "./notification.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Get overall dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments();
        const resolvedIssues = await Issue.countDocuments({ status: "resolved" });
        const pendingIssues = await Issue.countDocuments({ status: "pending" });
        const inProgress = await Issue.countDocuments({ status: "in_progress" });

        // Fetch the current user to get their points
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(
            new ApiResponse(200, {
                totalIssues,
                resolvedIssues,
                pendingIssues,
                inProgress,
                userPoints: user.points || 0,
            }, "Dashboard statistics fetched successfully")
        );
    } catch (err) {
        throw new ApiError(500, "Failed to fetch dashboard stats");
    }
});

// Recent issues (for dashboard list)
export const getRecentIssues = asyncHandler(async (req, res) => {
    const issues = await Issue.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("reportedBy", "username email");

    return res.status(200).json(new ApiResponse(200, issues, "Recent issues fetched successfully"));
});

// Recent notifications
export const getRecentNotifications = asyncHandler(async (req, res, next) => {
  req.params.userId = req.user._id;
  await getUserNotifications(req, res, next);
});

// Category breakdown (for pie chart)
export const getIssuesByCategory = asyncHandler(async (req, res) => {
    try {
        const categories = await Issue.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        return res.status(200).json(
            new ApiResponse(200, categories.map(c => ({ category: c._id, count: c.count })), "Issues by category fetched successfully")
        );
    } catch (err) {
        throw new ApiError(500, "Failed to fetch category stats");
    }
});

// Get top 10 users for leaderboard
export const getLeaderboard = asyncHandler(async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ points: -1 })
            .limit(10)
            .select("fullName username avatar points");

        return res.status(200).json(
            new ApiResponse(200, topUsers, "Leaderboard data fetched successfully")
        );
    } catch (err) {
        throw new ApiError(500, "Failed to fetch leaderboard data");
    }
});