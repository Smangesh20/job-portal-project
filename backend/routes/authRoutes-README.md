# Enhanced Authentication Routes

## Overview

The authentication routes (`/auth/signup` and `/auth/login`) have been updated to integrate the new error handling and validation middleware stack. This implementation maintains backward compatibility through feature flags while providing enhanced error handling, input validation, and security features.

## Features

### 1. Input Validation
- **Joi-based schema validation** for all authentication requests
- **Field-level error messages** with specific validation failures
- **Email format validation** and normalization
- **Password strength requirements** (minimum 8 characters, uppercase, lowercase, and numbers)
- **User type validation** (applicant or recruiter)

### 2. Input Sanitization
- **XSS prevention** through comprehensive input sanitization
- **SQL/NoSQL injection protection**
- **Threat detection and logging** for security monitoring
- **Automatic content cleaning** while preserving valid data

### 3. Enhanced Error Handling
- **Standardized error response format** with error codes and correlation IDs
- **User-friendly error messages** that don't expose security details
- **Automatic error logging** with request context
- **Database error translation** to meaningful messages

### 4. Backward Compatibility
- **Feature flag controlled** rollout of new features
- **Legacy response format** maintained when flags are disabled
- **Gradual migration path** for existing clients
- **No breaking changes** to existing functionality

### 5. Correlation ID Tracking
- **Unique request tracking** across the system
- **Error correlation** for debugging and monitoring
- **Request/response correlation** in logs and responses

## API Endpoints

### POST /auth/signup

Creates a new user account (applicant or recruiter).

#### Request Body

**For Applicants:**
```json
{
  "email": "applicant@example.com",
  "password": "SecurePass123",
  "type": "applicant",
  "name": "John Doe",
  "skills": ["JavaScript", "Node.js", "React"],
  "education": [
    {
      "institutionName": "University Name",
      "startYear": 2018,
      "endYear": 2022
    }
  ]
}
```

**For Recruiters:**
```json
{
  "email": "recruiter@example.com",
  "password": "SecurePass123",
  "type": "recruiter",
  "name": "Jane Smith",
  "contactNumber": "+1234567890",
  "bio": "Experienced tech recruiter"
}
```

#### Success Response (Enhanced Format)

**Status Code:** 200 OK

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "applicant",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "applicant@example.com",
      "type": "applicant"
    }
  },
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Success Response (Legacy Format)

**Status Code:** 200 OK

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "applicant"
}
```

#### Error Responses

**Validation Error (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "must be a valid email",
        "code": "INVALID_FORMAT"
      },
      {
        "field": "password",
        "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "code": "INVALID_FORMAT"
      }
    ],
    "correlationId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "retryable": false
  }
}
```

**Duplicate Email (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email address already exists",
    "details": [],
    "correlationId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "retryable": false
  }
}
```

### POST /auth/login

Authenticates a user and returns a JWT token.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Success Response (Enhanced Format)

**Status Code:** 200 OK

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "applicant",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "type": "applicant"
    }
  },
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Error Responses

**Invalid Credentials (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": [],
    "correlationId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "retryable": false
  }
}
```

## Feature Flags

The authentication routes behavior is controlled by the following feature flags:

### ENHANCED_ERROR_HANDLING
- **Default:** `false`
- **Description:** Enables enhanced error response format with standardized structure
- **Impact:** Changes response format from legacy to enhanced
- **Environment Variable:** `ENHANCED_ERROR_HANDLING=true`

### INPUT_VALIDATION
- **Default:** `false`
- **Description:** Enables Joi-based input validation and sanitization
- **Impact:** Validates all input data and sanitizes for security threats
- **Environment Variable:** `INPUT_VALIDATION=true`

### CORRELATION_TRACKING
- **Default:** `false`
- **Description:** Enables correlation ID tracking across requests
- **Impact:** Adds correlation IDs to requests and responses
- **Environment Variable:** `CORRELATION_TRACKING=true`

### STRUCTURED_LOGGING
- **Default:** `false`
- **Description:** Enables structured logging with Winston
- **Impact:** Logs all requests, responses, and errors in structured format
- **Environment Variable:** `STRUCTURED_LOGGING=true`

## Migration Guide

### Enabling Enhanced Features

1. **Start with validation only:**
   ```bash
   INPUT_VALIDATION=true npm start
   ```

2. **Add error handling:**
   ```bash
   INPUT_VALIDATION=true ENHANCED_ERROR_HANDLING=true npm start
   ```

3. **Enable full stack:**
   ```bash
   INPUT_VALIDATION=true \
   ENHANCED_ERROR_HANDLING=true \
   CORRELATION_TRACKING=true \
   STRUCTURED_LOGGING=true \
   npm start
   ```

### Client-Side Migration

**Detecting Enhanced Format:**
```javascript
function isEnhancedFormat(response) {
  return response.data.success !== undefined;
}

function extractToken(response) {
  if (isEnhancedFormat(response)) {
    return response.data.data.token;
  }
  return response.data.token;
}

function extractError(error) {
  if (error.response?.data?.error) {
    // Enhanced format
    return {
      message: error.response.data.error.message,
      code: error.response.data.error.code,
      details: error.response.data.error.details,
      correlationId: error.response.data.error.correlationId
    };
  }
  // Legacy format
  return {
    message: error.response?.data?.error || error.message
  };
}
```

## Testing

### Unit Tests

Run the authentication routes unit tests:
```bash
npm test -- authRoutes.test.js
```

### Manual Testing

Use the provided manual test script:
```bash
# Start MongoDB
mongod

# Start server with feature flags
ENHANCED_ERROR_HANDLING=true INPUT_VALIDATION=true npm start

# In another terminal, run manual tests
node test-auth-routes-manual.js
```

### Test Coverage

The authentication routes are covered by:
- **Unit tests:** Handler logic, error handling, feature flag behavior
- **Integration tests:** Middleware stack integration, validation, sanitization
- **Manual tests:** End-to-end flows with real server

## Security Considerations

### Input Sanitization
- All user input is sanitized to prevent XSS attacks
- SQL/NoSQL injection patterns are detected and blocked
- Threat detection logs security events for monitoring

### Password Security
- Passwords are validated for strength requirements
- Passwords are never logged or included in error responses
- Password hashing is handled by the User model

### Error Messages
- Error messages are user-friendly but don't expose security details
- Authentication failures use generic messages
- Detailed errors are logged server-side only

### Rate Limiting
- Consider implementing rate limiting for authentication endpoints
- Use the RATE_LIMITING feature flag when available
- Monitor failed login attempts for suspicious activity

## Troubleshooting

### Validation Errors Not Showing
- Ensure `INPUT_VALIDATION=true` is set
- Check that validation schemas are properly defined
- Verify Joi is installed: `npm install joi`

### Legacy Format Still Showing
- Ensure `ENHANCED_ERROR_HANDLING=true` is set
- Restart the server after changing environment variables
- Check feature flag configuration in logs

### Correlation IDs Missing
- Ensure `CORRELATION_TRACKING=true` is set
- Check that correlation middleware is applied before routes
- Verify UUID package is installed: `npm install uuid`

### Sanitization Not Working
- Ensure `INPUT_VALIDATION=true` is set (sanitization is part of validation)
- Check sanitization middleware is applied before validation
- Review sanitization logs for detected threats

## Performance Considerations

### Validation Overhead
- Joi validation adds ~1-5ms per request
- Validation is skipped when feature flag is disabled
- Consider caching compiled schemas for better performance

### Sanitization Impact
- Sanitization adds ~1-3ms per request
- Threat detection is optimized with regex patterns
- Large payloads may see higher overhead

### Logging Impact
- Structured logging adds ~2-5ms per request
- Async logging minimizes impact on response time
- Consider log levels in production (info/warn/error only)

## Related Documentation

- [Validation Middleware](../middleware/validation-README.md)
- [Error Handler Middleware](../middleware/errorHandler-README.md)
- [Logging Middleware](../middleware/winston-logging-README.md)
- [Migration Guide](../MIGRATION_GUIDE.md)
- [Feature Flags](../middleware/featureFlags.js)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the migration guide
3. Check existing tests for examples
4. Consult the middleware documentation
