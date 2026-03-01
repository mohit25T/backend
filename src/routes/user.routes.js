import express from "express";
import { getUsersByRole, getMyProfile, getResidentVisitorHistory, getUsersBySociety, uploadProfilePhoto, getResidentTenantDetails, removeTenant } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin, requireResident } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
const router = express.Router();

router.get("/", requireAuth, requireSuperAdmin, getUsersByRole);
router.get("/profile", requireAuth, getMyProfile);
router.get("/resident-visitor-history", requireAuth, requireResident, getResidentVisitorHistory);
router.get("/by-society", requireAuth, getUsersBySociety);
router.post(
    "/upload-profile-photo",
    requireAuth,
    upload.any(),
    uploadProfilePhoto
);

router.get(
    "/my-tenant",
    requireAuth,
    requireResident,
    getResidentTenantDetails
);

router.delete("/remove-tenant", requireAuth, requireResident, removeTenant);

export default router;
