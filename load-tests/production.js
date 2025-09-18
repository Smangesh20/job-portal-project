import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
export const errorRate = new Rate('errors');
export const responseTime = new Trend('response_time');
export const requestCount = new Counter('requests');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
    errors: ['rate<0.1'],              // Custom error rate below 10%
  },
};

// Base URLs for different environments
const BASE_URL = __ENV.BASE_URL || 'https://api.askyacham.com';
const WEB_URL = __ENV.WEB_URL || 'https://askyacham.com';

// Test data
const testUsers = [
  { email: 'test1@example.com', password: 'TestPass123!' },
  { email: 'test2@example.com', password: 'TestPass123!' },
  { email: 'test3@example.com', password: 'TestPass123!' },
  { email: 'test4@example.com', password: 'TestPass123!' },
  { email: 'test5@example.com', password: 'TestPass123!' },
];

const testJobs = [
  {
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    description: 'We are looking for a senior software engineer...',
    location: { city: 'San Francisco', state: 'CA', country: 'USA' },
    jobType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    requiredSkills: ['JavaScript', 'React', 'Node.js']
  },
  {
    title: 'Product Manager',
    company: 'Startup Inc',
    description: 'Join our team as a product manager...',
    location: { city: 'New York', state: 'NY', country: 'USA' },
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    requiredSkills: ['Product Management', 'Agile', 'Analytics']
  }
];

// Helper functions
function getRandomUser() {
  return testUsers[Math.floor(Math.random() * testUsers.length)];
}

function getRandomJob() {
  return testJobs[Math.floor(Math.random() * testJobs.length)];
}

function makeRequest(method, url, payload = null, headers = {}) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'k6-load-test',
      ...headers
    },
    timeout: '30s'
  };

  let response;
  if (method === 'GET') {
    response = http.get(url, params);
  } else if (method === 'POST') {
    response = http.post(url, JSON.stringify(payload), params);
  } else if (method === 'PUT') {
    response = http.put(url, JSON.stringify(payload), params);
  } else if (method === 'DELETE') {
    response = http.del(url, null, params);
  }

  requestCount.add(1);
  responseTime.add(response.timings.duration);
  errorRate.add(response.status >= 400);

  return response;
}

// Test scenarios
export default function() {
  const user = getRandomUser();
  const job = getRandomJob();
  
  // Scenario 1: Health Check
  healthCheckTest();
  sleep(1);

  // Scenario 2: User Registration and Login
  const tokens = authTest(user);
  sleep(1);

  // Scenario 3: Job Search and Browse
  jobSearchTest(tokens);
  sleep(1);

  // Scenario 4: Job Application
  applicationTest(tokens, job);
  sleep(1);

  // Scenario 5: User Profile Management
  profileTest(tokens);
  sleep(1);

  // Scenario 6: Real-time Features (WebSocket simulation)
  realTimeTest(tokens);
  sleep(1);
}

// Health Check Test
function healthCheckTest() {
  const response = makeRequest('GET', `${BASE_URL}/health`);
  
  check(response, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 1s': (r) => r.timings.duration < 1000,
    'health check returns valid JSON': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.status === 'healthy';
      } catch (e) {
        return false;
      }
    }
  });
}

// Authentication Test
function authTest(user) {
  // Test user registration
  const registerPayload = {
    email: user.email,
    password: user.password,
    confirmPassword: user.password,
    firstName: 'Test',
    lastName: 'User',
    role: 'CANDIDATE',
    agreeToTerms: true,
    agreeToPrivacy: true
  };

  const registerResponse = makeRequest('POST', `${BASE_URL}/api/auth/register`, registerPayload);
  
  check(registerResponse, {
    'registration successful or user exists': (r) => r.status === 201 || r.status === 409,
    'registration response time < 3s': (r) => r.timings.duration < 3000
  });

  // Test user login
  const loginPayload = {
    email: user.email,
    password: user.password
  };

  const loginResponse = makeRequest('POST', `${BASE_URL}/api/auth/login`, loginPayload);
  
  let tokens = null;
  check(loginResponse, {
    'login successful': (r) => r.status === 200,
    'login response time < 2s': (r) => r.timings.duration < 2000,
    'login returns tokens': (r) => {
      try {
        const data = JSON.parse(r.body);
        tokens = data.data.tokens;
        return tokens && tokens.accessToken;
      } catch (e) {
        return false;
      }
    }
  });

  return tokens;
}

// Job Search Test
function jobSearchTest(tokens) {
  if (!tokens) return;

  const headers = {
    'Authorization': `Bearer ${tokens.accessToken}`
  };

  // Test job listing
  const jobsResponse = makeRequest('GET', `${BASE_URL}/api/jobs?page=1&limit=20`, null, headers);
  
  check(jobsResponse, {
    'job listing successful': (r) => r.status === 200,
    'job listing response time < 2s': (r) => r.timings.duration < 2000,
    'job listing returns data': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success && data.data.jobs;
      } catch (e) {
        return false;
      }
    }
  });

  // Test job search
  const searchResponse = makeRequest('GET', 
    `${BASE_URL}/api/jobs/search?query=software engineer&location=San Francisco&page=1&limit=10`, 
    null, headers);
  
  check(searchResponse, {
    'job search successful': (r) => r.status === 200,
    'job search response time < 3s': (r) => r.timings.duration < 3000
  });

  // Test recommended jobs
  const recommendedResponse = makeRequest('GET', `${BASE_URL}/api/jobs/recommended?limit=10`, null, headers);
  
  check(recommendedResponse, {
    'recommended jobs successful': (r) => r.status === 200,
    'recommended jobs response time < 2s': (r) => r.timings.duration < 2000
  });
}

// Application Test
function applicationTest(tokens, job) {
  if (!tokens) return;

  const headers = {
    'Authorization': `Bearer ${tokens.accessToken}`
  };

  // Test job details
  const jobDetailResponse = makeRequest('GET', `${BASE_URL}/api/jobs/123`, null, headers);
  
  check(jobDetailResponse, {
    'job details successful or not found': (r) => r.status === 200 || r.status === 404,
    'job details response time < 2s': (r) => r.timings.duration < 2000
  });

  // Test application submission
  const applicationPayload = {
    jobId: '123',
    coverLetter: 'I am very interested in this position...',
    expectedSalary: 120000,
    availabilityDate: new Date().toISOString(),
    noticePeriod: 30,
    agreeToTerms: true
  };

  const applicationResponse = makeRequest('POST', `${BASE_URL}/api/applications`, applicationPayload, headers);
  
  check(applicationResponse, {
    'application submission successful or already applied': (r) => r.status === 201 || r.status === 409,
    'application response time < 3s': (r) => r.timings.duration < 3000
  });

  // Test application listing
  const applicationsResponse = makeRequest('GET', `${BASE_URL}/api/applications?page=1&limit=10`, null, headers);
  
  check(applicationsResponse, {
    'applications listing successful': (r) => r.status === 200,
    'applications response time < 2s': (r) => r.timings.duration < 2000
  });
}

// Profile Test
function profileTest(tokens) {
  if (!tokens) return;

  const headers = {
    'Authorization': `Bearer ${tokens.accessToken}`
  };

  // Test get current user
  const userResponse = makeRequest('GET', `${BASE_URL}/api/auth/me`, null, headers);
  
  check(userResponse, {
    'get user profile successful': (r) => r.status === 200,
    'get user response time < 1s': (r) => r.timings.duration < 1000
  });

  // Test update profile
  const updatePayload = {
    bio: 'Experienced software engineer with 5+ years of experience...',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    preferences: {
      notifications: true,
      jobAlerts: true,
      salaryRange: { min: 100000, max: 150000 }
    }
  };

  const updateResponse = makeRequest('PUT', `${BASE_URL}/api/users/me`, updatePayload, headers);
  
  check(updateResponse, {
    'profile update successful': (r) => r.status === 200,
    'profile update response time < 2s': (r) => r.timings.duration < 2000
  });
}

// Real-time Features Test
function realTimeTest(tokens) {
  if (!tokens) return;

  const headers = {
    'Authorization': `Bearer ${tokens.accessToken}`
  };

  // Test notifications
  const notificationsResponse = makeRequest('GET', `${BASE_URL}/api/notifications?page=1&limit=10`, null, headers);
  
  check(notificationsResponse, {
    'notifications successful': (r) => r.status === 200,
    'notifications response time < 1s': (r) => r.timings.duration < 1000
  });

  // Test chat conversations
  const conversationsResponse = makeRequest('GET', `${BASE_URL}/api/chat/conversations`, null, headers);
  
  check(conversationsResponse, {
    'conversations successful': (r) => r.status === 200,
    'conversations response time < 2s': (r) => r.timings.duration < 2000
  });

  // Test matching
  const matchingResponse = makeRequest('GET', `${BASE_URL}/api/matching/matches?limit=10`, null, headers);
  
  check(matchingResponse, {
    'matching successful': (r) => r.status === 200,
    'matching response time < 3s': (r) => r.timings.duration < 3000
  });
}

// Web Frontend Test
export function webFrontendTest() {
  // Test main page
  const mainPageResponse = makeRequest('GET', WEB_URL);
  
  check(mainPageResponse, {
    'main page loads successfully': (r) => r.status === 200,
    'main page response time < 3s': (r) => r.timings.duration < 3000,
    'main page contains expected content': (r) => r.body.includes('Ask Ya Cham')
  });

  // Test health page
  const healthPageResponse = makeRequest('GET', `${WEB_URL}/health`);
  
  check(healthPageResponse, {
    'health page loads successfully': (r) => r.status === 200,
    'health page response time < 2s': (r) => r.timings.duration < 2000
  });
}

// Database Performance Test
export function databaseTest() {
  // Test database health through API
  const dbHealthResponse = makeRequest('GET', `${BASE_URL}/health/detailed`);
  
  check(dbHealthResponse, {
    'database health check successful': (r) => r.status === 200,
    'database response time < 1s': (r) => r.timings.duration < 1000,
    'database is healthy': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.checks.database.status === 'healthy';
      } catch (e) {
        return false;
      }
    }
  });
}

// API Rate Limiting Test
export function rateLimitTest() {
  const requests = [];
  
  // Make multiple rapid requests to test rate limiting
  for (let i = 0; i < 20; i++) {
    requests.push(makeRequest('GET', `${BASE_URL}/health`));
  }
  
  const rateLimitedRequests = requests.filter(r => r.status === 429);
  
  check(rateLimitedRequests, {
    'rate limiting is working': (r) => rateLimitedRequests.length > 0,
    'rate limiting response is correct': (r) => {
      return rateLimitedRequests.every(req => req.status === 429);
    }
  });
}

// Error Handling Test
export function errorHandlingTest() {
  // Test 404 endpoint
  const notFoundResponse = makeRequest('GET', `${BASE_URL}/api/nonexistent`);
  
  check(notFoundResponse, {
    '404 handled correctly': (r) => r.status === 404,
    '404 response time < 1s': (r) => r.timings.duration < 1000
  });

  // Test invalid authentication
  const invalidAuthResponse = makeRequest('GET', `${BASE_URL}/api/auth/me`, null, {
    'Authorization': 'Bearer invalid-token'
  });
  
  check(invalidAuthResponse, {
    '401 handled correctly': (r) => r.status === 401,
    '401 response time < 1s': (r) => r.timings.duration < 1000
  });
}

// Memory and Performance Test
export function performanceTest() {
  // Test memory usage endpoint
  const metricsResponse = makeRequest('GET', `${BASE_URL}/health/metrics`);
  
  check(metricsResponse, {
    'metrics endpoint accessible': (r) => r.status === 200,
    'metrics response time < 1s': (r) => r.timings.duration < 1000,
    'metrics contain expected data': (r) => r.body.includes('nodejs_memory_usage_bytes')
  });
}

// Cleanup function
export function teardown(data) {
  console.log('Load test completed');
  console.log(`Total requests: ${requestCount}`);
  console.log(`Error rate: ${errorRate}`);
  console.log(`Average response time: ${responseTime}`);
}

// Setup function
export function setup() {
  console.log('Starting Ask Ya Cham production load test');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Web URL: ${WEB_URL}`);
  
  // Warm up the application
  const warmupResponse = makeRequest('GET', `${BASE_URL}/health`);
  if (warmupResponse.status !== 200) {
    throw new Error('Application is not ready for load testing');
  }
  
  console.log('Application warmed up successfully');
}
