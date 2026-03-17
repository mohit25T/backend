import express from "express";
import { getUsersByRole, getMyProfile, getResidentVisitorHistory, getUsersBySociety, uploadProfilePhoto, getResidentTenantDetails, removeTenant, getGuardActivity } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin, requireAdmin, requireResident } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";
const router = express.Router();


router.use(requireAuth); // 🔥 Global subscription check for all user routes
router.get("/", checkSubscriptionStatus, requireSuperAdmin, getUsersByRole);
router.get("/profile", checkSubscriptionStatus, getMyProfile);
router.get("/resident-visitor-history", checkSubscriptionStatus, requireResident, getResidentVisitorHistory);
router.get("/by-society", checkSubscriptionStatus, getUsersBySociety);
router.post(
    "/upload-profile-photo",
    checkSubscriptionStatus,
    upload.any(),
    uploadProfilePhoto
);

router.get(
    "/my-tenant",
    checkSubscriptionStatus,
    requireResident,
    getResidentTenantDetails
);


router.get(
    "/guards/activity",
    checkSubscriptionStatus,
    requireAdmin,
    getGuardActivity
);

router.delete("/remove-tenant", checkSubscriptionStatus, requireResident, removeTenant);

export default router;
