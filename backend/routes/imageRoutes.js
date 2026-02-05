import express from "express";
import { uploadImage, deleteImage } from "../controller/imageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can upload and delete images
router.post("/upload", authMiddleware, uploadImage);
router.delete("/delete", authMiddleware, deleteImage);

export default router;
