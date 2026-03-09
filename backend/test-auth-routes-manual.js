/**
 * Manual Test Script for Enhanced Authentication Routes
 * Tests the updated authentication routes with feature flags
 * 
 * Usage:
 * 1. Start MongoDB
 * 2. Set environment variables for feature flags
 * 3. Run: node test-auth-routes-manual.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:4444';
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123';

// Test data
const applicantData = {
  email: TEST_EMAIL,
  password: TEST_PASSWORD,
  type: 'applicant',
  name: 'Test Applicant',
  skills: ['JavaScript', 'Node.js', 'React']
};

const recruiterEmail = `recruiter-${Date.now()}@example.com`;
const recruiterData = {
  email: recruiterEmail,
  password: TEST_PASSWORD,
  type: 'recruiter',
  name: 'Test Recruiter',
  contactNumber: '+1234567890',
  bio: 'Experienced tech recruiter'
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  const status = passed ? '✓' : '✗';
  console.log(`${status} ${name}`);
  if (details) {
    console.log(`  ${details}`);
  }
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

async function testSignupApplicant() {
  console.log('\n=== Testing Applicant Signup ===');
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, applicantData);
    
    // Check response structure
    if (response.data.success !== undefined) {
      // Enhanced format
      logTest('Signup returns enhanced format', 
        response.data.success === true &&
        response.data.data &&
        response.data.data.token &&
        response.data.correlationId,
        `Correlation ID: ${response.data.correlationId}`
      );
    } else {
      // Legacy format
      logTest('Signup returns legacy format',
        response.data.token && response.data.type,
        'Legacy format detected (feature flag disabled)'
      );
    }
    
    logTest('Signup returns valid token', !!response.data.token || !!response.data.data?.token);
    logTest('Signup returns correct user type', 
      (response.data.type === 'applicant') || (response.data.data?.type === 'applicant')
    );
    
    return response.data;
  } catch (error) {
    logTest('Applicant signup', false, error.response?.data?.error?.message || error.message);
    return null;
  }
}

async function testSignupRecruiter() {
  console.log('\n=== Testing Recruiter Signup ===');
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, recruiterData);
    
    logTest('Recruiter signup succeeds', response.status === 200);
    logTest('Recruiter type is correct',
      (response.data.type === 'recruiter') || (response.data.data?.type === 'recruiter')
    );
    
    return response.data;
  } catch (error) {
    logTest('Recruiter signup', false, error.response?.data?.error?.message || error.message);
    return null;
  }
}

async function testValidationErrors() {
  console.log('\n=== Testing Validation Errors ===');
  
  // Test missing required fields
  try {
    await axios.post(`${BASE_URL}/auth/signup`, {
      email: 'test@example.com'
      // Missing password, type, name
    });
    logTest('Validation catches missing fields', false, 'Should have thrown error');
  } catch (error) {
    const isValidationError = error.response?.status === 400 &&
      (error.response?.data?.error?.code === 'VALIDATION_ERROR' ||
       error.response?.data?.error?.includes('validation'));
    logTest('Validation catches missing fields', isValidationError,
      error.response?.data?.error?.message || 'Validation error returned'
    );
  }
  
  // Test invalid email
  try {
    await axios.post(`${BASE_URL}/auth/signup`, {
      email: 'invalid-email',
      password: 'Password123',
      type: 'applicant',
      name: 'Test User'
    });
    logTest('Validation catches invalid email', false, 'Should have thrown error');
  } catch (error) {
    const isValidationError = error.response?.status === 400;
    logTest('Validation catches invalid email', isValidationError,
      'Invalid email format rejected'
    );
  }
  
  // Test weak password
  try {
    await axios.post(`${BASE_URL}/auth/signup`, {
      email: 'test2@example.com',
      password: 'weak',
      type: 'applicant',
      name: 'Test User'
    });
    logTest('Validation catches weak password', false, 'Should have thrown error');
  } catch (error) {
    const isValidationError = error.response?.status === 400;
    logTest('Validation catches weak password', isValidationError,
      'Weak password rejected'
    );
  }
}

async function testLogin() {
  console.log('\n=== Testing Login ===');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    logTest('Login succeeds with valid credentials', response.status === 200);
    logTest('Login returns token', !!response.data.token || !!response.data.data?.token);
    
    // Check for correlation ID in enhanced format
    if (response.data.correlationId) {
      logTest('Login includes correlation ID', true,
        `Correlation ID: ${response.data.correlationId}`
      );
    }
    
    return response.data;
  } catch (error) {
    logTest('Login with valid credentials', false, error.response?.data?.error?.message || error.message);
    return null;
  }
}

async function testLoginInvalidCredentials() {
  console.log('\n=== Testing Login with Invalid Credentials ===');
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: 'WrongPassword123'
    });
    logTest('Login rejects invalid credentials', false, 'Should have thrown error');
  } catch (error) {
    const isAuthError = error.response?.status === 401;
    logTest('Login rejects invalid credentials', isAuthError,
      error.response?.data?.error?.message || 'Authentication failed'
    );
  }
}

async function testSanitization() {
  console.log('\n=== Testing Input Sanitization ===');
  try {
    const xssEmail = `xss-${Date.now()}@example.com`;
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      email: xssEmail,
      password: 'Password123',
      type: 'applicant',
      name: '<script>alert("xss")</script>Test User',
      skills: ['JavaScript<script>alert("xss")</script>']
    });
    
    logTest('Sanitization allows valid signup with XSS attempt', response.status === 200,
      'XSS content should be sanitized but signup should succeed'
    );
  } catch (error) {
    // If it fails, check if it's due to sanitization blocking (strict mode)
    if (error.response?.status === 400 && 
        error.response?.data?.error?.message?.includes('malicious')) {
      logTest('Sanitization blocks malicious content in strict mode', true,
        'Strict sanitization mode is enabled'
      );
    } else {
      logTest('Sanitization test', false, error.message);
    }
  }
}

async function testCorrelationId() {
  console.log('\n=== Testing Correlation ID Tracking ===');
  try {
    const customCorrelationId = `test-correlation-${Date.now()}`;
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    }, {
      headers: {
        'X-Correlation-ID': customCorrelationId
      }
    });
    
    const returnedCorrelationId = response.headers['x-correlation-id'];
    logTest('Correlation ID is preserved from request', 
      returnedCorrelationId === customCorrelationId,
      `Sent: ${customCorrelationId}, Received: ${returnedCorrelationId}`
    );
  } catch (error) {
    logTest('Correlation ID tracking', false, error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing Enhanced Authentication Routes\n');
  console.log('Configuration:');
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Test Email: ${TEST_EMAIL}`);
  console.log('\nNote: Ensure MongoDB is running and server is started with feature flags enabled');
  console.log('Example: ENHANCED_ERROR_HANDLING=true INPUT_VALIDATION=true npm start\n');
  
  try {
    // Test signup
    await testSignupApplicant();
    await testSignupRecruiter();
    
    // Test validation
    await testValidationErrors();
    
    // Test login
    await testLogin();
    await testLoginInvalidCredentials();
    
    // Test sanitization
    await testSanitization();
    
    // Test correlation ID
    await testCorrelationId();
    
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log('='.repeat(50));
  
  if (results.failed === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
}

// Run tests
runTests().catch(console.error);
