/**
 * Middleware Index - Central export for all middleware components
 * This file provides a single entry point for all error handling and validation middleware
 */

const validationMiddleware = require('./validation');
const errorHandlerMiddleware = require('./errorHandler');
const loggingMiddleware = require('./logging');
const correlationMiddleware = require('./correlation');
const featureFlags = require('./featureFlags');

module.exports = {
  // Validation middleware
  validateRequest: validationMiddleware.validateRequest,
  sanitizeInput: validationMiddleware.sanitizeInput,
  
  // Error handling middleware
  errorHandler: errorHandlerMiddleware.errorHandler,
  notFoundHandler: errorHandlerMiddleware.notFoundHandler,
  
  // Logging middleware
  requestLogger: loggingMiddleware.requestLogger,
  errorLogger: loggingMiddleware.errorLogger,
  
  // Correlation ID middleware
  correlationId: correlationMiddleware.correlationId,
  
  // Feature flags
  featureFlags: featureFlags,
};