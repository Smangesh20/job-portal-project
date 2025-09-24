import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log(`🧪 TESTING REAL EMAIL DELIVERY: ${email}`);

    if (!email) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_EMAIL', message: 'Email is required' } },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address' } },
        { status: 400 }
      );
    }

    // Get configuration
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'; // Use configured sender
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com';

    console.log('📧 SendGrid Config Check:');
    console.log(`   API Key: ${sendGridApiKey ? 'Configured ✅' : 'Not Configured ❌'}`);
    console.log(`   From Email: ${fromEmail}`);
    console.log(`   Frontend URL: ${frontendUrl}`);

    if (!sendGridApiKey) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFIG_ERROR', message: 'SendGrid not configured' } },
        { status: 500 }
      );
    }

    // Generate test token
    const testToken = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${testToken}`;
    
    // Extract first name from email
    const firstName = email.split('@')[0].split('.')[0];
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    // Simple test email data
    const emailData = {
      personalizations: [{
        to: [{ email: email }],
        subject: '🧪 TEST: Ask Ya Cham Email Delivery Test',
        custom_args: {
          source: 'email-test',
          timestamp: Date.now().toString()
        }
      }],
      from: { 
        email: fromEmail,
        name: 'Ask Ya Cham Team'
      },
      reply_to: {
        email: 'support@askyacham.com',
        name: 'Ask Ya Cham Support'
      },
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true },
        subscription_tracking: { enable: false }
      },
      categories: ['test', 'email-delivery'],
      content: [
        {
          type: 'text/plain',
          value: `Hi ${displayName},\n\nThis is a test email from Ask Ya Cham to verify email delivery.\n\nIf you receive this email, our email system is working correctly!\n\nTest Reset Link: ${resetUrl}\n\nBest regards,\nThe Ask Ya Cham Team`
        },
        {
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #1a73e8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0;">🧪 Email Delivery Test</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2>Hi ${displayName},</h2>
                <p>This is a test email from Ask Ya Cham to verify email delivery.</p>
                <p><strong>If you receive this email, our email system is working correctly! ✅</strong></p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Test Reset Link</a>
                </div>
                
                <div style="background: #e8f5e8; border: 1px solid #4caf50; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <strong>✅ Email Delivery Status:</strong> Working correctly!
                </div>
              </div>
              <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
                <p>Best regards,<br>The Ask Ya Cham Team</p>
                <p>© 2024 Ask Ya Cham. All rights reserved.</p>
              </div>
            </div>
          `
        }
      ]
    };

    // Send email via SendGrid
    console.log(`📧 Sending test email to: ${email}`);
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    console.log(`📡 SendGrid Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ SendGrid API error: ${response.status} - ${errorData}`);
      throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
    }

    const messageId = response.headers.get('x-message-id');
    console.log(`✅ TEST EMAIL SENT: ${email} - Message ID: ${messageId}`);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully! Please check your inbox and spam folder.',
      data: {
        email,
        messageId,
        timestamp: new Date().toISOString(),
        instructions: 'Check your inbox and spam folder for the test email. If you receive it, our email system is working correctly!'
      }
    });

  } catch (error: any) {
    console.error('❌ TEST EMAIL ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'EMAIL_SEND_FAILED',
          message: error.message || 'Failed to send test email'
        }
      },
      { status: 500 }
    );
  }
}
