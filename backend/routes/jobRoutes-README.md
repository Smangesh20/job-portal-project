# Job Management Routes - Enhanced Error Handling and Validation

## Overview

The job management routes have been enhanced with comprehensive input validation, sanitization, and error handling middleware while maintaining backward compatibility with existing clients.

## Changes Made

### 1. Middleware Integration

All job-related routes now include:
- **Input Sanitization**: Removes malicious content (XSS, injection attempts)
- **Schema Validation**: Validates request data against Joi schemas
- **Error Handling**: Standardized error responses with correlation IDs
- **Async Error Handling**: Proper async/await error propagation

### 2. Updated Routes

#### POST /api/jobs - Create Job
- **Middleware**: `jwtAuth`, `sanitizeInput()`, `validateBody(jobSchemas.create)`
- **Validation**: 
  - Title: 3-100 characters
  - maxApplicants: 1-1000
  - maxPositions: 1-100
  - deadline: Must be in future
  - skillsets: 1-20 items
  - jobType: 'full-time', 'part-time', 'contract', 'internship'
  - salary: 0-10,000,000
- **Error Responses**:
  - 400: Validation errors with field-level details
  - 403: Authorization error (non-recruiter)
  - 500: Server errors

#### GET /api/jobs - List Jobs
- **Middleware**: `jwtAuth`, `sanitizeInput()`, `validateQuery(jobSchemas.query)`
- **Query Parameters**:
  - `q`: Search query (sanitized)
  - `jobType`: Filter by job type
  - `salaryMin`, `salaryMax`: Salary range
  - `duration`: Maximum duration
  - `myjobs`: Show only user's jobs (recruiter)
  - `page`, `limit`: Pagination (defaults: page=1, limit=10)
  - `asc`, `desc`: Sorting fields
- **Response**: Returns empty array with message if no jobs found (instead of 404)

#### GET /api/jobs/:id - Get Single Job
- **Middleware**: `jwtAuth`, `validateParams(paramSchemas.objectId)`
- **Validation**: MongoDB ObjectId format
- **Error Responses**:
  - 400: Invalid ID format
  - 404: Job not found

#### PUT /api/jobs/:id - Update Job
- **Middleware**: `jwtAuth`, `sanitizeInput()`, `validateParams(paramSchemas.objectId)`, `validateBody(jobSchemas.update)`
- **Validation**: At least one field required, same constraints as create
- **Error Responses**:
  - 400: Validation errors
  - 403: Authorization error (non-recruiter or not owner)
  - 404: Job not found

#### DELETE /api/jobs/:id - Delete Job
- **Middleware**: `jwtAuth`, `validateParams(paramSchemas.objectId)`
- **Error Responses**:
  - 400: Invalid ID format
  - 403: Authorization error (non-recruiter or not owner)
  - 404: Job not found

### 3. Error Response Format

#### Enhanced Format (when ENHANCED_ERROR_HANDLING feature flag is enabled)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 3 characters",
        "code": "INVALID_LENGTH",
        "value": "AB"
      }
    ],
    "correlationId": "uuid-v4-string",
    "timestamp": "2024-01-15T10:30:00Z",
    "retryable": false
  }
}
```

#### Legacy Format (backward compatible)

```json
{
  "message": "Error message"
}
```

### 4. Success Response Format

#### Enhanced Format (when ENHANCED_ERROR_HANDLING feature flag is enabled)

```json
{
  "success": true,
  "message": "Job added successfully",
  "data": { "jobId": "507f1f77bcf86cd799439011" },
  "correlationId": "uuid-v4-string"
}
```

#### Legacy Format (backward compatible)

```json
{
  "message": "Job added successfully"
}
```

## Feature Flags

The enhanced error handling is controlled by feature flags:

- `INPUT_VALIDATION`: Enables validation and sanitization middleware
- `ENHANCED_ERROR_HANDLING`: Enables enhanced response format

Set these in environment variables:
```bash
INPUT_VALIDATION=true
ENHANCED_ERROR_HANDLING=true
```

## Backward Compatibility

All changes maintain backward compatibility:
- Legacy response format used when feature flags are disabled
- Existing clients continue to work without modifications
- Gradual migration path for frontend updates

## Security Improvements

### Input Sanitization
- XSS prevention: Removes script tags, event handlers
- SQL/NoSQL injection prevention: Sanitizes special characters
- Path traversal prevention: Removes directory traversal patterns
- HTML encoding: Encodes dangerous characters

### Validation
- Type checking: Ensures correct data types
- Range validation: Enforces min/max constraints
- Format validation: Validates dates, IDs, enums
- Required field checking: Ensures all required data present

## Testing

### Integration Tests
Run integration tests to verify middleware integration:
```bash
npm test -- jobRoutes.integration.test.js
```

Tests cover:
- Schema validation rules
- Error class creation
- Feature flag integration
- Middleware availability
- Validation constraints

### Manual Testing
Use the provided test scripts:
```bash
# Test job creation
node test-job-routes-manual.js
```

## Migration Guide

### For Frontend Developers

1. **Check for Enhanced Format**: Look for `success` field in response
2. **Handle Validation Errors**: Parse `error.details` array for field-level errors
3. **Use Correlation IDs**: Include in bug reports for easier debugging
4. **Check Retryable Flag**: Implement retry logic for retryable errors

### Example Error Handling

```javascript
try {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });
  
  const data = await response.json();
  
  if (data.success === false) {
    // Enhanced error format
    if (data.error.details) {
      // Show field-level errors
      data.error.details.forEach(detail => {
        showFieldError(detail.field, detail.message);
      });
    } else {
      // Show general error
      showError(data.error.message);
    }
    
    // Log correlation ID for debugging
    console.error('Error correlation ID:', data.error.correlationId);
    
    // Retry if retryable
    if (data.error.retryable) {
      setTimeout(() => retryRequest(), 1000);
    }
  } else {
    // Success
    showSuccess(data.message);
  }
} catch (error) {
  // Network error
  showError('Network error occurred');
}
```

## Dependencies

- `joi`: Schema validation
- `express`: Web framework
- `mongoose`: MongoDB ODM
- Feature flags middleware
- Error handler middleware
- Validation middleware
- Sanitization middleware

## Related Files

- `/middleware/validation.js`: Validation schemas and middleware
- `/middleware/errorHandler.js`: Error handling middleware
- `/middleware/featureFlags.js`: Feature flag configuration
- `/utils/errorClasses.js`: Custom error classes
- `/utils/errorConstants.js`: Error codes and messages
- `/tests/jobRoutes.integration.test.js`: Integration tests

## Future Enhancements

- Rate limiting per user/IP
- Advanced search with full-text indexing
- Job recommendation based on user profile
- Bulk operations (create/update/delete multiple jobs)
- Job versioning and history
- Advanced analytics and reporting

## Support

For issues or questions:
1. Check correlation ID in error response
2. Review validation error details
3. Verify feature flags are enabled
4. Check middleware configuration
5. Review integration test results
