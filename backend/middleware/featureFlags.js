/**
 * Feature Flags Configuration
 * Controls the gradual rollout of new error handling and validation features
 */

const featureFlags = {
  // Core error handling features
  ENHANCED_ERROR_HANDLING: process.env.ENHANCED_ERROR_HANDLING === 'true' || false,
  STRUCTURED_LOGGING: process.env.STRUCTURED_LOGGING === 'true' || false,
  INPUT_VALIDATION: process.env.INPUT_VALIDATION === 'true' || false,
  
  // Input sanitization features
  ENHANCED_SANITIZATION: process.env.ENHANCED_SANITIZATION === 'true' || false,
  THREAT_DETECTION: process.env.THREAT_DETECTION === 'true' || false,
  STRICT_SANITIZATION: process.env.STRICT_SANITIZATION === 'true' || false,
  
  // Advanced features
  ERROR_ANALYTICS: process.env.ERROR_ANALYTICS === 'true' || false,
  RATE_LIMITING: process.env.RATE_LIMITING === 'true' || false,
  CORRELATION_TRACKING: process.env.CORRELATION_TRACKING === 'true' || false,
  
  // Authentication enhancements
  ENHANCED_AUTH_ERRORS: process.env.ENHANCED_AUTH_ERRORS === 'true' || false,
  OAUTH_INTEGRATION: process.env.OAUTH_INTEGRATION === 'true' || false,
  
  // File upload enhancements
  ENHANCED_FILE_VALIDATION: process.env.ENHANCED_FILE_VALIDATION === 'true' || false,
  
  // Database resilience
  DB_RETRY_LOGIC: process.env.DB_RETRY_LOGIC === 'true' || false,
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature flag
 * @returns {boolean} - Whether the feature is enabled
 */
function isEnabled(featureName) {
  return featureFlags[featureName] === true;
}

/**
 * Enable a feature flag (for testing purposes)
 * @param {string} featureName - Name of the feature flag
 */
function enable(featureName) {
  featureFlags[featureName] = true;
}

/**
 * Disable a feature flag (for testing purposes)
 * @param {string} featureName - Name of the feature flag
 */
function disable(featureName) {
  featureFlags[featureName] = false;
}

/**
 * Get all feature flags and their current state
 * @returns {object} - All feature flags
 */
function getAll() {
  return { ...featureFlags };
}

module.exports = {
  isEnabled,
  enable,
  disable,
  getAll,
  flags: featureFlags,
};