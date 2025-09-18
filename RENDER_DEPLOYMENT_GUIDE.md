# 🚀 Ask Ya Cham - Render Deployment Guide

## Overview
This guide will help you deploy the Ask Ya Cham global job platform to Render with production-ready configuration.

## 📋 Prerequisites
- Render account (free tier available)
- Git repository with your code
- Node.js 18+ (specified in package.json)

## 🔧 Deployment Steps

### 1. Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Select your repository containing the Ask Ya Cham code

### 2. Configuration
The `render.yaml` file is already configured with:
- ✅ Production environment variables
- ✅ Health check endpoint (`/api/health`)
- ✅ Auto-scaling (1-3 instances)
- ✅ Security headers
- ✅ Proper routing
- ✅ Custom domain support
- ✅ Storage disk for file uploads

### 3. Environment Variables
The following environment variables are automatically configured:

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `10000` | Render's standard port |
| `APP_NAME` | `Ask Ya Cham Global Platform` | Application name |
| `APP_VERSION` | `2.0.0` | Version tracking |
| `CORS_ORIGIN` | `*` | CORS configuration |
| `JWT_SECRET` | Auto-generated | JWT token security |
| `SESSION_SECRET` | Auto-generated | Session security |

### 4. Security Features
The deployment includes:
- 🔒 Security headers (XSS protection, CSRF, etc.)
- 🛡️ Rate limiting (100 requests per 15 minutes)
- 🔐 HTTPS enforcement
- 🚫 Frame options protection

### 5. Monitoring & Health Checks
- Health endpoint: `/api/health`
- Auto-scaling based on CPU/Memory usage
- Automatic restarts on failures

## 🌐 Custom Domain Setup

### Option 1: Render Subdomain (Free)
- Your app will be available at: `ask-ya-cham.onrender.com`
- HTTPS automatically enabled

### Option 2: Custom Domain (Paid)
1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `askyacham.com`)
4. Update DNS records as instructed
5. SSL certificate will be automatically provisioned

## 📊 Features Included

### Frontend Pages
- 🏠 **Homepage** (`/`) - Landing page with features
- 🔐 **Login** (`/login`) - User authentication
- 📝 **Register** (`/register`) - User registration
- 🔑 **Forgot Password** (`/forgot-password`) - Password recovery
- 📊 **Dashboard** (`/dashboard`) - User dashboard (protected)
- 💼 **Jobs** (`/jobs`) - Job listings (protected)
- 🏢 **Companies** (`/companies`) - Company listings (protected)
- ℹ️ **About** (`/about`) - About page
- 📞 **Contact** (`/contact`) - Contact form

### API Endpoints
- 🔍 **GET** `/api/health` - Health check
- 📋 **GET** `/api` - API information
- 💼 **GET** `/api/jobs` - List all jobs (authenticated)
- 🔍 **GET** `/api/jobs/:id` - Get specific job (authenticated)

### Authentication
- Demo authentication system
- Token-based authentication
- Protected routes with middleware
- Session management

## 🚀 Deployment Commands

### Automatic Deployment
```bash
# Push to main branch to trigger deployment
git add .
git commit -m "Deploy Ask Ya Cham to production"
git push origin main
```

### Manual Deployment
```bash
# Build command (runs automatically)
npm install

# Start command (runs automatically)
npm start
```

## 📈 Scaling Configuration

The app is configured for:
- **Minimum instances**: 1
- **Maximum instances**: 3
- **CPU threshold**: 70%
- **Memory threshold**: 70%
- **Auto-scaling**: Enabled

## 🔍 Monitoring & Debugging

### Health Check
```bash
curl https://ask-ya-cham.onrender.com/api/health
```

### Logs
- Access logs in Render dashboard
- Real-time log streaming
- Error tracking and monitoring

### Performance Monitoring
- CPU and memory usage tracking
- Response time monitoring
- Request volume analytics

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Check build logs in Render dashboard

2. **Runtime Errors**
   - Check application logs
   - Verify environment variables
   - Test health endpoint

3. **Performance Issues**
   - Monitor CPU/memory usage
   - Check scaling configuration
   - Optimize code if needed

### Support
- Render Documentation: https://render.com/docs
- Render Support: Available in dashboard

## 🎯 Next Steps

After successful deployment:

1. **Test all endpoints**:
   - Visit homepage
   - Test login/register
   - Check API endpoints
   - Verify protected routes

2. **Monitor performance**:
   - Check health endpoint
   - Monitor scaling
   - Review logs

3. **Customize as needed**:
   - Add custom domain
   - Configure additional environment variables
   - Set up monitoring alerts

## 📞 Support & Contact

For deployment issues:
- Check Render dashboard logs
- Review this deployment guide
- Contact Render support

---

**🎉 Congratulations!** Your Ask Ya Cham platform is now live and ready to help job seekers worldwide!