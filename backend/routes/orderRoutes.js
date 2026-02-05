import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controller/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: place an order
router.post("/", createOrder);

// Admin: manage orders
router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
