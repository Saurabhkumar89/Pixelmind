# PixelMind AI Studio - API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Sign Up
Create a new user account.

**Endpoint:** `POST /api/auth/signup`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe",
    "credits": 10,
    "plan": "free"
  }
}
```

**Status Codes:**
- `201` - Account created successfully
- `400` - Email already exists
- `500` - Server error

---

### 2. Sign In
Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe",
    "credits": 50,
    "plan": "starter",
    "subscriptionActive": true
  }
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `500` - Server error

---

### 3. Get Current User
Retrieve authenticated user information.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "fullName": "John Doe",
  "credits": 50,
  "plan": "starter",
  "subscriptionActive": true,
  "totalCreditsUsed": 15
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---

## AI Tools Endpoints

### 4. Generate Image
Create images from text descriptions.

**Endpoint:** `POST /api/tools/generate`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "A serene mountain landscape at sunset with golden light"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image generation started",
  "creditsCost": 2,
  "editId": "507f1f77bcf86cd799439011"
}
```

**Credits Required:** 2
**Status Codes:**
- `200` - Generation started (async)
- `402` - Insufficient credits
- `401` - Unauthorized
- `500` - Server error

---

### 5. Remove Background
Remove backgrounds from images.

**Endpoint:** `POST /api/tools/remove-bg`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Background removal started",
  "creditsCost": 1,
  "editId": "507f1f77bcf86cd799439011"
}
```

**Credits Required:** 1
**Status Codes:**
- `200` - Processing started (async)
- `402` - Insufficient credits
- `401` - Unauthorized
- `500` - Server error

---

### 6. Upscale Image
Increase image resolution.

**Endpoint:** `POST /api/tools/upscale`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "scale": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "Upscaling started",
  "creditsCost": 2,
  "editId": "507f1f77bcf86cd799439011"
}
```

**Credits Required:** 2
**Status Codes:**
- `200` - Processing started (async)
- `402` - Insufficient credits
- `401` - Unauthorized
- `500` - Server error

---

### 7. Expand Image
Add context around image using outpainting.

**Endpoint:** `POST /api/tools/expand`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "direction": "all"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image expansion started",
  "creditsCost": 3,
  "editId": "507f1f77bcf86cd799439011"
}
```

**Credits Required:** 3
**Status Codes:**
- `200` - Processing started (async)
- `402` - Insufficient credits
- `401` - Unauthorized
- `500` - Server error

---

### 8. Generative Fill
Remove and replace image areas.

**Endpoint:** `POST /api/tools/fill`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "maskUrl": "https://example.com/mask.jpg",
  "prompt": "Fill with blue sky"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Generative fill started",
  "creditsCost": 2,
  "editId": "507f1f77bcf86cd799439011"
}
```

**Credits Required:** 2
**Status Codes:**
- `200` - Processing started (async)
- `402` - Insufficient credits
- `401` - Unauthorized
- `500` - Server error

---

### 9. Replace Background
Replace image backgrounds with AI.

**Endpoint:** `POST /api/tools/background`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "backgroundPrompt": "Professional office setting"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Background replacement started",
  "creditsCost": 2,
  "editId": "507f1f77bcf86cd799439011"
}
```

**Credits Required:** 2
**Status Codes:**
- `200` - Processing started (async)
- `402` - Insufficient credits
- `401` - Unauthorized
- `500` - Server error

---

## Edit History Endpoints

### 10. Get Edit History
Retrieve user's edit history.

**Endpoint:** `GET /api/edit-history`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?limit=20&offset=0
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "tool": "generate",
    "prompt": "Mountain landscape",
    "outputImageUrl": "https://cloudinary.com/...",
    "creditsCost": 2,
    "status": "success",
    "createdAt": "2024-01-15T10:30:00Z",
    "completedAt": "2024-01-15T10:45:00Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### 11. Delete Edit
Delete a specific edit from history.

**Endpoint:** `DELETE /api/edit-history/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Edit deleted"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `401` - Unauthorized
- `404` - Edit not found
- `500` - Server error

---

## Payment Endpoints

### 12. Create Payment Order
Initialize Razorpay payment.

**Endpoint:** `POST /api/payment/create-order`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "planType": "pro"
}
```

**Response:**
```json
{
  "id": "order_DBJOWzybf0sJbb",
  "entity": "order",
  "amount": 49900,
  "amount_paid": 0,
  "amount_due": 49900,
  "currency": "INR",
  "receipt": "order_517f1f77bcf86cd799439011",
  "status": "created",
  "attempts": 0,
  "notes": {
    "planType": "pro",
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

**Status Codes:**
- `200` - Order created
- `400` - Invalid plan
- `401` - Unauthorized
- `500` - Server error

---

### 13. Verify Payment
Verify and process payment.

**Endpoint:** `POST /api/payment/verify`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "razorpayOrderId": "order_DBJOWzybf0sJbb",
  "razorpayPaymentId": "pay_DBJOWzybf0sJbb",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
  "planType": "pro"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "plan": "pro",
    "credits": 1000,
    "subscriptionActive": true
  }
}
```

**Status Codes:**
- `200` - Payment verified and processed
- `400` - Invalid signature
- `401` - Unauthorized
- `500` - Server error

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Error title",
  "message": "Detailed error message"
}
```

### Common Error Codes
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `402` - Payment Required (insufficient credits)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Rate Limiting
Currently no rate limiting implemented. Recommended limits:
- Auth endpoints: 5 requests/minute per IP
- Tool endpoints: 100 requests/hour per user
- Payment endpoints: 10 requests/minute per user

---

## Testing

### Example: Generate Image

```bash
# 1. Sign Up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234",
    "fullName": "Test User"
  }'

# Response contains token and user object

# 2. Generate Image (use token from signup)
curl -X POST http://localhost:5000/api/tools/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains"
  }'
```

---

## Webhook Support (Future)
Planned webhook events:
- `image.generated`
- `payment.completed`
- `subscription.renewed`
- `credits.depleted`

---

## Support
For API support, contact: api-support@pixelmindai.com
