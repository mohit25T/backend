import express from "express";
import {
    toggleUserstatus,
    toggleSocietyStatus
} from "../controllers/block.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin,requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.patch(
    "/admin/:adminId",
    requireAuth,
    requireSuperAdmin,
    requireAdmin,
    ‎toggleUserstatus‎
);

router.patch(
    "/society/:societyId",
    requireAuth,
    requireSuperAdmin,
    toggleSocietyStatus
);

export default router;
