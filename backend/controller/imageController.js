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

// Upload image (Base64 to file)
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    // Validate base64
    if (!image.startsWith("data:image/")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format. Expected base64 encoded image",
      });
    }

    // Extract image type and data
    const matches = image.match(/^data:image\/([a-zA-Z0-9]*);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format",
      });
    }

    const imageType = matches[1];
    const base64Data = matches[2];

    // Validate image type
    const allowedTypes = ["jpeg", "jpg", "png", "webp", "gif"];
    if (!allowedTypes.includes(imageType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid image type. Allowed: JPEG, PNG, WEBP, GIF",
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `product_${timestamp}_${randomString}.${imageType}`;
    const filepath = path.join(imagesDir, filename);

    // Convert base64 to buffer and save
    const imageBuffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(filepath, imageBuffer);

    // Return the image URL (relative path that can be accessed via backend)
    const imageUrl = `/public/images/${filename}`;

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      filename,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.body;

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
