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
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.use(requireAuth, checkSubscriptionStatus); // 🔥 Global subscription check for all vehicle routes
/**
 * =========================
 * 🧍 RESIDENT ROUTES
 * =========================
 */

router.post(
    "/create",
    requireResident,
    createVehicle
);

router.get(
    "/my",
    requireResident,
    getMyVehicles
);

router.put(
    "/update/:id",
    requireResident,
    updateVehicle
);

router.delete(
    "/delete/:id",
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
   requireGuard,
    getAllVehicles
);

// Guard search vehicle by number plate
router.get(
    "/search",
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
   requireAdmin,
    getAllVehicles
);

export default router;