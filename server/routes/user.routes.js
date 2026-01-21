import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { updateMe } from "../controllers/user.controller.js";

const router = express.Router();

// Update current user's profile
router.put("/me", authMiddleware, updateMe);

export default router;

