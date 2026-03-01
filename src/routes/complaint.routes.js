import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireResident } from "../middlewares/role.middleware.js";
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
    "/",
    requireAuth,
    requireResident,
    upload.single("image"), // 🔥 important
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
    getAllComplaints
);

// Admin → Update complaint
router.patch(
    "/:id",
    requireAuth,
    updateComplaintStatus
);

export default router;