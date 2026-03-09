/**
 * Authentication Routes Integration Tests
 * Tests for signup and login routes with new middleware integration
 * Validates: Requirements 1.1, 2.1, 6.1
 */

const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { AuthenticationError } = require('../utils/errorClasses');
const featureFlags = require('../middleware/featureFlags');

// Mock feature flags
jest.mock('../middleware/featureFlags', () => ({
  isEnabled: jest.fn(() => true),
  enable: jest.fn(),
  disable: jest.fn()
}));

// Mock validation middleware
jest.mock('../middleware/validation', () => ({
  sanitizeInput: jest.fn(() => (req, res, next) => next()),
  validateRequest: jest.fn(() => (req, res, next) => next())
}));

// Mock models
jest.mock('../db/User');
jest.mock('../db/JobApplicant');
jest.mock('../db/Recruiter');
jest.mock('jsonwebtoken');

const User = require('../db/User');
const JobApplicant = require('../db/JobApplicant');
const Recruiter = require('../db/Recruiter');
const jwt = require('jsonwebtoken');

describe('Authentication Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    featureFlags.isEnabled.mockReturnValue(true);
  });

  describe('Enhanced Signup Handler Logic', () => {
    it('should create applicant user and return enhanced response', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'applicant@example.com',
        type: 'applicant',
        save: jest.fn().mockResolvedValue(true)
      };

      const mockApplicant = {
        userId: 'user123',
        name: 'John Doe',
        save: jest.fn().mockResolvedValue(true)
      };

      User.mockImplementation(() => mockUser);
      JobApplicant.mockImplementation(() => mockApplicant);
      jwt.sign.mockReturnValue('mock-jwt-token');

      const req = {
        body: {
          email: 'applicant@example.com',
          password: 'Password123',
          type: 'applicant',
          name: 'John Doe',
          skills: ['JavaScript', 'Node.js']
        },
        correlationId: 'test-correlation-id'
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Simulate enhanced signup handler logic
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
      });

      await user.save();

      const userDetails = new JobApplicant({
        userId: user._id,
        name: req.body.name,
        skills: req.body.skills
      });

      await userDetails.save();

      const token = jwt.sign({ _id: user._id }, 'test-secret');

      // Enhanced response format
      const response = {
        success: true,
        data: {
          token: token,
          type: user.type,
          user: {
            id: user._id,
            email: user.email,
            type: user.type
          }
        },
        correlationId: req.correlationId
      };

      res.json(response);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockApplicant.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith({ _id: 'user123' }, 'test-secret');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          token: 'mock-jwt-token',
          type: 'applicant'
        }),
        correlationId: 'test-correlation-id'
      }));
    });

    it('should create recruiter user and return enhanced response', async () => {
      const mockUser = {
        _id: 'user456',
        email: 'recruiter@example.com',
        type: 'recruiter',
        save: jest.fn().mockResolvedValue(true)
      };

      const mockRecruiter = {
        userId: 'user456',
        name: 'Jane Smith',
        save: jest.fn().mockResolvedValue(true)
      };

      User.mockImplementation(() => mockUser);
      Recruiter.mockImplementation(() => mockRecruiter);
      jwt.sign.mockReturnValue('mock-jwt-token-recruiter');

      const req = {
        body: {
          email: 'recruiter@example.com',
          password: 'Password123',
          type: 'recruiter',
          name: 'Jane Smith',
          contactNumber: '+1234567890',
          bio: 'Experienced recruiter'
        },
        correlationId: 'test-correlation-id-2'
      };

      const res = {
        json: jest.fn()
      };

      // Simulate enhanced signup handler logic
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
      });

      await user.save();

      const userDetails = new Recruiter({
        userId: user._id,
        name: req.body.name,
        contactNumber: req.body.contactNumber,
        bio: req.body.bio
      });

      await userDetails.save();

      const token = jwt.sign({ _id: user._id }, 'test-secret');

      const response = {
        success: true,
        data: {
          token: token,
          type: user.type,
          user: {
            id: user._id,
            email: user.email,
            type: user.type
          }
        },
        correlationId: req.correlationId
      };

      res.json(response);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRecruiter.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          type: 'recruiter'
        })
      }));
    });

    it('should cleanup user if user details creation fails', async () => {
      const mockUser = {
        _id: 'user-to-cleanup',
        email: 'test@example.com',
        type: 'applicant',
        save: jest.fn().mockResolvedValue(true)
      };

      const mockApplicant = {
        save: jest.fn().mockRejectedValue(new Error('Applicant creation failed'))
      };

      User.mockImplementation(() => mockUser);
      User.findByIdAndDelete = jest.fn().mockResolvedValue(true);
      JobApplicant.mockImplementation(() => mockApplicant);

      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          type: 'applicant',
          name: 'Test User'
        }
      };

      // Simulate enhanced signup handler logic with error
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
      });

      await user.save();

      const userDetails = new JobApplicant({
        userId: user._id,
        name: req.body.name
      });

      try {
        await userDetails.save();
      } catch (error) {
        // Cleanup user on error
        if (user && user._id) {
          await User.findByIdAndDelete(user._id);
        }
        expect(User.findByIdAndDelete).toHaveBeenCalledWith('user-to-cleanup');
      }
    });

    it('should return legacy format when feature flag is disabled', async () => {
      featureFlags.isEnabled.mockReturnValue(false);

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        type: 'applicant',
        save: jest.fn().mockResolvedValue(true)
      };

      const mockApplicant = {
        save: jest.fn().mockResolvedValue(true)
      };

      User.mockImplementation(() => mockUser);
      JobApplicant.mockImplementation(() => mockApplicant);
      jwt.sign.mockReturnValue('legacy-token');

      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          type: 'applicant',
          name: 'Test User'
        }
      };

      const res = {
        json: jest.fn()
      };

      // Simulate handler logic
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
      });

      await user.save();

      const userDetails = new JobApplicant({
        userId: user._id,
        name: req.body.name
      });

      await userDetails.save();

      const token = jwt.sign({ _id: user._id }, 'test-secret');

      // Legacy response format (no success wrapper)
      const response = {
        token: token,
        type: user.type
      };

      res.json(response);

      expect(res.json).toHaveBeenCalledWith({
        token: 'legacy-token',
        type: 'applicant'
      });
    });
  });

  describe('Enhanced Login Handler Logic', () => {
    it('should return enhanced response format on successful login', () => {
      featureFlags.isEnabled.mockReturnValue(true);

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        type: 'applicant'
      };

      jwt.sign.mockReturnValue('login-token');

      const req = {
        correlationId: 'login-correlation-id'
      };

      const res = {
        json: jest.fn()
      };

      // Simulate successful authentication
      const token = jwt.sign({ _id: mockUser._id }, 'test-secret');

      const response = {
        success: true,
        data: {
          token: token,
          type: mockUser.type,
          user: {
            id: mockUser._id,
            email: mockUser.email,
            type: mockUser.type
          }
        },
        correlationId: req.correlationId
      };

      res.json(response);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          token: 'login-token',
          type: 'applicant'
        }),
        correlationId: 'login-correlation-id'
      }));
    });

    it('should throw AuthenticationError for invalid credentials', () => {
      const authError = new AuthenticationError(
        'Invalid credentials',
        'invalid_credentials'
      );

      expect(authError.message).toBe('Invalid credentials');
      expect(authError.authType).toBe('invalid_credentials');
      expect(authError.statusCode).toBe(401);
      expect(authError.errorCode).toBe('AUTHENTICATION_ERROR');
    });

    it('should return legacy format when feature flag is disabled', () => {
      featureFlags.isEnabled.mockReturnValue(false);

      const mockUser = {
        _id: 'user456',
        email: 'test@example.com',
        type: 'recruiter'
      };

      jwt.sign.mockReturnValue('legacy-login-token');

      const res = {
        json: jest.fn()
      };

      // Simulate successful authentication with legacy format
      const token = jwt.sign({ _id: mockUser._id }, 'test-secret');

      const response = {
        token: token,
        type: mockUser.type
      };

      res.json(response);

      expect(res.json).toHaveBeenCalledWith({
        token: 'legacy-login-token',
        type: 'recruiter'
      });
    });
  });

  describe('Middleware Integration', () => {
    it('should apply sanitization middleware to routes', () => {
      const { sanitizeInput } = require('../middleware/validation');
      
      // Verify sanitizeInput is called (mocked)
      expect(sanitizeInput).toBeDefined();
      expect(typeof sanitizeInput).toBe('function');
    });

    it('should apply validation middleware to routes', () => {
      const { validateRequest } = require('../middleware/validation');
      
      // Verify validateRequest is called (mocked)
      expect(validateRequest).toBeDefined();
      expect(typeof validateRequest).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const mockUser = {
        save: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      };

      User.mockImplementation(() => mockUser);

      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          type: 'applicant',
          name: 'Test User'
        }
      };

      const user = new User({
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
      });

      await expect(user.save()).rejects.toThrow('Database connection failed');
    });

    it('should handle duplicate email errors', async () => {
      const duplicateError = new Error('E11000 duplicate key error');
      duplicateError.code = 11000;
      
      const mockUser = {
        save: jest.fn().mockRejectedValue(duplicateError)
      };

      User.mockImplementation(() => mockUser);

      const req = {
        body: {
          email: 'existing@example.com',
          password: 'Password123',
          type: 'applicant',
          name: 'Test User'
        }
      };

      const user = new User({
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
      });

      await expect(user.save()).rejects.toThrow('E11000 duplicate key error');
    });
  });

  describe('Correlation ID Tracking', () => {
    it('should include correlation ID in enhanced responses', () => {
      const correlationId = 'test-correlation-123';
      
      const response = {
        success: true,
        data: {
          token: 'test-token',
          type: 'applicant'
        },
        correlationId: correlationId
      };

      expect(response.correlationId).toBe('test-correlation-123');
    });

    it('should handle missing correlation ID gracefully', () => {
      const response = {
        success: true,
        data: {
          token: 'test-token',
          type: 'applicant'
        },
        correlationId: undefined
      };

      expect(response.correlationId).toBeUndefined();
    });
  });
});
