import axios from 'axios';

/**
 * Centralized API Client with Error Interceptors
 * 
 * Features:
 * - Automatic retry logic with exponential backoff
 * - Request/response correlation ID tracking
 * - Standardized error handling
 * - Token management
 * 
 * Validates: Requirements 4.1, 8.1
 */

// Configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

/**
 * Generate correlation ID for request tracking
 * Uses crypto.randomUUID() if available, otherwise generates a simple UUID
 */
const generateCorrelationId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Calculate exponential backoff delay
 */
const calculateRetryDelay = (retryCount) => {
  return INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error) => {
  if (!error.response) {
    // Network errors are retryable
    return true;
  }
  
  const status = error.response.status;
  return RETRY_STATUS_CODES.includes(status);
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create axios instance with base configuration
 */
const createApiClient = () => {
  const instance = axios.create({
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request Interceptor
   * - Add correlation ID to all requests
   * - Add authentication token if available
   */
  instance.interceptors.request.use(
    (config) => {
      // Generate and attach correlation ID
      const correlationId = generateCorrelationId();
      config.headers['X-Correlation-ID'] = correlationId;
      
      // Store correlation ID in config for later use
      config.correlationId = correlationId;
      
      // Add authentication token if available
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Initialize retry count
      config.retryCount = config.retryCount || 0;
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor
   * - Handle errors consistently
   * - Implement retry logic
   * - Extract correlation ID from responses
   */
  instance.interceptors.response.use(
    (response) => {
      // Extract correlation ID from response if available
      const correlationId = response.headers['x-correlation-id'] || response.config.correlationId;
      
      // Attach correlation ID to response data
      if (response.data && typeof response.data === 'object') {
        response.data.correlationId = correlationId;
      }
      
      return response;
    },
    async (error) => {
      const config = error.config;
      
      // Extract correlation ID
      const correlationId = error.response?.headers?.['x-correlation-id'] || config?.correlationId;
      
      // Check if we should retry
      if (config && isRetryableError(error) && config.retryCount < MAX_RETRIES) {
        config.retryCount += 1;
        
        // Calculate delay with exponential backoff
        const delay = calculateRetryDelay(config.retryCount - 1);
        
        console.log(
          `Retrying request (attempt ${config.retryCount}/${MAX_RETRIES}) after ${delay}ms`,
          { correlationId, url: config.url }
        );
        
        // Wait before retrying
        await sleep(delay);
        
        // Retry the request
        return instance(config);
      }
      
      // Format error for consistent handling
      const formattedError = formatError(error, correlationId);
      
      return Promise.reject(formattedError);
    }
  );

  return instance;
};

/**
 * Format error into standardized structure
 */
const formatError = (error, correlationId) => {
  const formattedError = {
    correlationId,
    timestamp: new Date().toISOString(),
    isRetryable: isRetryableError(error),
  };

  if (error.response) {
    // Server responded with error status
    formattedError.status = error.response.status;
    formattedError.statusText = error.response.statusText;
    
    // Extract error details from response
    const errorData = error.response.data;
    if (errorData && errorData.error) {
      // Backend uses standardized error format
      formattedError.code = errorData.error.code;
      formattedError.message = errorData.error.message;
      formattedError.details = errorData.error.details;
    } else if (errorData && errorData.message) {
      // Legacy error format
      formattedError.message = errorData.message;
    } else {
      // Generic error message
      formattedError.message = 'An error occurred while processing your request';
    }
  } else if (error.request) {
    // Request made but no response received
    formattedError.status = 0;
    formattedError.code = 'NETWORK_ERROR';
    formattedError.message = 'Unable to connect to the server. Please check your internet connection.';
  } else {
    // Error in request setup
    formattedError.code = 'REQUEST_ERROR';
    formattedError.message = error.message || 'An error occurred while preparing the request';
  }

  // Preserve original error for debugging
  formattedError.originalError = error;

  return formattedError;
};

// Create singleton instance
const apiClient = createApiClient();

/**
 * API Client wrapper with convenience methods
 */
export const api = {
  /**
   * GET request
   */
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },

  /**
   * POST request
   */
  post: (url, data, config = {}) => {
    return apiClient.post(url, data, config);
  },

  /**
   * PUT request
   */
  put: (url, data, config = {}) => {
    return apiClient.put(url, data, config);
  },

  /**
   * DELETE request
   */
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  /**
   * PATCH request
   */
  patch: (url, data, config = {}) => {
    return apiClient.patch(url, data, config);
  },
};

export default api;
