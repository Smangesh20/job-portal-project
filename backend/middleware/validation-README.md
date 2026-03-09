# Joi Validation Middleware

This document describes the comprehensive Joi-based validation middleware system implemented for the job portal application.

## Overview

The validation middleware provides:
- **Comprehensive input validation** using Joi schemas
- **Input sanitization** to prevent XSS and injection attacks
- **File upload validation** with security checks
- **Field-level error messages** with specific error codes
- **Backward compatibility** with existing code
- **Feature flag integration** for gradual rollout

## Features

### ✅ Comprehensive Validation Schemas

Pre-built schemas for all API endpoints:

- **Authentication**: Signup, login with password strength validation
- **Jobs**: Creation, updates, search queries with business rule validation
- **Applications**: Creation, status updates with proper constraints
- **User Profiles**: Profile updates with data validation
- **File Uploads**: Resume and profile image validation
- **Parameters**: ObjectId and filename validation

### ✅ Advanced Input Sanitization

- Removes script tags and dangerous HTML
- Strips JavaScript protocols and event handlers
- Prevents XSS and injection attacks
- Handles nested objects and arrays
- Sanitizes query parameters and URL params

### ✅ File Upload Security

- File size validation with configurable limits
- MIME type and extension validation
- Suspicious filename detection
- Malware extension blocking
- Content validation beyond extensions

### ✅ Field-Level Error Messages

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
        "code": "INVALID_FORMAT",
        "value": "invalid-email"
      },
      {
        "field": "password",
        "message": "must be at least 8 characters long",
        "code": "INVALID_LENGTH"
      }
    ],
    "correlationId": "uuid-v4-string",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Usage

### Basic Validation

```javascript
const { validateBody, sanitizeInput, authSchemas } = require('./middleware/validation');

router.post('/auth/signup',
  sanitizeInput,                    // Sanitize first
  validateBody(authSchemas.signup), // Then validate
  (req, res) => {
    // req.body is now validated and sanitized
    const { email, password, type, name } = req.body;
    // ... your logic
  }
);
```

### Query Parameter Validation

```javascript
const { validateQuery, jobSchemas } = require('./middleware/validation');

router.get('/api/jobs',
  sanitizeInput,
  validateQuery(jobSchemas.query),
  (req, res) => {
    // req.query is validated with proper types
    const { page, limit, jobType, salary } = req.query;
    // page and limit are converted to numbers
  }
);
```

### File Upload Validation

```javascript
const { fileValidators } = require('./middleware/validation');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload/resume',
  upload.single('file'),
  fileValidators.resume,  // Validates PDF, max 5MB
  (req, res) => {
    // File is validated for type, size, and security
    const file = req.file;
  }
);
```

### Endpoint-Based Validation

```javascript
const { createEndpointValidator } = require('./middleware/validation');

// Automatically selects schema based on method and path
router.post('/auth/login',
  sanitizeInput,
  createEndpointValidator('POST', '/auth/login'),
  (req, res) => {
    // Uses predefined schema for this endpoint
  }
);
```

## Available Schemas

### Authentication Schemas

- `authSchemas.signup` - User registration validation
- `authSchemas.login` - Login credential validation

### Job Management Schemas

- `jobSchemas.create` - Job creation with all required fields
- `jobSchemas.update` - Job updates (partial validation)
- `jobSchemas.query` - Job search parameters

### Application Schemas

- `applicationSchemas.create` - Application submission
- `applicationSchemas.update` - Status updates
- `applicationSchemas.query` - Application queries

### User Profile Schemas

- `userSchemas.update` - Profile updates

### File Validation

- `fileValidators.resume` - PDF resume validation (5MB max)
- `fileValidators.profile` - Image profile validation (2MB max)

## Validation Rules

### Common Patterns

- **Email**: Valid format, trimmed, lowercase
- **Password**: Min 8 chars, uppercase, lowercase, number
- **ObjectId**: Valid MongoDB ObjectId format
- **Phone**: International phone number format
- **Dates**: ISO date format, future dates for deadlines

### Business Rules

- **Job Applications**: Max 1000 applicants, max 100 positions
- **Skills**: Max 20 skills per user/job, 1-50 chars each
- **File Sizes**: Resume 5MB max, profile images 2MB max
- **Text Limits**: Descriptions 2000 chars, bios 500 chars

### Security Rules

- **Input Sanitization**: Removes scripts, iframes, dangerous protocols
- **File Security**: Blocks executable extensions, suspicious names
- **Length Limits**: Prevents DoS with oversized inputs
- **Type Validation**: Ensures proper data types

## Error Codes

The middleware uses standardized error codes:

- `REQUIRED_FIELD` - Missing required field
- `INVALID_FORMAT` - Invalid format (email, phone, etc.)
- `INVALID_LENGTH` - String too short/long, number out of range
- `INVALID_TYPE` - Wrong data type
- `FILE_TOO_LARGE` - File exceeds size limit
- `INVALID_FILE_TYPE` - Unsupported file type
- `FILE_CORRUPTED` - Suspicious file content

## Feature Flags

All validation respects the `INPUT_VALIDATION` feature flag:

```javascript
// Enable validation
process.env.INPUT_VALIDATION = 'true';

// Disable validation (validation is skipped)
process.env.INPUT_VALIDATION = 'false';
```

## Integration with Existing Code

### Backward Compatibility

The middleware maintains full backward compatibility:

- Existing routes work without changes
- Legacy validation schemas are preserved
- Feature flags allow gradual rollout
- No breaking changes to API contracts

### Migration Strategy

1. **Add validation to new routes** immediately
2. **Gradually add to existing routes** with feature flags
3. **Test thoroughly** before enabling in production
4. **Monitor error rates** during rollout

### Example Migration

```javascript
// Before (existing route)
router.post('/api/jobs', jwtAuth, (req, res) => {
  // No validation
  const jobData = req.body;
  // ... create job
});

// After (with validation)
router.post('/api/jobs', 
  sanitizeInput,                    // Add sanitization
  validateBody(jobSchemas.create),  // Add validation
  jwtAuth,                          // Keep existing middleware
  (req, res) => {
    // Now req.body is validated and sanitized
    const jobData = req.body;
    // ... create job (same logic)
  }
);
```

## Performance Considerations

- **Schema Compilation**: Joi schemas are compiled once and reused
- **Async Validation**: Uses async/await for non-blocking validation
- **Sanitization**: Efficient recursive sanitization
- **Memory Usage**: Schemas are cached, not recreated per request
- **Error Handling**: Fast-fail validation with detailed error reporting

## Security Features

### XSS Prevention
- Removes `<script>`, `<iframe>`, `<object>` tags
- Strips `javascript:` and `data:` protocols
- Removes event handlers (`onclick`, etc.)
- Sanitizes CSS expressions

### Injection Prevention
- Input length limits prevent DoS
- Type validation prevents type confusion
- File extension validation prevents code execution
- Recursive sanitization handles nested attacks

### File Upload Security
- MIME type validation
- File extension whitelist
- Suspicious filename detection
- Size limits prevent storage DoS
- Content validation beyond extensions

## Testing

The validation middleware includes comprehensive tests:

```bash
# Run validation tests
npm test validation.test.js

# Run manual validation test
node test-validation.js
```

Test coverage includes:
- Valid input acceptance
- Invalid input rejection
- Sanitization effectiveness
- File validation security
- Error message accuracy
- Feature flag behavior

## Troubleshooting

### Common Issues

1. **Validation Not Running**
   - Check `INPUT_VALIDATION` feature flag is enabled
   - Ensure middleware is added before route handler
   - Verify schema is correctly imported

2. **Unexpected Validation Errors**
   - Check field names match schema exactly
   - Verify data types (strings vs numbers)
   - Ensure required fields are provided

3. **File Upload Failures**
   - Check file size limits
   - Verify MIME type is allowed
   - Ensure file extension is whitelisted

### Debug Mode

Enable debug logging:

```javascript
process.env.NODE_ENV = 'development';
// Validation errors include stack traces in development
```

## Future Enhancements

Planned improvements:
- **Custom validation rules** for business logic
- **Async validation** for database checks
- **Conditional schemas** based on user roles
- **Performance monitoring** for validation overhead
- **Schema versioning** for API evolution

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 1.1**: ✅ Comprehensive input validation on all API endpoints
- **Requirement 1.2**: ✅ Field-level error messages for invalid data
- **Requirement 1.3**: ✅ Input sanitization for security
- **Requirement 1.4**: ✅ File upload validation for type, size, and content
- **Requirement 1.5**: ✅ Validation error logging with request details

The middleware provides a robust, secure, and maintainable validation system that enhances both security and user experience while maintaining full backward compatibility.