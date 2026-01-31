import express from "express";
import { getAdminDashboard } from "../controllers/adminDashboard.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  requireAuth,
  getAdminDashboard
);



export default router;
