import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireResident } from "../middlewares/role.middleware.js";
import {
    createNotice,
    getNotices,
    deleteNotice
} from "../controllers/notice.controller.js";

const router = express.Router();

/* ================= ADMIN ================= */

// Create Notice (Admin Only - role check inside controller)
router.post(
    "/",
    requireAuth,
    createNotice
);

// Delete Notice (Admin Only)
router.delete(
    "/:id",
    requireAuth,
    deleteNotice
);

/* ================= ALL USERS ================= */

// Get Society Notices (Resident + Guard)
router.get(
    "/",
    requireAuth,
    getNotices
);

export default router;