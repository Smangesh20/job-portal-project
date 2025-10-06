# 🚀 Complete Vercel Environment Variables Setup

## Your Domain: www.askyacham.com

### Required Environment Variables for Vercel:

```
GOOGLE_CLIENT_ID=656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=https://www.askyacham.com
NEXTAUTH_SECRET=your_random_secret_key_here
NODE_ENV=production
```

### Step-by-Step Instructions:

1. **Go to your Vercel dashboard**
2. **Click on your project** (askyacham)
3. **Go to Settings tab**
4. **Click on Environment Variables**
5. **Add each variable one by one:**

#### Variable 1:
- **Name:** `GOOGLE_CLIENT_ID`
- **Value:** `656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com`
- **Environment:** Production, Preview, Development (select all)

#### Variable 2:
- **Name:** `GOOGLE_CLIENT_SECRET`
- **Value:** `your_google_client_secret_here` (replace with your actual secret)
- **Environment:** Production, Preview, Development (select all)

#### Variable 3:
- **Name:** `NEXTAUTH_URL`
- **Value:** `https://www.askyacham.com`
- **Environment:** Production, Preview, Development (select all)

#### Variable 4:
- **Name:** `NEXTAUTH_SECRET`
- **Value:** `your_random_secret_key_here` (generate a random string)
- **Environment:** Production, Preview, Development (select all)

#### Variable 5:
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production, Preview, Development (select all)

### After Adding Variables:

1. **Click Save** for each variable
2. **Go to Deployments tab**
3. **Click on the latest deployment**
4. **Click Redeploy**
5. **Wait for deployment to complete**

### Important Notes:

- Replace `your_google_client_secret_here` with your actual Google OAuth secret
- Replace `your_random_secret_key_here` with a random string (32+ characters)
- Make sure all variables are set for all environments
- After adding variables, you MUST redeploy for changes to take effect

### Google OAuth Setup:

Make sure your Google Cloud Console has these redirect URIs:
- `https://www.askyacham.com/api/auth/google/signup/callback`
- `https://www.askyacham.com/api/auth/google/signin/callback`

### That's it! Your Google-like job portal will be live on www.askyacham.com
