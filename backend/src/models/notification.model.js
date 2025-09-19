import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    issueId: { type: Schema.Types.ObjectId, ref: "Issue" },
    channel: { type: String, enum: ["app", "sms", "email"], required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
  }
);

export const Notification = mongoose.model("Notification", notificationSchema);
