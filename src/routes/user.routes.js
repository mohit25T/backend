import express from "express";
import { getUsersByRole, getMyProfile, getResidentVisitorHistory } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin, requireResident } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", requireAuth, requireSuperAdmin, getUsersByRole);
router.get("/profile", requireAuth, getMyProfile);
router.get("/resident-visitor-history", requireAuth, requireResident, getResidentVisitorHistory
);
export default router;
