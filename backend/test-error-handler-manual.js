/**
 * Manual test for enhanced error handler middleware
 * This tests the core functionality without property-based testing
 */

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { 
  ValidationError, 
  AuthenticationError, 
  NotFoundError,
  FileUploadError,
  RateLimitError 
} = require('./utils/errorClasses');

// Mock feature flags
jest.mock('./middleware/featureFlags', () => ({
  isEnabled: () => true
}));

// Mock correlation
jest.mock('./middleware/correlation', () => ({
  getCorrelationId: () => 'test-correlation-123'
}));

// Mock logging
jest.mock('./middleware/logging', () => ({
  logger: {
    error: () => {}
  }
}));

function createMockResponse() {
  const res = {
    status: function(code) { 
      this.statusCode = code;
      console.log(`Status: ${code}`);
      return this; 
    },
    json: function(data) { 
      this.responseData = data;
      console.log('Response:', JSON.stringify(data, null, 2));
      return this;
    },
    setHeader: function() { return this; }
  };
  return res;
}

function createMockRequest() {
  return {
    method: 'POST',
    url: '/test',
    path: '/test',
    correlationId: 'test-correlation-123',
    headers: { 'user-agent': 'test-agent' },
    ip: '127.0.0.1'
  };
}

console.log('=== Testing Enhanced Error Handler ===\n');

// Test 1: ValidationError
console.log('1. Testing ValidationError:');
const req1 = createMockRequest();
const res1 = createMockResponse();
const validationError = new ValidationError('Validation failed', [
  { field: 'email', message: 'Email is required', code: 'REQUIRED_FIELD' }
]);
errorHandler(validationError, req1, res1, () => {});
console.log('Expected: 400 status, standardized format with details\n');

// Test 2: AuthenticationError
console.log('2. Testing AuthenticationError:');
const req2 = createMockRequest();
const res2 = createMockResponse();
const authError = new AuthenticationError('Invalid token', 'token_expired');
errorHandler(authError, req2, res2, () => {});
console.log('Expected: 401 status, TOKEN_EXPIRED code\n');

// Test 3: FileUploadError
console.log('3. Testing FileUploadError:');
const req3 = createMockRequest();
const res3 = createMockResponse();
const fileError = new FileUploadError('File too large', 'image/jpeg', 5000000);
errorHandler(fileError, req3, res3, () => {});
console.log('Expected: 400 status, file upload details\n');

// Test 4: RateLimitError
console.log('4. Testing RateLimitError:');
const req4 = createMockRequest();
const res4 = createMockResponse();
const rateLimitError = new RateLimitError('Too many requests', 60);
errorHandler(rateLimitError, req4, res4, () => {});
console.log('Expected: 429 status, retryable=true, retry after details\n');

// Test 5: NotFoundHandler
console.log('5. Testing NotFoundHandler:');
const req5 = createMockRequest();
const res5 = createMockResponse();
req5.method = 'GET';
req5.path = '/nonexistent';
notFoundHandler(req5, res5, () => {});
console.log('Expected: 404 status, route not found message\n');

console.log('=== Manual Test Complete ===');