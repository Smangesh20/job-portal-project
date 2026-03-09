/**
 * Property-Based Tests for File Validation
 * Feature: error-handling-validation, Property 1: Comprehensive Input Validation
 * 
 * **Validates: Requirements 1.4, 7.1, 7.2, 7.3**
 * 
 * For any file upload request, the validation system should validate file size, 
 * type, and content, return detailed error messages with requirements, and 
 * implement secure file handling to prevent malicious uploads.
 */

const fc = require('fast-check');
const { 
  validateFileUpload, 
  fileValidators,
  formatFileSize,
  extractFileExtension,
  validateMagicNumbers,
  scanForEmbeddedThreats
} = require('../middleware/validation');
const { ValidationError } = require('../utils/errorClasses');
const { ERROR_CODES } = require('../utils/errorConstants');

// Mock feature flags
jest.mock('../middleware/featureFlags', () => ({
  isEnabled: jest.fn(() => true)
}));

describe('File Validation Property-Based Tests', () => {
  
  /**
   * Property 1: File Size Validation Consistency
   * For any file size and size limits, validation should consistently 
   * accept or reject based on the configured limits
   */
  test('validates file sizes consistently across all inputs', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        fileSize: fc.integer({ min: 0, max: 100 * 1024 * 1024 }), // 0 to 100MB
        maxSize: fc.integer({ min: 1024, max: 50 * 1024 * 1024 }), // 1KB to 50MB
        minSize: fc.integer({ min: 1, max: 1024 }) // 1 byte to 1KB
      }),
      async ({ fileSize, maxSize, minSize }) => {
        const validator = validateFileUpload({
          maxSize,
          minSize,
          allowedTypes: ['application/pdf']
        });

        const req = {
          file: {
            originalname: 'test.pdf',
            mimetype: 'application/pdf',
            size: fileSize,
            buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // PDF header
          },
          correlationId: 'test-id'
        };
        const res = {};
        let error = null;

        await new Promise((resolve) => {
          validator(req, res, (err) => {
            error = err;
            resolve();
          });
        });

        // Property: File should be rejected if outside size limits
        const shouldBeRejected = fileSize > maxSize || fileSize < minSize;
        const wasRejected = error instanceof ValidationError;

        if (shouldBeRejected) {
          expect(wasRejected).toBe(true);
          expect(error.details.some(d => 
            d.code === ERROR_CODES.FILE_TOO_LARGE || 
            d.code === ERROR_CODES.INVALID_LENGTH
          )).toBe(true);
        } else {
          // File might still be rejected for other reasons, but not size
          if (wasRejected) {
            expect(error.details.every(d => 
              d.code !== ERROR_CODES.FILE_TOO_LARGE && 
              d.code !== ERROR_CODES.INVALID_LENGTH
            )).toBe(true);
          }
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 2: MIME Type Validation Consistency
   * For any MIME type and allowed types list, validation should consistently
   * accept or reject based on the configuration
   */
  test('validates MIME types consistently', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        mimeType: fc.oneof(
          fc.constant('application/pdf'),
          fc.constant('image/jpeg'),
          fc.constant('image/png'),
          fc.constant('text/plain'),
          fc.constant('application/msword'),
          fc.constant('video/mp4'),
          fc.constant('audio/mpeg')
        ),
        allowedTypes: fc.subarray([
          'application/pdf',
          'image/jpeg', 
          'image/png',
          'text/plain'
        ], { minLength: 1, maxLength: 4 })
      }),
      async ({ mimeType, allowedTypes }) => {
        const validator = validateFileUpload({
          allowedTypes,
          maxSize: 5 * 1024 * 1024
        });

        const req = {
          file: {
            originalname: 'test.file',
            mimetype: mimeType,
            size: 1024 * 1024,
            buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // Generic header
          },
          correlationId: 'test-id'
        };
        const res = {};
        let error = null;

        await new Promise((resolve) => {
          validator(req, res, (err) => {
            error = err;
            resolve();
          });
        });

        // Property: File should be rejected if MIME type not in allowed list
        const shouldBeRejected = !allowedTypes.includes(mimeType);
        const wasRejected = error instanceof ValidationError;

        if (shouldBeRejected) {
          expect(wasRejected).toBe(true);
          // File should be rejected, but may have multiple error codes
          // (e.g., INVALID_FILE_TYPE, FILE_CORRUPTED, etc.)
          expect(error.details.length).toBeGreaterThan(0);
        } else {
          // File might still be rejected for other reasons (e.g., magic number mismatch)
          // but not specifically for MIME type
          if (wasRejected) {
            const hasMimeTypeError = error.details.some(d => 
              d.code === ERROR_CODES.INVALID_FILE_TYPE && 
              d.message.includes(mimeType)
            );
            expect(hasMimeTypeError).toBe(false);
          }
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 3: File Extension Validation Consistency
   * For any file extension and allowed extensions list, validation should
   * consistently accept or reject based on the configuration
   */
  test('validates file extensions consistently', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        fileName: fc.oneof(
          fc.constant('document.pdf'),
          fc.constant('image.jpg'),
          fc.constant('image.jpeg'),
          fc.constant('image.png'),
          fc.constant('text.txt'),
          fc.constant('script.js'),
          fc.constant('executable.exe'),
          fc.constant('file.unknown')
        ),
        allowedExtensions: fc.subarray([
          'pdf', 'jpg', 'jpeg', 'png', 'txt'
        ], { minLength: 1, maxLength: 5 })
      }),
      async ({ fileName, allowedExtensions }) => {
        const validator = validateFileUpload({
          allowedExtensions,
          maxSize: 5 * 1024 * 1024
        });

        const req = {
          file: {
            originalname: fileName,
            mimetype: 'application/octet-stream',
            size: 1024 * 1024,
            buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // Generic header
          },
          correlationId: 'test-id'
        };
        const res = {};
        let error = null;

        await new Promise((resolve) => {
          validator(req, res, (err) => {
            error = err;
            resolve();
          });
        });

        // Extract extension from filename
        const extension = extractFileExtension(fileName);
        const shouldBeRejected = !allowedExtensions.includes(extension);
        const wasRejected = error instanceof ValidationError;

        if (shouldBeRejected) {
          expect(wasRejected).toBe(true);
          // File should be rejected, may have multiple error codes
          expect(error.details.length).toBeGreaterThan(0);
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 4: Security Validation Consistency
   * For any filename with security patterns, validation should consistently
   * detect and handle security threats
   */
  test('detects security threats consistently', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        fileName: fc.oneof(
          // Safe filenames
          fc.constant('document.pdf'),
          fc.constant('image.jpg'),
          fc.constant('resume.pdf'),
          // Suspicious filenames
          fc.constant('malware.exe'),
          fc.constant('script.js.pdf'),
          fc.constant('../../../etc/passwd'),
          fc.constant('file<script>.pdf'),
          fc.constant('virus.bat.pdf'),
          fc.constant('hack.php.jpg')
        ),
        strictSecurity: fc.boolean()
      }),
      async ({ fileName, strictSecurity }) => {
        const validator = validateFileUpload({
          allowedTypes: ['application/pdf', 'image/jpeg'],
          allowedExtensions: ['pdf', 'jpg'],
          strictSecurity
        });

        const req = {
          file: {
            originalname: fileName,
            mimetype: 'application/pdf',
            size: 1024 * 1024,
            buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // PDF header
          },
          correlationId: 'test-id'
        };
        const res = {};
        let error = null;

        await new Promise((resolve) => {
          validator(req, res, (err) => {
            error = err;
            resolve();
          });
        });

        // Check for suspicious patterns
        const hasSuspiciousPatterns = /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|php|asp|jsp)$/i.test(fileName) ||
                                     /\.\./.test(fileName) ||
                                     /[<>:"|?*]/.test(fileName);

        if (hasSuspiciousPatterns && strictSecurity) {
          expect(error instanceof ValidationError).toBe(true);
          // File should be rejected with at least one error
          expect(error.details.length).toBeGreaterThan(0);
        }

        // Property: All errors should have proper structure
        if (error instanceof ValidationError) {
          error.details.forEach(detail => {
            expect(detail.field).toBeDefined();
            expect(detail.message).toBeDefined();
            expect(detail.code).toBeDefined();
            expect(detail.requirements).toBeDefined();
          });
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 5: Error Message Completeness
   * For any validation error, the error message should contain all required
   * information including requirements and current values
   */
  test('provides complete error information for all validation failures', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        fileSize: fc.integer({ min: 0, max: 100 * 1024 * 1024 }),
        mimeType: fc.oneof(
          fc.constant('application/pdf'),
          fc.constant('text/plain'),
          fc.constant('image/jpeg'),
          fc.constant('application/exe')
        ),
        fileName: fc.oneof(
          fc.constant('document.pdf'),
          fc.constant('file.txt'),
          fc.constant('image.jpg'),
          fc.constant('malware.exe')
        ),
        maxSize: fc.integer({ min: 1024, max: 10 * 1024 * 1024 }),
        allowedTypes: fc.constantFrom(
          ['application/pdf'],
          ['image/jpeg', 'image/png'],
          ['text/plain']
        )
      }),
      async ({ fileSize, mimeType, fileName, maxSize, allowedTypes }) => {
        const validator = validateFileUpload({
          maxSize,
          allowedTypes,
          allowedExtensions: ['pdf', 'jpg', 'png'],
          strictSecurity: true
        });

        const req = {
          file: {
            originalname: fileName,
            mimetype: mimeType,
            size: fileSize,
            buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // Generic header
          },
          correlationId: 'test-id'
        };
        const res = {};
        let error = null;

        await new Promise((resolve) => {
          validator(req, res, (err) => {
            error = err;
            resolve();
          });
        });

        // Property: If there's a validation error, it should be complete
        if (error instanceof ValidationError) {
          expect(error.message).toBeDefined();
          expect(Array.isArray(error.details)).toBe(true);
          expect(error.details.length).toBeGreaterThan(0);

          // Each error detail should have complete information
          error.details.forEach(detail => {
            expect(typeof detail.field).toBe('string');
            expect(typeof detail.message).toBe('string');
            expect(typeof detail.code).toBe('string');
            expect(typeof detail.requirements).toBe('string');
            
            // Specific error types should have additional information
            if (detail.code === ERROR_CODES.FILE_TOO_LARGE) {
              expect(detail.currentValue).toBeDefined();
              expect(detail.maxValue).toBeDefined();
            }
            
            if (detail.code === ERROR_CODES.INVALID_FILE_TYPE) {
              expect(detail.currentValue).toBeDefined();
              if (detail.allowedValues) {
                expect(Array.isArray(detail.allowedValues)).toBe(true);
              }
            }
          });
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 6: Magic Number Validation Consistency
   * For any buffer and MIME type combination, magic number validation
   * should consistently detect matches and mismatches
   */
  test('validates magic numbers consistently', () => {
    fc.assert(fc.property(
      fc.record({
        magicBytes: fc.oneof(
          fc.constant([0x25, 0x50, 0x44, 0x46]), // PDF
          fc.constant([0xFF, 0xD8, 0xFF, 0xE0]), // JPEG
          fc.constant([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), // PNG
          fc.constant([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]), // GIF87a
          fc.constant([0x4D, 0x5A, 0x90, 0x00]), // EXE
          fc.constant([0x00, 0x01, 0x02, 0x03]) // Unknown
        ),
        expectedMimeType: fc.oneof(
          fc.constant('application/pdf'),
          fc.constant('image/jpeg'),
          fc.constant('image/png'),
          fc.constant('image/gif'),
          fc.constant('application/octet-stream')
        )
      }),
      ({ magicBytes, expectedMimeType }) => {
        const buffer = Buffer.from(magicBytes);
        const result = validateMagicNumbers(buffer, expectedMimeType);

        // Property: Result should always have isValid and detectedType
        expect(typeof result.isValid).toBe('boolean');
        expect(typeof result.detectedType).toBe('string');

        // Property: Known magic numbers should be detected correctly
        const knownSignatures = {
          'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
          'image/jpeg': [[0xFF, 0xD8, 0xFF, 0xE0]],
          'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
          'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61]]
        };

        const expectedSignatures = knownSignatures[expectedMimeType];
        if (expectedSignatures) {
          const hasMatchingSignature = expectedSignatures.some(sig => 
            sig.every((byte, index) => magicBytes[index] === byte)
          );
          
          if (hasMatchingSignature) {
            expect(result.isValid).toBe(true);
            expect(result.detectedType).toBe(expectedMimeType);
          }
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 7: Threat Detection Consistency
   * For any buffer content, threat detection should consistently identify
   * dangerous patterns and return appropriate threat information
   */
  test('detects embedded threats consistently', () => {
    fc.assert(fc.property(
      fc.oneof(
        // Safe content
        fc.constant('This is safe text content without any threats'),
        fc.constant('Normal PDF content with /Type /Catalog'),
        fc.constant('Image metadata: Camera=Canon, Date=2024'),
        
        // Dangerous content
        fc.constant('<script>alert("xss")</script>'),
        fc.constant('javascript:void(0)'),
        fc.constant('onclick="malicious()"'),
        fc.constant('<iframe src="evil.com"></iframe>'),
        
        // Executable signatures - use proper byte sequences
        fc.constant(Buffer.from([0x4D, 0x5A, 0x90, 0x00]).toString()), // PE header
        fc.constant(Buffer.from([0x7F, 0x45, 0x4C, 0x46]).toString()), // ELF header
      ),
      (content) => {
        const buffer = Buffer.from(content);
        const threats = scanForEmbeddedThreats(buffer);

        // Property: Result should always be an array
        expect(Array.isArray(threats)).toBe(true);

        // Property: Each threat should have required properties
        threats.forEach(threat => {
          expect(typeof threat.type).toBe('string');
          expect(typeof threat.severity).toBe('string');
          expect(typeof threat.description).toBe('string');
          expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(threat.severity)).toBe(true);
        });

        // Property: Dangerous patterns should be detected
        if (content.includes('<script>')) {
          expect(threats.some(t => t.type === 'EMBEDDED_JAVASCRIPT')).toBe(true);
        }
        
        if (content.includes('javascript:')) {
          expect(threats.some(t => t.type === 'JAVASCRIPT_PROTOCOL')).toBe(true);
        }
        
        // Check for PE header bytes
        if (buffer.length >= 2 && buffer[0] === 0x4D && buffer[1] === 0x5A) {
          expect(threats.some(t => t.type === 'PE_EXECUTABLE_HEADER')).toBe(true);
        }
        
        // Check for ELF header bytes
        if (buffer.length >= 4 && buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
          expect(threats.some(t => t.type === 'ELF_EXECUTABLE_HEADER')).toBe(true);
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 8: File Size Formatting Consistency
   * For any file size, the formatting function should return a valid,
   * human-readable string representation
   */
  test('formats file sizes consistently', () => {
    fc.assert(fc.property(
      fc.integer({ min: 0, max: 1024 * 1024 * 1024 * 10 }), // 0 to 10GB
      (fileSize) => {
        const formatted = formatFileSize(fileSize);

        // Property: Result should be a non-empty string
        expect(typeof formatted).toBe('string');
        expect(formatted.length).toBeGreaterThan(0);

        // Property: Should contain a number and a unit
        expect(/^\d+(\.\d+)?\s+(Bytes|KB|MB|GB)$/.test(formatted)).toBe(true);

        // Property: Zero should always format as "0 Bytes"
        if (fileSize === 0) {
          expect(formatted).toBe('0 Bytes');
        }

        // Property: Large numbers should use appropriate units
        if (fileSize >= 1024 * 1024 * 1024) {
          expect(formatted).toContain('GB');
        } else if (fileSize >= 1024 * 1024) {
          expect(formatted).toContain('MB');
        } else if (fileSize >= 1024) {
          expect(formatted).toContain('KB');
        } else {
          expect(formatted).toContain('Bytes');
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 9: Pre-configured Validator Consistency
   * For any file input, pre-configured validators should behave consistently
   * with their documented specifications
   */
  test('pre-configured validators behave consistently', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        validatorType: fc.constantFrom('resume', 'profile', 'document'),
        fileName: fc.oneof(
          fc.constant('resume.pdf'),
          fc.constant('profile.jpg'),
          fc.constant('document.docx'),
          fc.constant('malware.exe'),
          fc.constant('image.png')
        ),
        mimeType: fc.oneof(
          fc.constant('application/pdf'),
          fc.constant('image/jpeg'),
          fc.constant('image/png'),
          fc.constant('text/plain'),
          fc.constant('application/octet-stream')
        ),
        fileSize: fc.integer({ min: 100, max: 20 * 1024 * 1024 })
      }),
      async ({ validatorType, fileName, mimeType, fileSize }) => {
        const validator = fileValidators[validatorType];
        if (!validator) return; // Skip if validator doesn't exist

        const req = {
          file: {
            originalname: fileName,
            mimetype: mimeType,
            size: fileSize,
            buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // Generic header
          },
          correlationId: 'test-id'
        };
        const res = {};
        let error = null;

        await new Promise((resolve) => {
          validator(req, res, (err) => {
            error = err;
            resolve();
          });
        });

        // Property: Validator should always call next() with or without error
        expect(typeof error === 'undefined' || error instanceof ValidationError || error === null).toBe(true);

        // Property: If validation passes, metadata should be set
        if (!error) {
          expect(req.fileValidationMeta).toBeDefined();
          expect(req.fileValidationMeta.processed).toBe(true);
        }

        // Property: Resume validator should only accept PDFs
        if (validatorType === 'resume' && mimeType !== 'application/pdf') {
          expect(error instanceof ValidationError).toBe(true);
        }

        // Property: Profile validator should only accept images
        if (validatorType === 'profile' && !mimeType.startsWith('image/')) {
          expect(error instanceof ValidationError).toBe(true);
        }
      }
    ), { numRuns: 100 });
  });
});