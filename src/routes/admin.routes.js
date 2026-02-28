import express from "express";
import { updateAdminDetails, getAllSocietyVisitors, getPendingTenantRequests } from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin, requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.patch(
  "/:adminId",
  requireAuth,
  requireSuperAdmin,
  updateAdminDetails
);



router.get("/Society", requireAuth, requireAdmin, getAllSocietyVisitors)

router.get(
  "/pending-tenants",
  requireAuth,
  requireAdmin,
  getPendingTenantRequests
);

router.patch(
  "/approve-tenant/:inviteId",
  requireAuth,
  requireAdmin,
  approveTenant
);
export default router;
