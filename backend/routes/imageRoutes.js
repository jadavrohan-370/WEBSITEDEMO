import express from "express";
import { uploadImage, deleteImage } from "../controller/imageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Only admin can upload and delete images (multipart/form-data)
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);
router.delete("/delete", authMiddleware, deleteImage);

export default router;
