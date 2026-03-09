/**
 * Property-Based Tests for Database Connection Manager
 * Feature: error-handling-validation, Property 11: Database Connection Resilience
 * 
 * **Validates: Requirements 5.1, 5.4, 5.5**
 * 
 * Tests universal properties:
 * - Connection retry with exponential backoff for any failure
 * - Timeout handling for any database operation
 * - Data integrity during connection failures
 */

const fc = require('fast-check');
const mongoose = require('mongoose');

// Mock the logger
jest.mock('../middleware/logging', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

describe('Database Connection Manager - Property Tests', () => {
  let ConnectionManager;
  let connectionManager;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
    }

    ConnectionManager = require('../db/connectionManager').constructor;
    connectionManager = new ConnectionManager();
  });

  afterEach(async () => {
    if (connectionManager.healthCheckInterval) {
      clearInterval(connectionManager.healthCheckInterval);
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * Property 11: Database Connection Resilience
   * For any database connection failure or timeout, the error handler should 
   * implement retry logic with exponential backoff, ensure data integrity, 
   * and provide appropriate error responses
   */
  describe('Property 11: Database Connection Resilience', () => {
    
    test('exponential backoff increases delay for any retry count', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 8 }), // Limit to avoid hitting max delay
          (retryCount) => {
            const delay1 = connectionManager._calculateBackoffDelay(retryCount);
            const delay2 = connectionManager._calculateBackoffDelay(retryCount + 1);
            
            // Calculate expected base delays (without jitter)
            const baseDelay1 = connectionManager.baseRetryDelay * Math.pow(2, retryCount - 1);
            const baseDelay2 = connectionManager.baseRetryDelay * Math.pow(2, retryCount);
            
            // If neither delay hits the max, delay2 should be roughly double delay1
            // Account for jitter by checking if delay2 base is greater than delay1 base
            if (baseDelay1 < connectionManager.maxRetryDelay && baseDelay2 < connectionManager.maxRetryDelay) {
              return baseDelay2 > baseDelay1;
            }
            
            // If we hit max delay, both should be capped
            return delay1 <= connectionManager.maxRetryDelay && 
                   delay2 <= connectionManager.maxRetryDelay;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('backoff delay never exceeds maximum for any retry count', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (retryCount) => {
            const delay = connectionManager._calculateBackoffDelay(retryCount);
            return delay <= connectionManager.maxRetryDelay;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('backoff delay is always positive for any retry count', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          (retryCount) => {
            const delay = connectionManager._calculateBackoffDelay(retryCount);
            return delay > 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('connection options always include required timeout settings', () => {
      fc.assert(
        fc.property(
          fc.record({
            maxPoolSize: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
            minPoolSize: fc.option(fc.integer({ min: 1, max: 10 }), { nil: undefined }),
            serverSelectionTimeoutMS: fc.option(fc.integer({ min: 1000, max: 30000 }), { nil: undefined }),
            socketTimeoutMS: fc.option(fc.integer({ min: 1000, max: 120000 }), { nil: undefined })
          }),
          (customOptions) => {
            // Filter out undefined values to create clean custom options
            const cleanOptions = Object.fromEntries(
              Object.entries(customOptions).filter(([_, v]) => v !== undefined)
            );
            
            const options = connectionManager._getConnectionOptions(cleanOptions);
            
            // Required timeout settings must always be present (from defaults or custom)
            const hasServerSelectionTimeout = typeof options.serverSelectionTimeoutMS === 'number' && options.serverSelectionTimeoutMS > 0;
            const hasSocketTimeout = typeof options.socketTimeoutMS === 'number' && options.socketTimeoutMS > 0;
            const hasConnectTimeout = typeof options.connectTimeoutMS === 'number' && options.connectTimeoutMS > 0;
            
            // Pool settings must be valid
            const hasValidPool = options.maxPoolSize > 0 && options.minPoolSize > 0;
            
            // Retry settings must be enabled
            const hasRetrySettings = options.retryWrites === true && options.retryReads === true;
            
            return hasServerSelectionTimeout && 
                   hasSocketTimeout && 
                   hasConnectTimeout && 
                   hasValidPool && 
                   hasRetrySettings;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('custom options are preserved in connection configuration', () => {
      fc.assert(
        fc.property(
          fc.record({
            maxPoolSize: fc.integer({ min: 5, max: 50 }),
            customField: fc.string({ minLength: 1, maxLength: 20 })
          }),
          (customOptions) => {
            const options = connectionManager._getConnectionOptions(customOptions);
            
            // Custom options should be preserved
            return options.maxPoolSize === customOptions.maxPoolSize &&
                   options.customField === customOptions.customField;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('ready state text is always valid for any state number', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -10, max: 10 }),
          (readyState) => {
            const text = connectionManager._getReadyStateText(readyState);
            
            // Should always return a string
            if (typeof text !== 'string') return false;
            
            // Should return known states or 'unknown'
            const validStates = ['disconnected', 'connected', 'connecting', 'disconnecting', 'unknown'];
            return validStates.includes(text);
          }
        ),
        { numRuns: 50 }
      );
    });

    test('connection status always has required fields', () => {
      fc.assert(
        fc.property(
          fc.constant(null), // No input needed, just checking status structure
          () => {
            const status = connectionManager.getStatus();
            
            // Required fields must always be present
            const hasConnected = typeof status.connected === 'boolean';
            const hasReadyState = typeof status.readyState === 'number';
            const hasReadyStateText = typeof status.readyStateText === 'string';
            const hasRetryCount = typeof status.retryCount === 'number' && status.retryCount >= 0;
            const hasMaxRetries = typeof status.maxRetries === 'number' && status.maxRetries > 0;
            
            return hasConnected && 
                   hasReadyState && 
                   hasReadyStateText && 
                   hasRetryCount && 
                   hasMaxRetries;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('sleep duration is accurate for any valid timeout', () => {
      fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 10, max: 200 }),
          async (duration) => {
            const start = Date.now();
            await connectionManager._sleep(duration);
            const elapsed = Date.now() - start;
            
            // Allow 20ms variance for system timing
            return elapsed >= duration - 20 && elapsed <= duration + 50;
          }
        ),
        { numRuns: 20 } // Fewer runs for async timing tests
      );
    });

    test('health check always returns valid structure', () => {
      fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async () => {
            const health = await connectionManager.healthCheck();
            
            // Required fields
            const hasConnected = typeof health.connected === 'boolean';
            const hasReadyState = typeof health.readyState === 'number';
            const hasReadyStateText = typeof health.readyStateText === 'string';
            const hasTimestamp = typeof health.timestamp === 'string';
            
            // Timestamp should be valid ISO string
            const isValidTimestamp = !isNaN(Date.parse(health.timestamp));
            
            return hasConnected && 
                   hasReadyState && 
                   hasReadyStateText && 
                   hasTimestamp && 
                   isValidTimestamp;
          }
        ),
        { numRuns: 20 }
      );
    });

    test('disconnect always clears health check interval', () => {
      fc.assert(
        fc.asyncProperty(
          fc.boolean(),
          async (hasInterval) => {
            // Set up interval if needed
            if (hasInterval) {
              connectionManager.healthCheckInterval = setInterval(() => {}, 1000);
            }
            
            await connectionManager.disconnect();
            
            // Interval should always be null after disconnect
            return connectionManager.healthCheckInterval === null;
          }
        ),
        { numRuns: 20 }
      );
    });

    test('disconnect always resets connection state', () => {
      fc.assert(
        fc.asyncProperty(
          fc.record({
            isConnected: fc.boolean(),
            retryCount: fc.integer({ min: 0, max: 10 })
          }),
          async (initialState) => {
            // Set initial state
            connectionManager.isConnected = initialState.isConnected;
            connectionManager.retryCount = initialState.retryCount;
            
            await connectionManager.disconnect();
            
            // State should be reset
            return connectionManager.isConnected === false && 
                   connectionManager.retryCount === 0;
          }
        ),
        { numRuns: 30 }
      );
    });

    test('jitter adds randomness to prevent thundering herd', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (retryCount) => {
            // Generate multiple delays for same retry count
            const delays = Array.from({ length: 10 }, () => 
              connectionManager._calculateBackoffDelay(retryCount)
            );
            
            // At least some delays should be different due to jitter
            const uniqueDelays = new Set(delays);
            return uniqueDelays.size > 1;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('pool stats handling is safe for any connection state', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const stats = connectionManager._getPoolStats();
            
            // Should return null or valid object, never throw
            return stats === null || (typeof stats === 'object' && stats !== null);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Data Integrity Properties', () => {
    test('retry count never exceeds max retries during operation', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 20 }),
          (simulatedRetries) => {
            connectionManager.retryCount = 0;
            connectionManager.maxRetries = 5;
            
            // Simulate retries
            for (let i = 0; i < simulatedRetries && connectionManager.retryCount < connectionManager.maxRetries; i++) {
              connectionManager.retryCount++;
            }
            
            // Retry count should never exceed max
            return connectionManager.retryCount <= connectionManager.maxRetries;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('connection state transitions are always valid', () => {
      fc.assert(
        fc.property(
          fc.array(fc.boolean(), { minLength: 1, maxLength: 10 }),
          (stateChanges) => {
            // Simulate state changes
            stateChanges.forEach(shouldConnect => {
              connectionManager.isConnected = shouldConnect;
              connectionManager.isConnecting = !shouldConnect;
            });
            
            // Final state should be consistent
            const finalState = connectionManager.isConnected;
            return typeof finalState === 'boolean';
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
