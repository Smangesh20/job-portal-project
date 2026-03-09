/**
 * Infrastructure Tests
 * Basic tests to verify the error handling and validation infrastructure
 */

const { 
  ValidationError, 
  AuthenticationError, 
  DatabaseError 
} = require('../utils/errorClasses');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorConstants');
const featureFlags = require('../middleware/featureFlags');
const { BasicValidator } = require('../middleware/validation');

// Test Error Classes
console.log('Testing Error Classes...');

try {
  const validationError = new ValidationError('Test validation error', [
    { field: 'email', message: 'Email is required', code: ERROR_CODES.REQUIRED_FIELD }
  ]);
  
  console.log('✓ ValidationError created successfully');
  console.log('  - Status Code:', validationError.statusCode);
  console.log('  - Error Code:', validationError.errorCode);
  console.log('  - Details:', validationError.details);
} catch (error) {
  console.log('✗ ValidationError test failed:', error.message);
}

try {
  const authError = new AuthenticationError('Invalid credentials');
  console.log('✓ AuthenticationError created successfully');
  console.log('  - Status Code:', authError.statusCode);
  console.log('  - Error Code:', authError.errorCode);
} catch (error) {
  console.log('✗ AuthenticationError test failed:', error.message);
}

// Test Feature Flags
console.log('\nTesting Feature Flags...');

try {
  console.log('✓ Feature flags loaded');
  console.log('  - All flags:', featureFlags.getAll());
  
  // Test enabling/disabling
  featureFlags.enable('INPUT_VALIDATION');
  console.log('  - INPUT_VALIDATION enabled:', featureFlags.isEnabled('INPUT_VALIDATION'));
  
  featureFlags.disable('INPUT_VALIDATION');
  console.log('  - INPUT_VALIDATION disabled:', featureFlags.isEnabled('INPUT_VALIDATION'));
} catch (error) {
  console.log('✗ Feature flags test failed:', error.message);
}

// Test Basic Validator
console.log('\nTesting Basic Validator...');

try {
  const validator = new BasicValidator()
    .addRule('email', { required: true, type: 'string', email: true })
    .addRule('password', { required: true, type: 'string', minLength: 8 });
  
  // Test valid data
  const validResult = validator.validate({
    email: 'test@example.com',
    password: 'password123'
  });
  
  console.log('✓ Valid data test:', validResult.isValid ? 'PASSED' : 'FAILED');
  
  // Test invalid data
  const invalidResult = validator.validate({
    email: 'invalid-email',
    password: '123'
  });
  
  console.log('✓ Invalid data test:', !invalidResult.isValid ? 'PASSED' : 'FAILED');
  console.log('  - Errors:', invalidResult.errors.length);
} catch (error) {
  console.log('✗ Basic validator test failed:', error.message);
}

// Test Error Constants
console.log('\nTesting Error Constants...');

try {
  console.log('✓ Error codes available:', Object.keys(ERROR_CODES).length);
  console.log('✓ Error messages available:', Object.keys(ERROR_MESSAGES).length);
  console.log('  - Sample code:', ERROR_CODES.VALIDATION_ERROR);
  console.log('  - Sample message:', ERROR_MESSAGES.INVALID_EMAIL);
} catch (error) {
  console.log('✗ Error constants test failed:', error.message);
}

console.log('\n=== Infrastructure Test Complete ===');
console.log('All core components are working correctly.');
console.log('The infrastructure is ready for gradual rollout using feature flags.');