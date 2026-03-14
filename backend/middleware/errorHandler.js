/**
 * Error Handler Middleware
 * Centralized error handling and response formatting
 */

const featureFlags = require('./featureFlags');
const { getCorrelationId } = require('./correlation');
const { logger } = require('./logging');
const { translateDatabaseError, isDatabaseError } = require('./databaseErrorTranslator');
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  FileUploadError,
  RateLimitError,
  ExternalServiceError
} = require('../utils/errorClasses');
const { 
  ERROR_CODES, 
  ERROR_MESSAGES, 
  HTTP_STATUS_CODES 
} = require('../utils/errorConstants');

/**
 * Main error handling middleware
 * Processes all errors and returns standardized responses
 */
function errorHandler(err, req, res, next) {
  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  const correlationId = getCorrelationId(req);
  
  // Log error if structured logging is enabled
  if (featureFlags.isEnabled('STRUCTURED_LOGGING')) {
    logger.error('Error handled by error middleware', {
      correlationId,
      error: {
        message: err.message,
        stack: err.stack,
        code: err.errorCode || err.code,
        statusCode: err.statusCode
      },
      request: {
        method: req.method,
        url: req.url,
        userId: req.user?.id || 'anonymous'
      }
    });
  }

  // Determine if we should use enhanced error handling
  const useEnhancedHandling = featureFlags.isEnabled('ENHANCED_ERROR_HANDLING');
  
  if (useEnhancedHandling) {
    return handleEnhancedError(err, req, res, correlationId);
  } else {
    return handleLegacyError(err, req, res);
  }
}

/**
 * Enhanced error handling with standardized format
 */
function handleEnhancedError(err, req, res, correlationId) {
  let statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  let errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
  let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  let details = [];
  let retryable = false;

  // Translate database errors first
  if (isDatabaseError(err)) {
    err = translateDatabaseError(err);
  }

  // Handle different error types with enhanced classification
  if (err instanceof ValidationError) {
    statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = err.message || ERROR_MESSAGES.VALIDATION_ERROR;
    details = formatValidationDetails(err.details || []);
    retryable = false;
  } else if (err instanceof AuthenticationError) {
    statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
    errorCode = getAuthenticationErrorCode(err);
    message = err.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
    
    // Add helpful details for authentication errors
    if (err.authType === 'token_expired') {
      details = [{
        field: 'token',
        message: 'Please log in again to continue',
        code: 'TOKEN_EXPIRED',
        action: 'redirect_to_login'
      }];
    } else if (err.authType === 'token_missing') {
      details = [{
        field: 'authorization',
        message: 'Include a valid JWT token in the Authorization header',
        code: 'TOKEN_MISSING',
        action: 'provide_token'
      }];
    } else if (err.authType === 'token_user_not_found') {
      details = [{
        field: 'token',
        message: 'The account associated with this token no longer exists',
        code: 'TOKEN_USER_NOT_FOUND',
        action: 'redirect_to_login'
      }];
    } else if (err.authType === 'token_malformed' || err.authType === 'token_signature_invalid') {
      details = [{
        field: 'token',
        message: 'The authentication token is invalid or corrupted',
        code: err.authType.toUpperCase(),
        action: 'redirect_to_login'
      }];
    }
    
    retryable = false;
  } else if (err instanceof AuthorizationError) {
    statusCode = HTTP_STATUS_CODES.FORBIDDEN;
    errorCode = ERROR_CODES.AUTHORIZATION_ERROR;
    message = err.message || ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS;
    if (err.requiredPermission) {
      details = [{
        field: 'permission',
        message: `Required permission: ${err.requiredPermission}`,
        code: 'MISSING_PERMISSION',
        action: 'contact_administrator'
      }];
    } else {
      // Provide generic permission guidance
      details = [{
        field: 'permission',
        message: 'You do not have the necessary permissions to perform this action',
        code: 'INSUFFICIENT_PERMISSIONS',
        action: 'contact_administrator'
      }];
    }
    retryable = false;
  } else if (err instanceof NotFoundError) {
    statusCode = HTTP_STATUS_CODES.NOT_FOUND;
    errorCode = getNotFoundErrorCode(err);
    message = err.message || 'Resource not found';
    retryable = false;
  } else if (err instanceof ConflictError) {
    statusCode = HTTP_STATUS_CODES.CONFLICT;
    errorCode = getConflictErrorCode(err);
    message = err.message || ERROR_MESSAGES.DUPLICATE_ENTRY;
    retryable = false;
  } else if (err instanceof FileUploadError) {
    statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
    errorCode = ERROR_CODES.FILE_UPLOAD_ERROR;
    message = err.message || ERROR_MESSAGES.FILE_TOO_LARGE;
    details = formatFileUploadDetails(err);
    retryable = false;
  } else if (err instanceof RateLimitError) {
    statusCode = HTTP_STATUS_CODES.TOO_MANY_REQUESTS;
    errorCode = ERROR_CODES.RATE_LIMIT_ERROR;
    message = err.message || ERROR_MESSAGES.TOO_MANY_REQUESTS;
    if (err.retryAfter) {
      details = [{
        field: 'retryAfter',
        message: `Retry after ${err.retryAfter} seconds`,
        code: 'RETRY_AFTER'
      }];
    }
    retryable = true;
  } else if (err instanceof ExternalServiceError) {
    statusCode = HTTP_STATUS_CODES.BAD_GATEWAY;
    errorCode = ERROR_CODES.EXTERNAL_SERVICE_ERROR;
    message = err.message || 'External service error';
    if (err.service) {
      details = [{
        field: 'service',
        message: `Service: ${err.service}`,
        code: 'SERVICE_ERROR'
      }];
    }
    retryable = true;
  } else if (err instanceof DatabaseError) {
    statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    errorCode = ERROR_CODES.DATABASE_ERROR;
    message = err.message || ERROR_MESSAGES.DATABASE_ERROR;
    retryable = err.retryable !== undefined ? err.retryable : true;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    retryable = determineRetryability(err);
  } else {
    // Handle non-AppError instances (e.g., native JavaScript errors)
    statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
    message = process.env.NODE_ENV === 'production' 
      ? ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
      : err.message;
    retryable = false;
  }

  // Ensure correlation ID is always present
  const finalCorrelationId = correlationId || generateFallbackCorrelationId();

  // Create standardized error response
  const errorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: details,
      correlationId: finalCorrelationId,
      timestamp: new Date().toISOString(),
      retryable: retryable
    }
  };

  // Add request context in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.context = {
      method: req?.method,
      url: req?.url,
      // Prefer req.get when available, otherwise fall back to raw header; undefined if req is missing
      userAgent: req?.get ? req.get('User-Agent') : req?.headers?.['user-agent'],
      ip: req?.ip || req?.connection?.remoteAddress
    };
    
    if (err.stack) {
      errorResponse.error.stack = err.stack;
    }
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * Legacy error handling (maintains backward compatibility)
 */
function handleLegacyError(err, req, res) {
  // Translate database errors even in legacy mode for better error messages
  if (isDatabaseError(err)) {
    err = translateDatabaseError(err);
  }

  // Maintain existing error response format for backward compatibility
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message,
      details: err.details
    });
  }
  
  if (err instanceof ConflictError) {
    return res.status(409).json({ error: err.message });
  }
  
  if (err instanceof AuthenticationError) {
    // Provide appropriate error response based on auth type
    const response = { error: err.message };
    
    // Add helpful context for specific error types
    if (err.authType === 'token_expired') {
      response.action = 'redirect_to_login';
    } else if (err.authType === 'token_missing') {
      response.hint = 'Include Authorization header with Bearer token';
    }
    
    return res.status(401).json(response);
  }
  
  if (err instanceof AuthorizationError) {
    return res.status(403).json({ error: err.message });
  }
  
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  
  if (err instanceof FileUploadError) {
    return res.status(400).json({ error: err.message });
  }
  
  if (err instanceof RateLimitError) {
    return res.status(429).json({ error: err.message });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error'
  });
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res, next) {
  const useEnhancedHandling = featureFlags.isEnabled('ENHANCED_ERROR_HANDLING');
  
  if (useEnhancedHandling) {
    const correlationId = getCorrelationId(req);
    
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
      success: false,
      error: {
        code: ERROR_CODES.NOT_FOUND_ERROR,
        message: `Route ${req.method} ${req.path} not found`,
        correlationId: correlationId,
        timestamp: new Date().toISOString(),
        retryable: false
      }
    });
  } else {
    res.status(404).json({
      error: 'Route not found'
    });
  }
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Helper function to format validation details
 */
function formatValidationDetails(details) {
  if (!Array.isArray(details)) {
    return [];
  }
  
  return details.map(detail => ({
    field: detail.field || detail.path || 'unknown',
    message: detail.message || 'Invalid value',
    code: detail.code || 'VALIDATION_FAILED',
    value: detail.value !== undefined ? detail.value : undefined
  }));
}

/**
 * Helper function to get specific authentication error codes
 */
function getAuthenticationErrorCode(err) {
  if (err.authType) {
    switch (err.authType) {
      case 'token_expired':
        return ERROR_CODES.TOKEN_EXPIRED;
      case 'token_invalid':
        return ERROR_CODES.TOKEN_INVALID;
      case 'token_missing':
        return ERROR_CODES.TOKEN_MISSING;
      case 'token_malformed':
        return ERROR_CODES.TOKEN_MALFORMED;
      case 'token_signature_invalid':
        return ERROR_CODES.TOKEN_SIGNATURE_INVALID;
      case 'token_user_not_found':
        return ERROR_CODES.TOKEN_USER_NOT_FOUND;
      case 'token_revoked':
        return ERROR_CODES.TOKEN_REVOKED;
      case 'invalid_credentials':
        return ERROR_CODES.INVALID_CREDENTIALS;
      case 'otp_invalid':
        return ERROR_CODES.OTP_INVALID;
      case 'otp_expired':
        return ERROR_CODES.OTP_EXPIRED;
      case 'otp_required':
        return ERROR_CODES.OTP_REQUIRED;
      case 'otp_attempts_exceeded':
        return ERROR_CODES.OTP_ATTEMPTS_EXCEEDED;
      case 'otp_delivery_failed':
        return ERROR_CODES.OTP_DELIVERY_FAILED;
      default:
        return ERROR_CODES.AUTHENTICATION_ERROR;
    }
  }
  return ERROR_CODES.AUTHENTICATION_ERROR;
}

/**
 * Helper function to get specific not found error codes
 */
function getNotFoundErrorCode(err) {
  if (err.resourceType) {
    switch (err.resourceType) {
      case 'user':
        return ERROR_CODES.USER_NOT_FOUND;
      case 'job':
        return ERROR_CODES.JOB_NOT_FOUND;
      case 'application':
        return ERROR_CODES.APPLICATION_NOT_FOUND;
      default:
        return ERROR_CODES.RESOURCE_NOT_FOUND;
    }
  }
  return ERROR_CODES.NOT_FOUND_ERROR;
}

/**
 * Helper function to get specific conflict error codes
 */
function getConflictErrorCode(err) {
  if (err.conflictType) {
    switch (err.conflictType) {
      case 'email':
        return ERROR_CODES.EMAIL_ALREADY_EXISTS;
      case 'duplicate':
      case 'duplicate_key':
        return ERROR_CODES.DUPLICATE_ENTRY;
      default:
        return ERROR_CODES.RESOURCE_CONFLICT;
    }
  }
  return ERROR_CODES.CONFLICT_ERROR;
}

/**
 * Helper function to format file upload error details
 */
function formatFileUploadDetails(err) {
  const details = [];
  
  if (err.fileType) {
    details.push({
      field: 'fileType',
      message: `Expected file type: ${err.fileType}`,
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  if (err.maxSize) {
    details.push({
      field: 'fileSize',
      message: `Maximum file size: ${err.maxSize} bytes`,
      code: 'FILE_TOO_LARGE'
    });
  }
  
  return details;
}

/**
 * Helper function to determine if an error is retryable
 */
function determineRetryability(err) {
  // Server errors (5xx) are generally retryable
  if (err.statusCode >= 500) {
    return true;
  }
  
  // Rate limiting errors are retryable
  if (err.statusCode === 429) {
    return true;
  }
  
  // Client errors (4xx) are generally not retryable
  if (err.statusCode >= 400 && err.statusCode < 500) {
    return false;
  }
  
  // Default to not retryable for safety
  return false;
}

/**
 * Generate fallback correlation ID when none is available
 */
function generateFallbackCorrelationId() {
  return `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
