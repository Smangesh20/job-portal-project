# JWT Authentication Error Handling

## Overview

Enhanced JWT authentication middleware with comprehensive error handling that provides specific error codes for different token scenarios, secure error messages, and permission-based error explanations.

## Features

- **Specific Error Codes**: Different error codes for expired, invalid, malformed, and missing tokens
- **Secure Error Messages**: User-friendly messages that don't expose security details
- **Permission-Based Errors**: Clear explanations for authorization failures
- **Standardized Format**: All errors follow the application's standard error response format
- **Actionable Guidance**: Error responses include suggested actions for recovery

## Error Types

### Token Expired (`TOKEN_EXPIRED`)
**Scenario**: JWT token has expired
**Status Code**: 401
**Message**: "Your session has expired. Please log in again."
**Action**: `redirect_to_login`

### Token Invalid (`TOKEN_INVALID`)
**Scenario**: Generic JWT validation failure
**Status Code**: 401
**Message**: "Invalid authentication token."
**Action**: `redirect_to_login`

### Token Malformed (`TOKEN_MALFORMED`)
**Scenario**: JWT token structure is invalid
**Status Code**: 401
**Message**: "Authentication token is malformed or improperly formatted."
**Action**: `redirect_to_login`

### Token Signature Invalid (`TOKEN_SIGNATURE_INVALID`)
**Scenario**: JWT signature verification failed
**Status Code**: 401
**Message**: "Authentication token signature is invalid."
**Action**: `redirect_to_login`

### Token Missing (`TOKEN_MISSING`)
**Scenario**: No authentication token provided
**Status Code**: 401
**Message**: "Authentication token is required."
**Action**: `provide_token`
**Hint**: "Include a valid JWT token in the Authorization header"

### Token User Not Found (`TOKEN_USER_NOT_FOUND`)
**Scenario**: User associated with token no longer exists
**Status Code**: 401
**Message**: "The user associated with this token no longer exists."
**Action**: `redirect_to_login`

## Usage

### Basic Usage

```javascript
const jwtAuth = require('../lib/jwtAuth');

// Protect a route with JWT authentication
router.get('/protected', jwtAuth, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### Error Response Format

When authentication fails, the error handler will return:

```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Your session has expired. Please log in again.",
    "details": [
      {
        "field": "token",
        "message": "Please log in again to continue",
        "code": "TOKEN_EXPIRED",
        "action": "redirect_to_login"
      }
    ],
    "correlationId": "uuid-v4-string",
    "timestamp": "2024-01-15T10:30:00Z",
    "retryable": false
  }
}
```

### Legacy Mode

When `ENHANCED_ERROR_HANDLING` feature flag is disabled, errors return in legacy format:

```json
{
  "error": "Your session has expired. Please log in again.",
  "action": "redirect_to_login"
}
```

## Frontend Integration

### Handling Authentication Errors

```javascript
// API client interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const errorCode = error.response.data.error?.code;
      
      switch (errorCode) {
        case 'TOKEN_EXPIRED':
        case 'TOKEN_USER_NOT_FOUND':
        case 'TOKEN_REVOKED':
          // Redirect to login
          window.location.href = '/login';
          break;
          
        case 'TOKEN_MISSING':
          // Prompt for authentication
          showLoginModal();
          break;
          
        default:
          // Show generic error
          showError('Authentication failed. Please try again.');
      }
    }
    return Promise.reject(error);
  }
);
```

### Automatic Token Refresh

```javascript
// Check for token expiration before requests
axios.interceptors.request.use(async config => {
  const token = getStoredToken();
  
  if (token && isTokenExpiringSoon(token)) {
    try {
      const newToken = await refreshToken();
      config.headers.Authorization = `Bearer ${newToken}`;
    } catch (error) {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      return Promise.reject(error);
    }
  }
  
  return config;
});
```

## Security Considerations

### What Error Messages DON'T Expose

- Database structure or queries
- Internal system details
- User existence (for security-sensitive operations)
- Secret keys or tokens
- Stack traces (in production)

### What Error Messages DO Provide

- Clear indication of what went wrong
- Actionable steps for recovery
- User-friendly language
- Appropriate HTTP status codes

## Testing

### Unit Tests

```bash
npm test -- jwtAuth.test.js
```

Tests cover:
- Token expired scenarios
- Invalid token formats
- Missing tokens
- User not found cases
- Successful authentication
- System error propagation

### Property-Based Tests

```bash
npm test -- jwtAuth.property.test.js
```

Properties verified:
- All authentication failures produce AuthenticationError instances
- Each JWT error type maps to a specific error code
- Error messages are user-friendly and secure
- Successful authentication always attaches user to request
- System errors are passed through without modification
- All authentication errors have consistent structure
- Token type detection is deterministic

## Configuration

### Feature Flags

Enable enhanced error handling in your configuration:

```javascript
// config/featureFlags.js
module.exports = {
  ENHANCED_ERROR_HANDLING: true,
  STRUCTURED_LOGGING: true
};
```

### JWT Configuration

Configure JWT settings in `lib/authKeys.js`:

```javascript
module.exports = {
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: '24h' // Token expiration time
};
```

## Migration Guide

### From Legacy Authentication

If you're migrating from the old authentication system:

1. **No code changes required** - The middleware is backward compatible
2. **Enable feature flags** - Turn on `ENHANCED_ERROR_HANDLING` when ready
3. **Update frontend** - Gradually update frontend to handle new error format
4. **Monitor logs** - Check for any authentication issues during migration

### Gradual Rollout

```javascript
// Use feature flags for gradual rollout
const useEnhancedAuth = featureFlags.isEnabled('ENHANCED_ERROR_HANDLING');

if (useEnhancedAuth) {
  // New error handling
} else {
  // Legacy error handling
}
```

## Troubleshooting

### Common Issues

**Issue**: "Token signature is invalid"
**Solution**: Verify JWT_SECRET_KEY matches between token generation and verification

**Issue**: "Token user not found"
**Solution**: User may have been deleted. Clear client-side tokens and redirect to login

**Issue**: "Token malformed"
**Solution**: Check token format. Should be: `Bearer <token>`

### Debug Mode

Enable debug logging:

```javascript
// Set environment variable
DEBUG=jwt:* npm start

// Or in code
process.env.DEBUG = 'jwt:*';
```

## Related Documentation

- [Error Handler Middleware](./errorHandler-README.md)
- [Error Constants](../utils/errorConstants.js)
- [Error Classes](../utils/errorClasses.js)
- [Migration Guide](../MIGRATION_GUIDE.md)

## Requirements Validation

This implementation validates:
- **Requirement 2.4**: Authentication errors return specific error codes
- **Requirement 6.1**: JWT tokens invalid or expired return specific error codes
- **Requirement 6.2**: Users lacking permissions receive clear explanations
- **Requirement 6.3**: Login failures provide appropriate feedback without revealing security details
