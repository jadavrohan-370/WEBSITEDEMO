# Orders Feature - Setup & Testing Checklist

## ✅ Backend Setup

- [ ] **Database**: Ensure MongoDB is running
  - Check `.env` has `MONGODB_URI=...` (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/foodie`)
  - Connection should show "MongoDB connected successfully" in console

- [ ] **Backend running**:

  ```bash
  npm run dev
  # or
  nodemon Server.js
  ```

  - Should output: `Server is running on port 5000` (or your PORT)

- [ ] **Test health check**:
  - Visit `http://localhost:5000/api/health` (or your backend URL)
  - Should return `{ status: "Server is running" }`

## ✅ Frontend Configuration

### Admin Panel (`admin/.env`)

```
# VITE_API_URL=http://localhost:5000/api
VITE_API_URL=https://food-website-26o6.onrender.com/api
```

- [ ] Verify the backend URL is set (currently using Render deployment)
- [ ] After changing `.env`, rebuild: `npm run build`
- [ ] Or run dev: `npm run dev`

### Public Frontend (`frontend/.env`)

```
# VITE_API_URL=http://localhost:5000/api
VITE_API_URL=https://food-website-26o6.onrender.com/api
```

- [ ] Same backend URL as admin
- [ ] After changing `.env`, rebuild: `npm run build`
- [ ] Or run dev: `npm run dev`

## ✅ End-to-End Test

### 1. Place Order (Public Site)

1. [ ] Go to public site → Product
2. [ ] Click "Order Now" on any item
3. [ ] Fill form:
   - Name: `Test User`
   - Phone: `1234567890`
   - Items: (auto-filled with product name)
   - Price: (auto-filled)
   - Address: `123 Test St`
   - Notes: (optional)
4. [ ] Click "Place Order" button
5. [ ] Should show: **"Order placed successfully!"**

### 2. View Order in Admin

1. [ ] Go to admin panel (`/admin` or deployed URL)
2. [ ] Log in (if not already logged in)
3. [ ] Navigate to **Orders** (left sidebar)
4. [ ] Click **Refresh** button
5. [ ] Should see your order in the table with:
   - Customer name
   - Items
   - Price
   - Phone
   - Address
   - Status dropdown (default: "pending")
   - Delete button

### 3. Manage Order Status

1. [ ] In Orders table, find your order
2. [ ] Click status dropdown
3. [ ] Change to: `preparing` → `completed` → `cancelled`
4. [ ] Status badge color should change accordingly
5. [ ] Delete button should remove the order

## 🔧 Troubleshooting

### Admin Orders page shows "No orders yet"

**Cause**: Wrong API URL or backend not reachable

**Fix**:

1. Open browser DevTools (F12) → Console
2. Check if there's an error about API endpoint
3. Verify `VITE_API_URL` in `admin/.env`:
   ```bash
   cat admin/.env
   ```
4. Test backend directly:
   ```bash
   curl https://food-website-26o6.onrender.com/api/health
   ```
   Should return `{"status":"Server is running"}`

### Error: "Database is not connected"

**Cause**: MongoDB not connected

**Fix**:

1. Check backend console for MongoDB error
2. Verify `MONGODB_URI` in backend `.env`
3. If using Atlas, check IP whitelist allows your backend IP

### Error: "Token is not valid" in Admin

**Cause**: Not logged in

**Fix**:

1. Go to Admin Login page
2. Log in with admin credentials
3. Should redirect to Dashboard
4. Then navigate to Orders

### Public site posts order but Admin doesn't show it

**Cause**: Frontends using different backend URLs

**Fix**:

1. Both `admin/.env` and `frontend/.env` must point to **same backend URL**
2. Currently should both be: `https://food-website-26o6.onrender.com/api`
3. Redeploy both frontends after updating `.env`

## 📊 API Endpoints

All protected admin endpoints require `Authorization: Bearer <token>` header

- `POST /api/orders` - Place order (public, no auth)
- `GET /api/orders` - List all orders (admin only)
- `GET /api/orders/:id` - Get single order (admin only)
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)

## 📝 Order Schema (Database)

```javascript
{
  name: String,          // Customer name
  phone: String,         // Phone number
  items: String,         // What was ordered
  price: Number,         // Order price
  address: String,       // Delivery address
  notes: String,         // Special instructions
  status: String,        // pending, preparing, completed, cancelled
  createdAt: Date,       // Order date/time
  updatedAt: Date        // Last update
}
```

## 🚀 Deployment Notes

When deploying:

1. Set backend URL in BOTH `.env` files before building
2. Deploy order routes are already created in backend
3. Admin Order page auto-fetches on load
4. Public AddOrder form auto-submits to backend
