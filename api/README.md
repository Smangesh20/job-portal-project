# API Backend - AskYaCham Job Portal

This directory contains the serverless API functions for the AskYaCham job portal authentication system.

## Overview

The API provides authentication endpoints for:
- **Email OTP Authentication**: Passwordless login using 6-digit verification codes
- **Google OAuth**: Signin and signup with Google accounts

## API Endpoints

### Email OTP Authentication

#### POST `/api/auth/send-otp`
Sends a 6-digit OTP to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "action": "signup" | "signin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to user@example.com",
  "otp": "123456"  // Only in development
}
```

#### POST `/api/auth/verify-otp`
Verifies the OTP and creates/signs in the user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "action": "signup" | "signin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "verified_email": true,
    "provider": "email",
    "created_at": "2023-10-10T00:00:00.000Z",
    "last_login": "2023-10-10T00:00:00.000Z"
  },
  "token": "..."
}
```

#### POST `/api/auth/resend-otp`
Resends the OTP to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "action": "signup" | "signin"
}
```

### Google OAuth Authentication

#### GET `/api/auth/google/signup`
Initiates Google OAuth flow for signup (forces consent screen).

**Response:** Redirects to Google OAuth

#### GET `/api/auth/google/signup/callback`
Callback endpoint for Google OAuth signup.

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: CSRF protection state

**Response:** Redirects to dashboard with auth token

#### GET `/api/auth/google/signin`
Initiates Google OAuth flow for signin (shows account selection).

**Response:** Redirects to Google OAuth

#### GET `/api/auth/google/signin/callback`
Callback endpoint for Google OAuth signin.

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: CSRF protection state

**Response:** Redirects to dashboard with auth token

## Development Setup

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application URL
NEXTAUTH_URL=http://localhost:4200

# Email Service (optional for development)
EMAIL_SERVICE_API_KEY=your_email_service_api_key

# Environment
NODE_ENV=development
```

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. The API will be available at `http://localhost:4200/api`

### Testing the API

In development mode:
- OTP codes are logged to the console
- OTP codes are included in API responses
- Email sending is mocked (just logs to console)

Example test with curl:

```bash
# Send OTP
curl -X POST http://localhost:4200/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","action":"signup"}'

# Verify OTP (use OTP from response)
curl -X POST http://localhost:4200/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","action":"signup"}'
```

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (your production domain)
   - `EMAIL_SERVICE_API_KEY` (for SendGrid, AWS SES, etc.)

4. Deploy!

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:4200/api/auth/google/signup/callback`
   - Development: `http://localhost:4200/api/auth/google/signin/callback`
   - Production: `https://your-domain.com/api/auth/google/signup/callback`
   - Production: `https://your-domain.com/api/auth/google/signin/callback`

### Email Service Integration

For production, integrate with an email service:

**Option 1: SendGrid**
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@askyacham.com',
  subject: 'Your Verification Code',
  text: `Your code is: ${otp}`,
  html: `<strong>Your code is: ${otp}</strong>`
});
```

**Option 2: AWS SES**
```typescript
import AWS from 'aws-sdk';
const ses = new AWS.SES();

await ses.sendEmail({
  Source: 'noreply@askyacham.com',
  Destination: { ToAddresses: [email] },
  Message: {
    Subject: { Data: 'Your Verification Code' },
    Body: { Text: { Data: `Your code is: ${otp}` } }
  }
}).promise();
```

## Database Integration

Currently, the API uses in-memory storage (Maps). For production, integrate with a database:

**Recommended options:**
- **PostgreSQL** with Vercel Postgres
- **MongoDB** with MongoDB Atlas
- **Supabase** for PostgreSQL + Auth
- **PlanetScale** for MySQL

Update `api/_utils.ts` to use your database instead of Maps.

## Security Features

- **CSRF Protection**: State parameter for OAuth flows
- **CORS Headers**: Properly configured for cross-origin requests
- **Input Validation**: Email and OTP format validation
- **OTP Expiration**: 10-minute validity for OTP codes
- **State Expiration**: 5-minute validity for OAuth state

## Rate Limiting

For production, add rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

// Apply to OTP endpoints
```

## Monitoring

Recommended monitoring tools:
- **Vercel Analytics**: Built-in analytics
- **Sentry**: Error tracking
- **LogRocket**: Session replay and logging
- **DataDog**: Application monitoring

## Support

For issues or questions, please check:
- [Vercel Documentation](https://vercel.com/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- Project GitHub Issues

