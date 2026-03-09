/**
 * Unit Tests for Comprehensive File Validation
 * Tests the enhanced file validation middleware
 */

const { 
  validateFileUpload, 
  fileValidators,
  formatFileSize,
  extractFileExtension,
  validateMagicNumbers,
  scanForEmbeddedThreats,
  validatePDFContent,
  validateImageContent
} = require('../middleware/validation');
const { ValidationError } = require('../utils/errorClasses');
const { ERROR_CODES } = require('../utils/errorConstants');

// Mock feature flags
jest.mock('../middleware/featureFlags', () => ({
  isEnabled: jest.fn(() => true)
}));

describe('File Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      file: null,
      correlationId: 'test-correlation-id'
    };
    res = {};
    next = jest.fn();
  });

  describe('validateFileUpload', () => {
    it('should pass validation for valid files', async () => {
      const validator = validateFileUpload({
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['application/pdf'],
        allowedExtensions: ['pdf']
      });

      req.file = {
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
        size: 2 * 1024 * 1024,
        buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // PDF header
      };

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.fileValidationMeta).toBeDefined();
      expect(req.fileValidationMeta.processed).toBe(true);
    });

    it('should reject files that are too large', async () => {
      const validator = validateFileUpload({
        maxSize: 1 * 1024 * 1024, // 1MB
        allowedTypes: ['application/pdf']
      });

      req.file = {
        originalname: 'large-document.pdf',
        mimetype: 'application/pdf',
        size: 5 * 1024 * 1024 // 5MB
      };

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details[0].code).toBe(ERROR_CODES.FILE_TOO_LARGE);
      expect(error.details[0].message).toContain('exceeds maximum allowed size');
    });

    it('should reject files that are too small', async () => {
      const validator = validateFileUpload({
        minSize: 1024, // 1KB
        allowedTypes: ['application/pdf']
      });

      req.file = {
        originalname: 'tiny-document.pdf',
        mimetype: 'application/pdf',
        size: 100 // 100 bytes
      };

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details[0].code).toBe(ERROR_CODES.INVALID_LENGTH);
      expect(error.details[0].message).toContain('too small or empty');
    });

    it('should reject invalid MIME types', async () => {
      const validator = validateFileUpload({
        allowedTypes: ['application/pdf']
      });

      req.file = {
        originalname: 'document.pdf',
        mimetype: 'text/plain',
        size: 1024 * 1024
      };

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details[0].code).toBe(ERROR_CODES.INVALID_FILE_TYPE);
      expect(error.details[0].message).toContain('not supported');
    });

    it('should reject invalid file extensions', async () => {
      const validator = validateFileUpload({
        allowedExtensions: ['pdf']
      });

      req.file = {
        originalname: 'document.txt',
        mimetype: 'application/pdf',
        size: 1024 * 1024
      };

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details[0].code).toBe(ERROR_CODES.INVALID_FILE_TYPE);
      expect(error.details[0].message).toContain('not allowed');
    });

    it('should reject suspicious filenames', async () => {
      const validator = validateFileUpload({
        allowedTypes: ['application/pdf'],
        strictSecurity: true
      });

      req.file = {
        originalname: 'malware.exe.pdf',
        mimetype: 'application/pdf',
        size: 1024 * 1024
      };

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details.some(d => d.code === ERROR_CODES.SECURITY_POLICY_VIOLATION)).toBe(true);
    });

    it('should handle missing files when required', async () => {
      const validator = validateFileUpload({
        required: true
      });

      req.file = null;

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details[0].code).toBe(ERROR_CODES.REQUIRED_FIELD);
      expect(error.details[0].message).toContain('required');
    });

    it('should pass when file is optional and missing', async () => {
      const validator = validateFileUpload({
        required: false
      });

      req.file = null;

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Pre-configured Validators', () => {
    it('should validate resume files correctly', async () => {
      req.file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 2 * 1024 * 1024,
        buffer: Buffer.from([0x25, 0x50, 0x44, 0x46]) // PDF header
      };

      await fileValidators.resume(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.fileValidationMeta).toBeDefined();
    });

    it('should validate profile images correctly', async () => {
      req.file = {
        originalname: 'profile.jpg',
        mimetype: 'image/jpeg',
        size: 1024 * 1024,
        buffer: Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]) // JPEG header
      };

      await fileValidators.profile(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.fileValidationMeta).toBeDefined();
    });

    it('should reject invalid resume files', async () => {
      req.file = {
        originalname: 'resume.txt',
        mimetype: 'text/plain',
        size: 1024 * 1024
      };

      await fileValidators.resume(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });
  });

  describe('Helper Functions', () => {
    describe('formatFileSize', () => {
      it('should format file sizes correctly', () => {
        expect(formatFileSize(0)).toBe('0 Bytes');
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(1048576)).toBe('1 MB');
        expect(formatFileSize(1073741824)).toBe('1 GB');
        expect(formatFileSize(1536)).toBe('1.5 KB');
      });
    });

    describe('extractFileExtension', () => {
      it('should extract file extensions correctly', () => {
        expect(extractFileExtension('document.pdf')).toBe('pdf');
        expect(extractFileExtension('image.JPEG')).toBe('jpeg');
        expect(extractFileExtension('file.tar.gz')).toBe('gz');
        expect(extractFileExtension('noextension')).toBe('');
        expect(extractFileExtension('')).toBe('');
        expect(extractFileExtension(null)).toBe('');
      });
    });

    describe('validateMagicNumbers', () => {
      it('should validate PDF magic numbers', () => {
        const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF
        const result = validateMagicNumbers(pdfBuffer, 'application/pdf');
        expect(result.isValid).toBe(true);
        expect(result.detectedType).toBe('application/pdf');
      });

      it('should validate JPEG magic numbers', () => {
        const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]); // JPEG JFIF
        const result = validateMagicNumbers(jpegBuffer, 'image/jpeg');
        expect(result.isValid).toBe(true);
        expect(result.detectedType).toBe('image/jpeg');
      });

      it('should detect magic number mismatches', () => {
        const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]); // JPEG
        const result = validateMagicNumbers(jpegBuffer, 'application/pdf');
        expect(result.isValid).toBe(false);
        expect(result.detectedType).toBe('image/jpeg');
      });

      it('should handle unknown file types', () => {
        const unknownBuffer = Buffer.from([0x00, 0x01, 0x02, 0x03]);
        const result = validateMagicNumbers(unknownBuffer, 'application/unknown');
        expect(result.isValid).toBe(true); // No signature check available
        expect(result.detectedType).toBe('unknown');
      });
    });

    describe('scanForEmbeddedThreats', () => {
      it('should detect JavaScript threats', () => {
        const jsBuffer = Buffer.from('<script>alert("xss")</script>');
        const threats = scanForEmbeddedThreats(jsBuffer);
        expect(threats.length).toBeGreaterThan(0);
        expect(threats.some(t => t.type === 'EMBEDDED_JAVASCRIPT')).toBe(true);
      });

      it('should detect executable headers', () => {
        const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00]); // MZ header
        const threats = scanForEmbeddedThreats(exeBuffer);
        expect(threats.length).toBeGreaterThan(0);
        expect(threats.some(t => t.type === 'PE_EXECUTABLE_HEADER')).toBe(true);
      });

      it('should return no threats for clean content', () => {
        const cleanBuffer = Buffer.from('This is clean text content');
        const threats = scanForEmbeddedThreats(cleanBuffer);
        expect(threats.length).toBe(0);
      });
    });

    describe('validatePDFContent', () => {
      it('should validate proper PDF structure', () => {
        const pdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\nxref\n0 1\n0000000000 65535 f \ntrailer\n<<\n/Size 1\n/Root 1 0 R\n>>\nstartxref\n9\n%%EOF');
        const result = validatePDFContent(pdfBuffer);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
      });

      it('should detect invalid PDF structure', () => {
        const invalidBuffer = Buffer.from('Not a PDF file');
        const result = validatePDFContent(invalidBuffer);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it('should detect JavaScript in PDFs', () => {
        const jsBuffer = Buffer.from('%PDF-1.4\n/JavaScript (alert("xss"))\n%%EOF');
        const result = validatePDFContent(jsBuffer);
        expect(result.threats.some(t => t.type === 'PDF_JAVASCRIPT')).toBe(true);
      });
    });

    describe('validateImageContent', () => {
      it('should validate JPEG structure', () => {
        const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0xFF, 0xD9]);
        const result = validateImageContent(jpegBuffer, 'image/jpeg');
        expect(result.isValid).toBe(true);
      });

      it('should validate PNG structure', () => {
        const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x49, 0x48, 0x44, 0x52, 0x49, 0x45, 0x4E, 0x44]);
        const result = validateImageContent(pngBuffer, 'image/png');
        expect(result.isValid).toBe(true);
      });

      it('should detect invalid image structure', () => {
        const invalidBuffer = Buffer.from('Not an image');
        const result = validateImageContent(invalidBuffer, 'image/jpeg');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Error Message Quality', () => {
    it('should provide detailed error messages with requirements', async () => {
      const validator = validateFileUpload({
        maxSize: 1024 * 1024, // 1MB
        allowedTypes: ['application/pdf'],
        allowedExtensions: ['pdf']
      });

      req.file = {
        originalname: 'large-document.txt',
        mimetype: 'text/plain',
        size: 5 * 1024 * 1024 // 5MB
      };

      await validator(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      
      // Should have multiple validation errors
      expect(error.details.length).toBeGreaterThan(1);
      
      // Each error should have detailed information
      error.details.forEach(detail => {
        expect(detail.field).toBeDefined();
        expect(detail.message).toBeDefined();
        expect(detail.code).toBeDefined();
        expect(detail.requirements).toBeDefined();
      });
    });

    it('should include current and expected values in error details', async () => {
      const validator = validateFileUpload({
        maxSize: 1024 * 1024, // 1MB
        allowedTypes: ['application/pdf']
      });

      req.file = {
        originalname: 'large-document.pdf',
        mimetype: 'text/plain',
        size: 5 * 1024 * 1024 // 5MB
      };

      await validator(req, res, next);

      const error = next.mock.calls[0][0];
      const sizeError = error.details.find(d => d.code === ERROR_CODES.FILE_TOO_LARGE);
      const typeError = error.details.find(d => d.code === ERROR_CODES.INVALID_FILE_TYPE);
      
      expect(sizeError.currentValue).toBeDefined();
      expect(sizeError.maxValue).toBeDefined();
      expect(typeError.currentValue).toBeDefined();
      expect(typeError.allowedValues).toBeDefined();
    });
  });
});