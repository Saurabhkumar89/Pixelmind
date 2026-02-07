# Backend Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally, or MongoDB Atlas account
- npm or yarn package manager

## Installation

### 1. Install Dependencies

All dependencies are already listed in `package.json`. Install them:

```bash
npm install
```

Key packages for backend:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### 2. Setup Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with:

```env
# Backend
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pixelmind

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production

# Admin
ADMIN_EMAIL=admin@pixelmind.ai

# Payment
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Setup MongoDB

#### Option A: Local MongoDB

1. Install MongoDB Community Edition:
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Linux**: `sudo apt-get install mongodb`

2. Start MongoDB:
   ```bash
   mongod
   ```

3. MongoDB will be available at `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pixelmind
   ```

### 4. Start Backend Server

```bash
node server.js
```

You should see:
```
Server running on port 5000
```

The backend is now running and ready for requests!

---

## Development Workflow

### Terminal 1: Backend Server
```bash
node server.js
```

### Terminal 2: Frontend Dev Server
```bash
npm run dev
```

Frontend will be at `http://localhost:3000`
Backend API will be at `http://localhost:5000`

### Frontend Environment

Update `/vercel/share/v0-project/app/context/AuthContext.tsx` to point to backend:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

---

## Testing the API

### 1. Create Admin Account

In MongoDB, add an admin user:

```javascript
db.users.insertOne({
  email: "admin@pixelmind.ai",
  password: "$2a$10$...", // hashed password
  fullName: "Admin User",
  credits: 10000,
  plan: "studio",
  subscriptionActive: true,
  createdAt: new Date()
})
```

Or via API:
```bash
# Sign up as admin
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pixelmind.ai",
    "password": "admin123",
    "fullName": "Admin"
  }'
```

### 2. Test Authentication

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Tool Endpoints

```bash
# Generate image (requires token from login)
curl -X POST http://localhost:5000/api/tools/text-to-image \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A sunset",
    "style": "realistic",
    "size": "1024x1024"
  }'
```

### 4. Test Admin Endpoints

```bash
# Get stats (requires admin token)
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  fullName: String,
  credits: Number,
  plan: String ("free", "starter", "pro", "studio"),
  subscriptionActive: Boolean,
  createdAt: Date
}
```

### Edits Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  tool: String,
  status: String ("pending", "processing", "success", "failed"),
  creditsCost: Number,
  inputImageUrl: String,
  outputImageUrl: String,
  prompt: String,
  parameters: Object,
  createdAt: Date
}
```

---

## File Structure

```
/vercel/share/v0-project/
├── server.js              # Main Express server
├── .env.example           # Environment variables template
├── .env.local             # Environment variables (create this)
├── API_DOCUMENTATION.md   # API reference
├── BACKEND_SETUP.md       # This file
├── app/                   # Next.js frontend
├── components/            # React components
├── public/                # Static assets
└── package.json           # Dependencies
```

---

## API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### User
- `GET /api/user/profile` - Get profile
- `GET /api/user/history` - Get edit history

### Tools
- `POST /api/tools/text-to-image` - Generate image
- `POST /api/tools/background-remove` - Remove background
- `POST /api/tools/upscale` - Upscale image
- `POST /api/tools/expand` - Expand canvas
- `POST /api/tools/prompt-edit` - Edit with prompt
- `POST /api/tools/generative-fill` - Generate fill
- `GET /api/tools/result/:editId` - Poll result

### Admin
- `GET /api/admin/stats` - Platform stats
- `GET /api/admin/users` - List users
- `GET /api/admin/analytics` - Usage analytics
- `POST /api/admin/adjust-credits` - Adjust credits

### Payment
- `POST /api/payment/order` - Create order

See `API_DOCUMENTATION.md` for detailed endpoint specs.

---

## Next: AI Integration

### Connect to Fal AI

```bash
npm install fal-client
```

Then in `server.js`:

```javascript
const fal = require('fal-client');

// In text-to-image endpoint:
const result = await fal.subscribe('fal-ai/text-to-image', {
  input: {
    prompt: req.body.prompt,
  },
});

edit.outputImageUrl = result.images[0].url;
```

### Connect to Replicate

```bash
npm install replicate
```

Then in `server.js`:

```javascript
const Replicate = require('replicate');
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// In tool endpoint:
const output = await replicate.run(
  'model-user/model-name:version',
  { input: { ... } }
);
```

---

## Payment Integration (Razorpay)

Install Razorpay:

```bash
npm install razorpay
```

In `server.js`:

```javascript
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// In payment order endpoint:
const order = await razorpay.orders.create({
  amount: planData.amount,
  currency: 'INR',
  receipt: `order_${Date.now()}`,
});
```

---

## Production Deployment

### 1. Environment Setup

Set production environment variables on your hosting:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=very-long-random-secret-key
```

### 2. Deploy to Vercel (Full Stack)

Vercel supports Next.js + Node.js:

```bash
vercel deploy
```

### 3. Deploy to Heroku

```bash
heroku create pixelmind-api
heroku config:set JWT_SECRET=your_secret
heroku addons:create mongolab:sandbox
git push heroku main
```

### 4. Deploy to AWS

Use AWS Lambda + API Gateway + RDS/MongoDB Atlas

---

## Troubleshooting

### MongoDB Connection Error

**Error:** `Error: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`
- Verify MongoDB port (default: 27017)

### Token Expired

**Error:** `401 Invalid token`

**Solution:**
- Tokens expire in 30 days
- User must login again to get new token

### Admin Access Denied

**Error:** `403 Admin access required`

**Solution:**
- Ensure user email matches `ADMIN_EMAIL` in `.env.local`
- Create admin user with correct email

### CORS Issues

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
- CORS is already enabled in `server.js`
- Check `NEXT_PUBLIC_API_URL` matches backend URL

---

## Monitoring

### Logs

Add logging middleware:

```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

### Error Tracking

Use Sentry:

```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

---

## Performance Tips

1. **Enable caching:**
   ```javascript
   app.use(express.static('public', { maxAge: '1h' }));
   ```

2. **Add database indexing:**
   ```javascript
   userSchema.index({ email: 1 });
   ```

3. **Use connection pooling:**
   Already handled by Mongoose

4. **Add compression:**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

---

**Backend is now ready for development!**

Next steps:
1. Start MongoDB
2. Run backend: `node server.js`
3. Run frontend: `npm run dev`
4. Test endpoints via Postman or curl
5. Connect to AI providers (Fal/Replicate)
6. Integrate payment processing
