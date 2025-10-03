# 🎯 FINAL SETUP - ONLY TWO REDIRECT URIs

## ✅ SIMPLIFIED SETUP

You only need to add these **TWO** redirect URIs to Google Cloud Console:

### 🚀 REDIRECT URIs TO ADD:

1. **For Signup (Consent Screen):**
   ```
   https://www.askyacham.com/api/auth/google/signup/callback
   ```

2. **For Signin (Account Selection):**
   ```
   https://www.askyacham.com/api/auth/google/signin/callback
   ```

### 🚀 STEP-BY-STEP:

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add ONLY these 2 URLs above
4. Click "SAVE"
5. Wait 1-2 minutes for changes to propagate
6. Clear browser cache and cookies
7. Try signup again

### 🚀 HOW IT WORKS:

- **Signup** → `/api/auth/google/signup` → Shows **CONSENT SCREEN**
- **Signin** → `/api/auth/google/signin` → Shows **ACCOUNT SELECTION**
- **Email** → **OTP-ONLY** (no passwords)

### ✅ DEPLOYMENT STATUS:

**CODE: ✅ FIXED AND DEPLOYED**
**GOOGLE CLOUD CONSOLE: ⏳ ADD THESE TWO REDIRECT URIs**

Once you add these two redirect URIs, everything will work exactly like Google's authentication!
