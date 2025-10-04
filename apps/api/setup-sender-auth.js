#!/usr/bin/env node

/**
 * SETUP SENDER AUTHENTICATION - Google-like Implementation
 * This script sets up sender authentication for askyacham.com
 */

require('dotenv').config();

async function setupSenderAuth() {
  console.log('🔧 SETTING UP SENDER AUTHENTICATION - Google-like Implementation\n');
  
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  
  if (!apiKey) {
    console.error('❌ SENDGRID_API_KEY is not set');
    process.exit(1);
  }
  
  console.log(`📧 Setting up authentication for: ${fromEmail}`);
  
  try {
    // First, let's verify the sender
    console.log('📧 Verifying sender...');
    const verifyResponse = await fetch('https://api.sendgrid.com/v3/verified_senders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: {
          email: fromEmail,
          name: 'Ask Ya Cham'
        },
        reply_to: {
          email: 'support@askyacham.com',
          name: 'Ask Ya Cham Support'
        }
      })
    });
    
    console.log(`Status: ${verifyResponse.status}`);
    
    if (verifyResponse.ok) {
      const result = await verifyResponse.json();
      console.log('✅ Sender verification initiated!');
      console.log(`📧 Verification ID: ${result.id}`);
      console.log('📬 Check your email for verification link');
    } else {
      const error = await verifyResponse.text();
      console.log('❌ Sender verification failed!');
      console.log(`Error: ${error}`);
    }
    
  } catch (error) {
    console.log('❌ Error setting up sender authentication:', error.message);
  }
  
  console.log('\n📋 MANUAL SETUP REQUIRED:');
  console.log('1. Go to SendGrid Dashboard: https://app.sendgrid.com/');
  console.log('2. Navigate to Settings > Sender Authentication');
  console.log('3. Set up Domain Authentication for askyacham.com');
  console.log('4. Add the required DNS records to your domain');
  console.log('5. Verify the domain authentication');
  console.log('\n🔗 Direct Links:');
  console.log('- Sender Authentication: https://app.sendgrid.com/settings/sender_auth');
  console.log('- Domain Authentication: https://app.sendgrid.com/settings/sender_auth/domains');
}

// Run the setup
setupSenderAuth().catch(console.error);











