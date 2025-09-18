# Vercel Environment Variables Setup Guide

## 🔧 **Environment Variables Configuration**

Your `vercel.json` has been optimized to avoid referencing non-existent secrets. Here's how to properly configure environment variables in Vercel:

### ✅ **What Was Fixed**

**❌ Previous Issue:**
```json
"env": {
  "NODE_ENV": "production",
  "NEXT_PUBLIC_APP_URL": "@next_public_app_url",     // ❌ Non-existent secret
  "NEXT_PUBLIC_API_URL": "@next_public_api_url"      // ❌ Non-existent secret
}
```

**✅ Current Solution:**
```json
"env": {
  "NODE_ENV": "production"  // ✅ Safe, no external references
}
```

---

## 🌐 **Setting Up Environment Variables in Vercel Dashboard**

### **Step 1: Access Project Settings**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your project: `ask-ya-cham-quantum-platform`
3. Click on **"Settings"** tab
4. Click on **"Environment Variables"** in the left sidebar

### **Step 2: Add Required Environment Variables**

Add the following environment variables in the Vercel dashboard:

#### **🔗 Application URLs**
```
NEXT_PUBLIC_APP_URL
Value: https://your-app-name.vercel.app
Environment: Production, Preview, Development
```

```
NEXT_PUBLIC_API_URL  
Value: https://your-app-name.vercel.app/api
Environment: Production, Preview, Development
```

#### **🔐 Authentication (Optional)**
```
JWT_SECRET
Value: your-secure-jwt-secret-key-here
Environment: Production, Preview, Development
```

```
JWT_REFRESH_SECRET
Value: your-secure-refresh-secret-key-here
Environment: Production, Preview, Development
```

#### **📧 Email Service (Optional)**
```
SMTP_HOST
Value: smtp.gmail.com
Environment: Production, Preview, Development
```

```
SMTP_PORT
Value: 587
Environment: Production, Preview, Development
```

```
SMTP_USER
Value: your-email@gmail.com
Environment: Production, Preview, Development
```

```
SMTP_PASS
Value: your-app-password
Environment: Production, Preview, Development
```

```
SMTP_FROM
Value: noreply@yourdomain.com
Environment: Production, Preview, Development
```

#### **🗄️ Database (If Using External Database)**
```
DATABASE_URL
Value: postgresql://username:password@host:port/database
Environment: Production, Preview, Development
```

#### **📊 Analytics & Monitoring (Optional)**
```
GOOGLE_ANALYTICS_ID
Value: GA-XXXXXXXXX-X
Environment: Production, Preview, Development
```

```
SENTRY_DSN
Value: https://your-sentry-dsn@sentry.io/project-id
Environment: Production, Preview, Development
```

---

## 🚀 **Quick Setup for Free Tier**

For the **free Vercel deployment**, you only need these essential variables:

### **Minimum Required Variables:**
```
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
NEXT_PUBLIC_API_URL = https://your-app-name.vercel.app/api
```

### **Recommended for Full Functionality:**
```
JWT_SECRET = generate-a-secure-random-string
NEXT_PUBLIC_APP_VERSION = 1.0.0
```

---

## 🔒 **Security Best Practices**

### **✅ DO:**
- Use strong, random strings for secrets
- Set different values for Production/Preview/Development
- Use Vercel's built-in secret management
- Rotate secrets regularly

### **❌ DON'T:**
- Commit secrets to your repository
- Use weak or predictable secret values
- Share environment variables in plain text
- Use the same secrets across different projects

---

## 📝 **Step-by-Step Setup Process**

### **1. Create Your Project**
1. Import your GitHub repository to Vercel
2. Let Vercel auto-detect Next.js framework
3. Deploy with default settings first

### **2. Add Environment Variables**
1. Go to Project Settings → Environment Variables
2. Add each variable one by one
3. Make sure to select the correct environment (Production/Preview/Development)
4. Click "Save" after adding each variable

### **3. Redeploy**
1. After adding all environment variables
2. Go to the "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger automatic redeployment

---

## 🎯 **Verification Checklist**

After setting up environment variables, verify:

- [ ] All required environment variables are set
- [ ] No references to non-existent secrets in `vercel.json`
- [ ] Environment variables are accessible in your application
- [ ] Application deploys without errors
- [ ] All features work correctly in production

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **"Environment Variable Not Found"**
- Check if the variable name matches exactly
- Ensure it's set for the correct environment (Production/Preview/Development)
- Redeploy after adding new variables

#### **"Secret Reference Error"**
- Remove any `@secret-name` references from `vercel.json`
- Set variables directly in Vercel dashboard instead

#### **"Build Fails"**
- Check if all required variables are set
- Verify variable values are correct
- Check build logs for specific error messages

---

## 🎉 **Success!**

Once you've set up the environment variables:

1. **✅ Your app will deploy without secret reference errors**
2. **✅ All features will work correctly**
3. **✅ Environment variables will be secure and properly managed**
4. **✅ You can easily update variables without code changes**

Your Ask Ya Cham platform is now ready for secure, production deployment on Vercel! 🚀
