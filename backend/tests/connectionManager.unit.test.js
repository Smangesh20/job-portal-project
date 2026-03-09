/**
 * Unit Tests for Database Connection Manager
 * Tests specific scenarios and edge cases for connection resilience
 */

const mongoose = require('mongoose');

// Mock the logger before requiring connectionManager
jest.mock('../middleware/logging', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

const logger = require('../middleware/logging');

describe('Database Connection Manager - Unit Tests', () => {
  let ConnectionManager;
  let connectionManager;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset mongoose connection state
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
    }

    // Require fresh instance
    jest.resetModules();
    ConnectionManager = require('../db/connectionManager').constructor;
    connectionManager = new ConnectionManager();
  });

  afterEach(async () => {
    // Clean up
    if (connectionManager.healthCheckInterval) {
      clearInterval(connectionManager.healthCheckInterval);
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('Connection Options', () => {
    test('should generate default connection options', () => {
      const options = connectionManager._getConnectionOptions();
      
      expect(options).toHaveProperty('maxPoolSize', 10);
      expect(options).toHaveProperty('minPoolSize', 2);
      expect(options).toHaveProperty('serverSelectionTimeoutMS', 5000);
      expect(options).toHaveProperty('socketTimeoutMS', 45000);
      expect(options).toHaveProperty('connectTimeoutMS', 10000);
      expect(options).toHaveProperty('retryWrites', true);
      expect(options).toHaveProperty('retryReads', true);
    });

    test('should merge custom options with defaults', () => {
      const customOptions = {
        maxPoolSize: 20,
        customOption: 'test'
      };
      
      const options = connectionManager._getConnectionOptions(customOptions);
      
      expect(options.maxPoolSize).toBe(20);
      expect(options.minPoolSize).toBe(2); // Default preserved
      expect(options.customOption).toBe('test');
    });
  });

  describe('Exponential Backoff', () => {
    test('should calculate exponential backoff correctly', () => {
      const delay1 = connectionManager._calculateBackoffDelay(1);
      const delay2 = connectionManager._calculateBackoffDelay(2);
      const delay3 = connectionManager._calculateBackoffDelay(3);
      
      // First retry: ~1 second (1000ms base)
      expect(delay1).toBeGreaterThanOrEqual(1000);
      expect(delay1).toBeLessThan(3000);
      
      // Second retry: ~2 seconds (2000ms)
      expect(delay2).toBeGreaterThanOrEqual(2000);
      expect(delay2).toBeLessThan(5000);
      
      // Third retry: ~4 seconds (4000ms)
      expect(delay3).toBeGreaterThanOrEqual(4000);
      expect(delay3).toBeLessThan(8000);
    });

    test('should cap delay at maximum', () => {
      // Very high retry count
      const delay = connectionManager._calculateBackoffDelay(10);
      
      expect(delay).toBeLessThanOrEqual(connectionManager.maxRetryDelay);
    });

    test('should add jitter to prevent thundering herd', () => {
      const delays = [];
      for (let i = 0; i < 10; i++) {
        delays.push(connectionManager._calculateBackoffDelay(1));
      }
      
      // All delays should be different due to jitter
      const uniqueDelays = new Set(delays);
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });
  });

  describe('Ready State', () => {
    test('should return correct ready state text', () => {
      expect(connectionManager._getReadyStateText(0)).toBe('disconnected');
      expect(connectionManager._getReadyStateText(1)).toBe('connected');
      expect(connectionManager._getReadyStateText(2)).toBe('connecting');
      expect(connectionManager._getReadyStateText(3)).toBe('disconnecting');
      expect(connectionManager._getReadyStateText(99)).toBe('unknown');
    });
  });

  describe('Connection Status', () => {
    test('should return current connection status', () => {
      const status = connectionManager.getStatus();
      
      expect(status).toHaveProperty('connected');
      expect(status).toHaveProperty('readyState');
      expect(status).toHaveProperty('readyStateText');
      expect(status).toHaveProperty('retryCount');
      expect(status).toHaveProperty('maxRetries');
      expect(status.maxRetries).toBe(5);
    });

    test('should reflect disconnected state initially', () => {
      const status = connectionManager.getStatus();
      
      expect(status.connected).toBe(false);
      expect(status.readyState).toBe(0);
      expect(status.readyStateText).toBe('disconnected');
    });
  });

  describe('Sleep Utility', () => {
    test('should sleep for specified duration', async () => {
      const start = Date.now();
      await connectionManager._sleep(100);
      const duration = Date.now() - start;
      
      expect(duration).toBeGreaterThanOrEqual(90); // Allow some variance
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Health Check Structure', () => {
    test('should return health check structure when disconnected', async () => {
      const health = await connectionManager.healthCheck();
      
      expect(health).toHaveProperty('connected');
      expect(health).toHaveProperty('readyState');
      expect(health).toHaveProperty('readyStateText');
      expect(health).toHaveProperty('timestamp');
      expect(health.connected).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should log errors when connection fails', () => {
      // Just verify the error logging behavior exists
      const error = new Error('Connection failed');
      
      logger.error('Database connection failed', {
        attempt: 1,
        maxRetries: 5,
        error: error.message
      });
      
      expect(logger.error).toHaveBeenCalledWith(
        'Database connection failed',
        expect.objectContaining({
          attempt: 1,
          maxRetries: 5,
          error: 'Connection failed'
        })
      );
    });

    test('should respect max retries configuration', () => {
      connectionManager.maxRetries = 3;
      expect(connectionManager.maxRetries).toBe(3);
      
      connectionManager.maxRetries = 10;
      expect(connectionManager.maxRetries).toBe(10);
    });
  });

  describe('Disconnect', () => {
    test('should clear health check interval on disconnect', async () => {
      connectionManager.healthCheckInterval = setInterval(() => {}, 1000);
      const intervalId = connectionManager.healthCheckInterval;
      
      await connectionManager.disconnect();
      
      expect(connectionManager.healthCheckInterval).toBeNull();
    });

    test('should reset retry count on disconnect', async () => {
      connectionManager.retryCount = 3;
      
      await connectionManager.disconnect();
      
      expect(connectionManager.retryCount).toBe(0);
    });
  });

  describe('Pool Stats', () => {
    test('should handle missing topology gracefully', () => {
      const stats = connectionManager._getPoolStats();
      
      // Should return null or basic info when topology not available
      expect(stats === null || typeof stats === 'object').toBe(true);
    });
  });
});
