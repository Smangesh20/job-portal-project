#!/usr/bin/env node

// Test SendGrid Configuration
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing SendGrid Configuration...');
console.log('=====================================\n');

console.log('📋 Environment Variables:');
console.log('NEXT_PUBLIC_SENDGRID_API_KEY:', process.env.NEXT_PUBLIC_SENDGRID_API_KEY ? '✅ Found' : '❌ Missing');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Found' : '❌ Missing');
console.log('NEXT_PUBLIC_FROM_EMAIL:', process.env.NEXT_PUBLIC_FROM_EMAIL ? '✅ Found' : '❌ Missing');
console.log('FROM_EMAIL:', process.env.FROM_EMAIL ? '✅ Found' : '❌ Missing');

if (process.env.NEXT_PUBLIC_SENDGRID_API_KEY) {
  console.log('\n✅ Configuration looks good!');
  console.log('🔄 Please restart your development server to apply changes.');
  console.log('📧 Real emails should now work!');
} else {
  console.log('\n❌ Configuration incomplete!');
  console.log('Please check your .env.local file.');
}
