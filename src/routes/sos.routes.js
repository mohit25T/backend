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

const router = express.Router();


// 🚨 Resident triggers SOS
router.post(
  "/trigger",
  requireAuth,
  requireResident,
  triggerSOS
);


// 🛡 Guards see active SOS alerts
router.get(
  "/active",
  requireAuth,
  requireGuard,
  getActiveSOS
);


// 🛡 Guard responding to SOS
router.patch(
  "/respond/:id",
  requireAuth,
  requireGuard,
  respondSOS
);


// ✅ Guard resolves SOS
router.patch(
  "/resolve/:id",
  requireAuth,
  requireGuard,
  resolveSOS
);


// 📊 Admin sees SOS history
router.get(
  "/history",
  requireAuth,
  requireAdmin,
  getSOSHistory
);


export default router;