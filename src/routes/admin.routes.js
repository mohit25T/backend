import express from "express";
import { updateAdminDetails,getAllSocietyVisitors } from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin,requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.patch(
    console.log("🔥 admin.routes.js FILE LOADED"),
  "/adminId",
  requireAuth,
  requireSuperAdmin,
  updateAdminDetails
);

router.get("/Society", requireAuth, requireAdmin, getAllSocietyVisitors)


export default router;
