import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js";

// ✅ Get current user's notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ sentAt: -1 });
  return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched"));
});

export { getMyNotifications };
