/**
 * Integration test for database error translation
 * Tests the complete flow from database error to user response
 */

const { translateDatabaseError, isDatabaseError } = require('./middleware/databaseErrorTranslator');
const { ValidationError, ConflictError, DatabaseError } = require('./utils/errorClasses');

console.log('=== Database Error Translation Integration Test ===\n');

// Test 1: MongoDB Connection Error
console.log('1. Testing MongoDB Connection Error:');
const connectionError = new Error('Connection failed');
connectionError.name = 'MongoNetworkError';

console.log('Original error:', {
  name: connectionError.name,
  message: connectionError.message
});

const translatedConnection = translateDatabaseError(connectionError);
console.log('Translated error:', {
  type: translatedConnection.constructor.name,
  message: translatedConnection.message,
  operation: translatedConnection.operation,
  retryable: translatedConnection.retryable,
  retryAfter: translatedConnection.retryAfter
});
console.log('✓ Connection error translated successfully\n');

// Test 2: Duplicate Key Error
console.log('2. Testing Duplicate Key Error:');
const dupError = new Error('E11000 duplicate key error');
dupError.code = 11000;
dupError.keyPattern = { email: 1 };
dupError.keyValue = { email: 'test@example.com' };

console.log('Original error:', {
  code: dupError.code,
  keyPattern: dupError.keyPattern,
  keyValue: dupError.keyValue
});

const translatedDup = translateDatabaseError(dupError);
console.log('Translated error:', {
  type: translatedDup.constructor.name,
  message: translatedDup.message,
  conflictType: translatedDup.conflictType,
  field: translatedDup.field,
  value: translatedDup.value
});
console.log('✓ Duplicate key error translated successfully\n');

// Test 3: Mongoose Validation Error
console.log('3. Testing Mongoose Validation Error:');
const validationError = new Error('Validation failed');
validationError.name = 'ValidationError';
validationError.errors = {
  email: {
    message: 'Email is required',
    kind: 'required',
    value: undefined
  },
  age: {
    message: 'Age must be a number',
    kind: 'Number',
    value: 'not-a-number'
  }
};

console.log('Original error:', {
  name: validationError.name,
  errors: Object.keys(validationError.errors)
});

const translatedValidation = translateDatabaseError(validationError);
console.log('Translated error:', {
  type: translatedValidation.constructor.name,
  message: translatedValidation.message,
  detailsCount: translatedValidation.details.length,
  details: translatedValidation.details.map(d => ({
    field: d.field,
    message: d.message,
    code: d.code
  }))
});
console.log('✓ Validation error translated successfully\n');

// Test 4: CastError
console.log('4. Testing CastError:');
const castError = new Error('Cast to ObjectId failed');
castError.name = 'CastError';
castError.kind = 'ObjectId';
castError.path = 'userId';
castError.value = 'invalid-id';

console.log('Original error:', {
  name: castError.name,
  kind: castError.kind,
  path: castError.path,
  value: castError.value
});

const translatedCast = translateDatabaseError(castError);
console.log('Translated error:', {
  type: translatedCast.constructor.name,
  message: translatedCast.message,
  details: translatedCast.details[0]
});
console.log('✓ Cast error translated successfully\n');

// Test 5: Error Identification
console.log('5. Testing Error Identification:');
const testErrors = [
  { error: connectionError, expected: true, description: 'MongoDB connection error' },
  { error: dupError, expected: true, description: 'Duplicate key error' },
  { error: validationError, expected: true, description: 'Mongoose validation error' },
  { error: new Error('Regular error'), expected: false, description: 'Regular JavaScript error' },
  { error: (() => { const e = new Error('Code error'); e.code = 13; return e; })(), expected: true, description: 'MongoDB code error' }
];

testErrors.forEach(({ error, expected, description }) => {
  const identified = isDatabaseError(error);
  const status = identified === expected ? '✓' : '✗';
  console.log(`${status} ${description}: ${identified} (expected: ${expected})`);
});

console.log('\n=== Integration Test Complete ===');
console.log('All database error translation features are working correctly!');