import mongoose, {Schema} from "mongoose";

const issueMediaSchema = new Schema(
  {
    issueId: { type: Schema.Types.ObjectId, ref: "Issue", required: true },
    fileUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true }
  },
  { timestamps: true }
);

export const IssueMedia = mongoose.model("IssueMedia", issueMediaSchema);
