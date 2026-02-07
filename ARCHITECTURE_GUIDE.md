# PixelMind AI Studio - Architecture Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PIXELMIND AI STUDIO PLATFORM                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐          ┌──────────────────────┐
│   FRONTEND LAYER    │          │   BACKEND LAYER      │
│   (Next.js)         │          │   (Express.js)       │
│   - Landing Page    │◄────────►│   - REST APIs        │
│   - Dashboard       │  HTTP    │   - Auth & JWT       │
│   - Tools           │  JSON    │   - Credit System    │
│   - Admin Panel     │          │   - Payments         │
└─────────────────────┘          └──────────────────────┘
        ▲                                  ▲
        │                                  │
        └──────────────────┬───────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    ┌────────────┐ ┌────────────┐ ┌────────────┐
    │ Cloudinary │ │  MongoDB   │ │ Replicate  │
    │  (Images)  │ │ (Database) │ │    (AI)    │
    └────────────┘ └────────────┘ └────────────┘
           ▼              ▼              ▼
    ┌────────────┐ ┌────────────┐ ┌────────────┐
    │    CDN     │ │  Backups   │ │ 100+ Models│
    │   Storage  │ │  Replica   │ │ Generation │
    │   Global   │ │  Recovery  │ │  Editing   │
    └────────────┘ └────────────┘ └────────────┘
           ▲
           │
    ┌─────────────────┐
    │  Razorpay       │
    │  (Payments)     │
    └─────────────────┘
```

---

## Frontend Architecture

### Page Structure
```
app/
├── page.tsx                      # Landing page
├── layout.tsx                    # Root layout with auth provider
│
├── auth/
│   ├── signup/page.tsx          # User registration
│   └── login/page.tsx           # User authentication
│
├── dashboard/
│   ├── page.tsx                 # Main dashboard with tools
│   ├── referral/page.tsx        # Referral system
│   └── settings/page.tsx        # User settings (planned)
│
├── tools/
│   ├── generate/page.tsx        # AI image generation
│   ├── remove-bg/page.tsx       # Background removal (planned)
│   ├── upscale/page.tsx         # Image upscaling (planned)
│   └── ...more tools
│
├── ai-*/ (SEO Pages)
│   ├── ai-image-generator/page.tsx
│   ├── ai-background-remover/page.tsx
│   └── ...more SEO pages
│
└── admin/
    ├── analytics/page.tsx       # Dashboard analytics
    ├── users/page.tsx           # User management
    ├── credits/page.tsx         # Credit management
    └── ...more admin pages
```

### Component Hierarchy
```
RootLayout
├── AuthProvider (Context)
└── Navbar
    ├── Logo
    ├── Navigation Links
    └── Auth Button
        
DashboardPage
├── NotificationCenter
├── Header with Navigation
├── Stats Cards (Credits, Plan, Usage)
└── Tool Grid
    └── ToolCard (Clickable)
        ├── Icon
        ├── Title & Description
        ├── Credit Cost Badge
        └── Access Control
```

### State Management Flow
```
AuthContext (Global)
├── user (User object)
├── isAuthenticated (boolean)
├── isLoading (boolean)
├── login (function)
├── logout (function)
└── updateCredits (function)
    │
    └─► Triggers UI updates across all components
```

### Component Reusability
```
Core Components
├── BeforeAfterSlider
│   └── Used in: SEO pages, tool workspaces
├── PromptTemplates
│   └── Used in: Generate tool, dashboard
├── NotificationCenter
│   └── Used in: Dashboard, all tool pages
├── CreationToolsSection
│   └── Used in: Landing page
├── EditingToolsSection
│   └── Used in: Landing page
├── EnhancementSection
│   └── Used in: Landing page
└── BatchProcessingSection
    └── Used in: Landing page
```

---

## Backend Architecture

### API Routes Structure
```
/api/
├── /auth
│   ├── POST /signup         # Create new user
│   ├── POST /login          # Authenticate user
│   └── POST /refresh        # Refresh JWT token
│
├── /tools
│   ├── POST /generate       # Text-to-image generation
│   ├── POST /remove-bg      # Background removal
│   ├── POST /upscale        # Image upscaling
│   ├── POST /expand         # Image expansion
│   ├── POST /fill           # Generative fill
│   └── POST /background     # Background replacement
│
├── /user
│   ├── GET  /profile        # Get user profile
│   ├── PUT  /profile        # Update profile
│   ├── GET  /history        # Get edit history
│   └── GET  /credits        # Get credit balance
│
├── /payment
│   ├── POST /create-order   # Create Razorpay order
│   ├── POST /verify         # Verify payment
│   └── GET  /plans          # Get subscription plans
│
└── /admin
    ├── GET  /analytics      # Dashboard metrics
    ├── GET  /users          # List users
    ├── POST /adjust-credits # Adjust user credits
    └── GET  /transactions   # Get transactions
```

### Middleware Pipeline
```
Request
  │
  ├─► bodyParser (parse JSON)
  │
  ├─► corsMiddleware (allow cross-origin)
  │
  ├─► authMiddleware (verify JWT)
  │   ├─► If no token → 401 Unauthorized
  │   └─► If valid → extract userId
  │
  ├─► creditCheckMiddleware (for tools)
  │   ├─► Calculate cost
  │   ├─► Check balance
  │   └─► If insufficient → block
  │
  ├─► rateLimitMiddleware
  │   ├─► Check request count
  │   └─► If exceeded → 429 Too Many Requests
  │
  └─► Route Handler
       ├─► Validate input
       ├─► Call external service (Replicate)
       ├─► Update database
       └─► Return response
```

### Database Schema
```
MongoDB Collections:

Users
├── _id (ObjectId)
├── email (String, unique)
├── password (String, hashed)
├── fullName (String)
├── credits (Number)
├── plan (String) [free/starter/pro/studio]
├── subscriptionActive (Boolean)
├── referralCode (String, unique)
├── referrals (Array of user IDs)
├── createdAt (Date)
└── lastLogin (Date)

EditHistory
├── _id (ObjectId)
├── userId (ObjectId, ref: User)
├── tool (String) [generate/remove-bg/upscale/etc]
├── inputImageUrl (String)
├── outputImageUrl (String)
├── prompt (String)
├── creditsCost (Number)
├── status (String) [success/failed/processing]
├── createdAt (Date)
└── completedAt (Date)

Transactions
├── _id (ObjectId)
├── userId (ObjectId, ref: User)
├── orderId (String, ref: Razorpay)
├── amount (Number)
├── currency (String)
├── status (String) [success/failed/pending]
├── plan (String)
├── creditsAdded (Number)
├── paymentMethod (String)
├── createdAt (Date)
└── expiresAt (Date)
```

### Authentication Flow
```
SIGNUP
  │
  ├─► Validate email format
  │
  ├─► Check email unique
  │
  ├─► Hash password (bcrypt)
  │
  ├─► Create user in DB
  │
  ├─► Generate JWT token
  │
  └─► Return token to client

LOGIN
  │
  ├─► Find user by email
  │
  ├─► Compare password (bcrypt)
  │
  ├─► Generate JWT token
  │
  └─► Return token to client

PROTECTED REQUEST
  │
  ├─► Extract token from header
  │
  ├─► Verify JWT signature
  │
  ├─► Check token expiration
  │
  ├─► Extract userId
  │
  └─► Allow access
```

### Credit System Flow
```
Tool Request
  │
  ├─► Get credit cost (predefined per tool)
  │
  ├─► Check user credits
  │
  ├─► If insufficient
  │   └─► Return 402 Payment Required
  │
  ├─► If sufficient
  │   ├─► Create transaction record
  │   ├─► Call Replicate API
  │   ├─► Wait for result
  │   ├─► Deduct credits (atomic transaction)
  │   ├─► Save to EditHistory
  │   └─► Return result
  │
  └─► Update UI with new balance
```

### Payment Flow
```
User Selects Plan
  │
  ├─► Create Razorpay order
  │   ├─► Amount
  │   ├─► Currency (INR)
  │   ├─► Description
  │   └─► Metadata (userId, planId)
  │
  ├─► Open Razorpay checkout
  │
  ├─► User completes payment
  │
  ├─► Razorpay callback
  │   ├─► Verify signature
  │   ├─► Check payment status
  │   └─► If success:
  │       ├─► Create transaction
  │       ├─► Update user plan
  │       ├─► Add credits
  │       └─► Send confirmation email
  │
  └─► Update dashboard
```

---

## External Services Integration

### Replicate AI
```
Function: Generate/Edit Images
Integration Points:
  ├─► replicateService.generateImage()
  │   └─► Uses: "stability-ai/stable-diffusion"
  │
  ├─► replicateService.removeBackground()
  │   └─► Uses: "remove-background" model
  │
  ├─► replicateService.upscaleImage()
  │   └─► Uses: "upscayl" or "Real-ESRGAN"
  │
  ├─► replicateService.expandImage()
  │   └─► Uses: "outpainting" model
  │
  ├─► replicateService.generativeFill()
  │   └─► Uses: "inpainting" model
  │
  └─► replicateService.replaceBackground()
      └─► Uses: custom workflow

API Key: REPLICATE_API_KEY (environment variable)
Response: Image URL (Cloudinary hosted)
```

### Cloudinary
```
Function: Store & Optimize Images
Integration Points:
  ├─► cloudinaryService.uploadImage()
  │   ├─► Input: Image file or URL
  │   ├─► Transformations: Auto format, quality
  │   └─► Output: Cloudinary URL
  │
  └─► cloudinaryService.generateSignedUrl()
      ├─► Input: Image ID, expiry time
      ├─► Secure access
      └─► Output: Signed URL

API Credentials:
  ├─► CLOUDINARY_NAME
  ├─► CLOUDINARY_API_KEY
  └─► CLOUDINARY_API_SECRET

Features:
  ├─► Auto format (WebP, AVIF)
  ├─► Responsive images (srcset)
  ├─► Global CDN
  └─► On-the-fly transformations
```

### Razorpay
```
Function: Payment Processing
Integration Points:
  ├─► razorpay.orders.create()
  │   └─► Create payment order
  │
  ├─► razorpay.payments.fetch()
  │   └─► Verify payment status
  │
  └─► Webhook handler
      ├─► Listen for payment.authorized
      └─► Update user subscription

API Credentials:
  ├─► RAZORPAY_KEY_ID
  └─► RAZORPAY_KEY_SECRET

Payment Methods:
  ├─► UPI
  ├─► Credit/Debit Cards
  ├─► Wallets
  └─► Net Banking
```

### MongoDB Atlas
```
Function: Data Storage & Management
Integration Points:
  ├─► User authentication
  ├─► Credit tracking
  ├─► Edit history
  ├─► Transaction logs
  └─► Admin data

Connection:
  ├─► MONGODB_URI (from .env)
  ├─► Mongoose for ODM
  └─► Connection pooling

Backup Strategy:
  ├─► Daily automated backups
  ├─► 30-day retention
  ├─► Restore capability
  └─► Replica set for redundancy
```

---

## Data Flow Diagrams

### Tool Processing Flow
```
User Input
    │
    ├─► Validate input
    │
    ├─► Check JWT token
    │
    ├─► Check credits
    │
    ├─► Create EditHistory record
    │
    ├─► Deduct credits
    │
    ├─► Call Replicate API
    │   │
    │   ├─► Replicate processes
    │   │
    │   └─► Returns image URL
    │
    ├─► Upload to Cloudinary
    │
    ├─► Update EditHistory
    │
    ├─► Return to client
    │
    └─► Update dashboard
```

### User Journey
```
Visitor
  │
  ├─► Lands on landing page
  │
  ├─► Clicks "Get Started"
  │
  ├─► Signup/Login
  │
  ├─► Dashboard with 10 free credits
  │
  ├─► Try a tool
  │   ├─► Credits deducted
  │   └─► EditHistory saved
  │
  ├─► View result
  │
  ├─► Download image
  │
  ├─► Out of credits
  │
  ├─► View pricing
  │
  ├─► Subscribe (Razorpay)
  │
  ├─► Credits added
  │
  ├─► Continue using tools
  │
  └─► Refer friends → earn credits
```

---

## Scaling Architecture

### Current Setup (MVP)
```
┌──────────────┐
│   Vercel     │  ← Frontend (auto-scales)
└──────┬───────┘
       │
       │ HTTP/JSON
       │
┌──────▼────────────┐
│  Railway/Render   │  ← Single server (can scale)
│  - Express.js     │
│  - Worker threads │
└──────┬────────────┘
       │
       ├─► MongoDB Atlas (auto-scales)
       ├─► Cloudinary (unlimited)
       └─► Replicate API (queued)
```

### Scalable Setup (Future)
```
┌─────────────────────┐
│  Vercel             │  ← CDN Global
│  Multiple regions   │
└────────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐        ┌───▼────┐
│ Railway │        │ Railway │  ← Multiple regions
│ EU      │        │ US      │
└───┬────┘        └───┬────┘
    │                 │
    └────────┬────────┘
             │
    ┌────────▼─────────┐
    │ MongoDB Replicas │  ← Sharded clusters
    │ - Write Primary  │
    │ - Read Replicas  │
    └──────────────────┘
```

### Performance Optimization
```
Frontend
├─► Code splitting
├─► Image lazy loading
├─► Caching strategy
└─► CDN optimization (Cloudinary)

Backend
├─► Database indexing
├─► Query optimization
├─► Redis caching
└─► Connection pooling

API
├─► Rate limiting
├─► Response compression
├─► Pagination
└─► Batch operations
```

---

## Security Architecture

### Authentication Layer
```
┌─────────────┐
│  Frontend   │
│  Login form │
└──────┬──────┘
       │ POST /auth/login
       │ email + password
       │
┌──────▼──────────────────┐
│  Backend               │
│  1. Find user by email │
│  2. Verify password    │
│  3. Check 2FA (opt)    │
│  4. Create JWT token   │
└──────┬──────────────────┘
       │ JWT token
       │
┌──────▼──────────────────┐
│  Frontend               │
│  Store in localStorage  │
│  Include in headers     │
└────────────────────────┘
```

### Authorization Layer
```
Every API Request
    │
    ├─► Extract JWT from header
    │
    ├─► Verify signature (secret key)
    │
    ├─► Check expiration
    │
    ├─► Extract userId
    │
    └─► Allow access
```

### Credit Verification
```
Tool Request
    │
    ├─► Identify tool cost
    │
    ├─► Query user credits
    │
    ├─► Compare: credits vs cost
    │
    ├─► If insufficient
    │   └─► Reject request
    │
    └─► If sufficient
        ├─► Reserve credits (lock)
        ├─► Execute operation
        └─► Confirm deduction
```

---

## Error Handling Strategy

### Error Types & Responses
```
400 Bad Request
├─► Invalid input format
├─► Missing required fields
└─► Validation errors

401 Unauthorized
├─► Missing token
├─► Invalid token
└─► Token expired

402 Payment Required
├─► Insufficient credits
└─► Subscription expired

429 Too Many Requests
├─► Rate limit exceeded
└─► Too many operations

500 Internal Server Error
├─► Database error
├─► Replicate API error
├─► Cloudinary error
└─► Unexpected error
```

### Error Recovery
```
Failed Tool Operation
    │
    ├─► Catch error
    │
    ├─► Log error details
    │
    ├─► Refund credits if deducted
    │
    ├─► Retry mechanism (3 attempts)
    │
    ├─► Notify user
    │
    └─► Escalate if critical
```

---

## Monitoring & Observability

### Key Metrics
```
Performance
├─► API response time
├─► Page load time
├─► Tool processing time
└─► Database query time

Business
├─► Active users (DAU/MAU)
├─► Conversions
├─► Churn rate
└─► LTV

Quality
├─► Error rate
├─► Success rate
├─► Uptime percentage
└─► Credit accuracy
```

### Logging Strategy
```
Application Logs
├─► Info: User actions
├─► Warn: Anomalies
├─► Error: Failures
└─► Debug: Development

Database Logs
├─► Queries (slow query log)
├─► Connections
└─► Replication status

Payment Logs
├─► Order creation
├─► Payment verification
└─► Subscription changes
```

---

## Deployment Architecture

### Continuous Integration
```
Code Changes (Git Push)
    │
    ├─► GitHub Actions trigger
    │
    ├─► Run tests
    │
    ├─► Check code quality
    │
    ├─► Build Docker image
    │
    └─► Push to registry
```

### Continuous Deployment
```
Docker Image Ready
    │
    ├─► Deploy to Railway/Render
    │
    ├─► Run database migrations
    │
    ├─► Health checks
    │
    ├─► Gradual rollout (if applicable)
    │
    └─► Monitor for errors
```

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Architecture Status**: ✅ Production Ready
