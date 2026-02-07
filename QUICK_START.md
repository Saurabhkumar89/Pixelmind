# PixelMind AI Studio - Quick Start Guide

Get PixelMind running in 5 minutes.

## Prerequisites
- Node.js 18+
- Git
- MongoDB Atlas account (free)
- Replicate account (free)
- Razorpay account (free)
- Cloudinary account (free)

## 1. Clone & Install (2 min)

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## 2. Get API Keys (3 min)

### MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Copy connection string

### Replicate
1. Go to [replicate.com](https://replicate.com)
2. Sign up and get API token from account settings

### Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up and copy Cloud Name, API Key, API Secret

### Razorpay
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up and copy Key ID and Key Secret

## 3. Configure Environment

### Frontend Config (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_test_key_id
```

### Backend Config (`backend/.env`)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pixelmind
JWT_SECRET=your-secret-key-at-least-32-characters-long
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
REPLICATE_API_TOKEN=your_token
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 4. Start Development Servers

### Terminal 1: Frontend
```bash
npm run dev
```
Runs on `http://localhost:3000`

### Terminal 2: Backend
```bash
cd backend
npm run dev
```
Runs on `http://localhost:5000`

## 5. Test Application

### Sign Up
1. Go to `http://localhost:3000`
2. Click "Get Started Free"
3. Create account with:
   - Email: test@example.com
   - Password: test1234
   - Name: Test User

### Generate Image
1. Click Dashboard
2. Find "AI Image Generation"
3. Enter prompt: "A beautiful sunset over mountains"
4. Click "Generate Image"
5. Watch credits decrease from 10 to 8

### View Dashboard
- See credit balance
- View current plan (Free)
- See all available tools
- Check usage stats

## Demo Account (Pre-populated)

If you initialize the database:

```bash
cd backend
node scripts/init-db.js
```

You get a demo account:
- Email: `demo@example.com`
- Password: `demo1234`
- Credits: 50
- Plan: Pro

## Common Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build

# Backend
npm run dev          # Start with nodemon
node server.js       # Start production
npm test             # Run tests (when added)
```

## API Testing

### Sign In
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

### Generate Image
```bash
curl -X POST http://localhost:5000/api/tools/generate \
  -H "Authorization: Bearer <token_from_login>" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A beautiful sunset"}'
```

## Troubleshooting

### MongoDB Connection Error
- Check connection string format
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for dev)
- Ensure database name is correct

### API Returns 500
- Check backend console for errors
- Verify all environment variables are set
- Test with curl command above

### Images Not Loading
- Check Cloudinary credentials
- Verify image URLs in response
- Check browser console for CORS errors

### Payment Not Working
- Use Razorpay test keys (not live)
- Check signature verification in logs
- Verify webhook URL if configured

## Next Steps

1. **Customize Branding**
   - Change colors in `/app/globals.css`
   - Update logo in `Navbar.tsx`
   - Edit copy on landing page

2. **Add More Tools**
   - Copy `/app/tools/generate/page.tsx`
   - Create `/app/tools/new-tool/page.tsx`
   - Add to tools grid in dashboard

3. **Create More SEO Pages**
   - Copy `/app/ai-image-generator/page.tsx`
   - Create `/app/ai-new-tool/page.tsx`
   - Update metadata and content

4. **Production Deployment**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Choose hosting platform
   - Configure production environment

## File Structure Quick Reference

```
/app           → Frontend pages and components
/backend       → Express server and API
/components    → Reusable React components
/public        → Static assets
README.md      → Full documentation
DEPLOYMENT.md  → Deployment instructions
API_DOCUMENTATION.md → API reference
```

## Support

- **Docs**: See README.md
- **API**: See API_DOCUMENTATION.md
- **Deploy**: See DEPLOYMENT.md
- **Code**: Check comments in source files

---

**You're all set!** Start building with PixelMind AI Studio. 🚀
