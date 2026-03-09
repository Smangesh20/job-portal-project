# Error Handling and Validation Infrastructure

This directory contains the new error handling and validation infrastructure for the job portal application. The implementation follows a **non-breaking, incremental approach** that maintains full backward compatibility.

## Overview

The infrastructure provides:
- Centralized error handling with standardized responses
- **Comprehensive input validation and sanitization**
- **XSS, SQL injection, and NoSQL injection prevention**
- **Real-time threat detection and logging**
- Structured logging with correlation tracking
- Feature flags for gradual rollout
- Backward compatibility with existing code

## Architecture

```
middleware/
├── index.js                    # Main export file
├── featureFlags.js            # Feature flag configuration
├── correlation.js             # Correlation ID tracking
├── logging.js                # Structured logging
├── validation.js             # Input validation and sanitization
├── errorHandler.js           # Centralized error handling
├── integration.js            # Integration helpers
├── sanitization-README.md    # Detailed sanitization documentation
└── README.md                # This file

utils/
├── errorClasses.js           # Custom error classes
└── errorConstants.js         # Error codes and messages

config/
└── index.js                 # Configuration management

examples/
├── validation-integration.js  # Validation usage examples
└── sanitization-integration.js # Sanitization usage examples

tests/
├── validation.test.js        # Validation tests
├── sanitization.test.js      # Sanitization tests
└── validation.property.test.js # Property-based tests
```

## Feature Flags

All new functionality is controlled by feature flags in `.env`:

```bash
# Core features
ENHANCED_ERROR_HANDLING=false    # Standardized error responses
STRUCTURED_LOGGING=false         # JSON structured logging
INPUT_VALIDATION=false           # Request validation
CORRELATION_TRACKING=false       # Request correlation IDs

# Input sanitization features
ENHANCED_SANITIZATION=false      # Advanced sanitization features
THREAT_DETECTION=false          # Real-time threat detection
STRICT_SANITIZATION=false       # Strict mode (reject malicious requests)

# Advanced features
ERROR_ANALYTICS=false           # Error analytics (future)
RATE_LIMITING=false            # Rate limiting (future)
ENHANCED_AUTH_ERRORS=false     # Enhanced auth errors (future)
```

## Usage

### Basic Integration (Non-Breaking)

```javascript
const { applyEnhancedMiddleware, applyErrorHandling } = require('./middleware/integration');

// Apply new middleware (only if feature flags enabled)
applyEnhancedMiddleware(app);

// ... existing routes ...

// Apply error handling (after all routes)
applyErrorHandling(app);
```

### Route Enhancement

```javascript
const { enhanceRoute } = require('./middleware/integration');
const { validationSchemas } = require('./middleware/validation');

// Enhance existing route with validation
router.post('/jobs', 
  ...enhanceRoute(createJob, validationSchemas.jobCreation)
);
```

### Gradual Migration

```javascript
const { createMigrationWrapper } = require('./middleware/integration');

// Gradually migrate routes
router.post('/signup', createMigrationWrapper(
  '/signup',
  newSignupHandler,  // Enhanced handler
  oldSignupHandler   // Original handler
));
```

## Error Response Format

When `ENHANCED_ERROR_HANDLING=true`, all errors return standardized format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": [
      {
        "field": "email",
        "message": "Email is required",
        "code": "REQUIRED_FIELD"
      }
    ],
    "correlationId": "uuid-v4-string",
    "timestamp": "2024-01-15T10:30:00Z",
    "retryable": false
  }
}
```

When disabled, maintains existing error format for backward compatibility.

## Logging Format

When `STRUCTURED_LOGGING=true`, logs use JSON format:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "error",
  "message": "Error occurred",
  "correlationId": "uuid-v4-string",
  "error": {
    "message": "Database connection failed",
    "stack": "...",
    "code": "DATABASE_ERROR"
  },
  "request": {
    "method": "POST",
    "url": "/api/jobs",
    "userId": "user123"
  }
}
```

## Input Sanitization and Validation

### Comprehensive Security Protection

The middleware provides multi-layered protection against common security threats:

```javascript
const { sanitizeInput, createAdvancedSanitizer, validateRequest } = require('./middleware/validation');

// Basic sanitization (global protection)
app.use(sanitizeInput());

// Advanced sanitization with custom configuration
const advancedSanitizer = createAdvancedSanitizer({
  maxLength: 5000,
  strictMode: true,        // Reject malicious requests
  logThreats: true,        // Log security threats
  allowHtml: false,        // Block HTML content
  customPatterns: [        // Custom threat patterns
    { 
      pattern: /\b(admin|root)\b/gi, 
      type: 'PRIVILEGED_KEYWORD', 
      severity: 'MEDIUM' 
    }
  ],
  whitelist: ['description'], // Skip sanitization for these fields
  encoding: 'html'
});

app.post('/api/secure-endpoint', advancedSanitizer, (req, res) => {
  // Input is sanitized and threats are logged
  console.log('Threats detected:', req.sanitizationMeta.threatTypes);
});
```

### Validation with Sanitization

```javascript
const { sanitizeInput, validateRequest, authSchemas } = require('./middleware/validation');

// Sanitize first, then validate (recommended order)
app.post('/auth/signup',
  sanitizeInput(),                    // Remove security threats
  validateRequest(authSchemas.signup), // Validate data structure
  (req, res) => {
    // Input is both sanitized and validated
  }
);
```

### Threat Detection

The system automatically detects and logs various security threats:

- **XSS Attacks**: Script tags, event handlers, dangerous protocols
- **SQL Injection**: SQL keywords, injection characters
- **NoSQL Injection**: MongoDB operators and patterns
- **Command Injection**: Command execution attempts
- **Path Traversal**: Directory traversal attacks
- **LDAP Injection**: LDAP query manipulation
- **XML Injection**: XML entity attacks

### Legacy Validation Support

Basic validation is still supported for backward compatibility:

```javascript
const { BasicValidator } = require('./middleware/validation');

const schema = new BasicValidator()
  .addRule('email', { required: true, type: 'string', email: true })
  .addRule('password', { required: true, type: 'string', minLength: 8 });
```

## Error Classes

Custom error classes for consistent error handling:

```javascript
const { ValidationError, AuthenticationError } = require('./utils/errorClasses');

// Throw structured errors
throw new ValidationError('Invalid input', [
  { field: 'email', message: 'Email is required', code: 'REQUIRED_FIELD' }
]);
```

## Migration Strategy

1. **Phase 1**: Infrastructure setup (current)
   - Install dependencies
   - Create middleware structure
   - Set up feature flags

2. **Phase 2**: Gradual enablement
   - Enable features one by one
   - Test with existing functionality
   - Monitor for issues

3. **Phase 3**: Route migration
   - Update routes individually
   - Maintain backward compatibility
   - Full rollback capability

## Rollback Plan

If issues arise:

1. Disable feature flags in `.env`
2. Restart application
3. All functionality reverts to original behavior
4. No code changes required

## Testing

The infrastructure includes comprehensive testing:
- Unit tests for each middleware component
- Property-based tests for validation
- Integration tests for complete flows
- Backward compatibility tests

## Dependencies

New dependencies added to `package.json`:
- `joi`: Schema validation
- `winston`: Structured logging
- `correlation-id`: Request correlation
- `express-rate-limit`: Rate limiting
- `helmet`: Security headers

All dependencies are optional and gracefully degrade if not available.

## Security Considerations

The enhanced security features provide comprehensive protection:

### Input Sanitization
- **XSS Prevention**: Removes script tags, event handlers, dangerous protocols
- **Injection Protection**: Blocks SQL, NoSQL, command, and LDAP injection attempts
- **Path Traversal Prevention**: Prevents directory traversal attacks
- **HTML Entity Encoding**: Safely encodes dangerous characters
- **Length Limits**: Prevents DoS attacks through oversized inputs

### Threat Detection and Logging
- **Real-time Monitoring**: Detects and logs security threats as they occur
- **Severity Classification**: Categorizes threats by severity level
- **Pattern Matching**: Uses comprehensive regex patterns for attack detection
- **Custom Patterns**: Supports application-specific threat detection
- **Correlation Tracking**: Links threats to specific requests for investigation

### Security Best Practices
- Sensitive data excluded from logs
- Error messages don't leak system information
- Rate limiting prevents abuse (when enabled)
- Security headers added via Helmet
- Feature flag control for gradual security rollout
- Strict mode for high-security endpoints

## Performance Impact

- Minimal overhead when features disabled
- Efficient correlation ID generation
- Asynchronous logging to prevent blocking
- Optimized validation with caching
- Memory-efficient error handling

## Future Enhancements

Planned features (controlled by feature flags):
- Advanced error analytics
- Real-time monitoring dashboard
- OAuth integration
- Enhanced file validation
- Database resilience improvements
- SMS and email verification
- Predictive error analysis

## Support

For issues or questions:
1. Check feature flag configuration
2. Review logs for correlation IDs
3. Test with features disabled
4. Consult error constants and classes
5. Use integration helpers for migration