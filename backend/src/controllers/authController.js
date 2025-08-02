import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
} from "../mailtrap/emails.js";

export async function signup(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userExist = await User.findOne({ email });

        if (userExist)
            return res.status(400).json({ message: "User already exist" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        await user.save();

        //  jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

export async function verifyEmail(req, res) {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Error in verifyEmail", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function signin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Error in login", error);
        res.status(200).json({ message: "Logged in successfully" });
    }
}

export async function signout(req, res) {
    res.clearCookie("authtoken");
    res.status(200).json({
        success: true,
        message: "Signed out successfully!",
    });
}

export async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found!" });

        //  Generate a reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        //  Send email
        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        res.status(200).json({
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        console.error("Error in forgotPassword", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user)
            return res
                .status(400)
                .json({ message: "Invalid or expired reset token" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();
        await sendResetSuccessEmail(user.email);

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error resetPassword", error);
        res.status(400).json({ message: error.message });
    }
}

export async function checkAuth(req, res) {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) return res.status(400).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in checkAuth", error);
        res.status(400).json({ message: error.message });
    }
}
