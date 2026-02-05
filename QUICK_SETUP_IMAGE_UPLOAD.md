# Quick Setup Guide - Image Upload Feature

## Changes Made

### 1. Backend Files Created/Modified

#### NEW: `backend/controller/imageController.js`
- `uploadImage()` - Converts Base64 to file and saves it
- `deleteImage()` - Removes image from storage
- Validates file type (JPEG, PNG, WEBP, GIF)
- Validates file size (max 5MB)
- Generates unique filenames with timestamp

#### NEW: `backend/routes/imageRoutes.js`
- `POST /api/images/upload` - Upload image
- `DELETE /api/images/delete` - Delete image
- Requires authentication

#### UPDATED: `backend/Server.js`
- Added static file serving for `/public` folder
- Registered image routes
- Added necessary imports for file path handling

#### UPDATED: `backend/.gitignore`
- Added `public/images/` to ignore uploaded images

### 2. Frontend Files Modified

#### UPDATED: `admin/src/pages/Products.jsx`
- Added file input with drag-drop UI
- Added image preview
- Added `handleImageChange()` function for Base64 conversion
- Replaced Image URL field with file upload field
- Added loading state for upload

#### UPDATED: `admin/src/services/apiClient.js`
- Added `imageService` with upload and delete methods

---

## How to Use

### For Admins (Frontend)

1. **Go to Products page** in admin panel
2. **Click "Add New Product"**
3. **Click the image upload area** or drag image
4. **See preview** of selected image
5. **Image uploads automatically** to backend
6. **Fill other product details**
7. **Click "Create Product"** - image URL is stored

### What Happens Behind the Scenes

```
Admin selects image
    ↓
JavaScript converts to Base64
    ↓
Sends Base64 to: POST /api/images/upload
    ↓
Backend saves file to: backend/public/images/
    ↓
Returns URL: /public/images/product_1707092400000_abc123.png
    ↓
URL stored in MongoDB product.image field
    ↓
Image displays on frontend using that URL
```

---

## File Locations

### Uploaded Images
```
backend/public/images/
├── product_1707092400000_abc123.png
├── product_1707092500000_def456.jpg
└── product_1707092600000_ghi789.webp
```

### Code Files
```
backend/
├── controller/imageController.js       ← Image processing logic
├── routes/imageRoutes.js               ← Image API endpoints
└── Server.js                           ← Updated with image routes

admin/src/
├── pages/Products.jsx                  ← Updated product form
└── services/apiClient.js               ← Image service added
```

---

## Key Features

✅ **Base64 Encoding** - Convert file to Base64 before upload
✅ **File Validation** - Check type and size before saving
✅ **Unique Filenames** - Prevent conflicts with timestamp
✅ **Image Preview** - Show preview before uploading
✅ **Authentication** - Only admins can upload
✅ **Database Storage** - URL path stored in MongoDB
✅ **Static Serving** - Images served via Express

---

## Testing Checklist

- [ ] Backend running on localhost:5000
- [ ] Admin panel running on localhost:5173
- [ ] Logged into admin panel
- [ ] Go to Products page
- [ ] Click "Add New Product"
- [ ] Select an image file (PNG, JPG, WEBP)
- [ ] See image preview appear
- [ ] Image uploads (check backend logs)
- [ ] Fill product name, price, stock, category
- [ ] Click "Create Product"
- [ ] Product appears in list with image thumbnail
- [ ] Click product to edit - image preview shows
- [ ] Verify image displays correctly on products table

---

## Troubleshooting

### "Image upload failed"
- Check image file size (max 5MB)
- Verify file is actually an image
- Check backend logs for error details

### Images not displaying
- Verify `backend/public/images/` folder exists
- Check image file actually exists in folder
- Verify image URL path in MongoDB database
- Check browser console for 404 errors

### "No such file or directory"
- Run `mkdir -p backend/public/images` to create folder
- System should auto-create it, but manual creation works too

---

## Database Format

When you create a product with image, MongoDB stores:

```javascript
{
  name: "Burger",
  price: 250,
  category: "Food",
  stock: 50,
  image: "/public/images/product_1707092400000_abc123.png",  // ← Image URL path
  description: "Delicious burger"
}
```

**NOT** the Base64 string - just the URL path!

---

## Security Notes

🔒 **Protected** - Only authenticated admins can upload
🔒 **Validated** - File type and size checked
🔒 **Sanitized** - File paths validated to prevent attacks
🔒 **Not in Git** - Images folder ignored by .gitignore

---

## Production Considerations

For production deployment:

1. **Use Cloud Storage** (AWS S3, Google Cloud Storage)
2. **Enable Image Compression** before saving
3. **Set up CDN** for faster image delivery
4. **Use smaller file sizes** for thumbnails
5. **Regular cleanup** of old unused images
6. **Backup images** along with database

---

**Image Upload System is Live! 🚀**

You can now upload product images directly from the admin panel.
Images are stored locally in `backend/public/images/` folder.
