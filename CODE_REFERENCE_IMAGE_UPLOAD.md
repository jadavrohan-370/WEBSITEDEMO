# Code Reference - Image Upload Implementation

## Complete Code Files

### 1. Backend Image Controller

**File:** `backend/controller/imageController.js`

```javascript
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

    // Return the image URL
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
```

---

### 2. Backend Image Routes

**File:** `backend/routes/imageRoutes.js`

```javascript
import express from "express";
import { uploadImage, deleteImage } from "../controller/imageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can upload and delete images
router.post("/upload", authMiddleware, uploadImage);
router.delete("/delete", authMiddleware, deleteImage);

export default router;
```

---

### 3. Updated Server.js

**Key additions to backend/Server.js:**

```javascript
// At the top - add imports
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// After app creation - add static file serving
app.use("/public", express.static(path.join(__dirname, "public")));

// In routes section - add image routes import and use
import imageRoutes from "./routes/imageRoutes.js";

app.use("/api/images", imageRoutes);
```

---

### 4. Backend .gitignore

**File:** `backend/.gitignore`

```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
public/images/
```

---

### 5. Admin API Client Service

**File:** `admin/src/services/apiClient.js` (additions)

```javascript
export const imageService = {
  upload: (imageBase64) => apiClient.post("/images/upload", { image: imageBase64 }),
  delete: (filename) => apiClient.delete("/images/delete", { data: { filename } }),
};
```

---

### 6. Admin Products Component - Key Functions

**File:** `admin/src/pages/Products.jsx` (additions)

```javascript
// State variables (add to Products component)
const [uploadingImage, setUploadingImage] = useState(false);
const [imagePreview, setImagePreview] = useState("");
const fileInputRef = useRef(null);

// Function to handle image selection and upload
const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    toast.error("Please select a valid image file");
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size must be less than 5MB");
    return;
  }

  setUploadingImage(true);
  const reader = new FileReader();

  reader.onload = async (event) => {
    const base64String = event.target?.result;
    setImagePreview(base64String);

    // Upload image to backend
    try {
      const uploadData = await imageService.upload(base64String);

      if (uploadData.success) {
        setCurrentProduct({
          ...currentProduct,
          image: uploadData.imageUrl,
        });
        toast.success("Image uploaded successfully");
      } else {
        toast.error(uploadData.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  reader.readAsDataURL(file);
};

// Update closeModal function
const closeModal = () => {
  setIsModalOpen(false);
  setIsEditing(false);
  setImagePreview("");
  setCurrentProduct({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
};

// Update openEdit function
const openEdit = (product) => {
  setCurrentProduct(product);
  setImagePreview(product.image);
  setIsEditing(true);
  setIsModalOpen(true);
};
```

---

### 7. Admin Products Form - Image Upload Input

**File:** `admin/src/pages/Products.jsx` (in modal form)

```jsx
<div>
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Product Image
  </label>
  <div
    onClick={() => fileInputRef.current?.click()}
    className="w-full border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center cursor-pointer hover:bg-indigo-50 transition-colors bg-indigo-50/30"
  >
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      disabled={uploadingImage}
      className="hidden"
    />
    {imagePreview ? (
      <div className="flex flex-col items-center gap-2">
        <img
          src={imagePreview}
          alt="Preview"
          className="h-24 w-24 object-cover rounded-lg"
        />
        <p className="text-xs text-slate-600">
          {uploadingImage ? "Uploading..." : "Click to change image"}
        </p>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-2">
        <Upload size={32} className="text-indigo-400" />
        <p className="text-sm font-medium text-slate-700">
          {uploadingImage ? "Uploading image..." : "Click to upload image"}
        </p>
        <p className="text-xs text-slate-500">
          PNG, JPG, WEBP (Max 5MB)
        </p>
      </div>
    )}
  </div>
  {currentProduct.image && (
    <p className="text-xs text-emerald-600 mt-2">✓ Image path saved</p>
  )}
</div>
```

---

### 8. Admin Imports

**File:** `admin/src/pages/Products.jsx` (updated imports)

```javascript
import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { productService, imageService } from "../services/apiClient";
```

---

## API Endpoints Reference

### Upload Image
```
POST /api/images/upload

Request Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}

Request Body:
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}

Success Response (201):
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "/public/images/product_1707092400000_abc123.png",
  "filename": "product_1707092400000_abc123.png"
}

Error Response (400/500):
{
  "success": false,
  "message": "Error description"
}
```

### Delete Image
```
DELETE /api/images/delete

Request Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}

Request Body:
{
  "filename": "product_1707092400000_abc123.png"
}

Success Response (200):
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Database Document Example

### Product with Image

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Delicious Burger",
  price: 250,
  category: "Food",
  description: "Fresh burger with lettuce and tomato",
  image: "/public/images/product_1707092400000_abc123.png",
  stock: 50,
  createdBy: ObjectId("507f1f77bcf86cd799439012"),
  createdAt: ISODate("2025-02-04T10:00:00.000Z"),
  updatedAt: ISODate("2025-02-04T10:00:00.000Z")
}
```

---

## File Naming Pattern

### Generated Filename Format
```
product_{timestamp}_{randomString}.{extension}

Example:
product_1707092400000_abc123.png

Breakdown:
- product_      = prefix
- 1707092400000 = timestamp (when image was uploaded)
- abc123        = random 7-character string
- .png          = file extension (preserved from original)
```

---

## Error Handling Examples

### Common Error Cases

1. **File too large**
```javascript
if (file.size > 5 * 1024 * 1024) {
  toast.error("Image size must be less than 5MB");
}
```

2. **Invalid file type**
```javascript
if (!file.type.startsWith("image/")) {
  toast.error("Please select a valid image file");
}
```

3. **Upload failure**
```javascript
if (!uploadData.success) {
  toast.error(uploadData.message || "Failed to upload image");
}
```

4. **Not authenticated**
```
Response: 401 Unauthorized
Message: "Authentication required"
```

---

## Testing Code Snippets

### Test Image Upload
```javascript
// In browser console, after selecting image:
const base64 = "data:image/png;base64,iVBORw0KGgo...";
const response = await fetch("http://localhost:5000/api/images/upload", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {your_token}"
  },
  body: JSON.stringify({ image: base64 })
});
const data = await response.json();
console.log(data); // Should show success and imageUrl
```

### Verify File Saved
```bash
# In terminal, check if image was saved
ls -la backend/public/images/

# Output should show:
# product_1707092400000_abc123.png
```

---

## Configuration Options

### Change Max File Size
```javascript
// In Products.jsx, handleImageChange function
const MAX_SIZE = 10 * 1024 * 1024; // 10MB instead of 5MB
if (file.size > MAX_SIZE) {
  toast.error("Image size must be less than 10MB");
}
```

### Add More Image Types
```javascript
// In imageController.js
const allowedTypes = ["jpeg", "jpg", "png", "webp", "gif", "svg"];
```

### Change Storage Directory
```javascript
// In imageController.js
const imagesDir = path.join(__dirname, "../uploads/products");
// or for cloud storage:
// const imagesDir = "s3://your-bucket/images";
```

---

## Common Issues & Solutions

### Issue: "Image directory doesn't exist"
**Solution:**
```bash
# Create it manually
mkdir -p backend/public/images

# Or the system creates it automatically on first upload
```

### Issue: "Upload returns 401"
**Solution:**
```javascript
// Check if token exists
const token = localStorage.getItem("authToken");
console.log("Token:", token); // Should show token value

// If no token, login first
```

### Issue: "Image not displaying"
**Solution:**
```javascript
// Check image URL in database
db.products.findOne({name: "Burger"})
// Should show: image: "/public/images/product_..."

// Verify file exists
ls backend/public/images/product_1707092400000_abc123.png
```

---

## Next Steps for Enhancement

### Add Image Compression
```javascript
// Install: npm install image-js
import { Image } from "image-js";

// Compress before saving
const compressed = await Image.load(imageBuffer).resize(...);
```

### Add to Cloud Storage
```javascript
// Install: npm install aws-sdk
import AWS from "aws-sdk";

const s3 = new AWS.S3();
// Upload to S3 instead of disk
```

### Add Thumbnail Generation
```javascript
// Install: npm install sharp
import sharp from "sharp";

// Generate thumbnail
await sharp(imageBuffer)
  .resize(200, 200)
  .toFile(thumbpath);
```

---

**This is the complete code reference for the image upload system!** 🎉
