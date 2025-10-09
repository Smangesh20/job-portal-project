# AskYaCham - Professional Job Portal

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Smangesh20/job-portal-project)
[![Last Updated](https://img.shields.io/badge/updated-October%202025-green.svg)](https://github.com/Smangesh20/job-portal-project)

A modern, Google-style job portal built with Angular and Material Design, featuring Google OAuth authentication and OTP-only email authentication.

## 🚀 Features

- **Google OAuth Authentication** - Sign up and sign in exactly like Google
- **OTP-Only Email Authentication** - Secure email verification without passwords
- **Professional UI** - Built with Angular Material Design (Google's official design system)
- **Job Search & Applications** - Advanced job search with application tracking
- **Profile Management** - Complete professional profile management
- **Real-time Dashboard** - Track applications and job matches
- **Mobile Responsive** - Works perfectly on all devices

## 🛠️ Technology Stack

- **Frontend**: Angular 17 with TypeScript
- **UI Framework**: Angular Material Design
- **Authentication**: Google OAuth 2.0 + Custom OTP
- **Backend**: Next.js API Routes
- **Deployment**: Vercel
- **Styling**: Google's official design system

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Console project with OAuth credentials

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd askyacham-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://www.askyacham.com/api/auth/google/signup/callback`
     - `https://www.askyacham.com/api/auth/google/signin/callback`

4. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   Update `.env.local` with your Google OAuth credentials:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

5. **Development Server**
   ```bash
   npm start
   ```
   Open [http://localhost:4200](http://localhost:4200)

6. **Production Build**
   ```bash
   npm run build
   ```

## 🔐 Authentication Flow

### Google OAuth (Sign Up)
- Forces consent screen for new account creation
- Clears Google cache to ensure fresh consent
- Uses `prompt=consent` parameter

### Google OAuth (Sign In)
- Shows account selection for existing users
- Uses `prompt=select_account` parameter

### Email Authentication
- OTP-only verification (no passwords)
- 6-digit verification codes
- Secure email delivery

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/                 # Authentication module
│   │   ├── signin/          # Sign in component
│   │   ├── signup/          # Sign up component
│   │   ├── otp-verification/ # OTP verification
│   │   └── services/        # Auth services
│   ├── dashboard/           # Dashboard module
│   │   ├── job-search/      # Job search component
│   │   ├── profile/         # Profile management
│   │   ├── applications/    # Application tracking
│   │   ├── settings/        # User settings
│   │   └── services/        # Dashboard services
│   └── shared/              # Shared components
├── assets/                  # Static assets
└── styles.scss             # Global styles

api/
├── auth/
│   ├── google/
│   │   ├── signup/         # Google signup endpoint
│   │   ├── signup/callback/ # Signup callback
│   │   ├── signin/         # Google signin endpoint
│   │   └── signin/callback/ # Signin callback
│   ├── send-otp/           # Send OTP endpoint
│   └── verify-otp/         # Verify OTP endpoint
└── jobs/                   # Job-related endpoints
```

## 🎨 Design System

Built using Google's official Material Design 3 with:
- Google Sans font family
- Official Google color palette
- Material Design components
- Responsive design patterns
- Accessibility compliance

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP code
- `GET /api/auth/google/signup` - Google signup flow
- `GET /api/auth/google/signin` - Google signin flow

### Jobs
- `GET /api/jobs` - Get job listings
- `POST /api/jobs/search` - Search jobs
- `GET /api/jobs/:id` - Get job details

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/upload-picture` - Upload profile picture

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run deploy
```

## 🔒 Security Features

- CSRF protection with nonce and state parameters
- Secure session management with HTTP-only cookies
- OAuth 2.0 with PKCE (Proof Key for Code Exchange)
- Rate limiting on API endpoints
- Input validation and sanitization

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Progressive Web App (PWA) ready
- Offline capability

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@askyacham.com or create an issue in the repository.

## 🙏 Acknowledgments

- Google for the Material Design system
- Angular team for the amazing framework
- Vercel for seamless deployment
- All contributors and users

---

**Built with ❤️ by the AskYaCham Team**
