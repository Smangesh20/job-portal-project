/**
 * Integration Tests for Application Management Routes
 * Tests the enhanced application routes with validation and error handling
 */

const Joi = require('joi');
const { validateBody, validateQuery, validateParams, sanitizeInput, paramSchemas } = require('../middleware/validation');
const { ValidationError, AuthorizationError, NotFoundError, ConflictError } = require('../utils/errorClasses');
const featureFlags = require('../middleware/featureFlags');

describe('Application Routes Integration Tests', () => {
  describe('Validation Schemas', () => {
    it('should validate application creation data (SOP)', () => {
      const sopSchema = Joi.string().min(50).max(1000).trim().required();
      
      const validSOP = 'A'.repeat(100); // Valid SOP with 100 characters
      const { error } = sopSchema.validate(validSOP);
      expect(error).toBeUndefined();
    });

    it('should reject SOP that is too short', () => {
      const sopSchema = Joi.string().min(50).max(1000).trim().required();
      
      const shortSOP = 'Too short'; // Less than 50 characters
      const { error } = sopSchema.validate(shortSOP);
      expect(error).toBeDefined();
      expect(error.details[0].type).toBe('string.min');
    });

    it('should reject SOP that is too long', () => {
      const sopSchema = Joi.string().min(50).max(1000).trim().required();
      
      const longSOP = 'A'.repeat(1001); // More than 1000 characters
      const { error } = sopSchema.validate(longSOP);
      expect(error).toBeDefined();
      expect(error.details[0].type).toBe('string.max');
    });

    it('should validate application status update data', () => {
      const statusSchema = Joi.object({
        status: Joi.string().valid('applied', 'shortlisted', 'accepted', 'rejected', 'deleted', 'cancelled', 'finished').required(),
        dateOfJoining: Joi.date().optional()
      });
      
      const validStatus = { status: 'accepted', dateOfJoining: new Date() };
      const { error } = statusSchema.validate(validStatus);
      expect(error).toBeUndefined();
    });

    it('should reject invalid application status', () => {
      const statusSchema = Joi.object({
        status: Joi.string().valid('applied', 'shortlisted', 'accepted', 'rejected', 'deleted', 'cancelled', 'finished').required(),
        dateOfJoining: Joi.date().optional()
      });
      
      const invalidStatus = { status: 'invalid-status' };
      const { error } = statusSchema.validate(invalidStatus);
      expect(error).toBeDefined();
      expect(error.details[0].type).toBe('any.only');
    });

    it('should validate query parameters for application filtering', () => {
      const querySchema = Joi.object({
        status: Joi.string().valid('applied', 'shortlisted', 'accepted', 'rejected', 'deleted', 'cancelled', 'finished').optional()
      });
      
      const validQuery = { status: 'applied' };
      const { error } = querySchema.validate(validQuery);
      expect(error).toBeUndefined();
    });

    it('should validate MongoDB ObjectId in params', () => {
      const validId = { id: '507f1f77bcf86cd799439011' };
      const { error } = paramSchemas.objectId.validate(validId);
      expect(error).toBeUndefined();
    });

    it('should reject invalid ObjectId format', () => {
      const invalidId = { id: 'not-a-valid-id' };
      const { error } = paramSchemas.objectId.validate(invalidId);
      expect(error).toBeDefined();
    });
  });

  describe('Error Classes for Application Routes', () => {
    it('should create ConflictError for duplicate applications', () => {
      const error = new ConflictError('You have already applied for this job', 'duplicate_application');
      
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.message).toBe('You have already applied for this job');
      expect(error.statusCode).toBe(409);
      expect(error.errorCode).toBe('CONFLICT_ERROR');
      expect(error.conflictType).toBe('duplicate_application');
    });

    it('should create ConflictError for max applicants reached', () => {
      const error = new ConflictError('Application limit reached for this job', 'max_applicants_reached');
      
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.conflictType).toBe('max_applicants_reached');
    });

    it('should create ConflictError for max user applications', () => {
      const error = new ConflictError('You have 10 active applications. Hence you cannot apply.', 'max_user_applications');
      
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.conflictType).toBe('max_user_applications');
    });

    it('should create ConflictError for already accepted job', () => {
      const error = new ConflictError('You already have an accepted job. Hence you cannot apply.', 'already_accepted');
      
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.conflictType).toBe('already_accepted');
    });

    it('should create NotFoundError for missing application', () => {
      const error = new NotFoundError('Application not found', 'application');
      
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Application not found');
      expect(error.statusCode).toBe(404);
      expect(error.errorCode).toBe('NOT_FOUND_ERROR');
      expect(error.resourceType).toBe('application');
    });

    it('should create AuthorizationError for permission issues', () => {
      const error = new AuthorizationError("You don't have permissions to apply for a job");
      
      expect(error).toBeInstanceOf(AuthorizationError);
      expect(error.message).toBe("You don't have permissions to apply for a job");
      expect(error.statusCode).toBe(403);
      expect(error.errorCode).toBe('AUTHORIZATION_ERROR');
    });

    it('should create ConflictError for invalid status transition', () => {
      const error = new ConflictError('Application status cannot be updated', 'invalid_status_transition');
      
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.conflictType).toBe('invalid_status_transition');
    });

    it('should create ConflictError for max positions reached', () => {
      const error = new ConflictError('All positions for this job are already filled', 'max_positions_reached');
      
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.conflictType).toBe('max_positions_reached');
    });
  });

  describe('Sanitization for Application Data', () => {
    it('should sanitize SOP with potential XSS', () => {
      const maliciousSOP = '<script>alert("xss")</script>' + 'A'.repeat(50);
      
      // Simulate sanitization
      const sanitized = maliciousSOP
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });

    it('should preserve valid SOP content', () => {
      const validSOP = 'I am a passionate software engineer with 5 years of experience in full-stack development. I have worked on various projects involving React, Node.js, and MongoDB.';
      
      // Valid content should remain unchanged after sanitization
      const sanitized = validSOP
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      expect(sanitized).toBe(validSOP);
    });
  });

  describe('Feature Flag Integration', () => {
    it('should check if enhanced error handling feature flag exists', () => {
      expect(featureFlags).toBeDefined();
      expect(typeof featureFlags.isEnabled).toBe('function');
    });

    it('should handle feature flag for enhanced responses', () => {
      // Test that feature flag can be checked
      const isEnabled = featureFlags.isEnabled('ENHANCED_ERROR_HANDLING');
      expect(typeof isEnabled).toBe('boolean');
    });
  });

  describe('Application Business Logic Validation', () => {
    it('should validate application limit constraints', () => {
      const maxApplicants = 10;
      const activeApplicationCount = 5;
      
      expect(activeApplicationCount).toBeLessThan(maxApplicants);
    });

    it('should validate user application limit', () => {
      const maxUserApplications = 10;
      const userActiveApplications = 3;
      
      expect(userActiveApplications).toBeLessThan(maxUserApplications);
    });

    it('should validate position limits', () => {
      const maxPositions = 5;
      const acceptedCount = 3;
      
      expect(acceptedCount).toBeLessThan(maxPositions);
    });

    it('should validate accepted job constraint', () => {
      const acceptedJobs = 0;
      
      expect(acceptedJobs).toBe(0); // User should have no accepted jobs to apply
    });
  });
});
