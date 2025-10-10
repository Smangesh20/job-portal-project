# 🧪 Testing Guide - AskYaCham Job Portal

## Quick Test - Verify Signup is Working

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Email Signup (Recommended First Test)

1. **Open the app**: http://localhost:4200/auth/signup
2. **Open DevTools**: Press F12 (or Cmd+Option+I on Mac)
3. **Go to Console tab** in DevTools
4. **Enter any email**: e.g., `test@example.com`
5. **Click**: "Create account with OTP"
6. **Watch the console**: You'll see `🔐 Development OTP: 123456`
7. **Enter the OTP**: Copy the 6-digit code from console
8. **Submit**: Click verify
9. **Success!**: You should be redirected to `/dashboard`

### Expected Console Output
```
🔐 Development OTP: 123456
```

### Expected Success Message
```
✅ Verification code sent! (Dev: 123456)
```

## API Testing

### Test OTP Send Endpoint

```bash
curl -X POST http://localhost:4200/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "action": "signup"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Verification code sent to test@example.com",
  "otp": "123456"
}
```

### Test OTP Verify Endpoint

```bash
curl -X POST http://localhost:4200/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "action": "signup"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "dGVzdEBleGFtcGxlLmNvbQ",
    "email": "test@example.com",
    "name": "test",
    "verified_email": true,
    "provider": "email",
    "created_at": "2025-10-10T...",
    "last_login": "2025-10-10T..."
  },
  "token": "..."
}
```

## Testing Different Scenarios

### Scenario 1: Signup with New Email ✅

1. Enter new email: `newuser@example.com`
2. Click "Create account with OTP"
3. Get OTP from console
4. Verify OTP
5. ✅ Should create new account and redirect to dashboard

### Scenario 2: Invalid Email Format ❌

1. Enter invalid email: `notanemail`
2. Click "Create account with OTP"
3. ❌ Should show validation error: "Please enter a valid email"

### Scenario 3: Invalid OTP ❌

1. Enter valid email
2. Get OTP from console
3. Enter wrong OTP: `000000`
4. ❌ Should show error: "Invalid or expired verification code"

### Scenario 4: Expired OTP ❌

1. Send OTP
2. Wait 11 minutes (OTP expires after 10 minutes)
3. Try to verify with old OTP
4. ❌ Should show error: "Invalid or expired verification code"

### Scenario 5: Resend OTP ✅

1. Enter email and send OTP
2. Click "Resend code" (if available)
3. Get new OTP from console
4. Verify with new OTP
5. ✅ Should work with new OTP

### Scenario 6: Sign In with Existing Email ✅

1. Use email from successful signup
2. Go to `/auth/signin`
3. Enter same email
4. Get OTP and verify
5. ✅ Should sign in (not create new account)

### Scenario 7: Sign In with Non-Existent Email ❌

1. Go to `/auth/signin`
2. Enter email never used before
3. Get OTP and verify
4. ❌ Should show error: "User not found. Please sign up first."

## Google OAuth Testing

### Prerequisites
- Google OAuth app configured in Google Cloud Console
- Redirect URIs added
- Client Secret in environment variables

### Test Google Signup

1. Click "Sign up with Google" button
2. Should redirect to Google consent screen
3. Select Google account
4. Grant permissions
5. Should redirect back to app
6. Should create account and redirect to dashboard

**Note**: Google OAuth won't work locally without proper setup. See [SETUP.md](SETUP.md) for configuration.

## Manual Testing Checklist

### Frontend Tests

- [ ] Signup page loads at `/auth/signup`
- [ ] Email input shows validation errors
- [ ] "Create account with OTP" button is disabled when form invalid
- [ ] Loading spinner shows during API call
- [ ] Success message appears after OTP sent
- [ ] OTP is visible in browser console
- [ ] Navigation to OTP verification page works
- [ ] OTP verification page loads with email parameter
- [ ] OTP input accepts 6 digits
- [ ] Invalid OTP shows error
- [ ] Valid OTP redirects to dashboard
- [ ] Dashboard shows user information

### API Tests

- [ ] `POST /api/auth/send-otp` returns OTP in development
- [ ] `POST /api/auth/verify-otp` creates user on signup
- [ ] `POST /api/auth/verify-otp` returns existing user on signin
- [ ] `POST /api/auth/resend-otp` generates new OTP
- [ ] Invalid email returns 400 error
- [ ] Invalid OTP returns 401 error
- [ ] Expired OTP returns 401 error
- [ ] CORS headers present in all responses
- [ ] OPTIONS requests handled correctly

### Network Tests (DevTools → Network Tab)

- [ ] API calls go to correct endpoint
- [ ] Request payload is correct JSON
- [ ] Response status is 200 for success
- [ ] Response contains expected data
- [ ] CORS headers are present
- [ ] No CORS errors in console

## Automated Testing (Future)

### Unit Tests Setup

```bash
# Install testing dependencies
npm install --save-dev @angular/core/testing
npm install --save-dev jasmine-core karma

# Run tests
npm test
```

### Example Unit Test for Auth Service

```typescript
// src/app/auth/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send OTP', async () => {
    const email = 'test@example.com';
    const response = await service.sendOtp(email, 'signup');
    expect(response.success).toBe(true);
  });
});
```

### E2E Tests Setup

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

### Example E2E Test

```typescript
// e2e/signup.spec.ts
import { test, expect } from '@playwright/test';

test('signup flow', async ({ page }) => {
  // Navigate to signup
  await page.goto('http://localhost:4200/auth/signup');

  // Fill email
  await page.fill('input[type="email"]', 'test@example.com');

  // Click signup
  await page.click('button[type="submit"]');

  // Wait for OTP in console
  // In real test, you'd mock the API or use a test inbox

  // Should navigate to OTP page
  await expect(page).toHaveURL(/\/auth\/otp-verification/);
});
```

## Performance Testing

### Load Test with k6

```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10, // 10 virtual users
  duration: '30s',
};

export default function() {
  let payload = JSON.stringify({
    email: 'test@example.com',
    action: 'signup'
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post('http://localhost:4200/api/auth/send-otp', payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has success': (r) => JSON.parse(r.body).success === true,
  });
}
```

Run: `k6 run load-test.js`

## Security Testing

### Test CORS

```bash
curl -X OPTIONS http://localhost:4200/api/auth/send-otp \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Should return CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Test Rate Limiting (After Implementation)

```bash
# Send 100 requests rapidly
for i in {1..100}; do
  curl -X POST http://localhost:4200/api/auth/send-otp \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","action":"signup"}' &
done
```

Should return 429 Too Many Requests after limit.

## Troubleshooting Tests

### Tests Failing?

1. **Check server is running**
   ```bash
   curl http://localhost:4200
   ```

2. **Check API is accessible**
   ```bash
   curl http://localhost:4200/api/auth/send-otp
   ```

3. **Check console for errors**
   - Open DevTools
   - Look for red errors
   - Check Network tab for failed requests

4. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
   - Clear localStorage: DevTools → Application → Storage → Clear

5. **Restart development server**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

## Test Data

### Valid Email Addresses for Testing
- `test@example.com`
- `user123@test.com`
- `hello@world.co.uk`
- `firstname.lastname@company.com`

### Invalid Email Addresses for Testing
- `notanemail`
- `missing@domain`
- `@nodomain.com`
- `spaces in@email.com`

### Test OTP Codes (Development)
Any 6-digit code shown in console will work.
Generated format: `123456`

## CI/CD Testing (Future)

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## Testing Checklist Summary

✅ **Must Test Before Deploying:**
- [ ] Email signup flow works end-to-end
- [ ] OTP is generated and can be verified
- [ ] Invalid inputs show appropriate errors
- [ ] Dashboard loads after successful signup
- [ ] All API endpoints return expected responses
- [ ] CORS is properly configured
- [ ] No console errors

🚀 **Ready to Deploy When:**
- All tests pass ✅
- No console errors ✅
- API responds correctly ✅
- Frontend loads without issues ✅

---

**Start with the Quick Test at the top of this file!** 🧪

