import express from "express";
import {
  generateMonthlyBills,
  getResidentBills,
  markBillAsPaid,
  getAllSocietyBills,
  payFullYearMaintenance,
  getMaintenanceDashboardStats // 🔥 ADDED
} from "../controllers/maintenance.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin, requireResident } from "../middlewares/role.middleware.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();
router.use(requireAuth, checkSubscriptionStatus); // 🔥 Global subscription check for all maintenance routes

/* =========================================================
   🔹 Admin generates monthly bills
========================================================= */
router.post(
  "/generate",
  requireAdmin,
  generateMonthlyBills
);

/* =========================================================
   🔹 Resident views own bills
========================================================= */
router.get(
  "/my-bills",
  requireResident,
  getResidentBills
);

/* =========================================================
   🔹 Admin marks single bill as paid
========================================================= */
router.put(
  "/pay/:id",
  requireAdmin,
  markBillAsPaid
);

/* =========================================================
   🔹 Admin marks full year as paid (Per Resident)
========================================================= */
router.post(
  "/pay-full-year",
  requireAdmin,
  payFullYearMaintenance
);

/* =========================================================
   🔹 Admin views all bills in society
========================================================= */
router.get(
  "/all",
  requireAdmin,
  getAllSocietyBills
);

/* =========================================================
   🔹 Admin Maintenance Dashboard Stats
========================================================= */
router.get(
  "/dashboard-stats",
  requireAdmin,
  getMaintenanceDashboardStats
);

export default router;