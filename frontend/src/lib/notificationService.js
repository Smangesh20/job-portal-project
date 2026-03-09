/**
 * Notification Service
 * 
 * Translates API errors into user-friendly messages
 * Provides centralized notification management
 * 
 * Validates: Requirements 4.1, 4.2
 */

/**
 * Error code to user-friendly message mapping
 */
const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Your session is invalid. Please log in again.',
  OTP_INVALID: 'Invalid OTP. Please recheck and try again.',
  OTP_EXPIRED: 'OTP expired. Request a new code and continue.',
  OTP_REQUIRED: 'Please enter the OTP sent to your email or phone.',
  OTP_ATTEMPTS_EXCEEDED: 'Too many invalid OTP attempts. Request a fresh OTP.',
  OTP_DELIVERY_FAILED: 'Unable to send OTP right now. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  
  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  
  // File upload errors
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'This file type is not supported. Please upload a valid file.',
  FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Database errors
  DUPLICATE_ENTRY: 'This record already exists. Please use a different value.',
  RESOURCE_NOT_FOUND: 'The requested resource was not found.',
  DATABASE_ERROR: 'A database error occurred. Please try again later.',
  
  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  
  // Application-specific errors
  APPLICATION_ALREADY_EXISTS: 'You have already applied for this job.',
  JOB_NOT_FOUND: 'The job posting was not found or has been removed.',
  APPLICATION_DEADLINE_PASSED: 'The application deadline for this job has passed.',
  MAX_APPLICANTS_REACHED: 'This job has reached the maximum number of applicants.',
  PROFILE_INCOMPLETE: 'Please complete your profile before applying.',
  
  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * HTTP status code to user-friendly message mapping
 */
const STATUS_MESSAGES = {
  400: 'Invalid request. Please check your input.',
  401: 'Please log in to continue.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  408: 'Request timeout. Please try again.',
  409: 'A conflict occurred. The resource may already exist.',
  422: 'Unable to process your request. Please check your input.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Server error. Please try again later.',
  502: 'Server is temporarily unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
  504: 'Server timeout. Please try again later.',
};

/**
 * Translate API error to user-friendly message
 * 
 * @param {Object} error - Error object from API client
 * @returns {Object} Notification object with message and severity
 */
export const translateError = (error) => {
  // Default notification
  const notification = {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    severity: 'error',
    details: null,
    correlationId: error.correlationId,
  };

  // Handle network errors
  if (error.code === 'NETWORK_ERROR') {
    notification.message = ERROR_MESSAGES.NETWORK_ERROR;
    notification.severity = 'warning';
    return notification;
  }

  // Handle timeout errors
  if (error.code === 'TIMEOUT_ERROR' || error.status === 408) {
    notification.message = ERROR_MESSAGES.TIMEOUT_ERROR;
    notification.severity = 'warning';
    return notification;
  }

  // Translate error code if available
  if (error.code && ERROR_MESSAGES[error.code]) {
    notification.message = ERROR_MESSAGES[error.code];
  }
  // Use error message from API if available and user-friendly
  else if (error.message && !error.message.includes('Error:')) {
    notification.message = error.message;
  }
  // Fallback to status code message
  else if (error.status && STATUS_MESSAGES[error.status]) {
    notification.message = STATUS_MESSAGES[error.status];
  }

  // Handle validation errors with field details
  if (error.code === 'VALIDATION_ERROR' && error.details && Array.isArray(error.details)) {
    notification.details = error.details.map(detail => ({
      field: detail.field,
      message: ERROR_MESSAGES[detail.code] || detail.message,
    }));
    
    // Create summary message for multiple validation errors
    if (error.details.length > 1) {
      notification.message = `Please fix ${error.details.length} validation errors.`;
    } else if (error.details.length === 1) {
      notification.message = error.details[0].message;
    }
  }

  // Set severity based on status code
  if (error.status >= 500) {
    notification.severity = 'error';
  } else if (error.status >= 400) {
    notification.severity = 'warning';
  }

  return notification;
};

/**
 * Create success notification
 * 
 * @param {string} message - Success message
 * @returns {Object} Notification object
 */
export const createSuccessNotification = (message) => {
  return {
    message,
    severity: 'success',
    details: null,
  };
};

/**
 * Create info notification
 * 
 * @param {string} message - Info message
 * @returns {Object} Notification object
 */
export const createInfoNotification = (message) => {
  return {
    message,
    severity: 'info',
    details: null,
  };
};

/**
 * Create warning notification
 * 
 * @param {string} message - Warning message
 * @returns {Object} Notification object
 */
export const createWarningNotification = (message) => {
  return {
    message,
    severity: 'warning',
    details: null,
  };
};

/**
 * Format field validation errors for display
 * 
 * @param {Array} details - Array of field error details
 * @returns {string} Formatted error message
 */
export const formatFieldErrors = (details) => {
  if (!details || !Array.isArray(details) || details.length === 0) {
    return '';
  }

  if (details.length === 1) {
    return details[0].message;
  }

  return details.map((detail, index) => 
    `${index + 1}. ${detail.field}: ${detail.message}`
  ).join('\n');
};

/**
 * Check if error is retryable
 * 
 * @param {Object} error - Error object
 * @returns {boolean} True if error is retryable
 */
export const isRetryableError = (error) => {
  return error.isRetryable === true;
};

/**
 * Get user action suggestion based on error
 * 
 * @param {Object} error - Error object
 * @returns {string} Suggested action for user
 */
export const getSuggestedAction = (error) => {
  if (error.code === 'NETWORK_ERROR') {
    return 'Please check your internet connection and try again.';
  }
  
  if (error.code === 'TOKEN_EXPIRED' || error.code === 'TOKEN_INVALID') {
    return 'Please log in again to continue.';
  }
  
  if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
    return 'Please contact support if you believe you should have access.';
  }
  
  if (error.status >= 500) {
    return 'Our team has been notified. Please try again later.';
  }
  
  if (isRetryableError(error)) {
    return 'Please try again in a moment.';
  }
  
  return 'Please review your input and try again.';
};

export default {
  translateError,
  createSuccessNotification,
  createInfoNotification,
  createWarningNotification,
  formatFieldErrors,
  isRetryableError,
  getSuggestedAction,
};
