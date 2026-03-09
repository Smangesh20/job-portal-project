/**
 * Correlation ID Middleware
 * Generates and tracks correlation IDs across requests for better error tracking
 */

const { v4: uuidv4 } = require('uuid');
const featureFlags = require('./featureFlags');

/**
 * Middleware to add correlation ID to requests
 * Generates a unique correlation ID for each request to track it across the system
 */
function correlationId(req, res, next) {
  // Only apply if feature flag is enabled
  if (!featureFlags.isEnabled('CORRELATION_TRACKING')) {
    return next();
  }

  // Check if correlation ID already exists in headers
  const existingCorrelationId = req.headers['x-correlation-id'] || 
                                req.headers['correlation-id'];
  
  // Generate new correlation ID if none exists
  const correlationId = existingCorrelationId || uuidv4();
  
  // Add correlation ID to request object
  req.correlationId = correlationId;
  
  // Add correlation ID to response headers
  res.setHeader('X-Correlation-ID', correlationId);
  
  // Continue to next middleware
  next();
}

/**
 * Get correlation ID from request
 * @param {object} req - Express request object
 * @returns {string} - Correlation ID
 */
function getCorrelationId(req) {
  return req.correlationId || 'unknown';
}

module.exports = {
  correlationId,
  getCorrelationId,
};