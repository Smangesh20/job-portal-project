/**
 * Integration Tests for Job Management Routes
 * Tests the enhanced job routes with actual middleware execution
 */

const { validateBody, validateQuery, validateParams, sanitizeInput, jobSchemas, paramSchemas } = require('../middleware/validation');
const { ValidationError, AuthorizationError, NotFoundError } = require('../utils/errorClasses');
const featureFlags = require('../middleware/featureFlags');

describe('Job Routes Integration Tests', () => {
  describe('Validation Middleware Integration', () => {
    it('should have job creation schema defined', () => {
      expect(jobSchemas.create).toBeDefined();
      expect(typeof jobSchemas.create.validate).toBe('function');
    });

    it('should have job update schema defined', () => {
      expect(jobSchemas.update).toBeDefined();
      expect(typeof jobSchemas.update.validate).toBe('function');
    });

    it('should have job query schema defined', () => {
      expect(jobSchemas.query).toBeDefined();
      expect(typeof jobSchemas.query.validate).toBe('function');
    });

    it('should have parameter validation schema defined', () => {
      expect(paramSchemas.objectId).toBeDefined();
      expect(typeof paramSchemas.objectId.validate).toBe('function');
    });

    it('should validate job creation data correctly', () => {
      const validJobData = {
        title: 'Software Engineer',
        maxApplicants: 10,
        maxPositions: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        skillsets: ['JavaScript', 'Node.js'],
        jobType: 'full-time',
        duration: 0,
        salary: 80000
      };

      const { error, value } = jobSchemas.create.validate(validJobData);
      expect(error).toBeUndefined();
      expect(value).toBeDefined();
      expect(value.title).toBe('Software Engineer');
    });

    it('should reject invalid job creation data', () => {
      const invalidJobData = {
        title: 'SE', // Too short
        maxApplicants: -5, // Negative
        // Missing required fields
      };

      const { error } = jobSchemas.create.validate(invalidJobData);
      expect(error).toBeDefined();
      expect(error.details).toBeDefined();
      expect(error.details.length).toBeGreaterThan(0);
    });

    it('should validate job update data correctly', () => {
      const validUpdateData = {
        maxApplicants: 15,
        maxPositions: 3,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };

      const { error, value } = jobSchemas.update.validate(validUpdateData);
      expect(error).toBeUndefined();
      expect(value).toBeDefined();
    });

    it('should reject empty job update data', () => {
      const emptyUpdateData = {};

      const { error } = jobSchemas.update.validate(emptyUpdateData);
      expect(error).toBeDefined();
      // Update schema requires at least one field
    });

    it('should validate MongoDB ObjectId format', () => {
      const validId = { id: '507f1f77bcf86cd799439011' };
      const { error } = paramSchemas.objectId.validate(validId);
      expect(error).toBeUndefined();
    });

    it('should reject invalid ObjectId format', () => {
      const invalidId = { id: 'invalid-id' };
      const { error } = paramSchemas.objectId.validate(invalidId);
      expect(error).toBeDefined();
    });
  });

  describe('Error Classes Integration', () => {
    it('should create ValidationError correctly', () => {
      const error = new ValidationError('Test validation error', [
        { field: 'title', message: 'Title is required', code: 'REQUIRED_FIELD' }
      ]);

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Test validation error');
      expect(error.details).toHaveLength(1);
      expect(error.details[0].field).toBe('title');
    });

    it('should create AuthorizationError correctly', () => {
      const error = new AuthorizationError('You don\'t have permissions');

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(error.message).toBe('You don\'t have permissions');
      expect(error.statusCode).toBe(403);
    });

    it('should create NotFoundError correctly', () => {
      const error = new NotFoundError('Job does not exist', 'job');

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Job does not exist');
      expect(error.resourceType).toBe('job');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('Feature Flags Integration', () => {
    it('should have feature flag functions available', () => {
      expect(typeof featureFlags.isEnabled).toBe('function');
      expect(typeof featureFlags.enable).toBe('function');
      expect(typeof featureFlags.disable).toBe('function');
    });

    it('should check INPUT_VALIDATION flag', () => {
      const result = featureFlags.isEnabled('INPUT_VALIDATION');
      expect(typeof result).toBe('boolean');
    });

    it('should check ENHANCED_ERROR_HANDLING flag', () => {
      const result = featureFlags.isEnabled('ENHANCED_ERROR_HANDLING');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Sanitization Integration', () => {
    it('should have sanitizeInput function available', () => {
      expect(typeof sanitizeInput).toBe('function');
    });

    it('should create sanitization middleware', () => {
      const middleware = sanitizeInput();
      expect(typeof middleware).toBe('function');
      expect(middleware.length).toBe(3); // req, res, next
    });
  });

  describe('Validation Middleware Functions', () => {
    it('should have validateBody function available', () => {
      expect(typeof validateBody).toBe('function');
    });

    it('should have validateQuery function available', () => {
      expect(typeof validateQuery).toBe('function');
    });

    it('should have validateParams function available', () => {
      expect(typeof validateParams).toBe('function');
    });

    it('should create validation middleware from schema', () => {
      const middleware = validateBody(jobSchemas.create);
      expect(typeof middleware).toBe('function');
      expect(middleware.length).toBe(3); // req, res, next
    });
  });

  describe('Job Schema Validation Rules', () => {
    it('should enforce title length constraints', () => {
      const tooShort = { ...getValidJobData(), title: 'AB' };
      const { error: error1 } = jobSchemas.create.validate(tooShort);
      expect(error1).toBeDefined();

      const tooLong = { ...getValidJobData(), title: 'A'.repeat(101) };
      const { error: error2 } = jobSchemas.create.validate(tooLong);
      expect(error2).toBeDefined();
    });

    it('should enforce maxApplicants constraints', () => {
      const negative = { ...getValidJobData(), maxApplicants: -1 };
      const { error: error1 } = jobSchemas.create.validate(negative);
      expect(error1).toBeDefined();

      const tooLarge = { ...getValidJobData(), maxApplicants: 1001 };
      const { error: error2 } = jobSchemas.create.validate(tooLarge);
      expect(error2).toBeDefined();
    });

    it('should enforce deadline must be in future', () => {
      const pastDate = { ...getValidJobData(), deadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() };
      const { error } = jobSchemas.create.validate(pastDate);
      expect(error).toBeDefined();
    });

    it('should enforce valid job types', () => {
      const invalidType = { ...getValidJobData(), jobType: 'invalid-type' };
      const { error } = jobSchemas.create.validate(invalidType);
      expect(error).toBeDefined();

      const validTypes = ['full-time', 'part-time', 'contract', 'internship'];
      validTypes.forEach(type => {
        const validData = { ...getValidJobData(), jobType: type };
        const { error } = jobSchemas.create.validate(validData);
        expect(error).toBeUndefined();
      });
    });

    it('should enforce skillsets array constraints', () => {
      const tooMany = { ...getValidJobData(), skillsets: Array(21).fill('skill') };
      const { error: error1 } = jobSchemas.create.validate(tooMany);
      expect(error1).toBeDefined();

      const empty = { ...getValidJobData(), skillsets: [] };
      const { error: error2 } = jobSchemas.create.validate(empty);
      expect(error2).toBeDefined();
    });

    it('should enforce salary constraints', () => {
      const negative = { ...getValidJobData(), salary: -1000 };
      const { error: error1 } = jobSchemas.create.validate(negative);
      expect(error1).toBeDefined();

      const tooLarge = { ...getValidJobData(), salary: 10000001 };
      const { error: error2 } = jobSchemas.create.validate(tooLarge);
      expect(error2).toBeDefined();
    });
  });

  describe('Query Parameter Validation', () => {
    it('should validate search query parameters', () => {
      const validQuery = {
        q: 'Software Engineer',
        jobType: 'full-time',
        page: 1,
        limit: 10
      };

      const { error } = jobSchemas.query.validate(validQuery);
      expect(error).toBeUndefined();
    });

    it('should apply default values for pagination', () => {
      const minimalQuery = {};
      const { error, value } = jobSchemas.query.validate(minimalQuery);
      expect(error).toBeUndefined();
      expect(value.page).toBe(1);
      expect(value.limit).toBe(10);
    });

    it('should enforce pagination limits', () => {
      const tooManyResults = { limit: 101 };
      const { error } = jobSchemas.query.validate(tooManyResults);
      expect(error).toBeDefined();
    });
  });
});

// Helper function to get valid job data
function getValidJobData() {
  return {
    title: 'Software Engineer',
    maxApplicants: 10,
    maxPositions: 2,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    skillsets: ['JavaScript', 'Node.js'],
    jobType: 'full-time',
    duration: 0,
    salary: 80000
  };
}
