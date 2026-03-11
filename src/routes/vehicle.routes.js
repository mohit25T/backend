import express from "express";

import {
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getMyVehicles,
    getAllVehicles,
    searchVehicle
} from "../controllers/vehicle.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

import {
    requireResident,
    requireAdmin,
    requireGuard
} from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * =========================
 * 🧍 RESIDENT ROUTES
 * =========================
 */

router.post(
    "/create",
    requireAuth,
    requireResident,
    createVehicle
);

router.get(
    "/my",
    requireAuth,
    requireResident,
    getMyVehicles
);

router.put(
    "/update/:id",
    requireAuth,
    requireResident,
    updateVehicle
);

router.delete(
    "/delete/:id",
    requireAuth,
    requireResident,
    deleteVehicle
);

/**
 * =========================
 * 👮 GUARD ROUTES
 * =========================
 */

// Guard view vehicle list
router.get(
    "/list",
    requireAuth,
    requireGuard,
    getAllVehicles
);

// Guard search vehicle by number plate
router.get(
    "/search",
    requireAuth,
    requireGuard,
    searchVehicle
);

/**
 * =========================
 * 🏢 ADMIN ROUTES
 * =========================
 */

router.get(
    "/all",
    requireAuth,
    requireAdmin,
    getAllVehicles
);

export default router;