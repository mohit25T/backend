import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin, requireResident } from "../middlewares/role.middleware.js";
import {
    createNotice,
    getNotices,
    deleteNotice
} from "../controllers/notice.controller.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.use(requireAuth, checkSubscriptionStatus); // 🔥 Global subscription check for all notice routes

/* ================= ADMIN ================= */

// Create Notice (Admin Only - role check inside controller)
router.post(
    "/",
    requireResident, // ✅ Only residents can create notices, but inside controller we will check if they are admin
    createNotice
);

// Delete Notice (Admin Only)
router.delete(
    "/:id",
    requireAdmin,
    deleteNotice
);

/* ================= ALL USERS ================= */

// Get Society Notices (Resident + Guard)
router.get(
    "/",
    getNotices
);

export default router;