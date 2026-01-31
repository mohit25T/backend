import express from "express";
import { updateAdminDetails } from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.put(
  "/",
  requireAuth,
  requireSuperAdmin,
  updateAdminDetails
);

export default router;
