#!/usr/bin/env node

/**
 * Test Forgot Password API Endpoint - Google-like Implementation
 * This script tests the actual API endpoint to ensure it works like Google
 */

require('dotenv').config();

async function testForgotPasswordAPI() {
  console.log('🚀 Testing Forgot Password API Endpoint...\n');
  
  const API_URL = process.env.API_URL || 'http://localhost:3001';
  const testEmail = 'test@example.com'; // Replace with your actual email
  
  try {
    console.log('📧 Testing forgot password endpoint...');
    console.log(`🌐 API URL: ${API_URL}`);
    console.log(`📮 Test Email: ${testEmail}\n`);
    
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AskYaCham-TestClient/1.0'
      },
      body: JSON.stringify({
        email: testEmail
      })
    });
    
    const responseData = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📋 Response Data:`, JSON.stringify(responseData, null, 2));
    
    if (response.ok && responseData.success) {
      console.log('\n✅ Forgot password API test successful!');
      console.log('📧 Check your email inbox and spam folder');
      console.log('🔍 Email should have Google-like design and tracking');
      console.log('📱 Email should include real-time tracking and analytics');
    } else {
      console.log('\n❌ Forgot password API test failed');
      console.log('🔍 Error details:', responseData.error || responseData.message);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.error('🔍 Full error:', error);
  }
}

// Run the test
testForgotPasswordAPI().catch(console.error);











