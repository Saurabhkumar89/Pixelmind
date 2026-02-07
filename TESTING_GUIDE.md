# PixelMind AI Studio - Testing Guide

## Quick Start

### 1. View the Landing Page
- Go to `/` (homepage)
- See feature highlights, pricing overview, and CTA buttons
- Click "Get Started" or "Go to Dashboard"

### 2. Authentication Flow

#### Sign Up
- Navigate to `/auth/signup`
- Fill in Full Name, Email, and Password
- Click "Create Account"
- Redirects to `/dashboard` after success

#### Login
- Navigate to `/auth/login`
- Enter email and password
- Click "Sign In"
- Redirects to `/dashboard` on success
- Demo credentials shown on page

### 3. User Dashboard
- Navigate to `/dashboard` (requires login)
- View your current credits (starts with 10 free credits)
- See all 6 available AI tools
- Click any tool to access it

### 4. AI Tools - Step-by-Step Testing

#### Text-to-Image Generator (`/ai/text-to-image`)
1. Login first (if not already logged in)
2. Enter a prompt (e.g., "A beautiful sunset over mountains")
3. Select style (Realistic, Cinematic, Anime, etc.)
4. Choose size (256x256, 512x512, 768x768, 1024x1024)
5. Click "Generate Image"
6. Wait for processing (mock delay)
7. See result image and download button
8. Credits decrease by 2

#### Remove Background (`/ai/background-remove`)
1. Click tool from dashboard
2. Upload an image by clicking or dragging
3. See preview of uploaded image
4. Click "Remove Background"
5. Result appears in right panel
6. Download processed image
7. Credits decrease by 1

#### Upscale Image (`/ai/upscale`)
1. Upload image
2. Choose upscale factor (2x or 4x)
3. Click "Upscale Image"
4. View and download result
5. Credits decrease by 2

#### Expand Canvas (`/ai/expand`)
1. Upload image
2. Choose direction (All, Horizontal, Vertical)
3. Click "Expand"
4. Download expanded image
5. Credits decrease by 3

#### Prompt Edit (`/ai/prompt-edit`)
1. Upload image
2. Enter edit prompt (e.g., "Change sky to blue")
3. Click "Apply Edit"
4. View result
5. Credits decrease by 2

#### Generative Fill (`/ai/generative-fill`)
1. Upload image
2. Describe what to fill
3. Click "Generate Fill"
4. Download result
5. Credits decrease by 2

### 5. Pricing Page
- Navigate to `/pricing`
- View all 3 plans (Free, Starter, Pro)
- See monthly credit allocation
- See feature comparison
- Click upgrade buttons (mock implementation)

### 6. Admin Dashboard

#### Access Admin Pages
- Admin pages start at `/admin/dashboard`
- **Note**: Requires proper authentication token

#### Admin Dashboard (`/admin/dashboard`)
- View total users, credits used, revenue
- See 3 quick links to management pages

#### User Management (`/admin/users`)
- Search users by email or name
- See user list with:
  - Email
  - Full name
  - Current plan
  - Available credits
  - Join date
- Click "Edit" button (placeholder for individual management)

#### Analytics (`/admin/analytics`)
- See usage breakdown by tool
- View monthly growth trends
- Visualized with progress bars

#### Credit Management (`/admin/credits`)
- Enter user ID
- Enter credit amount to add/subtract
- Negative numbers subtract credits
- See success/error messages

### 7. Credit System Testing

#### Check Credit Balance
- View on dashboard: Shows current credits
- Displayed in glass card at top of dashboard

#### Tool Access Control
- If credits < required: Button shows "Insufficient Credits"
- If credits ≥ required: Button shows "Use Tool"
- After using tool: Credits automatically decrease

#### Low Credit Warning
- When credits < 5: Dashboard shows CTA to upgrade
- Link goes to pricing page

### 8. Navigation Testing

#### Navbar Links
- Logo links to home
- Dashboard link (if logged in)
- Login/Signup links (if not logged in)
- Logout button (if logged in)

#### Breadcrumbs & Back Navigation
- Each tool links back to dashboard
- "Go to Dashboard" button on home page
- Login/Signup links cross-reference each other

### 9. Error Handling

#### Try These Scenarios
1. **Low credits**: Try tool when credits are too low
   - Expected: Error message + required credits shown
   
2. **No image upload**: Click tool button without uploading
   - Expected: "Please upload an image" error
   
3. **No prompt**: Click generate without prompt text
   - Expected: "Please enter a prompt" error
   
4. **Form validation**: Try submitting incomplete forms
   - Expected: Required field warnings

### 10. Responsive Design Testing

#### Mobile View (< 640px)
- Single column layout
- Full-width buttons
- Stacked forms
- Touch-friendly spacing

#### Tablet View (640px - 1024px)
- 2-column layouts where appropriate
- Responsive grids

#### Desktop View (> 1024px)
- 3-column grids
- Side-by-side input/output panels
- Full features visible

## Mock Data Flow

### What's Working (Frontend)
✅ All form inputs and validation
✅ Image uploads and previews
✅ Navigation between pages
✅ Authentication UI flow
✅ Dashboard displays
✅ Credit display and validation
✅ Tool availability checks
✅ Error message displays
✅ Loading states
✅ Responsive layouts

### What Needs Backend
🔄 Actual authentication (returns real tokens)
🔄 Real API endpoints for tools
🔄 Database storage of users/credits
🔄 Image processing results
🔄 Payment processing
🔄 Admin data retrieval

## Testing Checklist

- [ ] Can navigate all pages without errors
- [ ] Auth pages load and accept input
- [ ] Dashboard shows correct credit count
- [ ] All 6 tools are accessible
- [ ] Tool pages accept image uploads
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Navbar navigation works
- [ ] Responsive design works on mobile
- [ ] Admin pages load
- [ ] Pricing page displays all plans
- [ ] Links work between pages

## Known Limitations (Frontend Only)

- API calls return mock responses
- No actual image processing
- No real user database
- No payment processing
- Admin auth not enforced in UI
- Image download links are placeholders
- Result polling cycles indefinitely without real backend

## Environment Setup

Before testing, ensure:
1. Node.js 18+ installed
2. Project dependencies installed: `npm install`
3. Environment variables set in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
4. Development server running: `npm run dev`
5. Visit http://localhost:3000

## Browser Compatibility

Tested and working on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Issues & Solutions

### Issue: Image won't upload
- Solution: Check file is valid image format (jpg, png, etc.)
- Solution: Ensure file size is reasonable

### Issue: Navigation not working
- Solution: Check browser JavaScript is enabled
- Solution: Verify you're on correct page paths

### Issue: Credits not decreasing
- Solution: This is normal - backend integration needed
- Solution: Check console for API call details

### Issue: Forms not submitting
- Solution: Check all required fields are filled
- Solution: Verify no validation errors showing
- Solution: Check browser console for errors

---

**Happy Testing!** 🚀
