import express from "express";
import {
  inviteAdmin,
  getAllInvites,
  cancelInvite,
  inviteResident,
  inviteGuard,
  inviteAdminsBulk
} from "../controllers/invite.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin, requireAdmin } from "../middlewares/role.middleware.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();
router.use(requireAuth); // 🔥 Global subscription check for all invite routes

// router.use(requireAuth, requireSuperAdmin);

router.get("/", requireSuperAdmin, getAllInvites);
router.post("/admin", requireSuperAdmin, inviteAdmin);
router.post("/admin/bulk", requireSuperAdmin, inviteAdminsBulk);
router.post("/:id/cancel", requireSuperAdmin, cancelInvite);
router.post("/invite-resident", checkSubscriptionStatus, requireAdmin, inviteResident);
router.post("/invite-guard", checkSubscriptionStatus, requireAdmin, inviteGuard);

export default router;
