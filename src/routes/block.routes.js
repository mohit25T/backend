import express from "express";
import {
    toggleAdminStatus,
    toggleSocietyStatus
} from "../controllers/block.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.patch(
    "/admin/:adminId",
    requireAuth,
    requireSuperAdmin,
    toggleAdminStatus
);

router.patch(
    "/society/:societyId",
    requireAuth,
    requireSuperAdmin,
    toggleSocietyStatus
);

export default router;
