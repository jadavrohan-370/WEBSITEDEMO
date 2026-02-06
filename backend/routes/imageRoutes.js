import express from "express";
import { uploadImage, deleteImage } from "../controller/imageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import multer from "multer";

const router = express.Router();

// Helper to handle Multer errors specifically
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: `Upload error (Multer): ${err.message}`,
      });
    } else if (err) {
      console.error("General upload error:", err);
      return res.status(500).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    }
    next();
  });
};

// Routes
router.post("/upload", authMiddleware, handleUpload, uploadImage);
router.delete("/delete", authMiddleware, deleteImage);

export default router;
