# PixelMind AI Studio

Professional AI-powered image editing and generation SaaS platform with credit-based system and Razorpay integration.

## Features

### AI Tools
- **Image Generation**: Text-to-image creation (2 credits)
- **Remove Background**: Automatic background removal (1 credit)
- **Upscale Image**: Up to 4x resolution enhancement (2 credits)
- **Expand Image**: Outpainting with AI context (3 credits)
- **Generative Fill**: Intelligent inpainting (2 credits)
- **Background Replacement**: AI-powered background swapping (2 credits)

### Platform Features
- Credit-based consumption system
- Subscription management with Razorpay
- User authentication with JWT
- Edit history tracking
- Responsive dashboard
- SEO-optimized tool pages
- Glassmorphism UI design

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components

### Backend
- Node.js + Express
- MongoDB (Atlas recommended)
- JWT Authentication
- Razorpay Integration
- Replicate AI API

### Services
- **AI Models**: Replicate
- **Image Storage**: Cloudinary
- **Payments**: Razorpay
- **Database**: MongoDB Atlas

## Project Structure

```
pixelmind/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Landing page)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── tools/
│   │   ├── generate/page.tsx
│   │   ├── remove-bg/page.tsx
│   │   └── ... (other tools)
│   ├── ai-image-generator/page.tsx (SEO page)
│   ├── context/
│   │   └── AuthContext.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── sections/
│   │   ├── FeaturesSection.tsx
│   │   └── PricingSection.tsx
│   └── ui/ (shadcn components)
├── backend/
│   ├── server.js
│   ├── services/
│   │   ├── replicateService.js
│   │   └── cloudinaryService.js
│   ├── package.json
│   └── .env.example
├── public/
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Replicate API account
- Cloudinary account
- Razorpay account

### Frontend Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables** (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

3. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Backend Setup

1. **Navigate to backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables** (`.env`)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pixelmind
JWT_SECRET=your-secret-key-min-32-chars
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
REPLICATE_API_TOKEN=your_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

4. **Start backend server**
```bash
npm run dev
# or
node server.js
```

Backend runs on `http://localhost:5000`

## Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String,
  profileImage: String,
  plan: String (enum: 'free' | 'starter' | 'pro' | 'studio'),
  credits: Number,
  totalCreditsUsed: Number,
  razorpayCustomerId: String,
  subscriptionId: String,
  subscriptionActive: Boolean,
  nextBillingDate: Date,
  editHistory: Array,
  createdAt: Date,
  lastCreditResetDate: Date
}
```

### Transaction Model
```javascript
{
  userId: ObjectId,
  type: String (enum: 'payment' | 'credits_used' | 'refund' | 'monthly_reset'),
  amount: Number,
  credits: Number,
  razorpayPaymentId: String,
  razorpayOrderId: String,
  status: String (enum: 'pending' | 'success' | 'failed'),
  description: String,
  createdAt: Date
}
```

### EditHistory Model
```javascript
{
  userId: ObjectId,
  tool: String,
  inputImageUrl: String,
  outputImageUrl: String,
  creditsCost: Number,
  prompt: String,
  settings: Mixed,
  replicateTaskId: String,
  status: String (enum: 'processing' | 'success' | 'failed'),
  createdAt: Date,
  completedAt: Date
}
```

## Credit System

### Credit Costs
- Image Generation: 2 credits
- Remove Background: 1 credit
- Upscale Image: 2 credits
- Expand Image: 3 credits
- Generative Fill: 2 credits
- AI Background: 2 credits

### Plans
| Plan | Price | Credits | 
|------|-------|---------|
| Free | ₹0 | 10/month |
| Starter | ₹199 | 300/month |
| Pro | ₹499 | 1000/month |
| Studio | ₹999 | Unlimited |

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### AI Tools
- `POST /api/tools/generate` - Generate image
- `POST /api/tools/remove-bg` - Remove background
- `POST /api/tools/upscale` - Upscale image
- `POST /api/tools/expand` - Expand image
- `POST /api/tools/fill` - Generative fill
- `POST /api/tools/background` - Replace background

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### History
- `GET /api/edit-history` - Get user's edits
- `DELETE /api/edit-history/:id` - Delete edit

## Authentication Flow

1. User signs up/logs in
2. Backend generates JWT token
3. Token stored in localStorage
4. All API requests include `Authorization: Bearer <token>` header
5. AuthContext manages auth state globally

## Middleware

### Credit Check Middleware
Validates user has sufficient credits before processing:
```javascript
creditCheckMiddleware(requiredCredits)
```

### Auth Middleware
Validates JWT token and extracts userId:
```javascript
authMiddleware
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy from `main` branch

### Backend (Options)
- **Heroku**: Add Procfile and deploy
- **Railway**: Connect MongoDB and deploy
- **Render**: Deploy Node.js app
- **AWS**: Lambda + API Gateway
- **DigitalOcean**: Deploy on App Platform

## SEO Pages

Each AI tool has an SEO-optimized landing page:
- `/ai-image-generator` - Image generation
- `/ai-background-remover` - Background removal
- `/ai-upscaler` - Image upscaling
- `/ai-image-expander` - Image expansion
- `/ai-generative-fill` - Inpainting tool
- `/ai-background-replacer` - Background replacement

Each page includes:
- SEO metadata
- Live demo upload box
- Before/after gallery
- How-it-works section
- Feature list
- FAQ
- CTA buttons

## Security Considerations

✓ JWT-based authentication
✓ Password hashing with bcrypt
✓ CORS enabled for frontend URL only
✓ Environment variables for secrets
✓ Row-level operations with userId validation
✓ Credit validation before operations
✓ Razorpay signature verification

## Error Handling

All endpoints return structured errors:
```javascript
{
  error: "Error message",
  message: "Detailed error description"
}
```

## Performance Optimizations

- Image caching via Cloudinary CDN
- Lazy loading for dashboard components
- Async image processing
- Database indexing on userId
- JWT token-based stateless auth
- Responsive design for all devices

## Future Enhancements

- Real-time processing status
- Image batch operations
- Team/organization support
- API rate limiting
- Advanced analytics dashboard
- Webhooks for integrations
- Mobile app (React Native)
- Social sharing features

## Support & Feedback

For issues or feature requests, create a GitHub issue or contact support@pixelmindai.com

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ using PixelMind AI Studio**
