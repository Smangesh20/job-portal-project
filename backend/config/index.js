/**
 * Configuration Management
 * Centralized configuration for the application
 */

const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4444,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobPortal',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'logs/app.log',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png').split(','),
  
  // Email Service
  EMAIL_SERVICE_API_KEY: process.env.EMAIL_SERVICE_API_KEY || '',
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'noreply@jobportal.com',
  
  // SMS Service
  SMS_SERVICE_API_KEY: process.env.SMS_SERVICE_API_KEY || '',
  SMS_FROM_NUMBER: process.env.SMS_FROM_NUMBER || '',
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  
  // Feature Flags (loaded from featureFlags.js)
  FEATURES: require('../middleware/featureFlags').getAll(),
};

/**
 * Validate required configuration
 */
function validateConfig() {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
}

/**
 * Get configuration value
 */
function get(key, defaultValue = null) {
  return config[key] !== undefined ? config[key] : defaultValue;
}

/**
 * Check if running in development mode
 */
function isDevelopment() {
  return config.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
function isProduction() {
  return config.NODE_ENV === 'production';
}

module.exports = {
  ...config,
  validateConfig,
  get,
  isDevelopment,
  isProduction,
};