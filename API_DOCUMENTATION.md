# PixelMind AI Studio - API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### POST `/api/auth/signup`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe",
    "credits": 10,
    "plan": "free",
    "subscriptionActive": false
  }
}
```

**Errors:**
- `400` - Email already exists
- `500` - Signup failed

---

### POST `/api/auth/login`
Authenticate and get a JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe",
    "credits": 10,
    "plan": "free",
    "subscriptionActive": false
  }
}
```

**Errors:**
- `401` - Invalid email or password
- `500` - Login failed

---

## User Endpoints

### GET `/api/user/profile`
Get current user's profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "fullName": "John Doe",
  "credits": 8,
  "plan": "free",
  "subscriptionActive": false,
  "createdAt": "2024-01-25T10:30:00Z"
}
```

---

### GET `/api/user/history`
Get user's edit history (last 10).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "tool": "text-to-image",
    "status": "success",
    "creditsCost": 2,
    "inputImageUrl": null,
    "outputImageUrl": "https://...",
    "prompt": "A beautiful sunset",
    "createdAt": "2024-01-25T10:35:00Z"
  }
]
```

---

## AI Tool Endpoints

All tool endpoints require authentication and sufficient credits. Credits are deducted upon request.

### POST `/api/tools/text-to-image`
Generate an image from text prompt.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "prompt": "A beautiful sunset over mountains",
  "style": "realistic",
  "size": "1024x1024"
}
```

**Response (200):**
```json
{
  "editId": "507f1f77bcf86cd799439013",
  "status": "processing"
}
```

**Credits:** 2
**Errors:**
- `401` - Not authenticated
- `402` - Insufficient credits
- `500` - Generation failed

---

### POST `/api/tools/background-remove`
Remove background from an image.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response (200):**
```json
{
  "editId": "507f1f77bcf86cd799439014",
  "status": "processing"
}
```

**Credits:** 1

---

### POST `/api/tools/upscale`
Increase image resolution.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "scale": 4
}
```

**Response (200):**
```json
{
  "editId": "507f1f77bcf86cd799439015",
  "status": "processing"
}
```

**Credits:** 2
**Scale Options:** 2, 4

---

### POST `/api/tools/expand`
Expand canvas with AI-generated content.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "direction": "all"
}
```

**Response (200):**
```json
{
  "editId": "507f1f77bcf86cd799439016",
  "status": "processing"
}
```

**Credits:** 3
**Direction Options:** "all", "horizontal", "vertical"

---

### POST `/api/tools/prompt-edit`
Edit image based on text prompt.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "prompt": "Change the sky to blue"
}
```

**Response (200):**
```json
{
  "editId": "507f1f77bcf86cd799439017",
  "status": "processing"
}
```

**Credits:** 2

---

### POST `/api/tools/generative-fill`
Fill areas in an image with generated content.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "prompt": "Fill with trees"
}
```

**Response (200):**
```json
{
  "editId": "507f1f77bcf86cd799439018",
  "status": "processing"
}
```

**Credits:** 2

---

### GET `/api/tools/result/{editId}`
Poll for tool result.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "tool": "text-to-image",
  "status": "success",
  "creditsCost": 2,
  "inputImageUrl": null,
  "outputImageUrl": "https://storage.example.com/result.jpg",
  "prompt": "A beautiful sunset over mountains",
  "createdAt": "2024-01-25T10:35:00Z"
}
```

**Status Values:** "pending", "processing", "success", "failed"

---

## Admin Endpoints

All admin endpoints require admin authentication (admin email in token).

### GET `/api/admin/stats`
Get platform statistics.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "totalUsers": 150,
  "totalCreditsUsed": 25000,
  "totalRevenue": 250
}
```

**Errors:**
- `403` - Admin access required
- `500` - Failed to fetch stats

---

### GET `/api/admin/users`
Get list of all users.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe",
    "credits": 8,
    "plan": "free",
    "subscriptionActive": false,
    "createdAt": "2024-01-25T10:30:00Z"
  }
]
```

**Limit:** 100 users per request

---

### GET `/api/admin/analytics`
Get tool usage analytics.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "toolUsage": [
    {
      "_id": "text-to-image",
      "count": 450,
      "revenue": 900
    },
    {
      "_id": "background-remove",
      "count": 320,
      "revenue": 320
    }
  ]
}
```

---

### POST `/api/admin/adjust-credits`
Manually adjust user credits (add or subtract).

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "credits": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "credits": 58,
    "plan": "free"
  }
}
```

**Notes:**
- Use negative numbers to subtract credits
- No limit on adjustment amount

---

## Payment Endpoints

### POST `/api/payment/order`
Create a payment order.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "plan": "starter"
}
```

**Response (200):**
```json
{
  "success": true,
  "orderId": "order_1704960600000",
  "amount": 19900,
  "credits": 300
}
```

**Plan Options:**
- `starter`: ₹199 (300 credits)
- `pro`: ₹499 (1000 credits)

**Notes:**
- Amount is in paise (₹1 = 100 paise)
- Integrate with Razorpay for payment processing

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `402` - Payment required (insufficient credits)
- `403` - Forbidden (admin only)
- `404` - Not found
- `500` - Internal server error

---

## Rate Limiting

Currently not implemented. Add rate limiting middleware in production:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

---

## Testing

### Curl Examples

**Sign Up:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Generate Image:**
```bash
curl -X POST http://localhost:5000/api/tools/text-to-image \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset",
    "style": "realistic",
    "size": "1024x1024"
  }'
```

**Check Result:**
```bash
curl -X GET http://localhost:5000/api/tools/result/{editId} \
  -H "Authorization: Bearer {token}"
```

---

## Backend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file (copy from `.env.example`)

3. Start MongoDB:
   ```bash
   mongod
   ```

4. Start backend server:
   ```bash
   node server.js
   ```

5. Start frontend (in another terminal):
   ```bash
   npm run dev
   ```

Backend will be available at `http://localhost:5000`
Frontend will be available at `http://localhost:3000`

---

**Last Updated:** January 25, 2024
**Version:** 1.0.0
