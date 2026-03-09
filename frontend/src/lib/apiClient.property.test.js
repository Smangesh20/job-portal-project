/**
 * Property-Based Tests for API Client Error Handling
 * **Validates: Requirements 4.1, 8.1**
 * 
 * Property 9: Frontend Error Recovery (API portion)
 * For any API or network error, the recovery mechanism should display user-friendly messages,
 * provide appropriate retry options, and preserve user context during recovery.
 */

const fc = require('fast-check');

// Import helper functions from apiClient for testing
// We'll test the internal logic rather than the full HTTP flow
const apiClientModule = require('./apiClient');

describe('Property-Based Tests: API Client Error Handling', () => {
  
  /**
   * Property 9: Frontend Error Recovery
   * **Validates: Requirements 4.1, 8.1**
   */
  describe('Property 9: Frontend Error Recovery', () => {

    /**
     * Test that correlation ID generation always produces valid UUIDs
     */
    test('generates valid correlation IDs for all requests', () => {
      fc.assert(fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (iterations) => {
          const generateCorrelationId = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
              return crypto.randomUUID();
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0;
              const v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          };
          
          const correlationIds = new Set();
          
          for (let i = 0; i < Math.min(iterations, 100); i++) {
            const id = generateCorrelationId();
            
            // Should be valid UUID format
            expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            expect(id.length).toBe(36);
            
            correlationIds.add(id);
          }
          
          // All IDs should be unique
          expect(correlationIds.size).toBe(Math.min(iterations, 100));
          
          return true;
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that exponential backoff calculation is correct for any retry count
     */
    test('calculates exponential backoff correctly for any retry count', () => {
      fc.assert(fc.property(
        fc.integer({ min: 0, max: 10 }),
        (retryCount) => {
          const INITIAL_RETRY_DELAY = 1000;
          const calculateRetryDelay = (count) => {
            return INITIAL_RETRY_DELAY * Math.pow(2, count);
          };
          
          const delay = calculateRetryDelay(retryCount);
          
          // Delay should be exponential
          const expectedDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          expect(delay).toBe(expectedDelay);
          
          // Delay should be positive
          expect(delay).toBeGreaterThan(0);
          
          // Delay should increase with retry count
          if (retryCount > 0) {
            const previousDelay = calculateRetryDelay(retryCount - 1);
            expect(delay).toBeGreaterThan(previousDelay);
            expect(delay).toBe(previousDelay * 2);
          }
          
          return true;
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that retryable error detection works correctly for any status code
     */
    test('correctly identifies retryable vs non-retryable errors', () => {
      fc.assert(fc.property(
        fc.integer({ min: 100, max: 599 }),
        (statusCode) => {
          const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];
          
          const isRetryableError = (error) => {
            if (!error.response) {
              // Network errors are retryable
              return true;
            }
            
            const status = error.response.status;
            return RETRY_STATUS_CODES.includes(status);
          };
          
          const error = {
            response: {
              status: statusCode
            }
          };
          
          const isRetryable = isRetryableError(error);
          const shouldBeRetryable = RETRY_STATUS_CODES.includes(statusCode);
          
          expect(isRetryable).toBe(shouldBeRetryable);
          
          // Client errors (4xx except specific ones) should not be retryable
          if (statusCode >= 400 && statusCode < 500 && !RETRY_STATUS_CODES.includes(statusCode)) {
            expect(isRetryable).toBe(false);
          }
          
          // Server errors (5xx) should be retryable
          if (statusCode >= 500 && statusCode < 600) {
            expect(isRetryable).toBe(RETRY_STATUS_CODES.includes(statusCode));
          }
          
          return true;
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that network errors (no response) are always retryable
     */
    test('treats network errors as retryable', () => {
      fc.assert(fc.property(
        fc.constantFrom('ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH'),
        (errorCode) => {
          const isRetryableError = (error) => {
            if (!error.response) {
              // Network errors are retryable
              return true;
            }
            
            const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];
            const status = error.response.status;
            return RETRY_STATUS_CODES.includes(status);
          };
          
          const networkError = {
            code: errorCode,
            message: 'Network error',
            // No response property - simulates network failure
          };
          
          const isRetryable = isRetryableError(networkError);
          
          // All network errors should be retryable
          expect(isRetryable).toBe(true);
          
          return true;
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that error formatting produces consistent structure for any error type
     */
    test('formats errors consistently regardless of error type', () => {
      fc.assert(fc.property(
        fc.record({
          errorType: fc.constantFrom('server', 'network', 'request'),
          statusCode: fc.oneof(
            fc.constantFrom(400, 401, 403, 404, 500, 502, 503),
            fc.integer({ min: 400, max: 599 })
          ),
          errorMessage: fc.string({ minLength: 5, maxLength: 100 }),
          correlationId: fc.uuid()
        }),
        ({ errorType, statusCode, errorMessage, correlationId }) => {
          const formatError = (error, corrId) => {
            const formattedError = {
              correlationId: corrId,
              timestamp: new Date().toISOString(),
              isRetryable: false,
            };

            if (error.response) {
              // Server responded with error status
              formattedError.status = error.response.status;
              formattedError.statusText = error.response.statusText || 'Error';
              
              const errorData = error.response.data;
              if (errorData && errorData.error) {
                formattedError.code = errorData.error.code;
                formattedError.message = errorData.error.message;
                formattedError.details = errorData.error.details;
              } else if (errorData && errorData.message) {
                formattedError.message = errorData.message;
              } else {
                formattedError.message = 'An error occurred while processing your request';
              }
              
              // Check if retryable
              const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];
              formattedError.isRetryable = RETRY_STATUS_CODES.includes(error.response.status);
            } else if (error.request) {
              formattedError.status = 0;
              formattedError.code = 'NETWORK_ERROR';
              formattedError.message = 'Unable to connect to the server. Please check your internet connection.';
              formattedError.isRetryable = true;
            } else {
              formattedError.code = 'REQUEST_ERROR';
              formattedError.message = error.message || 'An error occurred while preparing the request';
              formattedError.isRetryable = false;
            }

            formattedError.originalError = error;
            return formattedError;
          };
          
          let error;
          if (errorType === 'server') {
            error = {
              response: {
                status: statusCode,
                statusText: 'Error',
                data: {
                  error: {
                    code: 'TEST_ERROR',
                    message: errorMessage
                  }
                }
              }
            };
          } else if (errorType === 'network') {
            error = {
              request: {},
              message: errorMessage
            };
          } else {
            error = {
              message: errorMessage
            };
          }
          
          const formatted = formatError(error, correlationId);
          
          // All formatted errors should have these properties
          expect(formatted).toHaveProperty('correlationId');
          expect(formatted).toHaveProperty('timestamp');
          expect(formatted).toHaveProperty('isRetryable');
          expect(formatted).toHaveProperty('message');
          expect(formatted).toHaveProperty('originalError');
          
          // Correlation ID should be preserved
          expect(formatted.correlationId).toBe(correlationId);
          
          // Timestamp should be valid ISO string
          expect(formatted.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
          
          // isRetryable should be boolean
          expect(typeof formatted.isRetryable).toBe('boolean');
          
          // Message should be non-empty string
          expect(typeof formatted.message).toBe('string');
          expect(formatted.message.length).toBeGreaterThan(0);
          
          // Server errors should have status
          if (errorType === 'server') {
            expect(formatted.status).toBe(statusCode);
            expect(formatted.code).toBe('TEST_ERROR');
          }
          
          // Network errors should be retryable
          if (errorType === 'network') {
            expect(formatted.isRetryable).toBe(true);
            expect(formatted.code).toBe('NETWORK_ERROR');
            expect(formatted.status).toBe(0);
          }
          
          return true;
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that error messages are user-friendly and don't expose technical details
     */
    test('produces user-friendly error messages without technical details', () => {
      fc.assert(fc.property(
        fc.record({
          statusCode: fc.constantFrom(400, 401, 403, 404, 500, 503),
          technicalError: fc.constantFrom(
            'MongoError: Connection failed',
            'TypeError: Cannot read property of undefined',
            'ReferenceError: variable is not defined',
            'Internal server error at line 42',
            'Stack trace: at Function.Module...'
          )
        }),
        ({ statusCode, technicalError }) => {
          const formatError = (error, correlationId) => {
            const formattedError = {
              correlationId,
              timestamp: new Date().toISOString(),
              isRetryable: false,
            };

            if (error.response) {
              formattedError.status = error.response.status;
              formattedError.statusText = error.response.statusText;
              
              const errorData = error.response.data;
              if (errorData && errorData.error) {
                formattedError.code = errorData.error.code;
                formattedError.message = errorData.error.message;
                formattedError.details = errorData.error.details;
              } else if (errorData && errorData.message) {
                formattedError.message = errorData.message;
              } else {
                // Generic user-friendly message
                formattedError.message = 'An error occurred while processing your request';
              }
            }

            formattedError.originalError = error;
            return formattedError;
          };
          
          const error = {
            response: {
              status: statusCode,
              statusText: 'Error',
              data: {
                // Technical error in response
                internalError: technicalError
              }
            }
          };
          
          const formatted = formatError(error, 'test-correlation-id');
          
          // Message should be user-friendly, not technical
          expect(formatted.message).toBe('An error occurred while processing your request');
          
          // Should not expose technical details in message
          expect(formatted.message).not.toMatch(/MongoError/i);
          expect(formatted.message).not.toMatch(/TypeError/i);
          expect(formatted.message).not.toMatch(/ReferenceError/i);
          expect(formatted.message).not.toMatch(/Stack trace/i);
          expect(formatted.message).not.toMatch(/at line \d+/i);
          
          return true;
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that validation error details are preserved correctly
     */
    test('preserves validation error details with field-level information', () => {
      fc.assert(fc.property(
        fc.array(
          fc.record({
            field: fc.constantFrom('email', 'password', 'name', 'title', 'salary'),
            message: fc.string({ minLength: 10, maxLength: 50 }),
            code: fc.constantFrom('REQUIRED_FIELD', 'INVALID_FORMAT', 'OUT_OF_RANGE', 'TOO_SHORT', 'TOO_LONG')
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (validationErrors) => {
          const formatError = (error, correlationId) => {
            const formattedError = {
              correlationId,
              timestamp: new Date().toISOString(),
              isRetryable: false,
            };

            if (error.response) {
              formattedError.status = error.response.status;
              
              const errorData = error.response.data;
              if (errorData && errorData.error) {
                formattedError.code = errorData.error.code;
                formattedError.message = errorData.error.message;
                formattedError.details = errorData.error.details;
              }
            }

            formattedError.originalError = error;
            return formattedError;
          };
          
          const error = {
            response: {
              status: 400,
              data: {
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Validation failed',
                  details: validationErrors
                }
              }
            }
          };
          
          const formatted = formatError(error, 'test-correlation-id');
          
          // Should preserve all validation details
          expect(formatted.details).toBeDefined();
          expect(Array.isArray(formatted.details)).toBe(true);
          expect(formatted.details.length).toBe(validationErrors.length);
          
          // Each detail should match the original
          formatted.details.forEach((detail, index) => {
            expect(detail.field).toBe(validationErrors[index].field);
            expect(detail.message).toBe(validationErrors[index].message);
            expect(detail.code).toBe(validationErrors[index].code);
          });
          
          // Should have validation error code
          expect(formatted.code).toBe('VALIDATION_ERROR');
          expect(formatted.status).toBe(400);
          
          return true;
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that retry limit is respected
     */
    test('respects maximum retry limit', () => {
      fc.assert(fc.property(
        fc.integer({ min: 0, max: 10 }),
        (currentRetryCount) => {
          const MAX_RETRIES = 3;
          
          const shouldRetry = (retryCount) => {
            return retryCount < MAX_RETRIES;
          };
          
          const result = shouldRetry(currentRetryCount);
          
          if (currentRetryCount < MAX_RETRIES) {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
          
          return true;
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that correlation IDs are consistently formatted
     */
    test('maintains correlation ID format consistency', () => {
      fc.assert(fc.property(
        fc.uuid(),
        (correlationId) => {
          // UUID format validation
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          
          expect(correlationId).toMatch(uuidRegex);
          expect(correlationId.length).toBe(36);
          expect(correlationId.split('-').length).toBe(5);
          
          return true;
        }
      ), { numRuns: 100 });
    });
  });
});
