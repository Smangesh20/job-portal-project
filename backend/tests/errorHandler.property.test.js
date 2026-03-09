/**
 * Property-Based Tests for Error Handler Middleware
 * **Validates: Requirements 2.1, 2.2, 2.5**
 * 
 * Property 4: Standardized Error Response Format
 * For any error condition, the error handler should return a consistent JSON format 
 * with error code, user-friendly message, field details, correlation ID, and timestamp.
 */

const fc = require('fast-check');
const { errorHandler, notFoundHandler, asyncHandler } = require('../middleware/errorHandler');
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  FileUploadError,
  RateLimitError 
} = require('../utils/errorClasses');
const { ERROR_CODES, HTTP_STATUS_CODES } = require('../utils/errorConstants');
const featureFlags = require('../middleware/featureFlags');

// Mock feature flags for testing
jest.mock('../middleware/featureFlags', () => ({
  isEnabled: jest.fn(() => true),
  enable: jest.fn(),
  disable: jest.fn(),
  getAll: jest.fn(() => ({})),
  flags: {}
}));

// Mock correlation middleware
jest.mock('../middleware/correlation', () => ({
  getCorrelationId: jest.fn(() => 'test-correlation-id-12345')
}));

// Mock logging middleware
jest.mock('../middleware/logging', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  }
}));

describe('Property-Based Tests: Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'POST',
      url: '/test',
      path: '/test',
      user: { id: 'test-user-123' },
      correlationId: 'test-correlation-id-12345'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      headersSent: false
    };
    next = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
    featureFlags.isEnabled.mockReturnValue(true);
  });

  /**
   * **Validates: Requirements 2.1, 2.2, 2.5**
   * Property 4: Standardized Error Response Format
   * 
   * For any error condition, the error handler should return a consistent JSON format
   * with error code, user-friendly message, field details, correlation ID, and timestamp.
   */
  describe('Property 4: Standardized Error Response Format', () => {
    
    test('Property 4.1: All error types produce standardized response format', () => {
      fc.assert(fc.property(
        fc.oneof(
          // Validation errors
          fc.record({
            type: fc.constant('ValidationError'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            details: fc.array(fc.record({
              field: fc.string({ minLength: 1, maxLength: 20 }),
              message: fc.string({ minLength: 1, maxLength: 50 }),
              code: fc.constantFrom('REQUIRED_FIELD', 'INVALID_FORMAT', 'INVALID_LENGTH')
            }), { maxLength: 5 })
          }),
          
          // Authentication errors
          fc.record({
            type: fc.constant('AuthenticationError'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            authType: fc.constantFrom('jwt', 'basic', 'oauth')
          }),
          
          // Authorization errors
          fc.record({
            type: fc.constant('AuthorizationError'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            requiredPermission: fc.constantFrom('read', 'write', 'admin')
          }),
          
          // Not found errors
          fc.record({
            type: fc.constant('NotFoundError'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            resourceType: fc.constantFrom('user', 'job', 'application')
          }),
          
          // Database errors
          fc.record({
            type: fc.constant('DatabaseError'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            operation: fc.constantFrom('create', 'read', 'update', 'delete')
          })
        ),
        (errorSpec) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          // Create error based on type
          let error;
          switch (errorSpec.type) {
            case 'ValidationError':
              error = new ValidationError(errorSpec.message, errorSpec.details);
              break;
            case 'AuthenticationError':
              error = new AuthenticationError(errorSpec.message, errorSpec.authType);
              break;
            case 'AuthorizationError':
              error = new AuthorizationError(errorSpec.message, errorSpec.requiredPermission);
              break;
            case 'NotFoundError':
              error = new NotFoundError(errorSpec.message, errorSpec.resourceType);
              break;
            case 'DatabaseError':
              error = new DatabaseError(errorSpec.message, errorSpec.operation);
              break;
          }

          // Process error through middleware
          errorHandler(error, req, res, next);

          // Property: Should call res.status with appropriate status code
          expect(res.status).toHaveBeenCalledTimes(1);
          const statusCode = res.status.mock.calls[0][0];
          expect(statusCode).toBeGreaterThanOrEqual(400);
          expect(statusCode).toBeLessThan(600);

          // Property: Should call res.json with standardized format
          expect(res.json).toHaveBeenCalledTimes(1);
          const response = res.json.mock.calls[0][0];

          // Property: Response must have standardized structure
          expect(response).toHaveProperty('success', false);
          expect(response).toHaveProperty('error');
          expect(response.error).toHaveProperty('code');
          expect(response.error).toHaveProperty('message');
          expect(response.error).toHaveProperty('correlationId');
          expect(response.error).toHaveProperty('timestamp');
          expect(response.error).toHaveProperty('retryable');

          // Property: Error code should be a string
          expect(typeof response.error.code).toBe('string');
          expect(response.error.code.length).toBeGreaterThan(0);

          // Property: Message should be a string
          expect(typeof response.error.message).toBe('string');
          expect(response.error.message.length).toBeGreaterThan(0);

          // Property: Correlation ID should be present
          expect(typeof response.error.correlationId).toBe('string');
          expect(response.error.correlationId).toBe('test-correlation-id-12345');

          // Property: Timestamp should be valid ISO string
          expect(typeof response.error.timestamp).toBe('string');
          expect(() => new Date(response.error.timestamp)).not.toThrow();

          // Property: Retryable should be boolean
          expect(typeof response.error.retryable).toBe('boolean');

          // Property: Details should be array for validation errors
          if (errorSpec.type === 'ValidationError') {
            expect(Array.isArray(response.error.details)).toBe(true);
            response.error.details.forEach(detail => {
              expect(detail).toHaveProperty('field');
              expect(detail).toHaveProperty('message');
              expect(detail).toHaveProperty('code');
            });
          }

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.2: MongoDB errors are translated to standardized format', () => {
      fc.assert(fc.property(
        fc.oneof(
          // Mongoose validation error
          fc.record({
            type: fc.constant('MongooseValidation'),
            errors: fc.record({
              email: fc.record({
                message: fc.constant('Email is required'),
                path: fc.constant('email')
              }),
              name: fc.record({
                message: fc.constant('Name must be at least 2 characters'),
                path: fc.constant('name')
              })
            })
          }),
          
          // MongoDB duplicate key error
          fc.record({
            type: fc.constant('MongoDuplicateKey'),
            code: fc.constant(11000),
            keyPattern: fc.record({
              email: fc.constant(1)
            }),
            keyValue: fc.record({
              email: fc.emailAddress()
            })
          })
        ),
        (errorSpec) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          let error;
          
          if (errorSpec.type === 'MongooseValidation') {
            error = new Error('Validation failed');
            error.name = 'ValidationError';
            error.errors = errorSpec.errors;
          } else if (errorSpec.type === 'MongoDuplicateKey') {
            error = new Error('Duplicate key error');
            error.code = errorSpec.code;
            error.keyPattern = errorSpec.keyPattern;
            error.keyValue = errorSpec.keyValue;
          }

          // Process error through middleware
          errorHandler(error, req, res, next);

          // Property: Should return standardized format
          expect(res.json).toHaveBeenCalledTimes(1);
          const response = res.json.mock.calls[0][0];

          expect(response.success).toBe(false);
          expect(response.error).toHaveProperty('code');
          expect(response.error).toHaveProperty('message');
          expect(response.error).toHaveProperty('correlationId');
          expect(response.error).toHaveProperty('timestamp');

          // Property: Mongoose validation errors should have details
          if (errorSpec.type === 'MongooseValidation') {
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
            expect(Array.isArray(response.error.details)).toBe(true);
            expect(response.error.details.length).toBeGreaterThan(0);
          }

          // Property: Duplicate key errors should have conflict status
          if (errorSpec.type === 'MongoDuplicateKey') {
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.CONFLICT);
            expect(response.error.code).toBe(ERROR_CODES.DUPLICATE_ENTRY);
          }

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.3: Error responses maintain consistency across feature flag states', () => {
      fc.assert(fc.property(
        fc.record({
          enhancedHandling: fc.boolean(),
          error: fc.oneof(
            fc.record({
              message: fc.string({ minLength: 1, maxLength: 50 }),
              statusCode: fc.constantFrom(400, 401, 403, 404, 500)
            })
          )
        }),
        ({ enhancedHandling, error: errorSpec }) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          featureFlags.isEnabled.mockImplementation((flag) => {
            if (flag === 'ENHANCED_ERROR_HANDLING') return enhancedHandling;
            return true;
          });

          const error = new Error(errorSpec.message);
          error.statusCode = errorSpec.statusCode;

          // Process error through middleware
          errorHandler(error, req, res, next);

          // Property: Should always call res.status and res.json
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledTimes(1);

          const response = res.json.mock.calls[0][0];

          if (enhancedHandling) {
            // Property: Enhanced handling should use standardized format
            expect(response).toHaveProperty('success', false);
            expect(response).toHaveProperty('error');
            expect(response.error).toHaveProperty('correlationId');
            expect(response.error).toHaveProperty('timestamp');
          } else {
            // Property: Legacy handling should still provide error information
            expect(response).toHaveProperty('error');
          }

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.4: Not found handler produces consistent format', () => {
      fc.assert(fc.property(
        fc.record({
          method: fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
          path: fc.string({ minLength: 1, maxLength: 50 }).map(s => '/' + s.replace(/\s/g, '')),
          enhancedHandling: fc.boolean()
        }),
        ({ method, path, enhancedHandling }) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          req.method = method;
          req.path = path;
          
          featureFlags.isEnabled.mockImplementation((flag) => {
            if (flag === 'ENHANCED_ERROR_HANDLING') return enhancedHandling;
            return true;
          });

          // Process through not found handler
          notFoundHandler(req, res, next);

          // Property: Should return 404 status
          expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.NOT_FOUND);
          expect(res.json).toHaveBeenCalledTimes(1);

          const response = res.json.mock.calls[0][0];

          if (enhancedHandling) {
            // Property: Enhanced format should be standardized
            expect(response.success).toBe(false);
            expect(response.error).toHaveProperty('code', ERROR_CODES.NOT_FOUND_ERROR);
            expect(response.error).toHaveProperty('message');
            expect(response.error.message).toContain(method);
            expect(response.error.message).toContain(path);
            expect(response.error).toHaveProperty('correlationId');
            expect(response.error).toHaveProperty('timestamp');
            expect(response.error.retryable).toBe(false);
          } else {
            // Property: Legacy format should still provide error info
            expect(response).toHaveProperty('error');
          }

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.5: Async handler properly catches and forwards errors', () => {
      fc.assert(fc.property(
        fc.record({
          shouldThrow: fc.boolean(),
          errorMessage: fc.string({ minLength: 1, maxLength: 50 }),
          isAsync: fc.boolean()
        }),
        ({ shouldThrow, errorMessage, isAsync }) => {
          // Reset mocks for each property test iteration
          next.mockClear();
          
          const mockHandler = jest.fn();
          
          if (shouldThrow) {
            if (isAsync) {
              mockHandler.mockRejectedValue(new Error(errorMessage));
            } else {
              mockHandler.mockImplementation(() => {
                throw new Error(errorMessage);
              });
            }
          } else {
            mockHandler.mockResolvedValue();
          }

          const wrappedHandler = asyncHandler(mockHandler);
          
          // Execute wrapped handler
          const result = wrappedHandler(req, res, next);

          // Property: Should return a promise
          expect(result).toBeInstanceOf(Promise);

          return result.then(() => {
            if (shouldThrow) {
              // Property: Should call next with error
              expect(next).toHaveBeenCalledTimes(1);
              const passedError = next.mock.calls[0][0];
              expect(passedError).toBeInstanceOf(Error);
              expect(passedError.message).toBe(errorMessage);
            } else {
              // Property: Should not call next if no error
              expect(mockHandler).toHaveBeenCalledWith(req, res, next);
            }
            return true;
          });
        }
      ), { numRuns: 10 });
    });

    test('Property 4.6: Error handler respects headersSent to prevent double responses', () => {
      fc.assert(fc.property(
        fc.record({
          headersSent: fc.boolean(),
          errorMessage: fc.string({ minLength: 1, maxLength: 50 })
        }),
        ({ headersSent, errorMessage }) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          res.headersSent = headersSent;
          const error = new Error(errorMessage);

          // Process error through middleware
          errorHandler(error, req, res, next);

          if (headersSent) {
            // Property: Should delegate to Express default handler
            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
          } else {
            // Property: Should handle error normally
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledTimes(1);
          }

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.7: Error responses exclude stack traces in production', () => {
      fc.assert(fc.property(
        fc.record({
          nodeEnv: fc.constantFrom('development', 'production', 'test'),
          errorMessage: fc.string({ minLength: 1, maxLength: 50 })
        }),
        ({ nodeEnv, errorMessage }) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          const originalEnv = process.env.NODE_ENV;
          process.env.NODE_ENV = nodeEnv;

          const error = new Error(errorMessage);
          error.stack = 'Error: test\n    at test.js:1:1';

          // Process error through middleware
          errorHandler(error, req, res, next);

          const response = res.json.mock.calls[0][0];

          if (nodeEnv === 'development') {
            // Property: Development should include stack trace
            expect(response.error).toHaveProperty('stack');
          } else {
            // Property: Production should exclude stack trace
            expect(response.error).not.toHaveProperty('stack');
          }

          // Restore original environment
          process.env.NODE_ENV = originalEnv;

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.8: All error responses include required fields with correct types', () => {
      fc.assert(fc.property(
        fc.oneof(
          fc.record({
            type: fc.constant('FileUploadError'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            fileType: fc.constantFrom('pdf', 'doc', 'jpg'),
            maxSize: fc.integer({ min: 1000, max: 10000000 })
          }),
          fc.record({
            type: fc.constant('RateLimitError'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            retryAfter: fc.integer({ min: 1, max: 3600 })
          }),
          fc.record({
            type: fc.constant('ExternalServiceError'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            service: fc.constantFrom('email', 'sms', 'payment')
          })
        ),
        (errorSpec) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          let error;
          switch (errorSpec.type) {
            case 'FileUploadError':
              error = new FileUploadError(errorSpec.message, errorSpec.fileType, errorSpec.maxSize);
              break;
            case 'RateLimitError':
              error = new RateLimitError(errorSpec.message, errorSpec.retryAfter);
              break;
            case 'ExternalServiceError':
              error = new ExternalServiceError(errorSpec.message, errorSpec.service);
              break;
          }

          // Process error through middleware
          errorHandler(error, req, res, next);

          const response = res.json.mock.calls[0][0];

          // Property: All responses must have standardized structure
          expect(response).toMatchObject({
            success: false,
            error: {
              code: expect.any(String),
              message: expect.any(String),
              correlationId: expect.any(String),
              timestamp: expect.any(String),
              retryable: expect.any(Boolean)
            }
          });

          // Property: Timestamp should be valid ISO 8601 format
          const timestamp = new Date(response.error.timestamp);
          expect(timestamp.toISOString()).toBe(response.error.timestamp);

          // Property: Correlation ID should be non-empty string
          expect(response.error.correlationId.length).toBeGreaterThan(0);

          // Property: Error code should be uppercase with underscores
          expect(response.error.code).toMatch(/^[A-Z_]+$/);

          // Property: Message should be non-empty and user-friendly
          expect(response.error.message.length).toBeGreaterThan(0);
          expect(response.error.message).not.toMatch(/stack|trace|internal/i);

          // Property: Details array should be present for certain error types
          if (errorSpec.type === 'FileUploadError' || errorSpec.type === 'RateLimitError') {
            expect(Array.isArray(response.error.details)).toBe(true);
          }

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.9: Error classification produces correct HTTP status codes', () => {
      fc.assert(fc.property(
        fc.oneof(
          fc.record({ type: fc.constant('ValidationError'), expectedStatus: fc.constant(400) }),
          fc.record({ type: fc.constant('AuthenticationError'), expectedStatus: fc.constant(401) }),
          fc.record({ type: fc.constant('AuthorizationError'), expectedStatus: fc.constant(403) }),
          fc.record({ type: fc.constant('NotFoundError'), expectedStatus: fc.constant(404) }),
          fc.record({ type: fc.constant('ConflictError'), expectedStatus: fc.constant(409) }),
          fc.record({ type: fc.constant('RateLimitError'), expectedStatus: fc.constant(429) }),
          fc.record({ type: fc.constant('DatabaseError'), expectedStatus: fc.constant(500) }),
          fc.record({ type: fc.constant('ExternalServiceError'), expectedStatus: fc.constant(502) })
        ),
        ({ type, expectedStatus }) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          let error;
          const message = `Test ${type}`;
          
          switch (type) {
            case 'ValidationError':
              error = new ValidationError(message);
              break;
            case 'AuthenticationError':
              error = new AuthenticationError(message);
              break;
            case 'AuthorizationError':
              error = new AuthorizationError(message);
              break;
            case 'NotFoundError':
              error = new NotFoundError(message);
              break;
            case 'ConflictError':
              error = new ConflictError(message);
              break;
            case 'RateLimitError':
              error = new RateLimitError(message);
              break;
            case 'DatabaseError':
              error = new DatabaseError(message);
              break;
            case 'ExternalServiceError':
              error = new ExternalServiceError(message);
              break;
          }

          // Process error through middleware
          errorHandler(error, req, res, next);

          // Property: Status code should match error type
          expect(res.status).toHaveBeenCalledWith(expectedStatus);

          const response = res.json.mock.calls[0][0];

          // Property: Retryable flag should be appropriate for error type
          const retryableTypes = ['RateLimitError', 'DatabaseError', 'ExternalServiceError'];
          const expectedRetryable = retryableTypes.includes(type);
          expect(response.error.retryable).toBe(expectedRetryable);

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.10: Correlation ID consistency across error handling', () => {
      fc.assert(fc.property(
        fc.record({
          correlationId: fc.option(fc.string({ minLength: 10, maxLength: 50 }), { nil: null }),
          errorType: fc.constantFrom('ValidationError', 'AuthenticationError', 'DatabaseError')
        }),
        ({ correlationId, errorType }) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          // Mock correlation ID
          const mockGetCorrelationId = require('../middleware/correlation').getCorrelationId;
          mockGetCorrelationId.mockReturnValue(correlationId || 'fallback-correlation-id');

          let error;
          switch (errorType) {
            case 'ValidationError':
              error = new ValidationError('Test validation error');
              break;
            case 'AuthenticationError':
              error = new AuthenticationError('Test auth error');
              break;
            case 'DatabaseError':
              error = new DatabaseError('Test database error');
              break;
          }

          // Process error through middleware
          errorHandler(error, req, res, next);

          const response = res.json.mock.calls[0][0];

          // Property: Response should include the correlation ID
          if (correlationId) {
            expect(response.error.correlationId).toBe(correlationId);
          } else {
            // Property: Should have fallback correlation ID
            expect(response.error.correlationId).toMatch(/fallback-\d+-[a-z0-9]+/);
          }

          return true;
        }
      ), { numRuns: 10 });
    });
  });

  /**
   * Additional Property Tests for Edge Cases and Robustness
   */
  describe('Property 4: Edge Cases and Robustness', () => {
    
    test('Property 4.11: Error handler gracefully handles malformed errors', () => {
      fc.assert(fc.property(
        fc.oneof(
          // Null/undefined errors
          fc.constant(null),
          fc.constant(undefined),
          
          // Errors with missing properties
          fc.record({
            message: fc.option(fc.string(), { nil: undefined }),
            statusCode: fc.option(fc.integer({ min: 400, max: 599 }), { nil: undefined }),
            stack: fc.option(fc.string(), { nil: undefined })
          }),
          
          // Circular reference errors
          fc.record({
            message: fc.string({ minLength: 1, maxLength: 50 }),
            circular: fc.constant('CIRCULAR_REF') // Will be replaced with circular reference
          })
        ),
        (errorSpec) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          let error;
          
          if (errorSpec === null || errorSpec === undefined) {
            error = errorSpec;
          } else if (errorSpec.circular) {
            error = new Error(errorSpec.message);
            error.circular = error; // Create circular reference
          } else {
            error = new Error(errorSpec.message || 'Unknown error');
            if (errorSpec.statusCode) error.statusCode = errorSpec.statusCode;
            if (errorSpec.stack) error.stack = errorSpec.stack;
          }

          // Process error through middleware - should not throw
          expect(() => {
            errorHandler(error, req, res, next);
          }).not.toThrow();

          // Property: Should always call res.status and res.json
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledTimes(1);

          const response = res.json.mock.calls[0][0];

          // Property: Should always return standardized format
          expect(response).toMatchObject({
            success: false,
            error: {
              code: expect.any(String),
              message: expect.any(String),
              correlationId: expect.any(String),
              timestamp: expect.any(String),
              retryable: expect.any(Boolean)
            }
          });

          return true;
        }
      ), { numRuns: 10 });
    });

    test('Property 4.12: Error handler maintains performance under load', () => {
      fc.assert(fc.property(
        fc.array(
          fc.record({
            type: fc.constantFrom('ValidationError', 'AuthenticationError', 'DatabaseError'),
            message: fc.string({ minLength: 1, maxLength: 100 })
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (errorSpecs) => {
          // Reset mocks for each property test iteration
          res.status.mockClear();
          res.json.mockClear();
          next.mockClear();
          
          const startTime = Date.now();
          
          // Process multiple errors in sequence
          errorSpecs.forEach((spec, index) => {
            // Create fresh response mocks for each error
            const mockRes = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
              headersSent: false
            };
            
            let error;
            switch (spec.type) {
              case 'ValidationError':
                error = new ValidationError(spec.message);
                break;
              case 'AuthenticationError':
                error = new AuthenticationError(spec.message);
                break;
              case 'DatabaseError':
                error = new DatabaseError(spec.message);
                break;
            }

            errorHandler(error, req, mockRes, next);
            
            // Property: Each error should be processed successfully
            expect(mockRes.status).toHaveBeenCalledTimes(1);
            expect(mockRes.json).toHaveBeenCalledTimes(1);
          });
          
          const processingTime = Date.now() - startTime;
          
          // Property: Processing should be reasonably fast (less than 100ms for 20 errors)
          expect(processingTime).toBeLessThan(100);

          return true;
        }
      ), { numRuns: 5 }); // Reduced runs for performance test
    });
  });
});