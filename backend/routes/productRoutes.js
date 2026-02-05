import express from "express";
import {
  getAllProducts,
  getProduct,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (anyone can view)
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.get("/category/:category", getProductsByCategory);

// Protected routes (only admin)
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
