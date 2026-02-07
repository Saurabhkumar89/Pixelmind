# PixelMind AI Studio - Deployment Guide

Complete guide to deploy PixelMind AI Studio to production.

## Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [External Services Configuration](#external-services-configuration)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Backend Deployment

### Option 1: Deploy to Railway.app (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "GitHub Repo"
   - Connect your PixelMind repository

3. **Configure Variables**
   - Go to project settings
   - Add environment variables:
     ```
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=<your-secret-key-32-chars>
     RAZORPAY_KEY_ID=<your-key>
     RAZORPAY_KEY_SECRET=<your-secret>
     REPLICATE_API_TOKEN=<your-token>
     CLOUDINARY_CLOUD_NAME=<name>
     CLOUDINARY_API_KEY=<key>
     CLOUDINARY_API_SECRET=<secret>
     NODE_ENV=production
     PORT=5000
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

4. **Deploy Backend Folder**
   - In Railway, set root directory to `backend`
   - Set start command: `npm install && npm start`

5. **Get Production URL**
   - Railway assigns a public URL
   - Update frontend `NEXT_PUBLIC_API_URL` to this URL

---

### Option 2: Deploy to Render.com

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Service**
   - Click "New +" → "Web Service"
   - Select GitHub repo

3. **Configure**
   - **Name**: pixelmind-backend
   - **Region**: Choose closest to users
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `./` (leave empty)

4. **Add Environment Variables**
   - Copy all from `.env.example`
   - Paste in Render dashboard

5. **Deploy**
   - Click "Create Web Service"
   - Render deploys automatically

---

### Option 3: Deploy to Heroku (Legacy)

1. **Create Heroku App**
   ```bash
   heroku create pixelmind-backend
   ```

2. **Add Procfile** in `backend/Procfile`
   ```
   web: npm start
   ```

3. **Set Config Variables**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set JWT_SECRET=your-secret-key
   # ... set all variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

---

### Option 4: Deploy to AWS Lambda + API Gateway

1. **Create Lambda Function**
   - Runtime: Node.js 18
   - Upload code as ZIP

2. **Install Serverless Framework**
   ```bash
   npm install -g serverless
   ```

3. **Deploy with Serverless**
   ```bash
   serverless deploy
   ```

4. **Configure API Gateway**
   - Enable CORS
   - Set timeout: 30 seconds

---

## Frontend Deployment

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select GitHub repository

2. **Configure Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically

5. **Custom Domain**
   - Go to project settings
   - Add custom domain
   - Update DNS records

---

### Deploy to Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select GitHub repo

2. **Configure Build**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

3. **Environment Variables**
   - Add in site settings → Build & deploy → Environment

4. **Deploy**
   - Netlify builds automatically

---

## Database Setup

### MongoDB Atlas Setup (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up

2. **Create Cluster**
   - Click "Create" → "Build a cluster"
   - Choose **M0** (free tier) for development
   - Select **AWS**, choose region

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Save connection string format

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For production: Add specific IPs
   - For testing: Add 0.0.0.0/0 (not recommended for prod)

5. **Get Connection String**
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>` and `<password>`

6. **Create Database**
   - In MongoDB Atlas, create database: `pixelmind`
   - Create collections:
     ```
     - users
     - transactions
     - edithistories
     ```

7. **Initialize Database**
   ```bash
   cd backend
   node scripts/init-db.js
   ```

---

## External Services Configuration

### Replicate.ai Setup

1. **Create Account**
   - Go to [replicate.com](https://replicate.com)
   - Sign up

2. **Get API Token**
   - Go to Account → API Tokens
   - Copy your API token

3. **Add to Environment**
   ```
   REPLICATE_API_TOKEN=<your-token>
   ```

---

### Cloudinary Setup

1. **Create Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up

2. **Get Credentials**
   - Dashboard shows:
     - Cloud Name
     - API Key
     - API Secret

3. **Configure Environment**
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

### Razorpay Setup

1. **Create Account**
   - Go to [razorpay.com](https://razorpay.com)
   - Sign up with business info

2. **Get API Keys**
   - Settings → API Keys
   - Copy Key ID and Key Secret

3. **Add to Environment**
   ```
   RAZORPAY_KEY_ID=<key-id>
   RAZORPAY_KEY_SECRET=<key-secret>
   ```

4. **Test Integration**
   - Use test keys first
   - Test payment flow
   - Switch to live keys when ready

---

## SSL/HTTPS Configuration

### Automatic (Recommended)
- **Vercel**: Automatic SSL
- **Railway**: Automatic SSL
- **Netlify**: Automatic SSL

### Manual
- Use **Let's Encrypt** for free SSL
- Generate certificates and upload to server

---

## Environment Variables Checklist

### Backend (.env)
```
✓ MONGODB_URI
✓ JWT_SECRET (min 32 characters)
✓ RAZORPAY_KEY_ID
✓ RAZORPAY_KEY_SECRET
✓ REPLICATE_API_TOKEN
✓ CLOUDINARY_CLOUD_NAME
✓ CLOUDINARY_API_KEY
✓ CLOUDINARY_API_SECRET
✓ NODE_ENV=production
✓ PORT=5000
✓ FRONTEND_URL (production URL)
```

### Frontend (.env.production)
```
✓ NEXT_PUBLIC_API_URL (backend URL)
✓ NEXT_PUBLIC_RAZORPAY_KEY_ID
```

---

## Post-Deployment Checklist

### Testing
- [ ] Test user signup/login
- [ ] Test image generation tool
- [ ] Test background removal
- [ ] Test payment flow (test mode)
- [ ] Verify credits deduction
- [ ] Check edit history
- [ ] Test all API endpoints

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics
- [ ] Monitor database performance
- [ ] Check API response times

### Security
- [ ] Update JWT_SECRET
- [ ] Enable HTTPS everywhere
- [ ] Set CORS properly
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] Password requirements

### Performance
- [ ] Enable CDN (Cloudinary)
- [ ] Optimize images
- [ ] Database indexing
- [ ] Cache strategy

### Backup & Recovery
- [ ] MongoDB automated backups enabled
- [ ] Database backup frequency: Daily
- [ ] Backup retention: 30 days
- [ ] Test restore procedure

---

## Monitoring & Logging

### Sentry Setup (Error Tracking)

1. **Create Sentry Account**
   - Go to [sentry.io](https://sentry.io)
   - Create project for Node.js

2. **Install Sentry**
   ```bash
   npm install @sentry/node
   ```

3. **Add to Backend**
   ```javascript
   const Sentry = require("@sentry/node");
   
   Sentry.init({
     dsn: "https://key@sentry.io/project",
     environment: "production"
   });
   
   app.use(Sentry.Handlers.errorHandler());
   ```

---

## Database Scaling

### As Users Grow

1. **Add Indexes**
   ```javascript
   db.users.createIndex({ email: 1 })
   db.transactions.createIndex({ userId: 1, createdAt: -1 })
   db.edithistories.createIndex({ userId: 1 })
   ```

2. **Upgrade MongoDB Tier**
   - MongoDB Atlas → Cluster Settings
   - Upgrade from M0 → M10/M20

3. **Enable Sharding** (for millions of records)
   - MongoDB Atlas → Sharding configuration

---

## CI/CD Pipeline

### GitHub Actions (Automatic Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          # Deploy to Railway/Render
          
      - name: Deploy Frontend
        run: |
          # Deploy to Vercel
```

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Test with MongoDB Compass

**API Returns 500**
- Check backend logs
- Verify environment variables
- Check Replicate/Cloudinary API status

**Payment Not Working**
- Verify Razorpay credentials
- Check test vs live mode
- Verify signature verification

### Frontend Issues

**API Calls Failing**
- Check NEXT_PUBLIC_API_URL
- Verify CORS settings on backend
- Check browser console for errors

**Images Not Loading**
- Verify Cloudinary configuration
- Check image URLs
- Test with curl

---

## Performance Optimization

1. **Enable Caching**
   - Browser cache: 1 year
   - CDN cache: 1 day
   - API cache: 5 minutes

2. **Compression**
   - Enable gzip compression
   - Optimize images with Cloudinary

3. **Database Queries**
   - Add indexes
   - Limit query results
   - Use pagination

---

## Support & Maintenance

- **Uptime Monitoring**: Use UptimeRobot
- **Daily Backups**: Automated
- **Weekly Logs Review**: Check for errors
- **Monthly Performance**: Review and optimize

---

## Rollback Plan

If deployment fails:

1. **Immediate Action**
   - Rollback to previous version
   - Check error logs

2. **Verify**
   - All systems operational
   - Database integrity
   - Users can access

3. **Investigation**
   - Find root cause
   - Fix in staging
   - Redeploy with testing

---

## Next Steps

1. Deploy backend to production
2. Deploy frontend to production
3. Run full test suite
4. Monitor for 24-48 hours
5. Announce public availability

Good luck! 🚀
