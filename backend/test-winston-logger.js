/**
 * Manual test for Winston logger implementation
 * Tests basic functionality and structured logging
 */

const { logger, sanitizeLogData, createChildLogger } = require('./middleware/logging');
const featureFlags = require('./middleware/featureFlags');

console.log('Testing Winston Logger Implementation...\n');

// Enable structured logging
featureFlags.enable('STRUCTURED_LOGGING');

// Test basic logging
console.log('1. Testing basic logging levels:');
logger.info('This is an info message', { test: true, timestamp: new Date() });
logger.warn('This is a warning message', { component: 'test' });
logger.error('This is an error message', { error: { code: 'TEST_ERROR' } });
logger.debug('This is a debug message', { debug: true });

console.log('\n2. Testing correlation ID tracking:');
const mockReq = { correlationId: 'test-correlation-123' };
const requestLogger = logger.withRequest(mockReq);
requestLogger.info('Request started', { method: 'GET', url: '/api/test' });
requestLogger.info('Request completed', { statusCode: 200, duration: '150ms' });

console.log('\n3. Testing log sanitization:');
const sensitiveData = {
  username: 'testuser',
  password: 'secret123',
  token: 'jwt-token-here',
  authorization: 'Bearer abc123',
  email: 'test@example.com',
  nested: {
    apiKey: 'api-key-secret',
    publicData: 'this should remain'
  }
};

console.log('Original data:', JSON.stringify(sensitiveData, null, 2));
const sanitized = sanitizeLogData(sensitiveData);
console.log('Sanitized data:', JSON.stringify(sanitized, null, 2));

console.log('\n4. Testing child logger:');
const childLogger = createChildLogger({ component: 'auth', version: '1.0' });
childLogger.info('Authentication attempt', { userId: 'user123' });

console.log('\n5. Testing with sensitive strings:');
const jwtString = 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
logger.info('Testing JWT sanitization', { authHeader: jwtString });

console.log('\n6. Testing error with correlation ID:');
try {
  throw new Error('Test error for logging');
} catch (error) {
  requestLogger.error('Caught test error', { 
    error: {
      message: error.message,
      stack: error.stack
    },
    context: 'manual test'
  });
}

console.log('\nWinston Logger test completed!');