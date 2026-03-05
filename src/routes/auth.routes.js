import express from "express";
import rateLimit from "express-rate-limit";

import {
    getMe,
    sendOtp,
    sendOtpUser,
    verifyOtpLogin,
    verifyUserLogin,
    logoutUser,
    requestEmailChange,
    verifyEmailChange,
    refreshAccessToken
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * =====================================================
 * 🔐 REFRESH TOKEN RATE LIMITER
 * Prevents abuse of refresh endpoint
 * =====================================================
 */
const refreshLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,             // max 10 refresh requests per minute
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * =====================================================
 * CURRENT USER
 * =====================================================
 */
router.get("/me", requireAuth, getMe);

/**
 * =====================================================
 * OTP LOGIN
 * =====================================================
 */
router.post("/send-otp", sendOtp);
router.post("/send-user-otp", sendOtpUser);
router.post("/verify-otp", verifyOtpLogin);
router.post("/verify-user-otp", verifyUserLogin);

/**
 * =====================================================
 * REFRESH ACCESS TOKEN
 * =====================================================
 */
router.post("/refresh-token", refreshLimiter, refreshAccessToken);

/**
 * =====================================================
 * LOGOUT
 * =====================================================
 */
router.post("/logout", requireAuth, logoutUser);

/**
 * =====================================================
 * REQUEST EMAIL CHANGE
 * =====================================================
 */
router.post("/request-email-change", requireAuth, requestEmailChange);

/**
 * =====================================================
 * VERIFY EMAIL CHANGE
 * =====================================================
 */
router.post("/verify-email-change", requireAuth, verifyEmailChange);

export default router;
