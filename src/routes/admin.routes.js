import express from "express";
import { updateAdminDetails, getPendingTenantRequests, approveTenant } from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin, requireAdmin } from "../middlewares/role.middleware.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();
router.use(requireAuth); // 🔥 Global subscription check for all admin routes

router.patch(
  "/:adminId",
  requireSuperAdmin,
  updateAdminDetails
);


router.get(
  "/pending-tenants",
  checkSubscriptionStatus,
  requireAdmin,
  getPendingTenantRequests
);

router.patch(
  "/approve-tenant/:inviteId",
  checkSubscriptionStatus,
  requireAdmin,
  approveTenant
);
export default router;
