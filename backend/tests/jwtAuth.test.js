/**
 * Unit Tests for JWT Authentication Error Handling
 * Tests specific JWT error scenarios and error message formatting
 */

const jwtAuth = require('../lib/jwtAuth');
const passport = require('passport');
const { AuthenticationError } = require('../utils/errorClasses');
const { ERROR_MESSAGES } = require('../utils/errorConstants');

// Mock passport
jest.mock('passport');

describe('JWT Authentication Error Handling', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Token Expired Errors', () => {
    test('should handle expired JWT token with specific error', () => {
      // Mock passport.authenticate to simulate expired token
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, { name: 'TokenExpiredError', message: 'jwt expired' });
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_EXPIRED,
          authType: 'token_expired'
        })
      );
      expect(next.mock.calls[0][0]).toBeInstanceOf(AuthenticationError);
    });
  });

  describe('Token Invalid Errors', () => {
    test('should handle malformed JWT token', () => {
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, { 
            name: 'JsonWebTokenError', 
            message: 'jwt malformed' 
          });
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_MALFORMED,
          authType: 'token_malformed'
        })
      );
    });

    test('should handle invalid signature', () => {
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, { 
            name: 'JsonWebTokenError', 
            message: 'invalid signature' 
          });
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_SIGNATURE_INVALID,
          authType: 'token_signature_invalid'
        })
      );
    });

    test('should handle generic JWT errors', () => {
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, { 
            name: 'JsonWebTokenError', 
            message: 'invalid token' 
          });
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_INVALID,
          authType: 'token_invalid'
        })
      );
    });
  });

  describe('Token Missing Errors', () => {
    test('should handle missing token', () => {
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, { message: 'No auth token' });
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_MISSING,
          authType: 'token_missing'
        })
      );
    });

    test('should handle JWT token does not exist message', () => {
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, { message: 'JWT Token does not exist' });
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_MISSING,
          authType: 'token_missing'
        })
      );
    });
  });

  describe('User Not Found Errors', () => {
    test('should handle user not found from token', () => {
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, { message: 'User associated with token not found' });
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_USER_NOT_FOUND,
          authType: 'token_user_not_found'
        })
      );
    });
  });

  describe('Successful Authentication', () => {
    test('should attach user to request on successful authentication', () => {
      const mockUser = { _id: '123', email: 'test@example.com', type: 'applicant' };
      
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, mockUser, null);
        };
      });

      jwtAuth(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledWith();
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('System Errors', () => {
    test('should pass through system errors', () => {
      const systemError = new Error('Database connection failed');
      
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(systemError, null, null);
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(systemError);
    });
  });

  describe('Edge Cases', () => {
    test('should handle authentication failure with no info object', () => {
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, null);
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_INVALID,
          authType: 'token_invalid'
        })
      );
    });

    test('should handle custom error messages from passport', () => {
      const customMessage = 'Custom authentication error';
      
      passport.authenticate.mockImplementation((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, false, { message: customMessage });
        };
      });

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: customMessage,
          authType: 'token_invalid'
        })
      );
    });
  });
});
