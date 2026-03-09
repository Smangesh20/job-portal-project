/**
 * Property-Based Tests for JWT Authentication Error Handling
 * Feature: error-handling-validation
 * 
 * **Property 6: Authentication Error Categorization**
 * **Validates: Requirements 2.4, 6.1, 6.2, 6.3**
 * 
 * For any authentication or authorization failure, the error handler should return 
 * specific error codes that distinguish between different failure types while maintaining security
 */

const fc = require('fast-check');
const jwtAuth = require('../lib/jwtAuth');
const passport = require('passport');
const { AuthenticationError } = require('../utils/errorClasses');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorConstants');

// Mock passport
jest.mock('passport');

describe('Property-Based Tests: JWT Authentication Error Categorization', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 6.1: All authentication failures produce AuthenticationError instances
   * Validates: Requirement 6.1 - JWT tokens invalid or expired return specific error codes
   */
  test('Property 6.1: All authentication failures produce AuthenticationError instances', () => {
    const jwtErrorArbitrary = fc.oneof(
      fc.constant({ name: 'TokenExpiredError', message: 'jwt expired' }),
      fc.constant({ name: 'JsonWebTokenError', message: 'jwt malformed' }),
      fc.constant({ name: 'JsonWebTokenError', message: 'invalid signature' }),
      fc.constant({ name: 'JsonWebTokenError', message: 'invalid token' }),
      fc.constant({ message: 'No auth token' }),
      fc.constant({ message: 'JWT Token does not exist' }),
      fc.constant({ message: 'User not found' })
    );

    fc.assert(
      fc.property(jwtErrorArbitrary, (errorInfo) => {
        // Clear mocks before each property run
        next.mockClear();
        
        // Setup mock
        passport.authenticate.mockImplementation((strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, false, errorInfo);
          };
        });

        // Execute
        jwtAuth(req, res, next);

        // Verify
        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(AuthenticationError);
        expect(error.authType).toBeDefined();
        expect(error.message).toBeDefined();
        expect(error.statusCode).toBe(401);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.2: Each JWT error type maps to a specific error code
   * Validates: Requirement 6.1 - Specific error codes for different token scenarios
   */
  test('Property 6.2: Each JWT error type maps to a specific error code', () => {
    const errorTypeMapping = [
      { info: { name: 'TokenExpiredError', message: 'jwt expired' }, expectedType: 'token_expired' },
      { info: { name: 'JsonWebTokenError', message: 'jwt malformed' }, expectedType: 'token_malformed' },
      { info: { name: 'JsonWebTokenError', message: 'invalid signature' }, expectedType: 'token_signature_invalid' },
      { info: { message: 'No auth token' }, expectedType: 'token_missing' },
      { info: { message: 'JWT Token does not exist' }, expectedType: 'token_missing' },
      { info: { message: 'User not found' }, expectedType: 'token_user_not_found' }
    ];

    fc.assert(
      fc.property(fc.constantFrom(...errorTypeMapping), (errorCase) => {
        // Clear mocks before each property run
        next.mockClear();
        
        // Setup mock
        passport.authenticate.mockImplementation((strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, false, errorCase.info);
          };
        });

        // Execute
        jwtAuth(req, res, next);

        // Verify
        const error = next.mock.calls[0][0];
        expect(error.authType).toBe(errorCase.expectedType);
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Property 6.3: Error messages are user-friendly and don't expose security details
   * Validates: Requirement 6.3 - Secure login error messages
   */
  test('Property 6.3: Error messages are user-friendly and do not expose security details', () => {
    const jwtErrorArbitrary = fc.oneof(
      fc.constant({ name: 'TokenExpiredError', message: 'jwt expired' }),
      fc.constant({ name: 'JsonWebTokenError', message: 'jwt malformed' }),
      fc.constant({ name: 'JsonWebTokenError', message: 'invalid signature' }),
      fc.constant({ message: 'No auth token' }),
      fc.constant({ message: 'User not found' })
    );

    fc.assert(
      fc.property(jwtErrorArbitrary, (errorInfo) => {
        // Setup mock
        passport.authenticate.mockImplementation((strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, false, errorInfo);
          };
        });

        // Execute
        jwtAuth(req, res, next);

        // Verify
        const error = next.mock.calls[0][0];
        const message = error.message.toLowerCase();
        
        // Should not expose internal details
        expect(message).not.toContain('database');
        expect(message).not.toContain('query');
        expect(message).not.toContain('stack');
        expect(message).not.toContain('secret');
        expect(message).not.toContain('key');
        expect(message).not.toContain('password');
        
        // Should be user-friendly
        expect(error.message.length).toBeGreaterThan(10);
        expect(error.message.length).toBeLessThan(200);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.4: Successful authentication always attaches user to request
   * Validates: Requirement 6.1 - Proper authentication flow
   */
  test('Property 6.4: Successful authentication always attaches user to request', () => {
    const userArbitrary = fc.record({
      _id: fc.string({ minLength: 24, maxLength: 24 }),
      email: fc.emailAddress(),
      type: fc.constantFrom('applicant', 'recruiter'),
      name: fc.string({ minLength: 2, maxLength: 50 })
    });

    fc.assert(
      fc.property(userArbitrary, (user) => {
        // Clear mocks and reset request
        next.mockClear();
        req.user = undefined;
        
        // Setup mock
        passport.authenticate.mockImplementation((strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, user, null);
          };
        });

        // Execute
        jwtAuth(req, res, next);

        // Verify
        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalledWith();
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.5: System errors are passed through without modification
   * Validates: Requirement 6.1 - Proper error propagation
   */
  test('Property 6.5: System errors are passed through without modification', () => {
    const systemErrorArbitrary = fc.string({ minLength: 10, maxLength: 100 }).map(
      msg => new Error(msg)
    );

    fc.assert(
      fc.property(systemErrorArbitrary, (systemError) => {
        // Clear mocks before each property run
        next.mockClear();
        
        // Setup mock
        passport.authenticate.mockImplementation((strategy, options, callback) => {
          return (req, res, next) => {
            callback(systemError, null, null);
          };
        });

        // Execute
        jwtAuth(req, res, next);

        // Verify - system errors should be passed through
        expect(next).toHaveBeenCalledWith(systemError);
        // Verify it's the same error object (not wrapped)
        const passedError = next.mock.calls[0][0];
        expect(passedError.message).toBe(systemError.message);
        expect(passedError).toBeInstanceOf(Error);
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Property 6.6: All authentication errors have consistent structure
   * Validates: Requirement 2.4 - Standardized error format for authentication
   */
  test('Property 6.6: All authentication errors have consistent structure', () => {
    const jwtErrorArbitrary = fc.oneof(
      fc.constant({ name: 'TokenExpiredError', message: 'jwt expired' }),
      fc.constant({ name: 'JsonWebTokenError', message: 'jwt malformed' }),
      fc.constant({ name: 'JsonWebTokenError', message: 'invalid signature' }),
      fc.constant({ message: 'No auth token' }),
      fc.constant({ message: 'User not found' })
    );

    fc.assert(
      fc.property(jwtErrorArbitrary, (errorInfo) => {
        // Setup mock
        passport.authenticate.mockImplementation((strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, false, errorInfo);
          };
        });

        // Execute
        jwtAuth(req, res, next);

        // Verify consistent structure
        const error = next.mock.calls[0][0];
        expect(error).toHaveProperty('message');
        expect(error).toHaveProperty('authType');
        expect(error).toHaveProperty('statusCode');
        expect(error).toHaveProperty('errorCode');
        expect(error).toHaveProperty('isOperational');
        expect(error).toHaveProperty('timestamp');
        
        // Verify correct values
        expect(error.statusCode).toBe(401);
        expect(error.errorCode).toBe('AUTHENTICATION_ERROR');
        expect(error.isOperational).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6.7: Token type detection is deterministic
   * Validates: Requirement 6.1 - Consistent error code assignment
   */
  test('Property 6.7: Token type detection is deterministic', () => {
    const errorInfo = { name: 'TokenExpiredError', message: 'jwt expired' };

    fc.assert(
      fc.property(fc.constant(errorInfo), (info) => {
        // Setup mock
        passport.authenticate.mockImplementation((strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, false, info);
          };
        });

        // Execute multiple times
        jwtAuth(req, res, next);
        const firstError = next.mock.calls[0][0];
        
        // Clear and execute again
        next.mockClear();
        jwtAuth(req, res, next);
        const secondError = next.mock.calls[0][0];

        // Verify same error type produced
        expect(firstError.authType).toBe(secondError.authType);
        expect(firstError.message).toBe(secondError.message);
      }),
      { numRuns: 50 }
    );
  });
});
