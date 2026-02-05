import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getProfile,
  logoutAdmin,
} from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", authMiddleware, logoutAdmin);

export default router;
