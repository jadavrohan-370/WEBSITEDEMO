import cloudinary from "../utils/cloudinary.js";

// Upload image (Cloudinary based via Multer)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // With CloudinaryStorage, req.file.path is the secure URL
    const imageUrl = req.file.path;
    const filename = req.file.filename; // This is the public_id in Cloudinary

    res.status(201).json({
      success: true,
      message: "Image uploaded to Cloudinary successfully",
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
