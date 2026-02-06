import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration for Render Deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Define allowed origins for production (Render deployment)
    const allowedOrigins = [
      // Local development
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
      // Vercel deployments
      "https://food-website-a9du.vercel.app",
      "https://food-website-eight-gamma.vercel.app",
      // Render deployments (add your Render URLs here)
      process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.replace(/\/$/, "")
        : undefined,
      process.env.FRONTEND_URL_CLIENT
        ? process.env.FRONTEND_URL_CLIENT.replace(/\/$/, "")
        : undefined,
      // Render frontend URLs (if different)
      process.env.RENDER_FRONTEND_URL
        ? process.env.RENDER_FRONTEND_URL.replace(/\/$/, "")
        : undefined,
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps, Postman, etc.)
    // In production, you might want to restrict this
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: ["Content-Disposition"],
};

// Middleware
app.use(cors(corsOptions));

// Explicit preflight handler using regex to satisfy path-to-regexp
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure req.body is always an object to prevent destructuring errors
app.use((req, res, next) => {
  if (!req.body) req.body = {};
  next();
});

// Serve static files (images)
app.use("/public", express.static(path.join(__dirname, "public")));

// MongoDB Connection
let mongoConnected = false;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/foodie_admin")
  .then(() => {
    mongoConnected = true;
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    mongoConnected = false;
    console.error("MongoDB connection error:", err.message);
    console.warn(
      "⚠️  MongoDB not connected. Some endpoints may not work. Check MONGODB_URI environment variable.",
    );
  });

// Middleware to check MongoDB connection
const checkMongoConnection = (req, res, next) => {
  if (!mongoConnected) {
    return res.status(503).json({
      success: false,
      message: "Database is not connected. Please try again later.",
    });
  }
  next();
};

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", checkMongoConnection, productRoutes);
app.use("/api/messages", checkMongoConnection, messageRoutes);
app.use("/api/orders", checkMongoConnection, orderRoutes);
app.use("/api/images", imageRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
