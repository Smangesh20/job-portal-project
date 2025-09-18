# SendGrid Setup Guide

## 🚀 Quick Setup Steps

### 1. Create SendGrid Account
1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key
1. Go to [Settings > API Keys](https://app.sendgrid.com/settings/api_keys)
2. Click "Create API Key"
3. Choose "Restricted Access" for security
4. Give it a name like "Ask Ya Cham App"
5. Set permissions:
   - ✅ Mail Send: Full Access
   - ✅ Stats: Read Access
6. Click "Create & View"
7. **Copy the API key** (you won't see it again!)

### 3. Verify Sender Email
1. Go to [Settings > Sender Authentication](https://app.sendgrid.com/settings/sender_authentication)
2. Click "Verify a Single Sender"
3. Enter your email address (e.g., noreply@yourdomain.com)
4. Check your email and click the verification link

### 4. Add Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```bash
# SendGrid Configuration
NEXT_PUBLIC_SENDGRID_API_KEY=your_actual_api_key_here
SENDGRID_API_KEY=your_actual_api_key_here

# From Email (must be verified in SendGrid)
NEXT_PUBLIC_FROM_EMAIL=noreply@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `/admin/emails` to test email sending

3. Try the forgot password flow to test real emails

## 🔧 Troubleshooting

### Common Issues:

1. **"API key not found"**
   - Make sure you've added the API key to `.env.local`
   - Restart your development server after adding the key

2. **"Sender not verified"**
   - Verify your sender email in SendGrid dashboard
   - Make sure the email in `FROM_EMAIL` matches the verified email

3. **"Rate limit exceeded"**
   - Free tier allows 100 emails/day
   - Check your usage in SendGrid dashboard

4. **Emails going to spam**
   - Set up SPF, DKIM, and DMARC records
   - Use a custom domain for better deliverability

## 📊 Monitoring

- Check email delivery in [SendGrid Activity Feed](https://app.sendgrid.com/email_activity)
- Monitor bounce rates and spam reports
- Set up webhooks for delivery events

## 💰 Pricing

- **Free Tier**: 100 emails/day forever
- **Essentials**: $19.95/month for 50,000 emails
- **Pro**: $89.95/month for 100,000 emails

## 🔒 Security Best Practices

1. Never commit API keys to version control
2. Use environment variables for all sensitive data
3. Rotate API keys regularly
4. Use restricted API keys with minimal permissions
5. Monitor API key usage

## ✅ Success Indicators

When everything is working correctly, you should see:
- ✅ "SendGrid initialized successfully" in console
- ✅ Real emails being sent (not simulated)
- ✅ Email delivery confirmations in SendGrid dashboard
- ✅ Password reset emails arriving in your inbox

## 🆘 Need Help?

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid Support](https://support.sendgrid.com/)
- [API Reference](https://docs.sendgrid.com/api-reference/)
