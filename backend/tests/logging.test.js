/**
 * Unit Tests for Winston Logger Implementation
 * Tests structured logging, correlation ID tracking, and log sanitization
 */

const { 
  logger, 
  sanitizeLogData, 
  sanitizeStringValue,
  createChildLogger,
  logPerformance,
  logSecurityEvent,
  getErrorSeverity
} = require('../middleware/logging');
const featureFlags = require('../middleware/featureFlags');

// Mock console methods to capture output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
let capturedLogs = [];

beforeEach(() => {
  capturedLogs = [];
  console.log = (...args) => {
    capturedLogs.push({ level: 'log', args });
  };
  console.error = (...args) => {
    capturedLogs.push({ level: 'error', args });
  };
  
  // Enable structured logging for tests
  featureFlags.enable('STRUCTURED_LOGGING');
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  featureFlags.disable('STRUCTURED_LOGGING');
});

describe('Winston Logger Implementation', () => {
  describe('Basic Logging Functionality', () => {
    test('should log messages with different levels', () => {
      logger.info('Test info message', { test: true });
      logger.warn('Test warning message', { test: true });
      logger.error('Test error message', { test: true });
      logger.debug('Test debug message', { test: true });

      expect(capturedLogs.length).toBeGreaterThan(0);
    });

    test('should include correlation ID in logs', () => {
      const mockReq = { correlationId: 'test-correlation-id' };
      const requestLogger = logger.withRequest(mockReq);
      
      requestLogger.info('Test message with correlation ID');
      
      // Check if correlation ID is included in the log output
      const logOutput = capturedLogs.find(log => 
        log.args.some(arg => 
          typeof arg === 'string' && arg.includes('test-correlation-id')
        )
      );
      expect(logOutput).toBeDefined();
    });

    test('should handle logging without correlation ID', () => {
      logger.info('Test message without correlation ID');
      
      expect(capturedLogs.length).toBeGreaterThan(0);
    });
  });

  describe('Log Sanitization', () => {
    test('should sanitize sensitive fields', () => {
      const sensitiveData = {
        username: 'testuser',
        password: 'secret123',
        token: 'jwt-token-here',
        authorization: 'Bearer token123',
        email: 'test@example.com'
      };

      const sanitized = sanitizeLogData(sensitiveData);

      expect(sanitized.username).toBe('testuser');
      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.token).toBe('[REDACTED]');
      expect(sanitized.authorization).toBe('[REDACTED]');
    });

    test('should sanitize nested objects', () => {
      const nestedData = {
        user: {
          name: 'John Doe',
          credentials: {
            password: 'secret123',
            apiKey: 'api-key-123'
          }
        },
        metadata: {
          token: 'jwt-token'
        }
      };

      const sanitized = sanitizeLogData(nestedData);

      expect(sanitized.user.name).toBe('John Doe');
      expect(sanitized.user.credentials.password).toBe('[REDACTED]');
      expect(sanitized.user.credentials.apiKey).toBe('[REDACTED]');
      expect(sanitized.metadata.token).toBe('[REDACTED]');
    });

    test('should sanitize arrays', () => {
      const arrayData = [
        { name: 'user1', password: 'secret1' },
        { name: 'user2', token: 'token123' }
      ];

      const sanitized = sanitizeLogData(arrayData);

      expect(sanitized[0].name).toBe('user1');
      expect(sanitized[0].password).toBe('[REDACTED]');
      expect(sanitized[1].name).toBe('user2');
      expect(sanitized[1].token).toBe('[REDACTED]');
    });

    test('should handle non-object data', () => {
      expect(sanitizeLogData('string')).toBe('string');
      expect(sanitizeLogData(123)).toBe(123);
      expect(sanitizeLogData(null)).toBe(null);
      expect(sanitizeLogData(undefined)).toBe(undefined);
    });
  });

  describe('String Value Sanitization', () => {
    test('should sanitize JWT tokens in strings', () => {
      const jwtString = 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      const sanitized = sanitizeStringValue(jwtString);
      
      expect(sanitized).toContain('[JWT_TOKEN]');
      expect(sanitized).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    });

    test('should sanitize Bearer tokens', () => {
      const bearerString = 'Bearer abc123def456ghi789';
      
      const sanitized = sanitizeStringValue(bearerString);
      
      expect(sanitized).toBe('Bearer [TOKEN]');
    });

    test('should sanitize Basic auth', () => {
      const basicAuth = 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=';
      
      const sanitized = sanitizeStringValue(basicAuth);
      
      expect(sanitized).toBe('Basic [CREDENTIALS]');
    });

    test('should handle non-string values', () => {
      expect(sanitizeStringValue(123)).toBe(123);
      expect(sanitizeStringValue(null)).toBe(null);
      expect(sanitizeStringValue(undefined)).toBe(undefined);
    });
  });

  describe('Child Logger', () => {
    test('should create child logger with context', () => {
      const childLogger = createChildLogger({ component: 'test', version: '1.0' });
      
      childLogger.info('Test message from child logger');
      
      expect(capturedLogs.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Logging', () => {
    test('should log performance metrics', () => {
      logPerformance('database.query', 150, { query: 'SELECT * FROM users' });
      
      expect(capturedLogs.length).toBeGreaterThan(0);
    });
  });

  describe('Security Event Logging', () => {
    test('should log security events with different severities', () => {
      logSecurityEvent('failed_login_attempt', 'medium', { 
        userId: 'user123', 
        ip: '192.168.1.1' 
      });
      
      logSecurityEvent('brute_force_detected', 'critical', { 
        ip: '192.168.1.1',
        attempts: 10 
      });
      
      expect(capturedLogs.length).toBeGreaterThan(0);
    });
  });

  describe('Error Severity Classification', () => {
    test('should classify 500 errors as high severity', () => {
      const error = { statusCode: 500, message: 'Internal server error' };
      expect(getErrorSeverity(error)).toBe('high');
    });

    test('should classify database errors as critical', () => {
      const error = { 
        statusCode: 500, 
        name: 'MongoNetworkError',
        message: 'Connection failed' 
      };
      expect(getErrorSeverity(error)).toBe('critical');
    });

    test('should classify auth errors as medium severity', () => {
      const error = { statusCode: 401, message: 'Unauthorized' };
      expect(getErrorSeverity(error)).toBe('medium');
    });

    test('should classify client errors as low severity', () => {
      const error = { statusCode: 400, message: 'Bad request' };
      expect(getErrorSeverity(error)).toBe('low');
    });

    test('should handle errors without status codes', () => {
      const error = { message: 'Unknown error' };
      expect(getErrorSeverity(error)).toBe('medium');
    });
  });

  describe('Feature Flag Integration', () => {
    test('should use fallback logger when structured logging is disabled', () => {
      featureFlags.disable('STRUCTURED_LOGGING');
      
      logger.info('Test message with disabled structured logging');
      
      expect(capturedLogs.length).toBeGreaterThan(0);
    });
  });
});