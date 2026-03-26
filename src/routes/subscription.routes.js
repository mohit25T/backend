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
   💳 CREATE ORDER (AUTO: NEW + UPGRADE)
   ===================================================== */
router.post("/create-order", requireAuth, createOrder);

/* =====================================================
   🔥 OPTIONAL: EXPLICIT UPGRADE ROUTE (BEST PRACTICE)
   (Uses same controller but clearer intent)
   ===================================================== */
router.post("/upgrade-order", requireAuth, createOrder);

/* =====================================================
   ✅ VERIFY PAYMENT (COMMON FOR BOTH)
   ===================================================== */
router.post("/verify-payment", requireAuth, verifyPayment);

/* =====================================================
   📊 GET CURRENT SUBSCRIPTION
   ===================================================== */
router.get("/me", requireAuth, getMySubscription);

/* =====================================================
   🔍 PREVIEW (AUTO CALCULATION)
   ===================================================== */
router.get("/preview", requireAuth, getSubscriptionPreview);

export default router;