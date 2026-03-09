/**
 * Database Error Translation Middleware
 * Translates MongoDB and Mongoose errors into user-friendly messages
 * 
 * Enhanced implementation for Requirements 2.3, 5.2, 5.3:
 * - Comprehensive MongoDB error translation
 * - User-friendly Mongoose validation error mapping
 * - Duplicate key error handling with clear conflict messages
 * - Connection error handling with retry indicators
 */

const { DatabaseError, ValidationError, ConflictError } = require('../utils/errorClasses');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorConstants');

/**
 * Translate MongoDB errors to standardized application errors
 * @param {Error} error - The original MongoDB/Mongoose error
 * @returns {Error} - Translated application error
 */
function translateDatabaseError(error) {
  // Handle Mongoose validation errors
  if (error.name === 'ValidationError' && error.errors) {
    const details = Object.keys(error.errors).map(field => {
      const fieldError = error.errors[field];
      return {
        field,
        message: translateValidationMessage(fieldError.message, field),
        code: getValidationErrorCode(fieldError.kind),
        value: fieldError.value
      };
    });

    return new ValidationError('Validation failed', details);
  }

  // Handle MongoDB duplicate key errors (E11000)
  if (error.code === 11000) {
    const duplicateInfo = extractDuplicateKeyInfo(error);
    const message = generateDuplicateKeyMessage(duplicateInfo);
    
    const conflictError = new ConflictError(message, 'duplicate_key');
    conflictError.field = duplicateInfo.field;
    conflictError.value = duplicateInfo.value;
    return conflictError;
  }

  // Handle MongoDB connection errors with enhanced categorization
  if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
    const connectionError = new DatabaseError(ERROR_MESSAGES.CONNECTION_ERROR, 'connection');
    connectionError.retryable = true;
    connectionError.retryAfter = 5; // Suggest retry after 5 seconds
    return connectionError;
  }

  // Handle MongoDB timeout errors with retry guidance
  if (error.name === 'MongoTimeoutError' || error.message?.includes('timeout')) {
    const timeoutError = new DatabaseError('Database operation timed out. Please try again.', 'timeout');
    timeoutError.retryable = true;
    timeoutError.retryAfter = 3; // Suggest retry after 3 seconds
    return timeoutError;
  }

  // Handle MongoDB server selection errors (no available servers)
  if (error.name === 'MongoServerSelectionError') {
    const selectionError = new DatabaseError('Database is temporarily unavailable. Please try again later.', 'server_selection');
    selectionError.retryable = true;
    selectionError.retryAfter = 10; // Suggest retry after 10 seconds
    return selectionError;
  }

  // Handle MongoDB topology closed errors
  if (error.name === 'MongoTopologyClosedError') {
    const topologyError = new DatabaseError('Database connection was closed. Please try again.', 'topology_closed');
    topologyError.retryable = true;
    topologyError.retryAfter = 5;
    return topologyError;
  }

  // Handle MongoDB write concern errors with detailed information
  if (error.name === 'MongoWriteConcernError') {
    const writeConcernError = new DatabaseError('Database write operation failed due to write concern', 'write_concern');
    writeConcernError.retryable = true;
    writeConcernError.retryAfter = 2;
    return writeConcernError;
  }

  // Handle MongoDB bulk write errors with operation details
  if (error.name === 'BulkWriteError' || error.name === 'MongoBulkWriteError') {
    const bulkError = new DatabaseError('Multiple database operations failed', 'bulk_write');
    bulkError.retryable = false; // Bulk operations typically need manual review
    return bulkError;
  }

  // Handle MongoDB cursor errors
  if (error.name === 'MongoCursorError') {
    const cursorError = new DatabaseError('Database query cursor error', 'cursor');
    cursorError.retryable = true;
    cursorError.retryAfter = 1;
    return cursorError;
  }

  // Handle MongoDB GridFS errors
  if (error.name === 'MongoGridFSError') {
    return new DatabaseError('File storage operation failed', 'gridfs');
  }

  // Handle Mongoose CastError (invalid ObjectId, etc.) with enhanced details
  if (error.name === 'CastError') {
    const details = [{
      field: error.path,
      message: generateCastErrorMessage(error.kind, error.value, error.path),
      code: ERROR_CODES.INVALID_FORMAT,
      value: error.value
    }];
    
    return new ValidationError('Invalid data format', details);
  }

  // Handle Mongoose VersionError (optimistic concurrency) with user guidance
  if (error.name === 'VersionError') {
    const versionError = new ConflictError('This record was modified by another user. Please refresh and try again.', 'version_conflict');
    versionError.retryable = true;
    versionError.retryAfter = 0; // Immediate retry after refresh
    return versionError;
  }

  // Handle Mongoose DocumentNotFoundError
  if (error.name === 'DocumentNotFoundError') {
    return new ValidationError('The requested document was not found', [{
      field: 'id',
      message: 'Document does not exist or has been deleted',
      code: ERROR_CODES.RESOURCE_NOT_FOUND
    }]);
  }

  // Handle Mongoose OverwriteModelError
  if (error.name === 'OverwriteModelError') {
    return new DatabaseError('Model configuration conflict', 'model_overwrite');
  }

  // Handle Mongoose MissingSchemaError
  if (error.name === 'MissingSchemaError') {
    return new DatabaseError('Database schema configuration error', 'missing_schema');
  }

  // Handle MongoDB index errors with specific guidance
  if (error.code === 85) { // IndexNotFound
    return new DatabaseError('Required database index is missing. Please contact support.', 'index_not_found');
  }
  
  if (error.code === 86) { // IndexKeySpecsConflict
    return new DatabaseError('Database index configuration conflict', 'index_conflict');
  }

  // Handle MongoDB authentication errors
  if (error.code === 18) { // AuthenticationFailed
    return new DatabaseError('Database authentication failed. Please contact support.', 'authentication');
  }

  // Handle MongoDB authorization errors
  if (error.code === 13) { // Unauthorized
    return new DatabaseError('Database authorization failed. Insufficient permissions.', 'authorization');
  }

  // Handle MongoDB command not found errors
  if (error.code === 59) { // CommandNotFound
    return new DatabaseError('Database operation not supported', 'command_not_found');
  }

  // Handle MongoDB namespace errors
  if (error.code === 26) { // NamespaceNotFound
    return new DatabaseError('Database collection not found', 'namespace_not_found');
  }

  // Handle MongoDB transaction errors
  if (error.code === 251 || error.code === 256) { // NoSuchTransaction, TransactionTooOld
    const transactionError = new DatabaseError('Database transaction failed. Please try again.', 'transaction');
    transactionError.retryable = true;
    transactionError.retryAfter = 1;
    return transactionError;
  }

  // Handle MongoDB write conflict errors
  if (error.code === 112) { // WriteConflict
    const writeConflictError = new ConflictError('Database write conflict. Please try again.', 'write_conflict');
    writeConflictError.retryable = true;
    writeConflictError.retryAfter = 1;
    return writeConflictError;
  }

  // Handle general MongoDB errors
  if (error.name?.startsWith('Mongo') || error.code) {
    return new DatabaseError(
      ERROR_MESSAGES.DATABASE_ERROR, 
      'general',
      { originalCode: error.code, originalName: error.name }
    );
  }

  // Return original error if not a database error
  return error;
}

/**
 * Extract duplicate key information from MongoDB error
 * @param {Error} error - MongoDB duplicate key error
 * @returns {object} - Extracted duplicate key information
 */
function extractDuplicateKeyInfo(error) {
  const info = {
    field: null,
    value: null,
    index: null
  };

  // Extract from keyPattern and keyValue (newer MongoDB versions)
  if (error.keyPattern && error.keyValue) {
    info.field = Object.keys(error.keyPattern)[0];
    info.value = error.keyValue[info.field];
    return info;
  }

  // Extract from error message (fallback for older versions)
  const message = error.message || '';
  
  // Pattern: E11000 duplicate key error collection: db.collection index: field_1 dup key: { field: "value" }
  const indexMatch = message.match(/index:\s*([^_]+)_/);
  if (indexMatch) {
    info.field = indexMatch[1];
    info.index = indexMatch[0];
  }

  const valueMatch = message.match(/dup key:\s*{\s*[^:]+:\s*"([^"]+)"/);
  if (valueMatch) {
    info.value = valueMatch[1];
  }

  // Try to extract field from errmsg
  if (!info.field && error.errmsg) {
    const fieldMatch = error.errmsg.match(/index:\s*([^_\s]+)/);
    if (fieldMatch) {
      info.field = fieldMatch[1];
    }
  }

  return info;
}

/**
 * Generate user-friendly message for duplicate key errors
 * @param {object} duplicateInfo - Extracted duplicate key information
 * @returns {string} - User-friendly error message
 */
function generateDuplicateKeyMessage(duplicateInfo) {
  const { field, value } = duplicateInfo;

  // Specific messages for common fields
  switch (field) {
    case 'email':
      return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
    case 'username':
      return `Username '${value}' is already taken`;
    case 'phone':
    case 'phoneNumber':
      return `Phone number '${value}' is already registered`;
    case 'slug':
      return `This URL slug is already in use`;
    default:
      if (field && value) {
        return `${field} '${value}' already exists`;
      }
      return ERROR_MESSAGES.DUPLICATE_ENTRY;
  }
}

/**
 * Translate Mongoose validation messages to user-friendly messages
 * @param {string} originalMessage - Original Mongoose validation message
 * @param {string} field - Field name
 * @returns {string} - User-friendly message
 */
function translateValidationMessage(originalMessage, field) {
  // Common validation message patterns
  if (originalMessage.includes('required')) {
    return `${capitalizeField(field)} is required`;
  }
  
  if (originalMessage.includes('too short') || originalMessage.includes('minlength')) {
    return `${capitalizeField(field)} is too short`;
  }
  
  if (originalMessage.includes('too long') || originalMessage.includes('maxlength')) {
    return `${capitalizeField(field)} is too long`;
  }
  
  if (originalMessage.includes('invalid') || originalMessage.includes('format')) {
    return `${capitalizeField(field)} format is invalid`;
  }
  
  if (originalMessage.includes('enum')) {
    return `${capitalizeField(field)} has an invalid value`;
  }

  // Field-specific messages
  switch (field) {
    case 'email':
      return 'Please provide a valid email address';
    case 'password':
      return 'Password must meet security requirements';
    case 'phone':
    case 'phoneNumber':
      return 'Please provide a valid phone number';
    case 'age':
      return 'Please provide a valid age';
    case 'salary':
      return 'Please provide a valid salary amount';
    default:
      return originalMessage || `${capitalizeField(field)} is invalid`;
  }
}

/**
 * Get error code based on Mongoose validation kind
 * @param {string} kind - Mongoose validation kind
 * @returns {string} - Error code
 */
function getValidationErrorCode(kind) {
  switch (kind) {
    case 'required':
      return ERROR_CODES.REQUIRED_FIELD;
    case 'minlength':
    case 'maxlength':
    case 'min':
    case 'max':
      return ERROR_CODES.INVALID_LENGTH;
    case 'enum':
      return ERROR_CODES.INVALID_TYPE;
    case 'user defined':
    case 'regexp':
      return ERROR_CODES.INVALID_FORMAT;
    default:
      return ERROR_CODES.VALIDATION_ERROR;
  }
}

/**
 * Generate user-friendly message for cast errors
 * @param {string} kind - Type of cast error (ObjectId, Number, Date, etc.)
 * @param {any} value - The invalid value
 * @param {string} path - Field path
 * @returns {string} - User-friendly error message
 */
function generateCastErrorMessage(kind, value, path) {
  const fieldName = capitalizeField(path);
  
  switch (kind) {
    case 'ObjectId':
      return `${fieldName} must be a valid identifier`;
    case 'Number':
      return `${fieldName} must be a valid number`;
    case 'Date':
      return `${fieldName} must be a valid date`;
    case 'Boolean':
      return `${fieldName} must be true or false`;
    case 'Array':
      return `${fieldName} must be a list of values`;
    case 'Buffer':
      return `${fieldName} must be valid binary data`;
    default:
      return `${fieldName} has an invalid format`;
  }
}

/**
 * Capitalize field name for user-friendly messages
 * @param {string} field - Field name
 * @returns {string} - Capitalized field name
 */
function capitalizeField(field) {
  // Handle camelCase and snake_case
  const words = field.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').split(' ');
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

/**
 * Check if error is a database-related error
 * @param {Error} error - Error to check
 * @returns {boolean} - Whether error is database-related
 */
function isDatabaseError(error) {
  // Check for MongoDB/Mongoose error names
  const mongoErrorNames = [
    'MongoNetworkError',
    'MongoServerError', 
    'MongoTimeoutError',
    'MongoServerSelectionError',
    'MongoTopologyClosedError',
    'MongoWriteConcernError',
    'MongoBulkWriteError',
    'BulkWriteError',
    'MongoCursorError',
    'MongoGridFSError',
    'ValidationError',
    'CastError',
    'VersionError',
    'DocumentNotFoundError',
    'OverwriteModelError',
    'MissingSchemaError'
  ];

  // Check if error name matches any MongoDB/Mongoose error
  if (error.name && mongoErrorNames.includes(error.name)) {
    return true;
  }

  // Check for MongoDB error codes
  if (error.code !== undefined && typeof error.code === 'number') {
    return true;
  }

  // Check for MongoDB error message properties
  if (error.errmsg !== undefined) {
    return true;
  }

  // Check for Mongoose validation error structure
  if (error.name === 'ValidationError' && error.errors) {
    return true;
  }

  // Check for any error name starting with 'Mongo'
  if (error.name?.startsWith('Mongo')) {
    return true;
  }

  return false;
}

module.exports = {
  translateDatabaseError,
  extractDuplicateKeyInfo,
  generateDuplicateKeyMessage,
  translateValidationMessage,
  getValidationErrorCode,
  generateCastErrorMessage,
  isDatabaseError,
};