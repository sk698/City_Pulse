import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getMyReportedIssues,
    getMyAssignments
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ Registration with avatar & cover image
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

// ✅ Login & Refresh
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

// ✅ Account Security
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// ✅ Profile & Account
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// ✅ Avatar & Cover Image Updates
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// ✅ Civic-Specific
router.route("/my-issues").get(verifyJWT, getMyReportedIssues);   // citizen’s reported issues
router.route("/my-assignments").get(verifyJWT, getMyAssignments); // worker/contractor’s assigned tasks

export default router;
