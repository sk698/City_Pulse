import mongoose, {Schema} from "mongoose";


const issueSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, enum: ["pothole", "garbage", "streetlight", "water", "other"] },
    status: { type: String, enum: ["pending", "verified", "in_progress", "resolved", "rejected"], default: "pending" },
    reportedBy: {                    
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    address: { type: String },
    priority: { type: Number, default: 0 }, 
    media: [{ type: Schema.Types.ObjectId, ref: "IssueMedia" }],
    aiVerified: { type: Boolean, default: false },
    aitags: [{ type: String }],
  },
  { timestamps: true }
);

export const Issue = mongoose.model("Issue", issueSchema);
