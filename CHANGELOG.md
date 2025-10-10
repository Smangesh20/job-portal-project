# Changelog

All notable changes to the AskYaCham Job Portal project.

## [1.0.0] - 2025-10-10

### 🎉 Initial Complete Release

### Added - Backend API (NEW!)
- ✅ Complete serverless API using Vercel Functions
- ✅ Email OTP authentication endpoints
  - `POST /api/auth/send-otp` - Send verification code
  - `POST /api/auth/verify-otp` - Verify code and authenticate
  - `POST /api/auth/resend-otp` - Resend verification code
- ✅ Google OAuth endpoints
  - `GET /api/auth/google/signup` - Initiate Google signup
  - `GET /api/auth/google/signup/callback` - Handle signup callback
  - `GET /api/auth/google/signin` - Initiate Google signin
  - `GET /api/auth/google/signin/callback` - Handle signin callback
- ✅ Utility functions for auth operations
- ✅ CORS configuration for cross-origin requests
- ✅ Input validation and error handling
- ✅ Development mode with console OTP display

### Added - Configuration
- ✅ Environment configuration (`src/environments/`)
  - Development environment with localhost API
  - Production environment with production API
- ✅ Vercel configuration (`vercel.json`)
  - API routes mapping
  - CORS headers
  - Build configuration
- ✅ TypeScript configuration for API (`api/tsconfig.json`)
- ✅ Updated package.json with @vercel/node dependency

### Added - Documentation
- ✅ Complete setup guide (`SETUP.md`)
  - Local development instructions
  - Google OAuth setup
  - Email service integration
  - Database integration guide
- ✅ API documentation (`api/README.md`)
  - All endpoint specifications
  - Request/response examples
  - Security features
  - Testing instructions
- ✅ Updated README.md with backend information
- ✅ Updated DEPLOYMENT.md with API deployment
- ✅ This changelog (`CHANGELOG.md`)

### Fixed
- 🐛 **MAJOR**: Signup was completely broken - no backend existed
- 🐛 Frontend was making API calls to non-existent endpoints
- 🐛 Google OAuth redirect URIs not configured
- 🐛 No OTP sending mechanism
- 🐛 No user storage or session management

### Changed
- 🔄 Auth services now use environment-based API URLs
- 🔄 Development mode shows OTP in console (no email service needed)
- 🔄 Google Client ID now loaded from environment
- 🔄 API URLs now configurable per environment

### Frontend (Existing)
- ✅ Angular 17 application
- ✅ Material Design 3 UI
- ✅ Authentication components (signup, signin, OTP verification)
- ✅ Dashboard with job search, applications, profile, settings
- ✅ Responsive design
- ✅ Auth services (updated to use new API)

### Technical Details
- **Backend Runtime**: Vercel Serverless Functions (Node.js)
- **Storage**: In-memory (Maps) - suitable for demo, upgrade to DB for production
- **Authentication**: OAuth 2.0 + OTP-based passwordless
- **Security**: CSRF protection, input validation, OTP expiration
- **Development**: OTP displayed in console, no email service required
- **Production Ready**: Just add email service and database

### Testing
- ✅ Local development fully functional
- ✅ Email OTP flow working with console display
- ✅ Google OAuth flow implemented (requires OAuth setup)
- ✅ API endpoints tested and functional
- ✅ CORS properly configured

### Known Limitations
- ⚠️ In-memory storage (data lost on restart) - upgrade to database for production
- ⚠️ Email service not configured - OTP shown in console in development
- ⚠️ Google OAuth requires proper OAuth app setup in Google Cloud Console
- ⚠️ No rate limiting yet - should add for production
- ⚠️ No database integration yet - add for production

### Migration from Previous Version
If you had the frontend-only version:
1. Pull latest changes
2. Run `npm install` to get @vercel/node
3. API endpoints are now functional
4. Signup/signin now work!

### Next Steps for Production
1. [ ] Integrate email service (SendGrid/Resend)
2. [ ] Add database (PostgreSQL/MongoDB)
3. [ ] Implement JWT tokens
4. [ ] Add rate limiting
5. [ ] Set up monitoring and logging
6. [ ] Add unit tests for API
7. [ ] Add E2E tests

### Contributors
- Initial implementation of complete authentication system
- Backend API architecture
- Documentation and setup guides

---

## How to Upgrade

### From Frontend-Only Version

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Start development server
npm run dev

# Test signup at http://localhost:4200/auth/signup
```

### Environment Setup

No environment variables required for local development! OTP is displayed in console.

For Google OAuth:
```env
GOOGLE_CLIENT_SECRET=your_secret_here
```

### Breaking Changes
None - this is the first complete version.

### Deprecations
None

---

**This version makes signup fully functional for the first time!** 🎉

