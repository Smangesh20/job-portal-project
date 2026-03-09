/**
 * Centralized Error Classes
 * Defines custom error types for consistent error handling across the application
 */

/**
 * Base Application Error
 * All custom errors should extend this class
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error
 * Used for input validation failures
 */
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * Authentication Error
 * Used for authentication failures
 */
class AuthenticationError extends AppError {
  constructor(message, authType = 'general') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.authType = authType;
  }
}

/**
 * Authorization Error
 * Used for authorization/permission failures
 */
class AuthorizationError extends AppError {
  constructor(message, requiredPermission = null) {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.requiredPermission = requiredPermission;
  }
}

/**
 * Not Found Error
 * Used when requested resources are not found
 */
class NotFoundError extends AppError {
  constructor(message, resourceType = null) {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.resourceType = resourceType;
  }
}

/**
 * Conflict Error
 * Used for resource conflicts (e.g., duplicate entries)
 */
class ConflictError extends AppError {
  constructor(message, conflictType = null) {
    super(message, 409, 'CONFLICT_ERROR');
    this.conflictType = conflictType;
  }
}

/**
 * Database Error
 * Used for database-related errors
 */
class DatabaseError extends AppError {
  constructor(message, operation = null) {
    super(message, 500, 'DATABASE_ERROR');
    this.operation = operation;
  }
}

/**
 * File Upload Error
 * Used for file upload related errors
 */
class FileUploadError extends AppError {
  constructor(message, fileType = null, maxSize = null) {
    super(message, 400, 'FILE_UPLOAD_ERROR');
    this.fileType = fileType;
    this.maxSize = maxSize;
  }
}

/**
 * Rate Limit Error
 * Used when rate limits are exceeded
 */
class RateLimitError extends AppError {
  constructor(message, retryAfter = null) {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.retryAfter = retryAfter;
  }
}

/**
 * External Service Error
 * Used for external service failures
 */
class ExternalServiceError extends AppError {
  constructor(message, service = null) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR');
    this.service = service;
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  FileUploadError,
  RateLimitError,
  ExternalServiceError,
};