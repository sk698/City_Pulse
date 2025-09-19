import mongoose, {Schema} from "mongoose";


const feedbackSchema = new Schema(
  {
    issueId: { type: Schema.Types.ObjectId, ref: "Issue", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String }
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
