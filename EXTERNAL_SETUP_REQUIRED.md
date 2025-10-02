# 🔧 EXTERNAL SETUP REQUIRED

## 🚨 **CRITICAL: You Must Do This Externally**

The error "The OAuth client was not found" means you need to configure Google Console properly.

---

## 🚀 **STEP 1: Google Cloud Console Setup**

### **Go to Google Cloud Console:**
https://console.cloud.google.com/apis/credentials

### **Create OAuth 2.0 Client ID:**
1. Click "Create Credentials" → "OAuth 2.0 Client ID"
2. Choose "Web application"
3. Name: "AskYaCham Authentication"

### **Configure Authorized JavaScript Origins:**
Add these URLs:
```
https://www.askyacham.com
http://localhost:3000
```

### **Configure Authorized Redirect URIs:**
Add these URLs:
```
https://www.askyacham.com/google-success
http://localhost:3000/google-success
```

### **Copy Your Credentials:**
- Copy the **Client ID** (starts with numbers)
- Copy the **Client Secret**
- You'll need these for Vercel

---

## 🚀 **STEP 2: Update Your Code**

### **Replace the Client ID in your code:**
In `apps/web/src/app/signup/page.tsx` and `apps/web/src/app/login/page.tsx`:

Replace this line:
```javascript
const clientId = '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
```

With your actual Client ID from Google Console:
```javascript
const clientId = 'YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com'
```

---

## 🚀 **STEP 3: Vercel Environment Variables**

### **Go to Vercel:**
https://vercel.com/your-project/settings/environment-variables

### **Add these variables:**
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE
NEXT_PUBLIC_APP_URL=https://www.askyacham.com
NEXTAUTH_URL=https://www.askyacham.com
```

---

## 🚀 **STEP 4: Deploy and Test**

1. **Push your code** with the correct Client ID
2. **Deploy to Vercel**
3. **Test the authentication flow**

---

## ✅ **EXPECTED RESULT:**

After completing these steps:
- ✅ **Signup**: Google consent screen → Account creation → Dashboard
- ✅ **Signin**: Google account selection → Authentication → Dashboard
- ✅ **Email**: OTP only → Verification → Dashboard

---

## 🚨 **IMPORTANT NOTES:**

1. **The Client ID must match** what's in Google Console
2. **The redirect URI must match** what's in Google Console
3. **Environment variables must be set** in Vercel
4. **Domain must be configured** properly

---

## 🎯 **QUICK CHECKLIST:**

- [ ] Google Console OAuth client created
- [ ] Redirect URIs added to Google Console
- [ ] Client ID updated in code
- [ ] Environment variables set in Vercel
- [ ] Code deployed to Vercel
- [ ] Test authentication flow

---

## 🚀 **AFTER COMPLETION:**

Your authentication system will work exactly like Google's:
- ✅ **Real consent screens**
- ✅ **Real account selection**
- ✅ **Real user data**
- ✅ **Enterprise-grade security**

**This is the ONLY way to fix the "OAuth client was not found" error!** 🚀
