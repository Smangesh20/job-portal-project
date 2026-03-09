/**
 * Validation Middleware Tests
 * Tests for Joi-based validation middleware
 */

const {
  validateRequest,
  validateBody,
  validateQuery,
  validateParams,
  sanitizeInput,
  validateFileUpload,
  validationSchemas,
  authSchemas,
  jobSchemas
} = require('../middleware/validation');
const { ValidationError } = require('../utils/errorClasses');
const featureFlags = require('../middleware/featureFlags');

// Mock feature flags for testing
jest.mock('../middleware/featureFlags', () => ({
  isEnabled: jest.fn(() => true)
}));

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      method: 'POST',
      url: '/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    featureFlags.isEnabled.mockReturnValue(true);
  });

  describe('validateRequest', () => {
    it('should validate valid user signup data', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Password123',
        type: 'applicant',
        name: 'John Doe'
      };

      const middleware = validateRequest(authSchemas.signup);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.email).toBe('test@example.com');
    });

    it('should reject invalid email format', async () => {
      req.body = {
        email: 'invalid-email',
        password: 'Password123',
        type: 'applicant',
        name: 'John Doe'
      };

      const middleware = validateRequest(authSchemas.signup);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('valid email')
          })
        ])
      );
    });

    it('should reject weak password', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'weak',
        type: 'applicant',
        name: 'John Doe'
      };

      const middleware = validateRequest(authSchemas.signup);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password'
          })
        ])
      );
    });

    it('should require contact number for recruiters', async () => {
      req.body = {
        email: 'recruiter@example.com',
        password: 'Password123',
        type: 'recruiter',
        name: 'Jane Recruiter'
      };

      const middleware = validateRequest(authSchemas.signup);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'contactNumber'
          })
        ])
      );
    });

    it('should validate job creation data', async () => {
      req.body = {
        title: 'Software Engineer',
        maxApplicants: 50,
        maxPositions: 2,
        deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        skillsets: ['JavaScript', 'Node.js'],
        jobType: 'full-time',
        salary: 75000
      };

      const middleware = validateRequest(jobSchemas.create);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.title).toBe('Software Engineer');
    });

    it('should reject job with past deadline', async () => {
      req.body = {
        title: 'Software Engineer',
        maxApplicants: 50,
        maxPositions: 2,
        deadline: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        skillsets: ['JavaScript', 'Node.js'],
        jobType: 'full-time',
        salary: 75000
      };

      const middleware = validateRequest(jobSchemas.create);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'deadline'
          })
        ])
      );
    });

    it('should skip validation when feature flag is disabled', async () => {
      featureFlags.isEnabled.mockReturnValue(false);
      req.body = { invalid: 'data' };

      const middleware = validateRequest(authSchemas.signup);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('sanitizeInput', () => {
    it('should remove script tags from input', () => {
      req.body = {
        name: 'John<script>alert("xss")</script>Doe',
        bio: 'Hello <iframe src="evil.com"></iframe> world'
      };

      const middleware = sanitizeInput;
      middleware(req, res, next);

      expect(req.body.name).toBe('JohnDoe');
      expect(req.body.bio).toBe('Hello  world');
      expect(next).toHaveBeenCalledWith();
    });

    it('should remove javascript: protocols', () => {
      req.body = {
        website: 'javascript:alert("xss")',
        description: 'Click <a href="javascript:void(0)">here</a>'
      };

      const middleware = sanitizeInput;
      middleware(req, res, next);

      expect(req.body.website).toBe('alert("xss")');
      expect(req.body.description).toBe('Click <a href="void(0)">here</a>');
    });

    it('should sanitize nested objects and arrays', () => {
      req.body = {
        education: [
          {
            institutionName: 'University<script>alert(1)</script>',
            description: 'Great <iframe></iframe> place'
          }
        ],
        skills: ['JavaScript<script></script>', 'Node.js']
      };

      const middleware = sanitizeInput;
      middleware(req, res, next);

      expect(req.body.education[0].institutionName).toBe('University');
      expect(req.body.education[0].description).toBe('Great  place');
      expect(req.body.skills[0]).toBe('JavaScript');
      expect(req.body.skills[1]).toBe('Node.js');
    });

    it('should sanitize query parameters', () => {
      req.query = {
        search: 'test<script>alert(1)</script>',
        filter: 'category'
      };

      const middleware = sanitizeInput;
      middleware(req, res, next);

      expect(req.query.search).toBe('test');
      expect(req.query.filter).toBe('category');
    });
  });

  describe('validateFileUpload', () => {
    it('should validate file size', () => {
      req.file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 6 * 1024 * 1024 // 6MB
      };

      const middleware = validateFileUpload({
        maxSize: 5 * 1024 * 1024, // 5MB limit
        allowedTypes: ['application/pdf']
      });
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'file',
            code: 'FILE_TOO_LARGE'
          })
        ])
      );
    });

    it('should validate file type', () => {
      req.file = {
        originalname: 'image.jpg',
        mimetype: 'image/jpeg',
        size: 1024 * 1024 // 1MB
      };

      const middleware = validateFileUpload({
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['application/pdf']
      });
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'file',
            code: 'INVALID_FILE_TYPE'
          })
        ])
      );
    });

    it('should reject suspicious file names', () => {
      req.file = {
        originalname: 'malware.exe',
        mimetype: 'application/octet-stream',
        size: 1024
      };

      const middleware = validateFileUpload({
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['application/octet-stream']
      });
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
      const error = next.mock.calls[0][0];
      expect(error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'file',
            code: 'FILE_CORRUPTED'
          })
        ])
      );
    });

    it('should pass valid file upload', () => {
      req.file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 2 * 1024 * 1024 // 2MB
      };

      const middleware = validateFileUpload({
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['application/pdf'],
        allowedExtensions: ['pdf']
      });
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Query validation', () => {
    it('should validate job search query parameters', async () => {
      req.query = {
        q: 'software engineer',
        jobType: 'full-time',
        salary: { min: 50000, max: 100000 },
        page: '1',
        limit: '10'
      };

      const middleware = validateQuery(jobSchemas.query);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.query.page).toBe(1); // Should be converted to number
      expect(req.query.limit).toBe(10);
    });

    it('should reject invalid query parameters', async () => {
      req.query = {
        page: 'invalid',
        limit: '1000' // Too high
      };

      const middleware = validateQuery(jobSchemas.query);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });
  });

  describe('Parameter validation', () => {
    it('should validate MongoDB ObjectId parameters', async () => {
      req.params = {
        id: '507f1f77bcf86cd799439011' // Valid ObjectId
      };

      const middleware = validateParams(validationSchemas['GET /api/jobs/:id']);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should reject invalid ObjectId parameters', async () => {
      req.params = {
        id: 'invalid-id'
      };

      const middleware = validateParams(validationSchemas['GET /api/jobs/:id']);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });
  });
});