import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

// Upload image (Manual upload to Cloudinary)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Upload to Cloudinary using a stream
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "food-website/products",
            resource_type: "image",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await uploadToCloudinary();

    res.status(201).json({
      success: true,
      message: "Image uploaded to Cloudinary successfully",
      imageUrl: result.secure_url,
      filename: result.public_id, // This is the public_id in Cloudinary
    });
  } catch (error) {
    console.error("Error in uploadImage controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Delete image from Cloudinary
export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.body || {}; // This should be the Cloudinary public_id

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary filename (public_id) is required",
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(filename);

    if (result.result === "ok") {
      res.json({
        success: true,
        message: "Image deleted from Cloudinary successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image not found or already deleted on Cloudinary",
        result,
      });
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
