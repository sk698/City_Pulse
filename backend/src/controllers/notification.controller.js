import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Create and save a notification
const createNotification = async (userId, message, type, issueId = null) => {
  const notification = new Notification({
    user: userId,
    message,
    notificationType: type,
    issue: issueId,
    status: 'unread',
    createdAt: new Date(),
  });

  return await notification.save();
};

// Notify the reporter when issue is created
const notifyReporter = async (issue) => {
  const message = `Your issue "${issue.title}" has been reported successfully.`;
  await createNotification(issue.reportedBy, message, 'issue_report', issue._id);
};

// Notify reporter on status update
const notifyReporterOnStatusUpdate = async (issue) => {
  const message = `Your issue "${issue.title}" status changed to "${issue.status}".`;
  await createNotification(issue.reportedBy, message, 'issue_update', issue._id);
};

// Notify reporter and assigned users when issue is resolved
const notifyUsersOnResolution = async (issue) => {
  const userIds = new Set([
    issue.reportedBy?.toString(),
    ...(issue.assignedTo || []).map((id) => id.toString()),
  ]);

  for (const userId of userIds) {
    const message = `The issue "${issue.title}" has been resolved.`;
    await createNotification(userId, message, 'issue_resolution', issue._id);
  }
};

// Fetch notifications for a user
const getUserNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

  if (!notifications) {
    throw new ApiError(404, 'No notifications found for this user.');
  }
  if (notifications.length === 0){
    new ApiResponse(200,0,"No notifiaction")
  }

  res.status(200).json(
    new ApiResponse(200, notifications, 'Notifications fetched successfully')
  );
});

export {
  getUserNotifications,
  notifyReporter,
  notifyReporterOnStatusUpdate,
  notifyUsersOnResolution,
};
