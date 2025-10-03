# 🚀 EXTERNAL SETUP REQUIRED - GOOGLE CLOUD CONSOLE

## ✅ CRITICAL: YOU MUST ADD THESE REDIRECT URIs

The error is fixed in the code, but **YOU MUST ADD THESE REDIRECT URIs** to your Google Cloud Console:

### 🚀 REDIRECT URIs TO ADD:

Go to: https://console.cloud.google.com/apis/credentials

1. **For Signup (Force Consent):**
   ```
   https://www.askyacham.com/api/auth/google/force-consent/callback
   ```

2. **For Signup (Alternative):**
   ```
   https://www.askyacham.com/api/auth/google/signup/callback
   ```

3. **For Signin:**
   ```
   https://www.askyacham.com/api/auth/google/signin/callback
   ```

4. **Original Callback:**
   ```
   https://www.askyacham.com/api/auth/google/callback
   ```

### 🚀 AUTHORIZED JAVASCRIPT ORIGINS:

```
https://www.askyacham.com
```

### 🚀 STEP-BY-STEP:

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID (for "Ask Ya Cham")
3. Under "Authorized redirect URIs", add ALL 4 URLs above
4. Click "SAVE"
5. Wait 1-2 minutes for changes to propagate
6. Clear browser cache and cookies
7. Try signup again

### 🚀 WHAT I FIXED IN CODE:

✅ Removed `approval_prompt=force` (conflicts with `prompt=consent`)
✅ Removed unnecessary parameters (nonce, hd, login_hint, max_auth_age, authuser)
✅ Clean OAuth URLs with only essential parameters
✅ Separate routes for signup and signin
✅ Signup uses `prompt=consent` to force consent screen
✅ Signin uses `prompt=select_account` to show account selection

### 🚀 CURRENT STATUS:

**CODE: ✅ FIXED AND DEPLOYED**
**GOOGLE CLOUD CONSOLE: ⏳ WAITING FOR YOU TO ADD REDIRECT URIs**

Once you add the redirect URIs, the signup will show the Google consent screen and signin will show account selection, exactly like Google's authentication!