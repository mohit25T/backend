import express from "express";
import {
  createOrder,
  verifyPayment,
  getMySubscription,
  getSubscriptionPreview,
} from "../controllers/subscription.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================================
   📊 GET CURRENT SUBSCRIPTION
   ===================================================== */
router.get("/current", requireAuth, getMySubscription);

/* =====================================================
   🔍 PREVIEW (AUTO CALCULATION)
   ===================================================== */
router.get("/preview", requireAuth, getSubscriptionPreview);

/* =====================================================
   💳 CREATE ORDER (AUTO: NEW + UPGRADE)
   ===================================================== */
router.post("/create-order", requireAuth, createOrder);
router.post("/upgrade-order", requireAuth, createOrder);

/* =====================================================
   ✅ VERIFY PAYMENT (COMMON FOR BOTH)
   ===================================================== */
router.post("/verify-payment", requireAuth, verifyPayment);

export default router;