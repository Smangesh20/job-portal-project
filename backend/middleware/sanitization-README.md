# Input Sanitization Middleware

## Overview

The input sanitization middleware provides comprehensive protection against XSS attacks, SQL injection, NoSQL injection, command injection, and other security vulnerabilities. It integrates seamlessly with the existing validation system and provides configurable security levels.

## Features

### Security Protection
- **XSS Prevention**: Removes script tags, iframe tags, event handlers, and dangerous protocols
- **SQL Injection Prevention**: Detects and neutralizes SQL injection attempts
- **NoSQL Injection Prevention**: Removes MongoDB operators and injection patterns
- **Command Injection Prevention**: Blocks command execution characters and patterns
- **Path Traversal Prevention**: Prevents directory traversal attacks
- **HTML Entity Encoding**: Safely encodes dangerous characters

### Threat Detection
- **Real-time Monitoring**: Detects and logs security threats as they occur
- **Severity Classification**: Categorizes threats by severity (LOW, MEDIUM, HIGH, CRITICAL)
- **Pattern Matching**: Uses comprehensive regex patterns to identify attack vectors
- **Custom Patterns**: Supports application-specific threat patterns

### Configuration Options
- **Strict Mode**: Rejects requests containing high-severity threats
- **Length Limits**: Prevents DoS attacks through oversized inputs
- **Whitelisting**: Allows specific fields to bypass sanitization
- **Custom Encoding**: Supports different encoding strategies (HTML, URL, none)
- **Feature Flags**: Controlled rollout through feature flag system

## Usage

### Basic Sanitization

```javascript
const { sanitizeInput } = require('./middleware/validation');

// Apply to all routes
app.use(sanitizeInput());

// Apply to specific routes
app.post('/api/jobs', sanitizeInput(), (req, res) => {
  // req.body, req.query, and req.params are automatically sanitized
});
```

### Advanced Sanitization

```javascript
const { createAdvancedSanitizer } = require('./middleware/validation');

const advancedSanitizer = createAdvancedSanitizer({
  maxLength: 5000,
  strictMode: true,
  logThreats: true,
  allowHtml: false,
  customPatterns: [
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
  // Advanced sanitization with custom configuration
});
```

### Integration with Validation

```javascript
const { sanitizeInput, validateRequest, authSchemas } = require('./middleware/validation');

app.post('/auth/signup',
  sanitizeInput(), // Sanitize first
  validateRequest(authSchemas.signup), // Then validate
  (req, res) => {
    // Input is both sanitized and validated
  }
);
```

## Configuration Options

### Basic Options
- `maxLength` (number): Maximum allowed string length (default: 10000)
- `strictMode` (boolean): Reject requests with high-severity threats (default: false)
- `logThreats` (boolean): Log detected threats (default: true)
- `allowHtml` (boolean): Allow safe HTML tags (default: false)
- `encoding` (string): Encoding strategy - 'html', 'url', or 'none' (default: 'html')

### Advanced Options
- `customPatterns` (array): Additional threat detection patterns
- `whitelist` (array): Fields to skip sanitization
- `threatThreshold` (string): Minimum severity level to log (default: 'LOW')

### Custom Pattern Format
```javascript
{
  pattern: /regex-pattern/gi,
  type: 'THREAT_TYPE_NAME',
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}
```

## Feature Flags

Control sanitization features through environment variables:

```bash
# Basic sanitization
INPUT_VALIDATION=true

# Enhanced features
ENHANCED_SANITIZATION=true
THREAT_DETECTION=true
STRICT_SANITIZATION=true
```

## Threat Detection

### Detected Threat Types

#### XSS Threats
- `XSS_SCRIPT_TAG`: Script tag injection
- `XSS_IFRAME`: Iframe injection
- `XSS_DANGEROUS_TAG`: Object, embed, applet tags
- `XSS_JAVASCRIPT_PROTOCOL`: javascript: protocol
- `XSS_EVENT_HANDLER`: Event handler attributes
- `XSS_DATA_URL`: Data URL injection
- `XSS_VBSCRIPT_PROTOCOL`: vbscript: protocol
- `XSS_CSS_EXPRESSION`: CSS expression() injection
- `XSS_STYLE_ATTRIBUTE`: Style attribute injection

#### Injection Threats
- `SQL_INJECTION_KEYWORD`: SQL command keywords
- `SQL_INJECTION_CHAR`: SQL injection characters
- `NOSQL_INJECTION`: MongoDB operator injection
- `COMMAND_INJECTION`: Command execution attempts
- `LDAP_INJECTION`: LDAP injection patterns
- `XML_INJECTION`: XML entity injection

#### Other Threats
- `PATH_TRAVERSAL`: Directory traversal attempts
- `DANGEROUS_HTML_TAG`: Dangerous HTML elements
- `DANGEROUS_JS_FUNCTION`: Dangerous JavaScript functions
- `DOM_ACCESS`: DOM manipulation attempts
- `WINDOW_MANIPULATION`: Window object manipulation
- `LENGTH_LIMIT_EXCEEDED`: Input length violations

### Threat Logging

Threats are automatically logged with contextual information:

```javascript
{
  correlationId: 'san_abc123_def456',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  path: '/api/jobs',
  method: 'POST',
  timestamp: '2024-01-15T10:30:00Z',
  threats: [
    {
      type: 'XSS_SCRIPT_TAG',
      severity: 'HIGH',
      field: 'description',
      matchCount: 1
    }
  ]
}
```

## Request Metadata

Sanitized requests include metadata in `req.sanitizationMeta`:

```javascript
{
  processed: true,
  timestamp: '2024-01-15T10:30:00Z',
  correlationId: 'san_abc123_def456',
  threatsDetected: 2,
  threatTypes: ['XSS_SCRIPT_TAG', 'SQL_INJECTION_CHAR'],
  strictMode: false
}
```

## Error Handling

Sanitization errors are returned as ValidationError instances:

```javascript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Request contains potentially malicious content',
    details: [
      {
        field: 'security',
        message: 'Request blocked due to security policy',
        code: 'SECURITY_POLICY_VIOLATION'
      }
    ],
    correlationId: 'san_abc123_def456',
    timestamp: '2024-01-15T10:30:00Z'
  }
}
```

## Performance Considerations

### Optimization Features
- **Efficient Pattern Matching**: Optimized regex patterns for performance
- **Lazy Evaluation**: Only processes fields that need sanitization
- **Caching**: Reuses compiled patterns across requests
- **Minimal Overhead**: Adds <5ms processing time for typical requests

### Best Practices
- Use whitelisting for fields that don't need sanitization
- Apply appropriate length limits to prevent DoS
- Monitor threat detection logs for security insights
- Use strict mode only for high-security endpoints

## Security Best Practices

### Deployment Recommendations
1. **Enable All Features**: Set all feature flags to true in production
2. **Monitor Threats**: Regularly review threat detection logs
3. **Update Patterns**: Keep threat detection patterns current
4. **Test Thoroughly**: Validate sanitization with security testing
5. **Layer Security**: Combine with validation, authentication, and authorization

### Common Pitfalls
- Don't rely solely on sanitization - use defense in depth
- Regularly update threat detection patterns
- Monitor for new attack vectors
- Test with real-world malicious inputs
- Consider context-specific sanitization needs

## Testing

### Unit Tests
Run the comprehensive test suite:
```bash
npm test -- --testPathPattern=sanitization.test.js
```

### Manual Testing
Test with various malicious inputs:
```javascript
const maliciousInputs = [
  '<script>alert("xss")</script>',
  '\'; DROP TABLE users; --',
  '{"$where": "this.password"}',
  'file.txt; rm -rf /',
  '../../../etc/passwd'
];
```

## Integration Examples

See `examples/sanitization-integration.js` for comprehensive usage examples including:
- Basic route sanitization
- Advanced configuration
- Custom threat patterns
- File upload sanitization
- Conditional sanitization
- Error handling
- Performance monitoring

## Troubleshooting

### Common Issues

1. **Sanitization Not Working**
   - Check INPUT_VALIDATION feature flag is enabled
   - Verify middleware is applied before route handlers
   - Check for middleware ordering conflicts

2. **False Positives**
   - Use whitelist for legitimate content
   - Adjust threat detection patterns
   - Consider context-specific sanitization

3. **Performance Issues**
   - Reduce maxLength for large inputs
   - Use whitelist for unnecessary fields
   - Monitor processing times

### Debug Mode
Enable debug logging:
```javascript
const sanitizer = createAdvancedSanitizer({
  logThreats: true,
  debug: true // Enable detailed logging
});
```

## Changelog

### Version 1.0.0
- Initial implementation with comprehensive threat detection
- Support for XSS, SQL injection, NoSQL injection prevention
- Configurable security levels and feature flags
- Integration with existing validation system
- Comprehensive test suite and documentation