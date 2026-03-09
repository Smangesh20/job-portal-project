/**
 * Integration Helper
 * Provides utilities for integrating new middleware with existing routes
 */

const { 
  correlationId, 
  requestLogger, 
  errorLogger, 
  errorHandler, 
  notFoundHandler,
  validateRequest,
  sanitizeInput 
} = require('./index');

const featureFlags = require('./featureFlags');

/**
 * Apply new middleware to Express app (non-breaking)
 * This function adds new middleware alongside existing middleware
 */
function applyEnhancedMiddleware(app) {
  // Add correlation ID tracking (if enabled)
  if (featureFlags.isEnabled('CORRELATION_TRACKING')) {
    app.use(correlationId);
  }

  // Add request logging (if enabled)
  if (featureFlags.isEnabled('STRUCTURED_LOGGING')) {
    app.use(requestLogger);
  }

  // Add input sanitization (if enabled)
  if (featureFlags.isEnabled('INPUT_VALIDATION')) {
    app.use(sanitizeInput);
  }

  // Note: Error handling middleware should be added after all routes
  // This will be done in the main server.js file
}

/**
 * Apply error handling middleware (should be called after all routes)
 */
function applyErrorHandling(app) {
  // Add error logging (if enabled)
  if (featureFlags.isEnabled('STRUCTURED_LOGGING')) {
    app.use(errorLogger);
  }

  // Add 404 handler
  app.use(notFoundHandler);

  // Add main error handler (always apply, but behavior depends on feature flags)
  app.use(errorHandler);
}

/**
 * Create enhanced route wrapper
 * Wraps existing routes with new validation and error handling
 */
function enhanceRoute(originalHandler, validationSchema = null) {
  const middleware = [];

  // Add validation if schema provided and feature enabled
  if (validationSchema && featureFlags.isEnabled('INPUT_VALIDATION')) {
    middleware.push(validateRequest(validationSchema));
  }

  // Add the original handler
  middleware.push(originalHandler);

  return middleware;
}

/**
 * Gradual migration helper
 * Allows testing new middleware on specific routes
 */
function createMigrationWrapper(routePath, newHandler, oldHandler) {
  return (req, res, next) => {
    // Check if enhanced error handling is enabled for this route
    const useEnhanced = featureFlags.isEnabled('ENHANCED_ERROR_HANDLING');
    
    if (useEnhanced) {
      return newHandler(req, res, next);
    } else {
      return oldHandler(req, res, next);
    }
  };
}

module.exports = {
  applyEnhancedMiddleware,
  applyErrorHandling,
  enhanceRoute,
  createMigrationWrapper,
};