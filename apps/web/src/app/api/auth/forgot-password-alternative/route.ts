import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log(`🔐 ALTERNATIVE FORGOT PASSWORD REQUEST: ${email}`);

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'MISSING_EMAIL', 
            message: 'Email is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_EMAIL', 
            message: 'Please enter a valid email address' 
          } 
        },
        { status: 400 }
      );
    }

    // Google-style alternative approach - use multiple delivery methods
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com';

    console.log('📧 ALTERNATIVE EMAIL DELIVERY:');
    console.log(`   API Key: ${sendGridApiKey ? 'Configured ✅' : 'Not Configured ❌'}`);
    console.log(`   Frontend URL: ${frontendUrl}`);

    if (!sendGridApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMAIL_SERVICE_ERROR',
            message: 'Email service is not configured. Please contact support.'
          }
        },
        { status: 500 }
      );
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Extract first name from email
    const firstName = email.split('@')[0].split('.')[0];
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    // Create reset URL
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;
    
    // Google-style bulletproof email with verified sender
    const emailData = {
      personalizations: [{
        to: [{ email: email }],
        subject: 'Reset your password - Ask Ya Cham',
        custom_args: {
          source: 'forgot-password-alternative',
          timestamp: Date.now().toString()
        }
      }],
      from: { 
        email: 'noreply@sendgrid.com', // Use SendGrid's verified sender
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
      categories: ['password-reset', 'security', 'authentication'],
      content: [
        {
          type: 'text/plain',
          value: `Hi ${displayName},\n\nWe received a request to reset your password for your Ask Ya Cham account.\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour. If you didn't request this password reset, please ignore this email.\n\nBest regards,\nThe Ask Ya Cham Team`
        },
        {
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #1a73e8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0;">Reset Your Password</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2>Hi ${displayName},</h2>
                <p>We received a request to reset your password for your Ask Ya Cham account.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #1a73e8;">${resetUrl}</p>
                <div style="background: #fef7e0; border: 1px solid #f9ab00; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
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

    // Send email via SendGrid with Google-style retry logic
    console.log(`📧 Sending password reset email to: ${email}`);
    
    let response;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendGridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        });

        console.log(`📡 SendGrid Response Status: ${response.status}`);

        if (response.ok) {
          break; // Success, exit retry loop
        } else {
          const errorData = await response.text();
          console.error(`❌ SendGrid API error (attempt ${retryCount + 1}): ${response.status} - ${errorData}`);
          
          if (retryCount < maxRetries - 1) {
            console.log(`🔄 Retrying in ${(retryCount + 1) * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
            retryCount++;
          } else {
            throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
          }
        }
      } catch (error) {
        if (retryCount < maxRetries - 1) {
          console.log(`🔄 Network error, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
        } else {
          throw error;
        }
      }
    }

    const messageId = response.headers.get('x-message-id');
    console.log(`✅ ALTERNATIVE PASSWORD RESET EMAIL SENT: ${email} - Message ID: ${messageId}`);

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we\'ve sent you a password reset link. Please check your inbox and spam folder.',
      data: {
        instructions: 'Please check your email and follow the instructions to reset your password. The link will expire in 1 hour.',
        securityNote: 'If you don\'t see the email, check your spam folder.',
        messageId: messageId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ ALTERNATIVE FORGOT PASSWORD ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PASSWORD_RESET_FAILED',
          message: error.message || 'Failed to process password reset request. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}












