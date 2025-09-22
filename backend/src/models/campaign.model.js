import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignName: {
      type: String,
      required: true,
      trim: true
    },
    campaignDate: {
      type: Date,
      required: true
    },
    campaignStatus: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming"
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
      }
    ],
    pointsAddedAfterJoining: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);
