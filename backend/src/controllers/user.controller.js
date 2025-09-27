import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Issue } from "../models/issue.model.js";
import { Assignment } from "../models/assignment.model.js";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {fullName, email, username, password } = req.body;

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if(existedUser){
        if (existedUser.username === username) {
        throw new ApiError(409, "username already exists");
        }
        if (existedUser.email === email) {
        throw new ApiError(409, "email already exists");
        }
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
   
    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Generate tokens to log the user in immediately after registration
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const data = {
        user: createdUser,
        accessToken,
        refreshToken
    };

    return res.status(201).json(
        new ApiResponse(
            201, 
            data, 
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) =>{
    const {email, username, password} = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }
 
    const user = await User.findOne({
        $or: [{username}, {email}]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    );
});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        };
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ));
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    );
});

const getMyReportedIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ userId: req.user._id }).populate("media");
  return res.status(200).json(new ApiResponse(200, issues, "Reported issues fetched"));
});

// Fetch all assignments for current worker
const getMyAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ assignedTo: req.user._id })
    .populate("issueId")
    .populate("assignedBy", "fullName role");
  return res.status(200).json(new ApiResponse(200, assignments, "Assignments fetched"));
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getMyReportedIssues,
    getMyAssignments
}