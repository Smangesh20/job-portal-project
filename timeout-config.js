/**
 * Timeout Configuration for Ask Ya Cham Quantum Platform
 * 
 * This file contains all timeout configurations to prevent err_timed_out errors
 * across different deployment environments and services.
 */

module.exports = {
  // Server-level timeouts
  server: {
    timeout: parseInt(process.env.SERVER_TIMEOUT || '30000', 10), // 30 seconds
    keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT || '65000', 10), // 65 seconds
    headersTimeout: parseInt(process.env.HEADERS_TIMEOUT || '66000', 10), // 66 seconds
  },

  // Request-level timeouts
  request: {
    timeout: parseInt(process.env.REQUEST_TIMEOUT || '25000', 10), // 25 seconds
    apiTimeout: parseInt(process.env.API_TIMEOUT || '20000', 10), // 20 seconds
    databaseTimeout: parseInt(process.env.DB_TIMEOUT || '15000', 10), // 15 seconds
  },

  // Client-side timeouts
  client: {
    fetchTimeout: parseInt(process.env.CLIENT_FETCH_TIMEOUT || '15000', 10), // 15 seconds
    websocketTimeout: parseInt(process.env.WS_TIMEOUT || '10000', 10), // 10 seconds
    retryTimeout: parseInt(process.env.RETRY_TIMEOUT || '5000', 10), // 5 seconds
  },

  // Deployment-specific timeouts
  deployment: {
    vercel: {
      functionTimeout: 30, // seconds (max for hobby plan)
      buildTimeout: 300, // seconds
    },
    render: {
      healthCheckTimeout: 30, // seconds
      buildTimeout: 600, // seconds
    },
    netlify: {
      functionTimeout: 10, // seconds (max for free plan)
      buildTimeout: 900, // seconds
    }
  },

  // Database connection timeouts
  database: {
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000', 10), // 10 seconds
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '15000', 10), // 15 seconds
    poolTimeout: parseInt(process.env.DB_POOL_TIMEOUT || '20000', 10), // 20 seconds
  },

  // External service timeouts
  external: {
    emailTimeout: parseInt(process.env.EMAIL_TIMEOUT || '10000', 10), // 10 seconds
    apiCallTimeout: parseInt(process.env.EXTERNAL_API_TIMEOUT || '15000', 10), // 15 seconds
    fileUploadTimeout: parseInt(process.env.FILE_UPLOAD_TIMEOUT || '30000', 10), // 30 seconds
  },

  // Graceful shutdown timeout
  shutdown: {
    gracefulTimeout: parseInt(process.env.GRACEFUL_SHUTDOWN_TIMEOUT || '10000', 10), // 10 seconds
    forceShutdownTimeout: parseInt(process.env.FORCE_SHUTDOWN_TIMEOUT || '15000', 10), // 15 seconds
  }
};

/**
 * Get timeout configuration for specific service
 * @param {string} service - Service name (server, request, client, etc.)
 * @param {string} type - Timeout type within the service
 * @returns {number} Timeout value in milliseconds
 */
function getTimeout(service, type) {
  const config = module.exports;
  return config[service]?.[type] || 30000; // Default 30 seconds
}

/**
 * Create timeout promise that rejects after specified time
 * @param {number} ms - Timeout in milliseconds
 * @param {string} message - Error message
 * @returns {Promise} Promise that rejects after timeout
 */
function createTimeoutPromise(ms, message = 'Operation timed out') {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });
}

/**
 * Wrap async function with timeout
 * @param {Function} fn - Async function to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} errorMessage - Error message for timeout
 * @returns {Function} Wrapped function with timeout
 */
function withTimeout(fn, timeoutMs, errorMessage = 'Function timed out') {
  return async (...args) => {
    const timeoutPromise = createTimeoutPromise(timeoutMs, errorMessage);
    const functionPromise = fn(...args);
    
    return Promise.race([functionPromise, timeoutPromise]);
  };
}

module.exports.getTimeout = getTimeout;
module.exports.createTimeoutPromise = createTimeoutPromise;
module.exports.withTimeout = withTimeout;




