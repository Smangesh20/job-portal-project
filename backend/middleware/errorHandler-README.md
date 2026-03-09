# Enhanced Error Handler Middleware

## Overview

The enhanced error handler middleware provides centralized error processing with standardized response formats, comprehensive error classification, and correlation ID tracking. This implementation fulfills Requirements 2.1, 2.2, and 2.5 from the error handling specification.

## Key Features

### 1. Standardized Error Response Format

All errors are returned in a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": [
      {
        "field": "fieldName",
        "message": "Field-specific error message",
        "code": "FIELD_ERROR_CODE"
      }
    ],
    "correlationId": "uuid-v4-string",
    "timestamp": "2024-01-15T10:30:00Z",
    "retryable": false
  }
}
```

### 2. Comprehensive Error Classification

The middleware handles all error types with appropriate HTTP status codes and error codes:

- **ValidationError** (400): Input validation failures with field-level details
- **AuthenticationError** (401): Authentication failures with specific auth type codes
- **AuthorizationError** (403): Permission failures with required permission details
- **NotFoundError** (404): Resource not found with resource type classification
- **ConflictError** (409): Resource conflicts with conflict type details
- **FileUploadError** (400): File upload failures with size and type requirements
- **RateLimitError** (429): Rate limiting with retry-after information
- **ExternalServiceError** (502): External service failures with service identification
- **DatabaseError** (500): Database failures with operation context

### 3. Correlation ID Integration

- Automatically includes correlation IDs in all error responses
- Supports existing correlation IDs from request headers
- Generates fallback correlation IDs when none available
- Enables end-to-end request tracking across system components

### 4. Enhanced Error Details

#### Validation Errors
```json
{
  "details": [
    {
      "field": "email",
      "message": "Email is required",
      "code": "REQUIRED_FIELD",
      "value": "invalid-email"
    }
  ]
}
```

#### Authentication Errors
- Specific error codes: `TOKEN_EXPIRED`, `TOKEN_INVALID`, `TOKEN_MISSING`, `INVALID_CREDENTIALS`
- Auth type classification for different authentication methods

#### Authorization Errors
```json
{
  "details": [
    {
      "field": "permission",
      "message": "Required permission: admin",
      "code": "MISSING_PERMISSION"
    }
  ]
}
```

#### File Upload Errors
```json
{
  "details": [
    {
      "field": "fileType",
      "message": "Expected file type: image/jpeg",
      "code": "INVALID_FILE_TYPE"
    },
    {
      "field": "fileSize",
      "message": "Maximum file size: 5000000 bytes",
      "code": "FILE_TOO_LARGE"
    }
  ]
}
```

#### Rate Limit Errors
```json
{
  "details": [
    {
      "field": "retryAfter",
      "message": "Retry after 60 seconds",
      "code": "RETRY_AFTER"
    }
  ]
}
```

### 5. Retryability Logic

The middleware intelligently determines if errors are retryable:

- **Retryable**: Server errors (5xx), rate limits (429), external service errors
- **Not Retryable**: Client errors (4xx), validation failures, authentication/authorization errors

### 6. Development vs Production Modes

#### Development Mode
- Includes stack traces in error responses
- Adds request context (method, URL, user agent, IP)
- Provides detailed error information for debugging

#### Production Mode
- Excludes stack traces for security
- Uses user-friendly error messages
- Hides sensitive technical details

### 7. Backward Compatibility

The middleware maintains backward compatibility through feature flags:

- **Enhanced Mode**: Full standardized error format with all features
- **Legacy Mode**: Maintains existing error response format for gradual migration

## Usage Examples

### Basic Error Handling
```javascript
const { errorHandler, asyncHandler } = require('./middleware/errorHandler');

// Use in Express app
app.use(errorHandler);

// Wrap async route handlers
app.post('/api/jobs', asyncHandler(async (req, res) => {
  // Route logic that may throw errors
}));
```

### Throwing Specific Errors
```javascript
const { ValidationError, NotFoundError } = require('../utils/errorClasses');

// Validation error with field details
throw new ValidationError('Validation failed', [
  { field: 'email', message: 'Email is required', code: 'REQUIRED_FIELD' }
]);

// Not found error with resource type
throw new NotFoundError('Job not found', 'job');

// Authentication error with auth type
throw new AuthenticationError('Token expired', 'token_expired');
```

### Database Error Translation

The middleware automatically translates MongoDB errors:

```javascript
// MongoDB duplicate key error becomes:
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email address already exists"
  }
}

// Mongoose validation error becomes:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Email is required",
        "code": "REQUIRED_FIELD"
      }
    ]
  }
}
```

## Integration with Other Middleware

### Correlation Middleware
```javascript
const { correlationId } = require('./middleware/correlation');
const { errorHandler } = require('./middleware/errorHandler');

app.use(correlationId);  // Must come before error handler
app.use(errorHandler);   // Should be last middleware
```

### Validation Middleware
```javascript
const { validateRequest } = require('./middleware/validation');
const { errorHandler } = require('./middleware/errorHandler');

app.post('/api/jobs', 
  validateRequest(jobSchema),  // Throws ValidationError
  createJobHandler,
  errorHandler                 // Catches and formats errors
);
```

## Property-Based Testing

The error handler is validated with comprehensive property-based tests that verify:

- **Property 4.1**: All error types produce standardized response format
- **Property 4.2**: MongoDB errors are translated to standardized format  
- **Property 4.3**: Error responses maintain consistency across feature flag states
- **Property 4.4**: Not found handler produces consistent format
- **Property 4.5**: Async handler properly catches and forwards errors
- **Property 4.6**: Error handler respects headersSent to prevent double responses
- **Property 4.7**: Error responses exclude stack traces in production

## Configuration

### Feature Flags
- `ENHANCED_ERROR_HANDLING`: Enable/disable enhanced error format
- `CORRELATION_TRACKING`: Enable/disable correlation ID tracking
- `STRUCTURED_LOGGING`: Enable/disable structured error logging

### Environment Variables
- `NODE_ENV`: Controls stack trace inclusion and error detail level

## Security Considerations

1. **Sensitive Data Exclusion**: Stack traces and sensitive details excluded in production
2. **Error Message Sanitization**: User-friendly messages prevent information leakage
3. **Correlation ID Safety**: Correlation IDs are UUIDs, not exposing system internals
4. **Request Context Filtering**: Only safe request information included in development mode

## Performance Impact

- **Minimal Overhead**: Error classification adds negligible processing time
- **Efficient Correlation**: Correlation ID generation uses fast UUID library
- **Lazy Evaluation**: Complex error details only generated when needed
- **Memory Efficient**: No memory leaks from error object retention

## Migration Guide

### From Legacy Error Handling

1. **Enable Feature Flag**: Set `ENHANCED_ERROR_HANDLING=true`
2. **Update Client Code**: Modify frontend to handle new error format
3. **Test Thoroughly**: Verify all error scenarios work correctly
4. **Gradual Rollout**: Use feature flags for gradual migration

### Error Format Changes

**Before (Legacy)**:
```json
{
  "error": "Validation failed"
}
```

**After (Enhanced)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [...],
    "correlationId": "uuid",
    "timestamp": "ISO-string",
    "retryable": false
  }
}
```

## Troubleshooting

### Common Issues

1. **Missing Correlation IDs**: Ensure correlation middleware is installed before error handler
2. **Stack Traces in Production**: Check `NODE_ENV` environment variable
3. **Legacy Format**: Verify `ENHANCED_ERROR_HANDLING` feature flag is enabled
4. **Double Responses**: Error handler checks `res.headersSent` to prevent this

### Debugging

Enable debug logging to trace error handling:

```javascript
process.env.DEBUG = 'error-handler:*';
```

## Future Enhancements

1. **Error Analytics**: Integration with monitoring services
2. **Custom Error Codes**: Support for application-specific error codes
3. **Internationalization**: Multi-language error messages
4. **Error Recovery**: Automatic retry mechanisms for retryable errors