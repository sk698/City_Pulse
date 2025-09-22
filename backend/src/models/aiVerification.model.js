import mongoose, {Schema} from "mongoose";

const aiVerificationSchema = new Schema(
  {
    issueId: { type: Schema.Types.ObjectId, ref: "Issue", required: true },
    verified: { type: Boolean, default: false },
    confidenceScore: { type: Number },
    duplicateOf: { type: Schema.Types.ObjectId, ref: "Issue" }
  },
  { timestamps: true }
);

export const AIVerification = mongoose.model("AIVerification", aiVerificationSchema);