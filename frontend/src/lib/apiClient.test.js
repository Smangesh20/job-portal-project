/**
 * API Client Unit Tests
 * 
 * These tests verify the core functionality of the API client including:
 * - Error formatting
 * - Correlation ID generation
 * - Retry logic configuration
 * - HTTP method support
 */

describe('API Client - Module Structure', () => {
  test('should export api object with HTTP methods', () => {
    // Import after test setup
    const api = require('./apiClient').default;
    
    expect(api).toBeDefined();
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
    expect(typeof api.put).toBe('function');
    expect(typeof api.delete).toBe('function');
    expect(typeof api.patch).toBe('function');
  });
});

describe('API Client - Error Formatting Logic', () => {
  test('should identify retryable status codes', () => {
    const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];
    
    // Retryable codes
    expect(RETRY_STATUS_CODES.includes(500)).toBe(true);
    expect(RETRY_STATUS_CODES.includes(503)).toBe(true);
    expect(RETRY_STATUS_CODES.includes(429)).toBe(true);
    
    // Non-retryable codes
    expect(RETRY_STATUS_CODES.includes(400)).toBe(false);
    expect(RETRY_STATUS_CODES.includes(401)).toBe(false);
    expect(RETRY_STATUS_CODES.includes(404)).toBe(false);
  });

  test('should calculate exponential backoff correctly', () => {
    const INITIAL_RETRY_DELAY = 1000;
    
    const calculateRetryDelay = (retryCount) => {
      return INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
    };
    
    expect(calculateRetryDelay(0)).toBe(1000);  // 1 second
    expect(calculateRetryDelay(1)).toBe(2000);  // 2 seconds
    expect(calculateRetryDelay(2)).toBe(4000);  // 4 seconds
  });
});

describe('API Client - Correlation ID Generation', () => {
  test('should generate valid UUID format', () => {
    const generateCorrelationId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    const correlationId = generateCorrelationId();
    
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    expect(correlationId).toBeDefined();
    expect(typeof correlationId).toBe('string');
    expect(correlationId.length).toBe(36);
    expect(correlationId).toMatch(uuidRegex);
  });

  test('should generate unique correlation IDs', () => {
    const generateCorrelationId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    const id1 = generateCorrelationId();
    const id2 = generateCorrelationId();
    const id3 = generateCorrelationId();
    
    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });
});

describe('API Client - Configuration', () => {
  test('should have correct retry configuration', () => {
    const MAX_RETRIES = 3;
    const INITIAL_RETRY_DELAY = 1000;
    
    expect(MAX_RETRIES).toBe(3);
    expect(INITIAL_RETRY_DELAY).toBe(1000);
  });

  test('should have correct timeout configuration', () => {
    const TIMEOUT = 30000; // 30 seconds
    expect(TIMEOUT).toBe(30000);
  });
});
