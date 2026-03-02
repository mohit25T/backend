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

const router = express.Router();

/* ================= RESIDENT ================= */

// Create complaint with image upload
router.post(
    "/create",
    requireAuth,
    requireResident,
    upload.any(), // 🔥 important
    createComplaint
);

// Resident → My complaints
router.get(
    "/my",
    requireAuth,
    requireResident,
    getMyComplaints
);

/* ================= ADMIN ================= */

// Admin → Get all complaints
router.get(
    "/",
    requireAuth,
    requireAdmin,
    getAllComplaints
);

// Admin → Update complaint
router.patch(
    "/:id",
    requireAuth,
    requireAdmin,
    updateComplaintStatus
);

export default router;