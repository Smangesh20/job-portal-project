/**
 * Unit Tests for Database Error Translation
 * Tests specific examples and edge cases for database error translation
 */

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

describe('Unit Tests: Database Error Translation', () => {

  describe('translateDatabaseError', () => {
    test('should translate MongoDB connection error', () => {
      const error = new Error('Connection failed');
      error.name = 'MongoNetworkError';
      
      const result = translateDatabaseError(error);
      
      expect(result).toBeInstanceOf(DatabaseError);
      expect(result.operation).toBe('connection');
      expect(result.retryable).toBe(true);
      expect(result.retryAfter).toBe(5);
    });

    test('should translate duplicate key error with keyPattern and keyValue', () => {
      const error = new Error('E11000 duplicate key error');
      error.code = 11000;
      error.keyPattern = { email: 1 };
      error.keyValue = { email: 'test@example.com' };
      
      const result = translateDatabaseError(error);
      
      expect(result).toBeInstanceOf(ConflictError);
      expect(result.conflictType).toBe('duplicate_key');
      expect(result.field).toBe('email');
      expect(result.value).toBe('test@example.com');
    });

    test('should translate Mongoose validation error', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {
        email: {
          message: 'Email is required',
          kind: 'required',
          value: undefined
        },
        name: {
          message: 'Name is too short',
          kind: 'minlength',
          value: 'A'
        }
      };
      
      const result = translateDatabaseError(error);
      
      expect(result).toBeInstanceOf(ValidationError);
      expect(result.details).toHaveLength(2);
      expect(result.details[0].field).toBe('email');
      expect(result.details[0].code).toBe(ERROR_CODES.REQUIRED_FIELD);
      expect(result.details[1].field).toBe('name');
      expect(result.details[1].code).toBe(ERROR_CODES.INVALID_LENGTH);
    });

    test('should translate CastError', () => {
      const error = new Error('Cast to ObjectId failed');
      error.name = 'CastError';
      error.kind = 'ObjectId';
      error.path = 'userId';
      error.value = 'invalid-id';
      
      const result = translateDatabaseError(error);
      
      expect(result).toBeInstanceOf(ValidationError);
      expect(result.details).toHaveLength(1);
      expect(result.details[0].field).toBe('userId');
      expect(result.details[0].code).toBe(ERROR_CODES.INVALID_FORMAT);
      expect(result.details[0].value).toBe('invalid-id');
    });

    test('should return original error for non-database errors', () => {
      const error = new Error('Regular JavaScript error');
      error.name = 'TypeError';
      
      const result = translateDatabaseError(error);
      
      expect(result).toBe(error);
    });
  });

  describe('isDatabaseError', () => {
    test('should identify MongoDB errors', () => {
      const mongoError = new Error('Connection failed');
      mongoError.name = 'MongoNetworkError';
      
      expect(isDatabaseError(mongoError)).toBe(true);
    });

    test('should identify Mongoose errors', () => {
      const mongooseError = new Error('Validation failed');
      mongooseError.name = 'ValidationError';
      
      expect(isDatabaseError(mongooseError)).toBe(true);
    });

    test('should identify errors with MongoDB codes', () => {
      const codeError = new Error('Duplicate key');
      codeError.code = 11000;
      
      expect(isDatabaseError(codeError)).toBe(true);
    });

    test('should not identify regular JavaScript errors', () => {
      const jsError = new Error('Regular error');
      jsError.name = 'TypeError';
      
      expect(isDatabaseError(jsError)).toBe(false);
    });
  });

  describe('generateCastErrorMessage', () => {
    test('should generate user-friendly ObjectId error message', () => {
      const message = generateCastErrorMessage('ObjectId', 'invalid-id', 'userId');
      
      expect(message).toBe('User Id must be a valid identifier');
      expect(message).not.toContain('ObjectId');
      expect(message).not.toContain('Cast');
    });

    test('should generate user-friendly Number error message', () => {
      const message = generateCastErrorMessage('Number', 'not-a-number', 'age');
      
      expect(message).toBe('Age must be a valid number');
    });

    test('should handle camelCase field names', () => {
      const message = generateCastErrorMessage('Date', 'invalid-date', 'createdAt');
      
      expect(message).toBe('Created At must be a valid date');
    });
  });

  describe('getValidationErrorCode', () => {
    test('should return correct code for required validation', () => {
      expect(getValidationErrorCode('required')).toBe(ERROR_CODES.REQUIRED_FIELD);
    });

    test('should return correct code for length validations', () => {
      expect(getValidationErrorCode('minlength')).toBe(ERROR_CODES.INVALID_LENGTH);
      expect(getValidationErrorCode('maxlength')).toBe(ERROR_CODES.INVALID_LENGTH);
      expect(getValidationErrorCode('min')).toBe(ERROR_CODES.INVALID_LENGTH);
      expect(getValidationErrorCode('max')).toBe(ERROR_CODES.INVALID_LENGTH);
    });

    test('should return correct code for enum validation', () => {
      expect(getValidationErrorCode('enum')).toBe(ERROR_CODES.INVALID_TYPE);
    });

    test('should return correct code for format validations', () => {
      expect(getValidationErrorCode('user defined')).toBe(ERROR_CODES.INVALID_FORMAT);
      expect(getValidationErrorCode('regexp')).toBe(ERROR_CODES.INVALID_FORMAT);
    });

    test('should return default code for unknown validation', () => {
      expect(getValidationErrorCode('unknown')).toBe(ERROR_CODES.VALIDATION_ERROR);
    });
  });

  describe('extractDuplicateKeyInfo', () => {
    test('should extract info from keyPattern and keyValue', () => {
      const error = {
        keyPattern: { email: 1 },
        keyValue: { email: 'test@example.com' }
      };
      
      const info = extractDuplicateKeyInfo(error);
      
      expect(info.field).toBe('email');
      expect(info.value).toBe('test@example.com');
    });

    test('should extract info from error message fallback', () => {
      const error = {
        message: 'E11000 duplicate key error collection: db.users index: email_1 dup key: { email: "test@example.com" }'
      };
      
      const info = extractDuplicateKeyInfo(error);
      
      expect(info.field).toBe('email');
      expect(info.value).toBe('test@example.com');
    });
  });

  describe('generateDuplicateKeyMessage', () => {
    test('should generate specific message for email field', () => {
      const message = generateDuplicateKeyMessage({ field: 'email', value: 'test@example.com' });
      
      expect(message).toContain('email address already exists');
    });

    test('should generate specific message for username field', () => {
      const message = generateDuplicateKeyMessage({ field: 'username', value: 'testuser' });
      
      expect(message).toContain("Username 'testuser' is already taken");
    });

    test('should generate generic message for unknown field', () => {
      const message = generateDuplicateKeyMessage({ field: 'customField', value: 'value' });
      
      expect(message).toContain("customField 'value' already exists");
    });
  });

  describe('translateValidationMessage', () => {
    test('should translate required validation message', () => {
      const message = translateValidationMessage('Path `email` is required.', 'email');
      
      expect(message).toBe('Email is required');
    });

    test('should translate length validation messages', () => {
      const shortMessage = translateValidationMessage('Path `name` is too short', 'name');
      const longMessage = translateValidationMessage('Path `description` is too long', 'description');
      
      expect(shortMessage).toBe('Name is too short');
      expect(longMessage).toBe('Description is too long');
    });

    test('should provide field-specific messages', () => {
      const emailMessage = translateValidationMessage('invalid format', 'email');
      const passwordMessage = translateValidationMessage('invalid format', 'password');
      
      expect(emailMessage).toBe('Please provide a valid email address');
      expect(passwordMessage).toBe('Password must meet security requirements');
    });
  });
});