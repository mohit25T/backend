import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin, requireResident } from "../middlewares/role.middleware.js";
import {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus
} from "../controllers/complaint.controller.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();
router.use(requireAuth, checkSubscriptionStatus); // 🔥 Global subscription check for all complaint routes

/* ================= RESIDENT ================= */

// Create complaint with image upload
router.post(
    "/create",
    requireResident,
    upload.array("images", 5), // 🔥 important
    createComplaint
);

// Resident → My complaints
router.get(
    "/my",
    requireResident,
    getMyComplaints
);

/* ================= ADMIN ================= */

// Admin → Get all complaints
router.get(
    "/",
    requireAdmin,
    getAllComplaints
);

// Admin → Update complaint
router.patch(
    "/:id",
    requireAdmin,
    updateComplaintStatus
);

export default router;