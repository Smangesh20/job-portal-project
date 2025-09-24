import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log(`🔐 FORGOT PASSWORD REQUEST: ${email}`);

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

    // Check SendGrid configuration
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@askyacham.com';
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com';

    if (!sendGridApiKey) {
      console.error('❌ SENDGRID_API_KEY not configured');
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMAIL_SERVICE_ERROR',
            message: 'Email service is not configured. Please contact support.'
          }
        },
        { status: 503 }
      );
    }

    // Generate secure reset token
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Extract first name from email
    const firstName = email.split('@')[0].split('.')[0];
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    // Create reset URL
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;
    
    // Simple email data
    const emailData = {
      personalizations: [{
        to: [{ email: email }],
        subject: 'Reset your password - Ask Ya Cham'
      }],
      from: { 
        email: fromEmail,
        name: 'Ask Ya Cham'
      },
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

    // Send email via SendGrid
    console.log(`📧 Sending password reset email to: ${email}`);
    
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
    console.log(`✅ PASSWORD RESET EMAIL SENT: ${email} - Message ID: ${messageId}`);

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we\'ve sent you a password reset link. Please check your inbox and spam folder.',
      data: {
        instructions: 'Please check your email and follow the instructions to reset your password. The link will expire in 1 hour.',
        securityNote: 'For security reasons, we do not reveal whether an email address is registered with our system.',
        timestamp: new Date().toISOString(),
        messageId: messageId
      }
    });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error);
    
    // Return a generic error message for security
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PASSWORD_RESET_FAILED',
          message: 'Failed to process password reset request. Please try again later.'
        }
      },
      { status: 500 }
    );
  }
}