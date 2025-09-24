#!/usr/bin/env node

/**
 * REAL EMAIL DELIVERY TEST - Google-like Implementation
 * This script tests actual email delivery to a real email address
 */

require('dotenv').config();

async function testRealEmailDelivery() {
  console.log('🚀 TESTING REAL EMAIL DELIVERY - Google-like Implementation\n');
  
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
    // Test with a real email address - REPLACE WITH YOUR EMAIL
    const testEmail = 'rahul@askyacham.com'; // ⚠️ REPLACE THIS WITH YOUR REAL EMAIL ADDRESS
    const testFirstName = 'Test User';
    const testToken = 'test-token-' + Date.now();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${testToken}`;
    const timestamp = new Date().toISOString();
    
    console.log('📧 Testing REAL email delivery...');
    console.log(`📮 Test Email: ${testEmail}`);
    console.log(`🔗 Reset URL: ${resetUrl}\n`);
    
    // Google-like email template with enhanced design
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Ask Ya Cham</title>
        <style>
          body { 
            font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #202124; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #4285f4 0%, #34a853 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 400;
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: #1a73e8; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 4px; 
            margin: 20px 0; 
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .button:hover {
            background: #1557b0;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #5f6368; 
            font-size: 14px; 
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e8eaed;
          }
          .security-info {
            background: #e8f0fe;
            border: 1px solid #1a73e8;
            padding: 16px;
            border-radius: 4px;
            margin: 20px 0;
            border-left: 4px solid #1a73e8;
          }
          .timestamp {
            color: #5f6368;
            font-size: 12px;
            margin-top: 20px;
          }
          .link-fallback {
            word-break: break-all; 
            color: #1a73e8; 
            font-size: 14px;
            background: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid #e8eaed;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
          </div>
          <div class="content">
            <h2 style="color: #202124; margin-top: 0;">Hi ${testFirstName},</h2>
            <p>We received a request to reset your password for your Ask Ya Cham account. If you made this request, click the button below to reset your password.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="security-info">
              <strong>🔒 Security Information:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>This link will expire in 1 hour for your security</li>
                <li>Only you can use this link to reset your password</li>
                <li>If you didn't request this, you can safely ignore this email</li>
              </ul>
            </div>
            
            <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
            <div class="link-fallback">${resetUrl}</div>
            
            <div class="timestamp">Request made on: ${new Date(timestamp).toLocaleString()}</div>
          </div>
          <div class="footer">
            <p><strong>Ask Ya Cham Team</strong></p>
            <p>This email was sent to help you secure your account. If you have any questions, contact our support team.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9aa0a6;">
              © 2024 Ask Ya Cham. All rights reserved.<br>
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Google-like email payload with enhanced tracking
    const emailPayload = {
      personalizations: [{
        to: [{ email: testEmail }],
        subject: 'Reset your password - Ask Ya Cham',
        // Add tracking for Google-like analytics
        custom_args: {
          user_id: 'test-user-id',
          email_type: 'password_reset',
          timestamp: Date.now().toString(),
          source: 'ask-ya-cham-platform'
        }
      }],
      from: { 
        email: process.env.FROM_EMAIL,
        name: 'Ask Ya Cham'
      },
      reply_to: {
        email: 'support@askyacham.com',
        name: 'Ask Ya Cham Support'
      },
      content: [
        {
          type: 'text/plain',
          value: `Hi ${testFirstName}, reset your password by clicking this link: ${resetUrl}`
        },
        {
          type: 'text/html',
          value: htmlTemplate
        }
      ],
      // Google-like email settings
      mail_settings: {
        sandbox_mode: {
          enable: false // Set to false for real delivery
        },
        spam_check: {
          enable: false,
          threshold: 5
        },
        click_tracking: {
          enable: true,
          enable_text: true
        },
        open_tracking: {
          enable: true,
          substitution_tag: '%open-track%'
        },
        subscription_tracking: {
          enable: true,
          text: 'If you would like to unsubscribe and stop receiving these emails, you can do so here: <% %>',
          html: '<p>If you would like to unsubscribe and stop receiving these emails, you can do so <a href="<% %>">here</a>.</p>',
          substitution_tag: '<% %>'
        }
      },
      // Real-time tracking like Google
      tracking_settings: {
        click_tracking: {
          enable: true,
          enable_text: true
        },
        open_tracking: {
          enable: true,
          substitution_tag: '%open-track%'
        },
        subscription_tracking: {
          enable: true,
          text: 'If you would like to unsubscribe and stop receiving these emails, you can do so here: <% %>',
          html: '<p>If you would like to unsubscribe and stop receiving these emails, you can do so <a href="<% %>">here</a>.</p>',
          substitution_tag: '<% %>'
        }
      }
    };

    console.log('📤 Sending email via SendGrid API...');
    console.log('🔍 Payload:', JSON.stringify(emailPayload, null, 2));
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AskYaCham-EmailService/1.0'
      },
      body: JSON.stringify(emailPayload)
    });

    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📋 Response Headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ SendGrid API error: ${response.status} - ${errorData}`);
      process.exit(1);
    }

    const messageId = response.headers.get('x-message-id');
    const requestId = response.headers.get('x-request-id');
    
    console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
    console.log(`📧 Message ID: ${messageId}`);
    console.log(`🆔 Request ID: ${requestId}`);
    console.log('📊 Email tracking enabled for real-time analytics');
    console.log('\n🔍 CHECK YOUR EMAIL NOW:');
    console.log(`📮 To: ${testEmail}`);
    console.log('📱 Check both inbox and spam folder');
    console.log('⏰ Email should arrive within 1-2 minutes');
    console.log('📧 Email should have Google-like design and tracking');
    
    // Additional debugging info
    console.log('\n🔧 DEBUGGING INFO:');
    console.log(`🌐 SendGrid API: https://api.sendgrid.com/v3/mail/send`);
    console.log(`🔑 API Key: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...`);
    console.log(`📤 From: ${process.env.FROM_EMAIL}`);
    console.log(`📥 To: ${testEmail}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('🔍 Full error:', error);
    process.exit(1);
  }
}

// Run the test
testRealEmailDelivery().catch(console.error);
