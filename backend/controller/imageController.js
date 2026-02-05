import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, "../public/images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Upload image (Multer based)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Multer has already saved the file
    const filename = req.file.filename;
    const imageUrl = `/public/images/${filename}`;

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      filename,
    });
  } catch (error) {
    console.error("Error in uploadImage controller:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.body || {};

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    const filepath = path.join(imagesDir, filename);

    // Security: Prevent directory traversal
    if (!filepath.startsWith(imagesDir)) {
      return res.status(403).json({
        success: false,
        message: "Invalid file path",
      });
    }

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
