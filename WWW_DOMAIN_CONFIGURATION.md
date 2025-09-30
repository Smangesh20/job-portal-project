# 🌐 WWW Domain Configuration Guide

## ✅ YOUR PRIMARY DOMAIN: `www.askyacham.com`

Since your primary domain uses `www.`, you need to configure everything to use `www.askyacham.com` instead of `askyacham.com`.

---

## 🔧 WHAT YOU NEED TO UPDATE:

### 1️⃣ **Environment Variables (.env.local)**

Update your `.env.local` file with:

```bash
# App URL - MUST include www.
NEXT_PUBLIC_APP_URL=https://www.askyacham.com
NEXTAUTH_URL=https://www.askyacham.com

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://www.askyacham.com/api/auth/google/callback

# Email Configuration
FROM_EMAIL=info@askyacham.com
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

---

### 2️⃣ **Google Cloud Console Configuration**

Go to: https://console.cloud.google.com/apis/credentials

#### **Authorized JavaScript Origins:**
Add these URLs:
- `https://www.askyacham.com`
- `http://localhost:3000` (for local testing)

#### **Authorized Redirect URIs:**
Add these URLs:
- `https://www.askyacham.com/api/auth/google/callback`
- `http://localhost:3000/api/auth/google/callback` (for local testing)

⚠️ **IMPORTANT**: 
- Google OAuth is very strict about redirect URIs
- The redirect URI in your code MUST exactly match what's in Google Console
- Include or exclude `www.` consistently everywhere

---

### 3️⃣ **Vercel Environment Variables**

If you're deploying on Vercel, add these environment variables in your Vercel project settings:

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add:
   - `NEXT_PUBLIC_APP_URL` = `https://www.askyacham.com`
   - `NEXTAUTH_URL` = `https://www.askyacham.com`
   - `GOOGLE_REDIRECT_URI` = `https://www.askyacham.com/api/auth/google/callback`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = your client ID
   - `GOOGLE_CLIENT_SECRET` = your client secret
   - `SENDGRID_API_KEY` = your SendGrid API key
   - `FROM_EMAIL` = `info@askyacham.com`

---

### 4️⃣ **Domain Redirect (Recommended)**

Set up a redirect from `askyacham.com` to `www.askyacham.com`:

#### **In Vercel:**
1. Go to your project settings → Domains
2. Add both `askyacham.com` and `www.askyacham.com`
3. Set `www.askyacham.com` as primary
4. Vercel will automatically redirect `askyacham.com` → `www.askyacham.com`

#### **In DNS/Cloudflare:**
- Add a redirect rule: `askyacham.com` → `www.askyacham.com` (301 permanent)

---

## 🧪 TESTING CHECKLIST:

### ✅ **Local Testing (before deployment):**
1. ✅ Update `.env.local` with `www.askyacham.com`
2. ✅ Test Google OAuth locally with `localhost:3000`
3. ✅ Verify redirect URI matches Google Console

### ✅ **Production Testing (after deployment):**
1. ✅ Visit `https://www.askyacham.com/signup`
2. ✅ Click "Sign up with Google"
3. ✅ Should redirect to Google → Show consent screen (for new users)
4. ✅ After consent → Redirect back to `https://www.askyacham.com/dashboard`

### ✅ **Common Issues & Solutions:**

| Issue | Solution |
|-------|----------|
| `redirect_uri_mismatch` error | Check Google Console - add `https://www.askyacham.com/api/auth/google/callback` |
| OAuth works locally but not production | Update Vercel environment variables |
| Shows `askyacham.com` instead of `www.` | Update `NEXT_PUBLIC_APP_URL` in Vercel |
| Email links show wrong domain | Update `FROM_EMAIL` and email templates |

---

## 🚀 DEPLOYMENT STEPS:

1. **Update Google Cloud Console**
   - Add `www.askyacham.com` to authorized origins and redirect URIs

2. **Update Vercel Environment Variables**
   - Set all URLs to use `www.askyacham.com`

3. **Deploy to Vercel**
   - Push your code → Vercel auto-deploys

4. **Test Production**
   - Visit `https://www.askyacham.com/test-google-consent`
   - Test the OAuth flow

5. **Set up Domain Redirect**
   - Ensure `askyacham.com` redirects to `www.askyacham.com`

---

## 📝 IMPORTANT NOTES:

1. **Consistency is Key**: Use `www.askyacham.com` EVERYWHERE or nowhere. Mixing them will cause issues.

2. **Google OAuth Cache**: If you change redirect URIs, Google may cache the old ones. Wait 5-10 minutes or revoke app access and test again.

3. **Testing**: Always test with a fresh Google account or after revoking access to see the consent screen.

4. **DNS Propagation**: After DNS changes, wait 24-48 hours for full propagation.

---

## ✅ YOUR CURRENT CODE IS READY!

Your code already handles the domain properly using `window.location.origin`, which will automatically use whatever domain the user is on. Just make sure:
- Environment variables use `www.askyacham.com`
- Google Console has `www.askyacham.com` in redirect URIs
- Domain redirects are set up properly

**Everything else is already configured correctly in your code!** 🚀
