import express from "express";
import { createLead } from "../controllers/lead.controller.js";

const router = express.Router();

// Public route to submit a lead (no auth required)
router.post("/", createLead);

export default router;
