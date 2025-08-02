import express from "express";
import {
    signin,
    signout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
} from "../controllers/authController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/check-auth", protect, checkAuth);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
