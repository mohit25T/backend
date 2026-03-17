import express from "express";
import {
    createVisitorEntry,
    approveVisitor,
    rejectVisitor,
    markVisitorEntered,
    markVisitorExited,
    getVisitors,
    getSocietyFlats,
    createPreApprovedGuest,
    verifyGuestOtp,
    allowOtpGuestEntry
} from "../controllers/visitor.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    requireGuard,
    requireResident,
} from "../middlewares/role.middleware.js";
import { checkGuardShift } from "../middlewares/checkGuardShift.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();

/**
 * =========================
 * 👮 GUARD ROUTES
 * =========================
 */

router.use(requireAuth,checkSubscriptionStatus); // 🔥 Global subscription check for all visitor routes

// Guard creates visitor entry
router.post(
    "/create",
    requireGuard,
    checkGuardShift,
    upload.any(), // ✅ NEW
    createVisitorEntry
);

// Guard allows entry
router.put(
    "/enter/:id",
    requireGuard,
    checkGuardShift,
    markVisitorEntered
);

// Guard marks exit
router.put(
    "/exit/:id",
    requireGuard,
    checkGuardShift,
    markVisitorExited
);


/**
 * =========================
 * 🧍 RESIDENT ROUTES
 * =========================
 */

// Resident approves visitor
router.put(
    "/approve/:id",
    requireResident,
    approveVisitor
);

// Resident rejects visitor
router.put(
    "/reject/:id",
    requireResident,
    rejectVisitor
);


/**
 * =========================
 * 🏢 ADMIN / COMMON ROUTES
 * =========================
 */

// Admin / Secretary / Super Admin can view logs
router.get(
    "/",
    getVisitors
);

// Get flats list (for guard)
router.get(
    "/flats",
    requireGuard,
    getSocietyFlats
);

// resident
router.post(
    "/preapprove",
    requireResident,
    createPreApprovedGuest
);

// guard
router.post(
    "/verify-otp",
    requireGuard,
    checkGuardShift,
    verifyGuestOtp
);

router.put(
    "/otp-enter/:id",
    requireGuard,
    checkGuardShift,
    allowOtpGuestEntry
);



export default router;
