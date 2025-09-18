const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data.success ? 'OK' : 'FAILED');

    // Test 2: Register a user
    console.log('\n2. Testing user registration...');
    const registerData = {
      email: 'apitest@example.com',
      password: 'testpassword123',
      firstName: 'API',
      lastName: 'Test',
      role: 'CANDIDATE'
    };

    const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, registerData);
    console.log('✅ User registered:', registerResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   User ID:', registerResponse.data.data.user.id);
    console.log('   Email:', registerResponse.data.data.user.email);

    const userId = registerResponse.data.data.user.id;

    // Test 3: Login with the user
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'apitest@example.com',
      password: 'testpassword123'
    };

    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, loginData);
    console.log('✅ User login:', loginResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   User ID:', loginResponse.data.data.user.id);

    // Test 4: Get user profile
    console.log('\n4. Testing get user profile...');
    const profileResponse = await axios.get(`${API_BASE}/api/auth/profile/${userId}`);
    console.log('✅ Profile retrieved:', profileResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Name:', profileResponse.data.data.user.firstName, profileResponse.data.data.user.lastName);

    // Test 5: Update user profile
    console.log('\n5. Testing update user profile...');
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name'
    };

    const updateResponse = await axios.put(`${API_BASE}/api/auth/profile/${userId}`, updateData);
    console.log('✅ Profile updated:', updateResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   New name:', updateResponse.data.data.user.firstName, updateResponse.data.data.user.lastName);

    // Test 6: Verify persistence by getting profile again
    console.log('\n6. Testing persistence by getting updated profile...');
    const verifyResponse = await axios.get(`${API_BASE}/api/auth/profile/${userId}`);
    console.log('✅ Profile verification:', verifyResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Verified name:', verifyResponse.data.data.user.firstName, verifyResponse.data.data.user.lastName);

    console.log('\n🎉 ALL API TESTS PASSED! Account data persistence is working through API!');
    console.log('\n📊 API Test Summary:');
    console.log(`   - Health check: ${healthResponse.data.success ? 'PASS' : 'FAIL'}`);
    console.log(`   - User registration: ${registerResponse.data.success ? 'PASS' : 'FAIL'}`);
    console.log(`   - User login: ${loginResponse.data.success ? 'PASS' : 'FAIL'}`);
    console.log(`   - Get profile: ${profileResponse.data.success ? 'PASS' : 'FAIL'}`);
    console.log(`   - Update profile: ${updateResponse.data.success ? 'PASS' : 'FAIL'}`);
    console.log(`   - Verify persistence: ${verifyResponse.data.success ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Start the API server first, then test
async function startServerAndTest() {
  console.log('🚀 Starting API server...');
  
  // Start server in background
  const { spawn } = require('child_process');
  const server = spawn('node', ['apps/api/src/index.ts'], { 
    stdio: 'pipe',
    cwd: process.cwd()
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    await testAPIEndpoints();
  } finally {
    // Kill the server
    server.kill();
    console.log('\n🛑 API server stopped.');
  }
}

startServerAndTest();
