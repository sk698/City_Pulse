import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AIVerification } from "../models/aiVerification.model.js";
import { Issue } from "../models/issue.model.js";
import { User } from "../models/user.model.js";
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Initialize Google Vision Client
const visionClient = new ImageAnnotatorClient();

//  Predefined keywords for verification
const VALID_TAGS = [
    "garbage", "trash", "waste", "litter", "dumping", "overflowing bin",
    "pothole", "road damage", "broken sidewalk", "blocked road", "traffic light not working", "damaged signboard",
    "sewage", "open drain", "waterlogging", "leakage", "broken pipeline",
    "streetlight not working", "electrical hazard", "exposed wires", "power outage",
    "illegal construction", "deforestation", "pollution", "burning waste",
    "vandalism", "graffiti", "illegal parking", "encroachment", "broken fence",
    "park maintenance", "broken bench", "damaged playground", "public toilet issue"
];


const verifyIssueAI = asyncHandler(async (req, res) => {
    const { issueId } = req.params;

    // Fetch issue from DB
    const issue = await Issue.findById(issueId).populate("media");
    if (!issue || !issue.media || issue.media.length === 0) {
        throw new ApiError(404, "Issue or issue media not found");
    }

    // Check if already verified
    let existingVerification = await AIVerification.findOne({ issueId });
    if (existingVerification?.verified) {
        return res.status(200).json(
            new ApiResponse(200, existingVerification, "Issue already verified earlier")
        );
    }

    const imageUrl = issue.media[0].fileUrl;
    const description = issue.description?.toLowerCase() || "";

    // Call Google Vision API
    const [result] = await visionClient.labelDetection(imageUrl);
    const labels = result.labelAnnotations || [];

    if (labels.length === 0) {
        throw new ApiError(500, "AI could not analyze the image.");
    }

    // Extract AI tags
    const tags = labels.map(label => label.description.toLowerCase());

    // Match description with AI tags
    const matchedTag = tags.find(
        tag => VALID_TAGS.includes(tag) &&
            (description.includes(tag) || description.includes("waste") || description.includes("garbage"))
    );

    const verified = matchedTag ? true : false;

    // Save verification result
    const verification = await AIVerification.findOneAndUpdate(
        { issueId },
        {
            issueId,
            verified,
            confidenceScore: Math.round((labels[0].score || 0)),
            tags: tags.slice(0, 5)
        },
        { new: true, upsert: true }
    );

    // If verified and first time then award 50 points
    if (verified && (!existingVerification || !existingVerification.verified)) {
        const user = await User.findById(issue.userId);
        if (user) {
            user.points = (user.points || 0) + 50;
            await user.save();
        }
    }

    return res.status(201).json(
        new ApiResponse(201, 
            { verification, 
                tags: verified ? tags : [] }, 
                verified
            ? "AI + description verified issue and 50 points awarded"
            : "Verification failed (AI and description did not match)")
    );
});

const getVerificationResult = asyncHandler(async (req, res) => {
    const { issueId } = req.params;
    const verification = await AIVerification.findOne({ issueId });

    if (!verification) {
        throw new ApiError(404, "No verification result found for this issue");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, verification, "AI verification result fetched successfully"));
});

export { verifyIssueAI, getVerificationResult };
