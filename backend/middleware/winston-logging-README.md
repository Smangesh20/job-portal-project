# Winston Logger Implementation

This document describes the enhanced Winston logger implementation for structured logging, correlation ID tracking, and log sanitization.

## Overview

The Winston logger provides comprehensive logging capabilities with:

- **Structured JSON logging** for production environments
- **Human-readable logging** for development
- **Automatic correlation ID tracking** across requests
- **Sensitive data sanitization** to prevent data leaks
- **Error severity classification** for better monitoring
- **Performance and security event logging**
- **Child loggers** with contextual information

## Features

### 1. Structured Logging

The logger outputs structured JSON logs in production and human-readable logs in development:

```javascript
// Production output (JSON)
{
  "timestamp": "2024-01-15 10:30:45.123",
  "level": "info",
  "message": "User login successful",
  "correlationId": "uuid-v4-string",
  "userId": "user123",
  "operation": "auth.login"
}

// Development output (readable)
10:30:45.123 [uuid-v4-string] info: User login successful
{
  "userId": "user123",
  "operation": "auth.login"
}
```

### 2. Correlation ID Tracking

Every log entry includes a correlation ID that tracks requests across the system:

```javascript
const requestLogger = logger.withRequest(req);
requestLogger.info('Processing request'); // Automatically includes correlation ID
```

### 3. Sensitive Data Sanitization

The logger automatically removes sensitive information from logs:

```javascript
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret123',
  token: 'jwt-token-here'
};

logger.info('User data', { userData });
// Output: { name: 'John Doe', email: 'john@example.com', password: '[REDACTED]', token: '[REDACTED]' }
```

**Sanitized Fields:**
- `password`, `passwd`, `pass`
- `token`, `jwt`, `bearer`
- `secret`, `key`, `apikey`, `api_key`
- `authorization`, `cookie`
- `client_secret`, `refresh_token`, `access_token`
- `ssn`, `social_security`, `credit_card`, `cvv`
- `pin`, `otp`, `verification_code`

**String Pattern Sanitization:**
- JWT tokens: `eyJ...` → `[JWT_TOKEN]`
- Bearer tokens: `Bearer abc123` → `Bearer [TOKEN]`
- Basic auth: `Basic dXNlcm5hbWU6cGFzc3dvcmQ=` → `Basic [CREDENTIALS]`
- Long API keys (32+ chars) → `[API_KEY]`

### 4. Error Severity Classification

Errors are automatically classified by severity:

- **Critical**: Database connection failures, memory issues
- **High**: 5xx server errors
- **Medium**: Authentication/authorization errors, unknown errors
- **Low**: 4xx client errors

```javascript
const severity = getErrorSeverity(error);
// Returns: 'critical', 'high', 'medium', or 'low'
```

### 5. Performance Logging

Track operation performance with dedicated logging:

```javascript
logPerformance('database.query', 150, {
  query: 'SELECT * FROM users',
  cacheHit: false
});
```

### 6. Security Event Logging

Log security-related events with severity levels:

```javascript
logSecurityEvent('failed_login_attempt', 'medium', {
  userId: 'user123',
  ip: '192.168.1.1',
  attempts: 3
});
```

### 7. Child Loggers

Create specialized loggers with additional context:

```javascript
const authLogger = createChildLogger({ 
  component: 'auth', 
  version: '1.0' 
});

authLogger.info('Authentication successful'); 
// Includes component and version in all log entries
```

## Usage

### Basic Logging

```javascript
const { logger } = require('./middleware/logging');

logger.info('Application started');
logger.warn('Configuration missing', { config: 'database.url' });
logger.error('Database connection failed', { error: err.message });
logger.debug('Debug information', { data: debugData });
```

### Request Logging

```javascript
const { requestLogger, errorLogger } = require('./middleware/logging');

app.use(requestLogger);  // Log all requests
app.use(errorLogger);    // Log all errors
```

### Request-Scoped Logging

```javascript
app.get('/api/users', (req, res) => {
  const requestLogger = logger.withRequest(req);
  
  requestLogger.info('Fetching users');
  // Automatically includes correlation ID from request
});
```

### Error Logging with Context

```javascript
try {
  // Some operation
} catch (error) {
  logger.error('Operation failed', {
    operation: 'user.create',
    userId: req.user.id,
    error: {
      message: error.message,
      stack: error.stack,
      code: error.code
    }
  });
}
```

## Configuration

### Environment Variables

- `NODE_ENV`: Set to 'production' for JSON logging, otherwise human-readable
- `STRUCTURED_LOGGING`: Enable/disable structured logging (feature flag)

### Log Levels

- **Production**: `info` and above (info, warn, error)
- **Development**: `debug` and above (debug, info, warn, error)

### File Logging (Production Only)

Logs are written to files in production:

- `logs/error.log`: Error-level logs only
- `logs/combined.log`: All logs
- **Rotation**: 5MB max file size, 5 files retained

## Integration with Express

### Complete Setup

```javascript
const express = require('express');
const { correlationId } = require('./middleware/correlation');
const { requestLogger, errorLogger } = require('./middleware/logging');

const app = express();

// 1. Add correlation ID to requests
app.use(correlationId);

// 2. Log all requests
app.use(requestLogger);

// 3. Your routes here
app.get('/api/users', (req, res) => {
  // Use request-scoped logger
  const logger = logger.withRequest(req);
  logger.info('Processing user request');
});

// 4. Log all errors
app.use(errorLogger);

// 5. Final error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
    correlationId: req.correlationId
  });
});
```

## Feature Flags

The logging system respects feature flags:

```javascript
const featureFlags = require('./featureFlags');

// Enable structured logging
featureFlags.enable('STRUCTURED_LOGGING');

// Enable correlation tracking
featureFlags.enable('CORRELATION_TRACKING');
```

## Testing

### Unit Tests

Run unit tests to verify logging functionality:

```bash
npm test -- tests/logging.test.js
```

### Property-Based Tests

Run property-based tests to verify universal properties:

```bash
npm test -- tests/logging.property.test.js
```

### Manual Testing

Use the integration example to test logging:

```javascript
const app = require('./examples/winston-logging-integration');
// Test various endpoints to see logging in action
```

## Best Practices

### 1. Use Request-Scoped Loggers

Always use request-scoped loggers in route handlers:

```javascript
// Good
const requestLogger = logger.withRequest(req);
requestLogger.info('Processing request');

// Avoid
logger.info('Processing request', { correlationId: req.correlationId });
```

### 2. Include Contextual Information

Provide relevant context in log metadata:

```javascript
logger.error('Database query failed', {
  operation: 'user.findById',
  userId: userId,
  query: sanitizedQuery,
  duration: queryDuration,
  error: {
    message: error.message,
    code: error.code
  }
});
```

### 3. Use Appropriate Log Levels

- **Error**: Actual errors that need attention
- **Warn**: Potential issues or deprecated usage
- **Info**: Important business events
- **Debug**: Detailed diagnostic information

### 4. Sanitize Sensitive Data

The logger automatically sanitizes known sensitive fields, but be mindful of:

- Custom sensitive fields in your domain
- Sensitive data in error messages
- User-generated content that might contain sensitive information

### 5. Performance Considerations

- Logging is asynchronous and shouldn't block requests
- Avoid logging large objects in high-frequency operations
- Use appropriate log levels to control verbosity

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check if `STRUCTURED_LOGGING` feature flag is enabled
2. **Missing correlation IDs**: Ensure `correlationId` middleware is applied before `requestLogger`
3. **Sensitive data in logs**: Verify field names match sanitization patterns
4. **Performance issues**: Check log level configuration and reduce debug logging in production

### Debug Mode

Enable debug logging to troubleshoot issues:

```javascript
// Temporarily enable debug logging
process.env.NODE_ENV = 'development';
logger.debug('Debug information', { data: debugData });
```

## Security Considerations

1. **Sensitive Data**: The logger automatically sanitizes known sensitive fields
2. **Log Storage**: Ensure log files are properly secured and access-controlled
3. **Log Retention**: Implement appropriate log retention policies
4. **Monitoring**: Set up alerts for critical errors and security events

## Performance Impact

- **Minimal overhead**: Asynchronous logging with minimal performance impact
- **Memory usage**: Logs are streamed to files, not stored in memory
- **CPU usage**: Sanitization adds minimal CPU overhead
- **I/O impact**: File logging in production, console logging in development