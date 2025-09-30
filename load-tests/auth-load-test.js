const { check } = require('k6');
const http = require('k6/http');
const { Rate, Trend } = require('k6/metrics');

// Custom metrics
const authSuccessRate = new Rate('auth_success_rate');
const authResponseTime = new Trend('auth_response_time');
const mfaSuccessRate = new Rate('mfa_success_rate');
const otpSuccessRate = new Rate('otp_success_rate');
const socialAuthSuccessRate = new Rate('social_auth_success_rate');

// Test configuration
export const options = {
  stages: [
    // Warm up
    { duration: '2m', target: 10 },
    // Ramp up
    { duration: '5m', target: 50 },
    // Sustained load
    { duration: '10m', target: 100 },
    // Peak load
    { duration: '5m', target: 200 },
    // Cool down
    { duration: '2m', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'], // Error rate under 10%
    auth_success_rate: ['rate>0.95'], // Auth success rate over 95%
    auth_response_time: ['p(95)<1500'], // Auth response time under 1.5s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test data
const testUsers = [
  { email: 'test1@example.com', password: 'Password123!' },
  { email: 'test2@example.com', password: 'Password123!' },
  { email: 'test3@example.com', password: 'Password123!' },
  { email: 'test4@example.com', password: 'Password123!' },
  { email: 'test5@example.com', password: 'Password123!' },
];

const socialProviders = ['google', 'microsoft', 'apple', 'github', 'linkedin'];

export default function () {
  // Test different authentication scenarios
  const scenario = Math.random();
  
  if (scenario < 0.4) {
    // 40% - Standard password login
    testPasswordLogin();
  } else if (scenario < 0.6) {
    // 20% - OTP-based login
    testOtpLogin();
  } else if (scenario < 0.8) {
    // 20% - Social authentication
    testSocialAuth();
  } else {
    // 20% - MFA authentication
    testMfaAuth();
  }
}

function testPasswordLogin() {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  
  const payload = JSON.stringify({
    email: user.email,
    password: user.password
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = http.post(`${BASE_URL}/api/auth/google-like/enhanced-login`, payload, params);
  
  const success = check(response, {
    'password login status is 200': (r) => r.status === 200,
    'password login response time < 2000ms': (r) => r.timings.duration < 2000,
    'password login has access token': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success && data.data.accessToken;
      } catch {
        return false;
      }
    },
  });
  
  authSuccessRate.add(success);
  authResponseTime.add(response.timings.duration);
}

function testOtpLogin() {
  const email = `otp${Math.floor(Math.random() * 10000)}@example.com`;
  
  // Send OTP
  const otpPayload = JSON.stringify({
    email: email,
    type: 'LOGIN'
  });
  
  const otpParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const otpResponse = http.post(`${BASE_URL}/api/auth/google-like/send-otp`, otpPayload, otpParams);
  
  const otpSent = check(otpResponse, {
    'OTP send status is 200': (r) => r.status === 200,
    'OTP send response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  if (otpSent) {
    // Verify OTP (using a mock OTP for testing)
    const verifyPayload = JSON.stringify({
      email: email,
      token: '123456', // Mock OTP
      type: 'LOGIN'
    });
    
    const verifyResponse = http.post(`${BASE_URL}/api/auth/google-like/verify-otp`, verifyPayload, otpParams);
    
    const success = check(verifyResponse, {
      'OTP verify status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      'OTP verify response time < 1500ms': (r) => r.timings.duration < 1500,
    });
    
    otpSuccessRate.add(success);
  }
}

function testSocialAuth() {
  const provider = socialProviders[Math.floor(Math.random() * socialProviders.length)];
  const userId = Math.floor(Math.random() * 10000);
  
  const payload = JSON.stringify({
    provider: provider,
    providerId: `${provider}_${userId}`,
    email: `social${userId}@example.com`,
    name: `Social User ${userId}`,
    avatar: `https://example.com/avatar${userId}.jpg`
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = http.post(`${BASE_URL}/api/auth/google-like/social`, payload, params);
  
  const success = check(response, {
    'social auth status is 200': (r) => r.status === 200,
    'social auth response time < 2000ms': (r) => r.timings.duration < 2000,
    'social auth has access token': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success && data.data.accessToken;
      } catch {
        return false;
      }
    },
  });
  
  socialAuthSuccessRate.add(success);
  authResponseTime.add(response.timings.duration);
}

function testMfaAuth() {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  
  // First login to get MFA challenge
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password
  });
  
  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const loginResponse = http.post(`${BASE_URL}/api/auth/google-like/enhanced-login`, loginPayload, loginParams);
  
  const loginSuccess = check(loginResponse, {
    'MFA login status is 200': (r) => r.status === 200,
    'MFA login response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  
  if (loginSuccess) {
    try {
      const data = JSON.parse(loginResponse.body);
      if (data.data.requiresMfa && data.data.mfaToken) {
        // Verify MFA
        const mfaPayload = JSON.stringify({
          mfaToken: data.data.mfaToken,
          token: '123456' // Mock MFA token
        });
        
        const mfaResponse = http.post(`${BASE_URL}/api/auth/google-like/verify-mfa`, mfaPayload, loginParams);
        
        const mfaSuccess = check(mfaResponse, {
          'MFA verify status is 200 or 401': (r) => r.status === 200 || r.status === 401,
          'MFA verify response time < 1500ms': (r) => r.timings.duration < 1500,
        });
        
        mfaSuccessRate.add(mfaSuccess);
      }
    } catch (e) {
      // Handle JSON parse errors
      mfaSuccessRate.add(false);
    }
  }
}

// Setup function to create test users
export function setup() {
  console.log('Setting up authentication load test...');
  
  // Create test users if they don't exist
  for (const user of testUsers) {
    const registerPayload = JSON.stringify({
      email: user.email,
      password: user.password,
      name: `Test User ${user.email.split('@')[0]}`
    });
    
    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Try to register user (might fail if already exists, that's OK)
    http.post(`${BASE_URL}/api/auth/register`, registerPayload, params);
  }
  
  console.log('Authentication load test setup complete');
  return {};
}

// Teardown function
export function teardown(data) {
  console.log('Authentication load test completed');
  console.log('Final metrics will be available in the test results');
}

// Custom metrics summary
export function handleSummary(data) {
  return {
    'auth-load-test-summary.json': JSON.stringify(data, null, 2),
    'auth-load-test-summary.html': generateHtmlReport(data),
  };
}

function generateHtmlReport(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Authentication Load Test Results</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .success { background-color: #d4edda; }
            .warning { background-color: #fff3cd; }
            .error { background-color: #f8d7da; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>Authentication Load Test Results</h1>
        
        <div class="metric success">
            <h3>Test Summary</h3>
            <p><strong>Total Requests:</strong> ${data.metrics.http_reqs.values.count}</p>
            <p><strong>Duration:</strong> ${data.state.testRunDurationMs / 1000}s</p>
            <p><strong>Average Response Time:</strong> ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms</p>
            <p><strong>95th Percentile:</strong> ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms</p>
        </div>
        
        <div class="metric ${data.metrics.http_req_failed.values.rate < 0.1 ? 'success' : 'warning'}">
            <h3>Error Rate</h3>
            <p><strong>Failed Requests:</strong> ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</p>
            <p><strong>Success Rate:</strong> ${((1 - data.metrics.http_req_failed.values.rate) * 100).toFixed(2)}%</p>
        </div>
        
        <div class="metric success">
            <h3>Authentication Metrics</h3>
            <p><strong>Auth Success Rate:</strong> ${(data.metrics.auth_success_rate.values.rate * 100).toFixed(2)}%</p>
            <p><strong>MFA Success Rate:</strong> ${(data.metrics.mfa_success_rate.values.rate * 100).toFixed(2)}%</p>
            <p><strong>OTP Success Rate:</strong> ${(data.metrics.otp_success_rate.values.rate * 100).toFixed(2)}%</p>
            <p><strong>Social Auth Success Rate:</strong> ${(data.metrics.social_auth_success_rate.values.rate * 100).toFixed(2)}%</p>
        </div>
        
        <div class="metric ${data.metrics.auth_response_time.values['p(95)'] < 1500 ? 'success' : 'warning'}">
            <h3>Response Time Metrics</h3>
            <p><strong>Auth Response Time (95th percentile):</strong> ${data.metrics.auth_response_time.values['p(95)'].toFixed(2)}ms</p>
            <p><strong>Average Auth Response Time:</strong> ${data.metrics.auth_response_time.values.avg.toFixed(2)}ms</p>
        </div>
        
        <h3>Recommendations</h3>
        <ul>
            ${data.metrics.http_req_failed.values.rate > 0.1 ? '<li>Error rate is high - investigate server stability</li>' : ''}
            ${data.metrics.http_req_duration.values['p(95)'] > 2000 ? '<li>Response times are high - optimize database queries and caching</li>' : ''}
            ${data.metrics.auth_success_rate.values.rate < 0.95 ? '<li>Authentication success rate is low - check auth logic</li>' : ''}
            ${data.metrics.auth_response_time.values['p(95)'] > 1500 ? '<li>Authentication response times are high - optimize auth flow</li>' : ''}
        </ul>
        
        <p><em>Test completed at: ${new Date().toISOString()}</em></p>
    </body>
    </html>
  `;
}






