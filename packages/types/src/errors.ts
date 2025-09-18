// Error Types and Codes

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  stack?: string;
  timestamp: Date;
  requestId?: string;
}

export class CustomError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;
  public timestamp: Date;
  public requestId?: string;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: any,
    requestId?: string
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date();
    this.requestId = requestId;
  }
}

// Authentication Errors
export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed', details?: any, requestId?: string) {
    super(message, 'AUTH_ERROR', 401, details, requestId);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Access denied', details?: any, requestId?: string) {
    super(message, 'AUTHORIZATION_ERROR', 403, details, requestId);
    this.name = 'AuthorizationError';
  }
}

export class TokenExpiredError extends CustomError {
  constructor(message: string = 'Token has expired', details?: any, requestId?: string) {
    super(message, 'TOKEN_EXPIRED', 401, details, requestId);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends CustomError {
  constructor(message: string = 'Invalid token', details?: any, requestId?: string) {
    super(message, 'INVALID_TOKEN', 401, details, requestId);
    this.name = 'InvalidTokenError';
  }
}

export class AccountLockedError extends CustomError {
  constructor(message: string = 'Account is locked', details?: any, requestId?: string) {
    super(message, 'ACCOUNT_LOCKED', 423, details, requestId);
    this.name = 'AccountLockedError';
  }
}

export class EmailNotVerifiedError extends CustomError {
  constructor(message: string = 'Email not verified', details?: any, requestId?: string) {
    super(message, 'EMAIL_NOT_VERIFIED', 403, details, requestId);
    this.name = 'EmailNotVerifiedError';
  }
}

export class TwoFactorRequiredError extends CustomError {
  constructor(message: string = 'Two-factor authentication required', details?: any, requestId?: string) {
    super(message, 'TWO_FACTOR_REQUIRED', 403, details, requestId);
    this.name = 'TwoFactorRequiredError';
  }
}

// Validation Errors
export class ValidationError extends CustomError {
  constructor(message: string = 'Validation failed', details?: any, requestId?: string) {
    super(message, 'VALIDATION_ERROR', 400, details, requestId);
    this.name = 'ValidationError';
  }
}

export class RequiredFieldError extends CustomError {
  constructor(field: string, requestId?: string) {
    super(`Field '${field}' is required`, 'REQUIRED_FIELD', 400, { field }, requestId);
    this.name = 'RequiredFieldError';
  }
}

export class InvalidFormatError extends CustomError {
  constructor(field: string, format: string, requestId?: string) {
    super(`Field '${field}' has invalid format. Expected: ${format}`, 'INVALID_FORMAT', 400, { field, format }, requestId);
    this.name = 'InvalidFormatError';
  }
}

export class DuplicateFieldError extends CustomError {
  constructor(field: string, value: any, requestId?: string) {
    super(`Field '${field}' with value '${value}' already exists`, 'DUPLICATE_FIELD', 409, { field, value }, requestId);
    this.name = 'DuplicateFieldError';
  }
}

// Resource Errors
export class NotFoundError extends CustomError {
  constructor(resource: string, id?: string, requestId?: string) {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
    super(message, 'NOT_FOUND', 404, { resource, id }, requestId);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Resource conflict', details?: any, requestId?: string) {
    super(message, 'CONFLICT', 409, details, requestId);
    this.name = 'ConflictError';
  }
}

export class GoneError extends CustomError {
  constructor(message: string = 'Resource no longer available', details?: any, requestId?: string) {
    super(message, 'GONE', 410, details, requestId);
    this.name = 'GoneError';
  }
}

export class TooManyRequestsError extends CustomError {
  constructor(message: string = 'Too many requests', details?: any, requestId?: string) {
    super(message, 'TOO_MANY_REQUESTS', 429, details, requestId);
    this.name = 'TooManyRequestsError';
  }
}

// Business Logic Errors
export class BusinessLogicError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(message, 'BUSINESS_LOGIC_ERROR', 422, details, requestId);
    this.name = 'BusinessLogicError';
  }
}

export class InsufficientPermissionsError extends CustomError {
  constructor(action: string, resource: string, requestId?: string) {
    super(`Insufficient permissions to ${action} ${resource}`, 'INSUFFICIENT_PERMISSIONS', 403, { action, resource }, requestId);
    this.name = 'InsufficientPermissionsError';
  }
}

export class QuotaExceededError extends CustomError {
  constructor(quota: string, limit: number, requestId?: string) {
    super(`Quota exceeded for ${quota}. Limit: ${limit}`, 'QUOTA_EXCEEDED', 429, { quota, limit }, requestId);
    this.name = 'QuotaExceededError';
  }
}

export class FeatureNotAvailableError extends CustomError {
  constructor(feature: string, requestId?: string) {
    super(`Feature '${feature}' is not available`, 'FEATURE_NOT_AVAILABLE', 403, { feature }, requestId);
    this.name = 'FeatureNotAvailableError';
  }
}

// External Service Errors
export class ExternalServiceError extends CustomError {
  constructor(service: string, message: string, details?: any, requestId?: string) {
    super(`External service '${service}' error: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502, { service, ...details }, requestId);
    this.name = 'ExternalServiceError';
  }
}

export class PaymentError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Payment error: ${message}`, 'PAYMENT_ERROR', 402, details, requestId);
    this.name = 'PaymentError';
  }
}

export class EmailServiceError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Email service error: ${message}`, 'EMAIL_SERVICE_ERROR', 502, details, requestId);
    this.name = 'EmailServiceError';
  }
}

export class SMSServiceError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`SMS service error: ${message}`, 'SMS_SERVICE_ERROR', 502, details, requestId);
    this.name = 'SMSServiceError';
  }
}

export class FileUploadError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`File upload error: ${message}`, 'FILE_UPLOAD_ERROR', 400, details, requestId);
    this.name = 'FileUploadError';
  }
}

// Database Errors
export class DatabaseError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Database error: ${message}`, 'DATABASE_ERROR', 500, details, requestId);
    this.name = 'DatabaseError';
  }
}

export class ConnectionError extends CustomError {
  constructor(message: string = 'Database connection failed', details?: any, requestId?: string) {
    super(message, 'CONNECTION_ERROR', 503, details, requestId);
    this.name = 'ConnectionError';
  }
}

export class QueryError extends CustomError {
  constructor(message: string, query?: string, details?: any, requestId?: string) {
    super(`Query error: ${message}`, 'QUERY_ERROR', 500, { query, ...details }, requestId);
    this.name = 'QueryError';
  }
}

export class TransactionError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Transaction error: ${message}`, 'TRANSACTION_ERROR', 500, details, requestId);
    this.name = 'TransactionError';
  }
}

// AI/ML Service Errors
export class AIServiceError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`AI service error: ${message}`, 'AI_SERVICE_ERROR', 502, details, requestId);
    this.name = 'AIServiceError';
  }
}

export class ModelTrainingError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Model training error: ${message}`, 'MODEL_TRAINING_ERROR', 500, details, requestId);
    this.name = 'ModelTrainingError';
  }
}

export class PredictionError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Prediction error: ${message}`, 'PREDICTION_ERROR', 500, details, requestId);
    this.name = 'PredictionError';
  }
}

// Security Errors
export class SecurityError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Security error: ${message}`, 'SECURITY_ERROR', 403, details, requestId);
    this.name = 'SecurityError';
  }
}

export class SuspiciousActivityError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Suspicious activity detected: ${message}`, 'SUSPICIOUS_ACTIVITY', 403, details, requestId);
    this.name = 'SuspiciousActivityError';
  }
}

export class MaliciousContentError extends CustomError {
  constructor(message: string, details?: any, requestId?: string) {
    super(`Malicious content detected: ${message}`, 'MALICIOUS_CONTENT', 400, details, requestId);
    this.name = 'MaliciousContentError';
  }
}

// Error Codes Enum
export enum ErrorCode {
  // Authentication & Authorization
  AUTH_ERROR = 'AUTH_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  TWO_FACTOR_REQUIRED = 'TWO_FACTOR_REQUIRED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  DUPLICATE_FIELD = 'DUPLICATE_FIELD',

  // Resources
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  GONE = 'GONE',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // Business Logic
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  FEATURE_NOT_AVAILABLE = 'FEATURE_NOT_AVAILABLE',

  // External Services
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
  SMS_SERVICE_ERROR = 'SMS_SERVICE_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',

  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  QUERY_ERROR = 'QUERY_ERROR',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',

  // AI/ML
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  MODEL_TRAINING_ERROR = 'MODEL_TRAINING_ERROR',
  PREDICTION_ERROR = 'PREDICTION_ERROR',

  // Security
  SECURITY_ERROR = 'SECURITY_ERROR',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  MALICIOUS_CONTENT = 'MALICIOUS_CONTENT',

  // Generic
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  BAD_GATEWAY = 'BAD_GATEWAY',
  TIMEOUT = 'TIMEOUT'
}

// Error Handler Types
export interface ErrorHandler {
  (error: Error, request?: any): AppError;
}

export interface ErrorLogger {
  (error: AppError, context?: any): void;
}

export interface ErrorReporter {
  (error: AppError, context?: any): Promise<void>;
}

// Error Response Format
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    requestId?: string;
    timestamp: string;
  };
}
