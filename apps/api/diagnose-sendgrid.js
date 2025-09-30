#!/usr/bin/env node

/**
 * SENDGRID DIAGNOSTIC TOOL - Google-like Implementation
 * This script diagnoses SendGrid configuration issues
 */

require('dotenv').config();

async function diagnoseSendGrid() {
  console.log('🔍 SENDGRID DIAGNOSTIC TOOL - Google-like Implementation\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`EMAIL_PROVIDER: ${process.env.EMAIL_PROVIDER}`);
  console.log(`SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}\n`);
  
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not set in environment variables');
    process.exit(1);
  }
  
  // Check API key format
  console.log('🔑 API Key Analysis:');
  const apiKey = process.env.SENDGRID_API_KEY;
  console.log(`Length: ${apiKey.length} characters`);
  console.log(`Starts with: ${apiKey.substring(0, 3)}`);
  console.log(`Format: ${apiKey.startsWith('SG.') ? '✅ Correct' : '❌ Incorrect'}`);
  console.log(`Contains dots: ${apiKey.includes('.') ? '✅ Yes' : '❌ No'}`);
  console.log(`Contains dashes: ${apiKey.includes('-') ? '✅ Yes' : '❌ No'}\n`);
  
  // Test SendGrid API connectivity
  console.log('🌐 Testing SendGrid API Connectivity...');
  try {
    const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const profile = await response.json();
      console.log('✅ SendGrid API connection successful!');
      console.log(`👤 User: ${profile.username || 'Unknown'}`);
      console.log(`📧 Email: ${profile.email || 'Unknown'}`);
      console.log(`🏢 Company: ${profile.company || 'Unknown'}`);
    } else {
      const error = await response.text();
      console.log('❌ SendGrid API connection failed!');
      console.log(`Error: ${error}`);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('\n🔍 Testing Sender Authentication...');
  try {
    const response = await fetch('https://api.sendgrid.com/v3/verified_senders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const senders = await response.json();
      console.log('✅ Sender verification check successful!');
      console.log(`📧 Verified senders: ${senders.results ? senders.results.length : 0}`);
      
      if (senders.results && senders.results.length > 0) {
        senders.results.forEach((sender, index) => {
          console.log(`  ${index + 1}. ${sender.from.email} - ${sender.verified ? '✅ Verified' : '❌ Not Verified'}`);
        });
      }
    } else {
      const error = await response.text();
      console.log('❌ Sender verification check failed!');
      console.log(`Error: ${error}`);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('\n🔍 Testing Domain Authentication...');
  try {
    const response = await fetch('https://api.sendgrid.com/v3/whitelabel/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const domains = await response.json();
      console.log('✅ Domain authentication check successful!');
      console.log(`🌐 Authenticated domains: ${domains.length || 0}`);
      
      if (domains.length > 0) {
        domains.forEach((domain, index) => {
          console.log(`  ${index + 1}. ${domain.domain} - ${domain.valid ? '✅ Valid' : '❌ Invalid'}`);
        });
      }
    } else {
      const error = await response.text();
      console.log('❌ Domain authentication check failed!');
      console.log(`Error: ${error}`);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('\n🔍 Testing API Key Permissions...');
  try {
    const response = await fetch('https://api.sendgrid.com/v3/scopes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const scopes = await response.json();
      console.log('✅ API key permissions check successful!');
      console.log(`🔑 Available scopes: ${scopes.scopes ? scopes.scopes.length : 0}`);
      
      if (scopes.scopes && scopes.scopes.length > 0) {
        const mailScopes = scopes.scopes.filter(scope => scope.includes('mail'));
        console.log(`📧 Mail-related scopes: ${mailScopes.length}`);
        mailScopes.forEach(scope => {
          console.log(`  - ${scope}`);
        });
      }
    } else {
      const error = await response.text();
      console.log('❌ API key permissions check failed!');
      console.log(`Error: ${error}`);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('\n📋 DIAGNOSTIC SUMMARY:');
  console.log('1. Check if your SendGrid account is active');
  console.log('2. Verify the sender email is authenticated');
  console.log('3. Check if domain authentication is set up');
  console.log('4. Ensure API key has mail.send permissions');
  console.log('5. Check SendGrid account limits and usage');
  console.log('\n🔗 Useful Links:');
  console.log('- SendGrid Dashboard: https://app.sendgrid.com/');
  console.log('- Sender Authentication: https://app.sendgrid.com/settings/sender_auth');
  console.log('- Domain Authentication: https://app.sendgrid.com/settings/sender_auth/domains');
  console.log('- API Keys: https://app.sendgrid.com/settings/api_keys');
}

// Run the diagnostic
diagnoseSendGrid().catch(console.error);






