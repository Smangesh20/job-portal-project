/**
 * Property-Based Tests for Database Error Translation
 * **Validates: Requirements 2.3, 5.2, 5.3**
 * 
 * Property 5: Database Error Translation
 * For any database error, the error handler should translate technical MongoDB errors 
 * into user-friendly messages with appropriate HTTP status codes.
 */

const fc = require('fast-check');
const {
  translateDatabaseError,
  extractDuplicateKeyInfo,
  generateDuplicateKeyMessage,
  translateValidationMessage,
  getValidationErrorCode,
  generateCastErrorMessage,
  isDatabaseError
} = require('../middleware/databaseErrorTranslator');
const { 
  ValidationError, 
  ConflictError, 
  DatabaseError 
} = require('../utils/errorClasses');
const { ERROR_CODES } = require('../utils/errorConstants');

describe('Property-Based Tests: Database Error Translation', () => {

  /**
   * **Validates: Requirements 2.3, 5.2, 5.3**
   * Property 5: Database Error Translation
   * 
   * For any database error, the error handler should translate technical MongoDB errors 
   * into user-friendly messages with appropriate HTTP status codes.
   */
  describe('Property 5: Database Error Translation', () => {
    
    test('should translate all MongoDB connection errors to user-friendly messages', () => {
      fc.assert(fc.property(
        fc.constantFrom(
          'MongoNetworkError',
          'MongoServerError',
          'MongoTimeoutError',
          'MongoServerSelectionError',
          'MongoTopologyClosedError'
        ),
        fc.string({ minLength: 1, maxLength: 100 }),
        (errorName, message) => {
          const error = new Error(message);
          error.name = errorName;
          
          const translated = translateDatabaseError(error);
          
          // Should return a DatabaseError
          expect(translated).toBeInstanceOf(DatabaseError);
          
          // Should have user-friendly message (not technical)
          expect(translated.message).toBeDefined();
          expect(translated.message.length).toBeGreaterThan(0);
          expect(translated.message).not.toContain('Mongo');
          
          // Connection errors should be retryable
          expect(translated.retryable).toBe(true);
          expect(translated.retryAfter).toBeGreaterThan(0);
          
          // Should have appropriate operation type
          expect(['connection', 'timeout', 'server_selection', 'topology_closed']).toContain(translated.operation);
        }
      ), { numRuns: 50 });
    });

    test('should translate all Mongoose validation errors to ValidationError with field details', () => {
      fc.assert(fc.property(
        fc.record({
          field1: fc.record({
            message: fc.string({ minLength: 1, maxLength: 50 }),
            kind: fc.constantFrom('required', 'minlength', 'maxlength', 'enum', 'user defined'),
            value: fc.oneof(fc.string(), fc.integer(), fc.constant(null))
          }),
          field2: fc.record({
            message: fc.string({ minLength: 1, maxLength: 50 }),
            kind: fc.constantFrom('required', 'minlength', 'maxlength', 'enum', 'user defined'),
            value: fc.oneof(fc.string(), fc.integer(), fc.constant(null))
          })
        }),
        (errors) => {
          const error = new Error('Validation failed');
          error.name = 'ValidationError';
          error.errors = errors;
          
          const translated = translateDatabaseError(error);
          
          // Should return a ValidationError
          expect(translated).toBeInstanceOf(ValidationError);
          
          // Should have details for each field
          expect(translated.details).toBeDefined();
          expect(translated.details.length).toBe(Object.keys(errors).length);
          
          // Each detail should have required properties
          translated.details.forEach(detail => {
            expect(detail.field).toBeDefined();
            expect(detail.message).toBeDefined();
            expect(detail.code).toBeDefined();
            expect(Object.values(ERROR_CODES)).toContain(detail.code);
          });
        }
      ), { numRuns: 30 });
    });

    test('should translate duplicate key errors (11000) to ConflictError with field information', () => {
      fc.assert(fc.property(
        fc.constantFrom('email', 'username', 'phone', 'slug'),
        fc.string({ minLength: 1, maxLength: 50 }),
        (field, value) => {
          const error = new Error(`E11000 duplicate key error`);
          error.code = 11000;
          error.keyPattern = { [field]: 1 };
          error.keyValue = { [field]: value };
          
          const translated = translateDatabaseError(error);
          
          // Should return a ConflictError
          expect(translated).toBeInstanceOf(ConflictError);
          
          // Should have user-friendly message
          expect(translated.message).toBeDefined();
          expect(translated.message.length).toBeGreaterThan(0);
          
          // Should include field and value information
          expect(translated.field).toBe(field);
          expect(translated.value).toBe(value);
          
          // Should have appropriate conflict type
          expect(translated.conflictType).toBe('duplicate_key');
        }
      ), { numRuns: 40 });
    });

    test('should translate CastError to ValidationError with appropriate field information', () => {
      fc.assert(fc.property(
        fc.constantFrom('ObjectId', 'Number', 'Date', 'Boolean', 'Array'),
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.oneof(fc.string(), fc.integer(), fc.constant(null)),
        (kind, path, value) => {
          const error = new Error(`Cast to ${kind} failed`);
          error.name = 'CastError';
          error.kind = kind;
          error.path = path;
          error.value = value;
          
          const translated = translateDatabaseError(error);
          
          // Should return a ValidationError
          expect(translated).toBeInstanceOf(ValidationError);
          
          // Should have field details
          expect(translated.details).toBeDefined();
          expect(translated.details.length).toBe(1);
          
          const detail = translated.details[0];
          expect(detail.field).toBe(path);
          expect(detail.code).toBe(ERROR_CODES.INVALID_FORMAT);
          expect(detail.value).toBe(value);
          
          // Message should be user-friendly
          expect(detail.message).toBeDefined();
          expect(detail.message).not.toContain('Cast');
          expect(detail.message).not.toContain(kind);
        }
      ), { numRuns: 40 });
    });

    test('should handle MongoDB error codes consistently', () => {
      fc.assert(fc.property(
        fc.constantFrom(13, 18, 26, 59, 85, 86, 112, 251, 256),
        fc.string({ minLength: 1, maxLength: 100 }),
        (code, message) => {
          const error = new Error(message);
          error.code = code;
          
          const translated = translateDatabaseError(error);
          
          // Should return appropriate error type
          expect(translated).toBeInstanceOf(Error);
          
          // Should have user-friendly message
          expect(translated.message).toBeDefined();
          expect(translated.message.length).toBeGreaterThan(0);
          
          // Should have appropriate operation type for DatabaseError
          if (translated instanceof DatabaseError) {
            expect(translated.operation).toBeDefined();
          }
          
          // Write conflict and transaction errors should be retryable
          if ([112, 251, 256].includes(code)) {
            expect(translated.retryable).toBe(true);
            expect(translated.retryAfter).toBeGreaterThanOrEqual(1);
          }
        }
      ), { numRuns: 50 });
    });

    test('should correctly identify database errors', () => {
      fc.assert(fc.property(
        fc.oneof(
          // MongoDB errors
          fc.record({
            name: fc.constantFrom(
              'MongoNetworkError', 'MongoServerError', 'MongoTimeoutError',
              'ValidationError', 'CastError', 'VersionError'
            ),
            message: fc.string()
          }),
          // MongoDB error codes
          fc.record({
            code: fc.integer({ min: 1, max: 1000 }),
            message: fc.string()
          }),
          // Non-database errors
          fc.record({
            name: fc.constantFrom('TypeError', 'ReferenceError', 'SyntaxError'),
            message: fc.string()
          })
        ),
        (errorData) => {
          const error = new Error(errorData.message);
          if (errorData.name) error.name = errorData.name;
          if (errorData.code) error.code = errorData.code;
          
          const isDbError = isDatabaseError(error);
          
          // Should correctly identify database errors
          if (errorData.name && (
            errorData.name.startsWith('Mongo') ||
            ['ValidationError', 'CastError', 'VersionError'].includes(errorData.name)
          )) {
            expect(isDbError).toBe(true);
          } else if (errorData.code !== undefined) {
            expect(isDbError).toBe(true);
          } else if (errorData.name && ['TypeError', 'ReferenceError', 'SyntaxError'].includes(errorData.name)) {
            expect(isDbError).toBe(false);
          }
        }
      ), { numRuns: 100 });
    });

    test('should generate appropriate validation error codes', () => {
      fc.assert(fc.property(
        fc.constantFrom('required', 'minlength', 'maxlength', 'min', 'max', 'enum', 'user defined', 'regexp'),
        (kind) => {
          const errorCode = getValidationErrorCode(kind);
          
          // Should return a valid error code
          expect(Object.values(ERROR_CODES)).toContain(errorCode);
          
          // Should map specific kinds to appropriate codes
          switch (kind) {
            case 'required':
              expect(errorCode).toBe(ERROR_CODES.REQUIRED_FIELD);
              break;
            case 'minlength':
            case 'maxlength':
            case 'min':
            case 'max':
              expect(errorCode).toBe(ERROR_CODES.INVALID_LENGTH);
              break;
            case 'enum':
              expect(errorCode).toBe(ERROR_CODES.INVALID_TYPE);
              break;
            case 'user defined':
            case 'regexp':
              expect(errorCode).toBe(ERROR_CODES.INVALID_FORMAT);
              break;
            default:
              expect(errorCode).toBe(ERROR_CODES.VALIDATION_ERROR);
          }
        }
      ), { numRuns: 50 });
    });

    test('should generate user-friendly cast error messages', () => {
      fc.assert(fc.property(
        fc.constantFrom('ObjectId', 'Number', 'Date', 'Boolean', 'Array', 'Buffer'),
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.oneof(fc.string(), fc.integer(), fc.constant(null)),
        (kind, path, value) => {
          const message = generateCastErrorMessage(kind, value, path);
          
          // Should return a user-friendly message
          expect(message).toBeDefined();
          expect(message.length).toBeGreaterThan(0);
          
          // Should not contain technical terms
          expect(message).not.toContain('Cast');
          expect(message).not.toContain('ObjectId');
          
          // Should contain the field name
          expect(message.toLowerCase()).toContain(path.toLowerCase());
          
          // Should contain appropriate guidance
          expect(message).toMatch(/must be|has an invalid/);
        }
      ), { numRuns: 50 });
    });

    test('should preserve original error for non-database errors', () => {
      fc.assert(fc.property(
        fc.record({
          name: fc.constantFrom('TypeError', 'ReferenceError', 'SyntaxError', 'RangeError'),
          message: fc.string({ minLength: 1, maxLength: 100 })
        }),
        (errorData) => {
          const error = new Error(errorData.message);
          error.name = errorData.name;
          
          const translated = translateDatabaseError(error);
          
          // Should return the original error unchanged
          expect(translated).toBe(error);
          expect(translated.name).toBe(errorData.name);
          expect(translated.message).toBe(errorData.message);
        }
      ), { numRuns: 30 });
    });
  });
});