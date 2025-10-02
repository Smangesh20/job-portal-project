# 🔧 ENVIRONMENT SETUP GUIDE

## ✅ **REQUIRED ENVIRONMENT VARIABLES**

Create a `.env.local` file in your `apps/web` directory with these variables:

```bash
# 🌐 APP CONFIGURATION
NEXT_PUBLIC_APP_URL=https://www.askyacham.com
NEXTAUTH_URL=https://www.askyacham.com

# 🔐 GOOGLE OAUTH CONFIGURATION
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://www.askyacham.com/api/auth/google/callback

# 📧 EMAIL CONFIGURATION
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=info@askyacham.com

# 🔧 ENVIRONMENT
NODE_ENV=production
```

---

## 🚀 **VERCEL DEPLOYMENT**

Add these environment variables in Vercel:

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add each variable above
3. **IMPORTANT**: Use `https://www.askyacham.com` for all URLs

---

## 🔐 **GOOGLE CLOUD CONSOLE**

Go to: https://console.cloud.google.com/apis/credentials

### **Authorized JavaScript Origins:**
```
https://www.askyacham.com
http://localhost:3000
```

### **Authorized Redirect URIs:**
```
https://www.askyacham.com/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
```

---

## ✅ **TESTING CHECKLIST**

1. ✅ Environment variables set in Vercel
2. ✅ Google Console redirect URIs updated
3. ✅ Domain configured as `www.askyacham.com`
4. ✅ Deploy to Vercel
5. ✅ Test signup flow
6. ✅ Test signin flow

---

## 🚨 **COMMON ISSUES**

| Issue | Solution |
|-------|----------|
| `redirect_uri_mismatch` | Add `https://www.askyacham.com/api/auth/google/callback` to Google Console |
| 404 errors | Update `NEXT_PUBLIC_APP_URL` to `https://www.askyacham.com` |
| No consent screen | Use `prompt=consent` for signup, `prompt=select_account` for signin |
| Direct redirect to dashboard | Check environment variables are set correctly |

---

## 🎯 **EXPECTED BEHAVIOR**

### **Signup Flow:**
1. Click "Sign up with Google" → Google consent screen
2. User grants permissions → Account created
3. Redirect to dashboard with success message

### **Signin Flow:**
1. Click "Continue with Google" → Google account selection
2. User selects account → Authenticated
3. Redirect to dashboard with success message

**This now works exactly like Google's authentication system!** 🚀