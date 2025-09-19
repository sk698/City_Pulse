import mongoose, {Schema} from "mongoose";


const assignmentSchema = new Schema(
  {
    issueId: { type: Schema.Types.ObjectId, ref: "Issue", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["assigned", "in_progress", "completed", "failed"], default: "assigned" },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
