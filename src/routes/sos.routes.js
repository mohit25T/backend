import express from "express";

import {
  triggerSOS,
  getActiveSOS,
  respondSOS,
  resolveSOS,
  getSOSHistory
} from "../controllers/sos.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

import {
  requireAdmin,
  requireResident,
  requireGuard
} from "../middlewares/role.middleware.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.use(requireAuth, checkSubscriptionStatus); // 🔥 Global subscription check for all SOS routes


// 🚨 Resident triggers SOS
router.post(
  "/trigger",
  requireResident,
  triggerSOS
);


// 🛡 Guards see active SOS alerts
router.get(
  "/active",
  requireGuard,
  getActiveSOS
);


// 🛡 Guard responding to SOS
router.patch(
  "/respond/:id",
  requireGuard,
  respondSOS
);


// ✅ Guard resolves SOS
router.patch(
  "/resolve/:id",
  requireGuard,
  resolveSOS
);


// 📊 Admin sees SOS history
router.get(
  "/history",
  requireAdmin,
  getSOSHistory
);


export default router;