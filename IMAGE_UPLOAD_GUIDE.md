# Image Upload Implementation Guide (Multer Edition)

## Overview

This system implements **Multipart/Form-Data** image upload to the backend using `Multer`. Images are saved as files in the `backend/public/images/` folder, and their relative paths are stored in the MongoDB database.

## How It Works

### Frontend Flow (Admin Panel)

1. **Admin selects an image** in the "Add New Product" form.
2. **Local Preview** is generated using `URL.createObjectURL(file)`.
3. **FormData object** is created, and the `File` object is appended to it.
4. **Multipart request** is sent to the backend `/api/images/upload` endpoint.
5. **Backend returns image URL**, which is then stored in the product's `image` field.

### Backend Flow

1. **Multer Middleware** intercepts the request.
2. **Validates** the file type (JPEG, PNG, WEBP, GIF) and size (max 5MB).
3. **Saves file** directly to `backend/public/images/` with a unique timestamped name.
4. **Controller** receives the saved file metadata via `req.file`.
5. **Returns image URL** (e.g., `/public/images/product_1707092400000_abc123.png`).
6. **URL is stored in database**.

### Display Flow

1. **Frontend fetches product** from API.
2. **Displays image** by requesting it from the relative path stored in the database.
3. **Backend serves image** using Express static file serving.

---

## File Structure

```
backend/
├── controller/
│   ├── imageController.js      (Updated - Handles req.file from Multer)
├── middleware/
│   ├── uploadMiddleware.js     (NEW - Multer configuration)
├── routes/
│   ├── imageRoutes.js          (Updated - Uses uploadMiddleware)
├── public/
│   └── images/                 (Stores uploaded images)
├── Server.js                   (Serves static files)

admin/src/
├── pages/
│   └── Products.jsx            (Updated - Sends File object via FormData)
└── services/
    └── apiClient.js            (Updated - Uses FormData for uploads)
```

---

## API Endpoints

### Upload Image

**POST** `/api/images/upload`

**Headers:**

```
Content-Type: multipart/form-data
Authorization: Bearer {authToken}
```

**Request Body (FormData):**

```
image: [File Object]
```

**Response:**

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "/public/images/product_1707092400000_abc123.png",
  "filename": "product_1707092400000_abc123.png"
}
```

---

## Frontend Usage

### Adding/Editing Product with Image

**File:** `admin/src/services/apiClient.js`

```javascript
export const imageService = {
  upload: (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return apiClient.post("/images/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
```

**File:** `admin/src/pages/Products.jsx`

```jsx
const handleImageChange = async (e) => {
  const file = e.target.files?.[0];
  const uploadData = await imageService.upload(file);
  // Returns: { success: true, imageUrl: "/public/images/..." }
};
```

---

## Backend Configuration

### Multer Middleware

**File:** `backend/middleware/uploadMiddleware.js`

- **Disk Storage**: Files saved to `public/images`.
- **Naming**: `product_{timestamp}_{random}.{ext}`.
- **Limits**: 5MB file size.
- **Filter**: Only allows `image/*` mimetypes.

---

## Security Features

1. ✅ **Multer Validation** - Rejects non-image files before they reach the controller.
2. ✅ **File Size Limit** - Hard 5MB limit enforced by Multer.
3. ✅ **Unique Filenames** - Prevents overwriting existing files.
4. ✅ **Authentication Required** - Only authorized admins can upload.

---

## Troubleshooting

### "No image file provided" Error

- Ensure the field name in `FormData` matches the one in `upload.single("image")`.

### "Unexpected field" Error

- Usually happens if the client sends a field name that Multer doesn't expect.

---

## Summary

✅ **System successfully migrated from Base64 to Multer!**

- Cleaner frontend logic (no more long Base64 strings).
- Better performance (binary transfer is more efficient).
- Robust backend validation via middleware.
- Easy scaling for larger files.
