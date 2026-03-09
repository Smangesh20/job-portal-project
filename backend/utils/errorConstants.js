/**
 * Error Constants
 * Centralized error codes and messages for consistent error handling
 */

const ERROR_CODES = {
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_LENGTH: 'INVALID_LENGTH',
  INVALID_TYPE: 'INVALID_TYPE',
  
  // Sanitization Errors
  SANITIZATION_ERROR: 'SANITIZATION_ERROR',
  MALICIOUS_CONTENT_DETECTED: 'MALICIOUS_CONTENT_DETECTED',
  XSS_ATTEMPT_DETECTED: 'XSS_ATTEMPT_DETECTED',
  INJECTION_ATTEMPT_DETECTED: 'INJECTION_ATTEMPT_DETECTED',
  SECURITY_POLICY_VIOLATION: 'SECURITY_POLICY_VIOLATION',
  
  // Authentication Errors
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_MISSING: 'TOKEN_MISSING',
  TOKEN_MALFORMED: 'TOKEN_MALFORMED',
  TOKEN_REVOKED: 'TOKEN_REVOKED',
  TOKEN_USER_NOT_FOUND: 'TOKEN_USER_NOT_FOUND',
  TOKEN_SIGNATURE_INVALID: 'TOKEN_SIGNATURE_INVALID',
  OTP_INVALID: 'OTP_INVALID',
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_REQUIRED: 'OTP_REQUIRED',
  OTP_ATTEMPTS_EXCEEDED: 'OTP_ATTEMPTS_EXCEEDED',
  OTP_DELIVERY_FAILED: 'OTP_DELIVERY_FAILED',
  
  // Authorization Errors
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Resource Errors
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  JOB_NOT_FOUND: 'JOB_NOT_FOUND',
  APPLICATION_NOT_FOUND: 'APPLICATION_NOT_FOUND',
  
  // Conflict Errors
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Database Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  QUERY_ERROR: 'QUERY_ERROR',
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  
  // File Upload Errors
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_CORRUPTED: 'FILE_CORRUPTED',
  FILE_TOO_SMALL: 'FILE_TOO_SMALL',
  MIME_TYPE_MISMATCH: 'MIME_TYPE_MISMATCH',
  INVALID_FILE_STRUCTURE: 'INVALID_FILE_STRUCTURE',
  EMBEDDED_EXECUTABLE: 'EMBEDDED_EXECUTABLE',
  SUSPICIOUS_FILE_CONTENT: 'SUSPICIOUS_FILE_CONTENT',
  
  // Rate Limiting Errors
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // External Service Errors
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  EMAIL_SERVICE_ERROR: 'EMAIL_SERVICE_ERROR',
  SMS_SERVICE_ERROR: 'SMS_SERVICE_ERROR',
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};

const ERROR_MESSAGES = {
  // Generic Messages
  INTERNAL_SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  
  // Validation Messages
  VALIDATION_ERROR: 'The provided data is invalid.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please provide a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.',
  
  // Sanitization Messages
  SANITIZATION_ERROR: 'Input could not be processed safely.',
  MALICIOUS_CONTENT_DETECTED: 'Potentially malicious content was detected and removed.',
  XSS_ATTEMPT_DETECTED: 'Cross-site scripting attempt detected and blocked.',
  INJECTION_ATTEMPT_DETECTED: 'Code injection attempt detected and blocked.',
  SECURITY_POLICY_VIOLATION: 'Request violates security policy and has been blocked.',
  
  // Authentication Messages
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Invalid authentication token.',
  TOKEN_MISSING: 'Authentication token is required.',
  TOKEN_MALFORMED: 'Authentication token is malformed or improperly formatted.',
  TOKEN_REVOKED: 'This authentication token has been revoked. Please log in again.',
  TOKEN_USER_NOT_FOUND: 'The user associated with this token no longer exists.',
  TOKEN_SIGNATURE_INVALID: 'Authentication token signature is invalid.',
  OTP_INVALID: 'Invalid one-time password. Please try again.',
  OTP_EXPIRED: 'OTP expired. Please request a new one.',
  OTP_REQUIRED: 'OTP is required.',
  OTP_ATTEMPTS_EXCEEDED: 'Too many invalid OTP attempts. Please request a new OTP.',
  OTP_DELIVERY_FAILED: 'Unable to deliver OTP. Please try again.',
  
  // Authorization Messages
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action.',
  ACCESS_DENIED: 'Access denied.',
  
  // Resource Messages
  USER_NOT_FOUND: 'User not found.',
  JOB_NOT_FOUND: 'Job not found.',
  APPLICATION_NOT_FOUND: 'Application not found.',
  
  // Conflict Messages
  EMAIL_ALREADY_EXISTS: 'An account with this email address already exists.',
  DUPLICATE_ENTRY: 'This entry already exists.',
  
  // Database Messages
  DATABASE_ERROR: 'A database error occurred. Please try again.',
  CONNECTION_ERROR: 'Unable to connect to the database.',
  
  // File Upload Messages
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported file format.',
  FILE_CORRUPTED: 'The uploaded file appears to be corrupted or invalid.',
  FILE_TOO_SMALL: 'File is too small or empty.',
  MIME_TYPE_MISMATCH: 'File content does not match the declared file type.',
  INVALID_FILE_STRUCTURE: 'File has an invalid or corrupted internal structure.',
  EMBEDDED_EXECUTABLE: 'File contains executable content and cannot be uploaded.',
  SUSPICIOUS_FILE_CONTENT: 'File contains suspicious content that violates security policies.',
  
  // Rate Limiting Messages
  TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
  
  // External Service Messages
  EMAIL_SERVICE_ERROR: 'Unable to send email. Please try again later.',
  SMS_SERVICE_ERROR: 'Unable to send SMS. Please try again later.',
};

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

module.exports = {
  ERROR_CODES,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
  SEVERITY_LEVELS,
};
