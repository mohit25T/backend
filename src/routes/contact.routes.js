import express from "express";

import {
  createContact,
  getContacts,
  updateContact,
  deleteContact
} from "../controllers/contact.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";
import { checkSubscriptionStatus } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.use(requireAuth, checkSubscriptionStatus); // 🔥 Global subscription check for all contact routes


// ➕ Admin creates contact
router.post(
  "/",
  requireAdmin,
  createContact
);


// 📋 Get contacts (Resident + Guard + Admin)
router.get(
  "/",
  getContacts
);


// ✏️ Update contact (Admin only)
router.patch(
  "/:id",
  requireAdmin,
  updateContact
);


// ❌ Delete contact (Admin only)
router.delete(
  "/:id",
  requireAdmin,
  deleteContact
);

export default router;