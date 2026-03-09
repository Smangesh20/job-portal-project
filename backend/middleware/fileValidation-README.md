# Comprehensive File Validation Middleware

## Overview

The comprehensive file validation middleware provides advanced security and validation features for file uploads in the job portal application. It implements multi-layered validation including size, type, content, and security checks to prevent malicious file uploads and ensure data integrity.

## Features

### 1. File Size Validation
- **Maximum size limits**: Configurable per file type
- **Minimum size limits**: Prevents empty or suspiciously small files
- **Detailed error messages**: Shows current size vs. limits in human-readable format
- **Requirements information**: Clear guidance on acceptable file sizes

### 2. MIME Type and Extension Validation
- **MIME type checking**: Validates against allowed MIME types list
- **File extension validation**: Cross-checks file extensions with MIME types
- **Magic number validation**: Verifies file signatures match declared types
- **Mismatch detection**: Identifies files with mismatched content and extensions

### 3. Advanced Security Checks
- **Malicious filename detection**: Blocks suspicious file names and patterns
- **Path traversal prevention**: Prevents directory traversal attacks
- **Executable content scanning**: Detects embedded executables and scripts
- **Threat pattern matching**: Identifies XSS, injection, and malware patterns

### 4. Content Validation
- **PDF structure validation**: Verifies PDF internal structure and detects JavaScript
- **Image integrity checks**: Validates image headers and structure
- **Embedded script detection**: Scans for malicious scripts in file content
- **Metadata analysis**: Examines file metadata for suspicious content

### 5. Detailed Error Reporting
- **Field-level errors**: Specific error messages for each validation failure
- **Requirements guidance**: Clear instructions on how to fix issues
- **Current vs. expected values**: Shows what was provided vs. what's required
- **Security threat logging**: Comprehensive logging of detected threats

## Usage

### Basic File Validation

```javascript
const { validateFileUpload } = require('./middleware/validation');

// Basic file upload validation
const basicValidator = validateFileUpload({
  required: true,
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['application/pdf'],
  allowedExtensions: ['pdf']
});

app.post('/upload', basicValidator, (req, res) => {
  // File is validated and safe to process
  res.json({ message: 'File uploaded successfully' });
});
```

### Advanced Security Validation

```javascript
// Advanced validation with security checks
const secureValidator = validateFileUpload({
  required: true,
  maxSize: 10 * 1024 * 1024, // 10MB
  minSize: 1024, // 1KB minimum
  allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
  validateMagicNumbers: true,
  validateStructure: true,
  validateMetadata: true,
  strictSecurity: true
});

app.post('/secure-upload', secureValidator, (req, res) => {
  // File has passed comprehensive security validation
  console.log('Validation metadata:', req.fileValidationMeta);
  res.json({ message: 'Secure upload successful' });
});
```

### Pre-configured Validators

```javascript
const { fileValidators } = require('./middleware/validation');

// Resume upload (PDF only, 5MB max, strict security)
app.post('/upload/resume', fileValidators.resume, handleResumeUpload);

// Profile image (Images only, 2MB max, strict security)
app.post('/upload/profile', fileValidators.profile, handleProfileUpload);

// Document upload (Multiple formats, 10MB max, moderate security)
app.post('/upload/document', fileValidators.document, handleDocumentUpload);
```

## Configuration Options

### Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `required` | boolean | false | Whether file upload is required |
| `maxSize` | number | 5MB | Maximum file size in bytes |
| `minSize` | number | 1 | Minimum file size in bytes |
| `allowedTypes` | string[] | [] | Allowed MIME types |
| `allowedExtensions` | string[] | [] | Allowed file extensions |

### Security Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `validateMagicNumbers` | boolean | true | Validate file signatures |
| `validateStructure` | boolean | true | Validate internal file structure |
| `validateMetadata` | boolean | true | Scan file metadata for threats |
| `strictSecurity` | boolean | false | Reject files with any security threats |

## Error Response Format

When validation fails, the middleware returns a standardized error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "File validation failed",
    "details": [
      {
        "field": "file",
        "message": "File size (10.5 MB) exceeds maximum allowed size",
        "code": "FILE_TOO_LARGE",
        "requirements": "Maximum file size: 5 MB",
        "currentValue": "10.5 MB",
        "maxValue": "5 MB"
      },
      {
        "field": "file",
        "message": "File type 'text/plain' is not supported",
        "code": "INVALID_FILE_TYPE",
        "requirements": "Supported file types: application/pdf, image/jpeg",
        "currentValue": "text/plain",
        "allowedValues": ["application/pdf", "image/jpeg"]
      }
    ],
    "correlationId": "file_val_1234567890",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Security Features

### Threat Detection

The middleware detects various security threats:

- **XSS Patterns**: Script tags, event handlers, JavaScript protocols
- **Injection Attempts**: SQL, NoSQL, command injection patterns
- **Executable Content**: PE, ELF, Mach-O executable headers
- **Path Traversal**: Directory traversal attempts in filenames
- **Malicious Extensions**: Dangerous file extensions disguised as safe files

### Security Logging

All security threats are logged with detailed context:

```javascript
// High-severity threats trigger immediate alerts
console.warn('FILE SECURITY ALERT: Critical file threats detected', {
  correlationId: 'file_val_1234567890',
  fileName: 'suspicious.exe.pdf',
  fileSize: 1048576,
  mimeType: 'application/pdf',
  ip: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  userId: 'user123',
  timestamp: '2024-01-15T10:30:00Z',
  threats: [
    {
      type: 'EXECUTABLE_EXTENSION',
      severity: 'HIGH',
      description: 'Suspicious pattern detected in filename'
    }
  ]
});
```

### Magic Number Validation

The middleware validates file signatures to prevent MIME type spoofing:

```javascript
// Supported file signatures
const signatures = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'image/jpeg': [[0xFF, 0xD8, 0xFF, 0xE0]], // JFIF
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]], // PNG
  'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61]] // GIF87a
};
```

## Helper Functions

### File Size Formatting

```javascript
const { formatFileSize } = require('./middleware/validation');

console.log(formatFileSize(1024)); // "1 KB"
console.log(formatFileSize(1048576)); // "1 MB"
console.log(formatFileSize(1073741824)); // "1 GB"
```

### Extension Extraction

```javascript
const { extractFileExtension } = require('./middleware/validation');

console.log(extractFileExtension('document.pdf')); // "pdf"
console.log(extractFileExtension('image.JPEG')); // "jpeg"
```

### Magic Number Validation

```javascript
const { validateMagicNumbers } = require('./middleware/validation');

const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46]); // PDF header
const result = validateMagicNumbers(buffer, 'application/pdf');
console.log(result); // { isValid: true, detectedType: 'application/pdf' }
```

### Threat Detection

```javascript
const { scanForEmbeddedThreats } = require('./middleware/validation');

const buffer = Buffer.from('<script>alert("xss")</script>');
const threats = scanForEmbeddedThreats(buffer);
console.log(threats); // Array of detected threats
```

## Integration with Error Handler

The file validation middleware integrates seamlessly with the centralized error handler:

```javascript
const { errorHandler } = require('./middleware/errorHandler');
const { fileValidators } = require('./middleware/validation');

app.post('/upload/resume', 
  fileValidators.resume,
  (req, res) => {
    // Handle successful upload
    res.json({ message: 'Resume uploaded successfully' });
  }
);

// Error handler automatically processes validation errors
app.use(errorHandler);
```

## Testing

The middleware includes comprehensive test coverage:

### Unit Tests
- File size validation edge cases
- MIME type and extension validation
- Security pattern detection
- Error message formatting
- Helper function behavior

### Property-Based Tests
- Validation consistency across all inputs
- Error message completeness
- Security threat detection reliability
- Magic number validation accuracy

### Manual Testing
```bash
# Run unit tests
npm test fileValidation.test.js

# Run property-based tests
npm test fileValidation.property.test.js

# Run manual test suite
node test-file-validation-manual.js
```

## Performance Considerations

### Optimization Features
- **Lazy validation**: Only performs expensive checks when necessary
- **Early termination**: Stops validation on first critical security threat
- **Buffer reuse**: Efficient memory usage for large files
- **Configurable depth**: Adjustable validation depth based on security requirements

### Memory Usage
- **Streaming support**: Works with both buffered and streaming uploads
- **Size limits**: Prevents memory exhaustion from large files
- **Garbage collection**: Proper cleanup of validation resources

## Migration Guide

### From Basic Validation
```javascript
// Old basic validation
const multer = require('multer');
const upload = multer({ 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// New comprehensive validation
const { fileValidators } = require('./middleware/validation');
app.post('/upload', fileValidators.resume, handleUpload);
```

### Updating Error Handling
```javascript
// Old error handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

// New centralized error handling (automatically handles ValidationError)
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);
```

## Best Practices

### Security
1. **Always use strict security mode** for sensitive file uploads
2. **Validate both MIME type and extension** to prevent spoofing
3. **Enable magic number validation** for critical file types
4. **Monitor security logs** for threat patterns
5. **Regularly update threat detection patterns**

### Performance
1. **Set appropriate file size limits** to prevent resource exhaustion
2. **Use pre-configured validators** for common use cases
3. **Enable only necessary validation features** for better performance
4. **Implement proper error handling** to prevent memory leaks

### User Experience
1. **Provide clear error messages** with specific requirements
2. **Show current vs. expected values** in error responses
3. **Include helpful guidance** on how to fix validation issues
4. **Use consistent error formats** across all endpoints

## Troubleshooting

### Common Issues

#### File Size Errors
```javascript
// Problem: File size validation failing unexpectedly
// Solution: Check if file size is in bytes, not KB/MB
const validator = validateFileUpload({
  maxSize: 5 * 1024 * 1024 // 5MB in bytes, not 5
});
```

#### MIME Type Mismatches
```javascript
// Problem: Valid files being rejected for MIME type
// Solution: Enable magic number validation to detect actual type
const validator = validateFileUpload({
  allowedTypes: ['application/pdf'],
  validateMagicNumbers: true // This will help identify the issue
});
```

#### Security False Positives
```javascript
// Problem: Safe files being rejected as security threats
// Solution: Adjust security strictness or add exceptions
const validator = validateFileUpload({
  strictSecurity: false, // Less strict for general uploads
  allowedTypes: ['application/pdf']
});
```

### Debug Mode

Enable debug logging to troubleshoot validation issues:

```javascript
// Set environment variable for debug mode
process.env.FILE_VALIDATION_DEBUG = 'true';

// Or enable in code
const validator = validateFileUpload({
  debug: true,
  allowedTypes: ['application/pdf']
});
```

## Changelog

### Version 1.0.0
- Initial implementation with comprehensive file validation
- Security threat detection and logging
- Magic number validation
- Pre-configured validators for common use cases
- Detailed error messages with requirements
- Property-based testing coverage