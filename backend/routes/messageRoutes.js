import express from "express";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessage,
  markAsRead,
  replyToMessage,
} from "../controller/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route (anyone can send message)
router.post("/", createMessage);

// Protected routes (only admin can view)
router.get("/", authMiddleware, getAllMessages);
router.get("/:id", authMiddleware, getMessage);
router.put("/:id/reply", authMiddleware, replyToMessage);
router.put("/:id/read", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
