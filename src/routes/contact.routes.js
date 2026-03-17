import express from "express";

import {
  createContact,
  getContacts,
  updateContact,
  deleteContact
} from "../controllers/contact.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

import {
  requireAdmin,
} from "../middlewares/role.middleware.js";

const router = express.Router();


// ➕ Admin creates contact
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createContact
);


// 📋 Get contacts (Resident + Guard + Admin)
router.get(
  "/",
  requireAuth,
  getContacts
);


// ✏️ Update contact (Admin only)
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateContact
);


// ❌ Delete contact (Admin only)
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteContact
);

export default router;