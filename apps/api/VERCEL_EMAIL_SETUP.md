# Vercel Email Configuration Guide

## Environment Variables to Set in Vercel

Go to your Vercel Dashboard → Your Project → Settings → Environment Variables and add these:

### Required Variables:
```
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key-here
FROM_EMAIL=info@askyacham.com
```

### Optional Variables (if you want to use SMTP instead):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Local Development Setup

Create a `.env.local` file in the `apps/api` directory with:

```bash
# Email Configuration
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key-here
FROM_EMAIL=info@askyacham.com

# Other required variables...
DATABASE_URL=postgresql://askyacham_user:secure_password_2024@localhost:5432/askyacham
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secure-jwt-secret-key-2024
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-character-encryption-key
API_PORT=3001
API_HOST=0.0.0.0
NODE_ENV=development
```

## Testing Email Functionality

1. **Check Environment Variables:**
   ```bash
   node check-env.js
   ```

2. **Test SendGrid Connection:**
   ```bash
   node test-email.js
   ```

3. **Test Forgot Password:**
   - Go to your app's forgot password page
   - Enter a valid email address
   - Check the server logs for email sending confirmation

## Troubleshooting

### If emails are not being sent:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check the logs for any error messages

2. **Verify SendGrid API Key:**
   - Make sure the API key is correct and has sending permissions
   - Check SendGrid dashboard for any account issues

3. **Check Email Provider Setting:**
   - Ensure `EMAIL_PROVIDER=sendgrid` is set in Vercel
   - The system will fall back to SMTP if SendGrid is not configured

4. **Verify FROM_EMAIL:**
   - Make sure the FROM_EMAIL is verified in SendGrid
   - Check that the domain is properly configured

## Expected Log Messages

When working correctly, you should see these log messages:
```
Using SendGrid for email delivery
SendGrid API Key configured: Yes
Sending email via SendGrid to: user@example.com
✅ Email sent via SendGrid API: [message-id]
```
