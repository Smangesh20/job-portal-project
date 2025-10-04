#!/usr/bin/env node

/**
 * Test SendGrid Email Delivery - Google-like Implementation
 * This script tests the email functionality to ensure it works like Google
 */

require('dotenv').config();
const { EmailService } = require('./dist/services/emailService');

async function testEmailDelivery() {
  console.log('🚀 Testing SendGrid Email Delivery...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`EMAIL_PROVIDER: ${process.env.EMAIL_PROVIDER}`);
  console.log(`SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}\n`);
  
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not set in environment variables');
    process.exit(1);
  }
  
  if (process.env.EMAIL_PROVIDER !== 'sendgrid') {
    console.error('❌ EMAIL_PROVIDER is not set to "sendgrid"');
    process.exit(1);
  }
  
  try {
    const emailService = new EmailService();
    
    // Test password reset email
    console.log('📧 Testing Password Reset Email...');
    const testToken = 'test-token-' + Date.now();
    const testEmail = 'test@example.com'; // Replace with your test email
    const testFirstName = 'Test User';
    
    await emailService.sendPasswordResetEmail(
      testEmail, 
      testFirstName, 
      testToken, 
      'test-user-id'
    );
    
    console.log('✅ Password reset email sent successfully!');
    console.log('📊 Check your email inbox and spam folder');
    console.log('🔍 Email should have Google-like design and tracking');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('🔍 Full error:', error);
    process.exit(1);
  }
}

// Run the test
testEmailDelivery().catch(console.error);


















