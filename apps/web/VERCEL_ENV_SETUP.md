# Vercel Environment Variables Setup

## Quick Setup (2 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project (askyacham87777 or similar)

### Step 2: Add Environment Variables
1. Go to: **Settings** → **Environment Variables**
2. Add these 2 variables:

**Variable 1:**
- **Name**: `SENDGRID_API_KEY`
- **Value**: [Use the SendGrid API key from our previous conversation]
- **Environment**: Select all (Production, Preview, Development)

**Variable 2:**
- **Name**: `FROM_EMAIL`
- **Value**: `info@askyacham.com`
- **Environment**: Select all (Production, Preview, Development)

### Step 3: Save and Redeploy
1. Click **Save** for each variable
2. Vercel will automatically redeploy your project
3. Wait 1-2 minutes for deployment to complete

### Step 4: Test
1. Go to your live site: https://askyacham.com
2. Try the "Forgot Password" feature
3. Check your email for the reset link!

## ✅ Success Indicators
- No more "SendGrid API key not configured" errors in console
- "Email sent successfully via SendGrid" messages
- Real emails delivered to your inbox

## 🔧 Alternative: Vercel CLI
If you have Vercel CLI installed:
```bash
vercel env add SENDGRID_API_KEY
# Enter your SendGrid API key when prompted

vercel env add FROM_EMAIL
# Enter: info@askyacham.com
```

That's it! Your email system will work perfectly after this setup. 🚀
