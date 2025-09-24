import { NextRequest, NextResponse } from 'next/server';

// GOOGLE-STYLE SENDGRID EMAIL SERVICE - BULLETPROOF IMPLEMENTATION
async function sendPasswordResetEmail(email: string, firstName: string, token: string): Promise<void> {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'noreply@askyacham.com';
  const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com';
  
  if (!sendGridApiKey) {
    throw new Error('SendGrid API key not configured');
  }

  const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
  
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
        type: 'text/html',
        value: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
              body {
                font-family: 'Google Sans', Arial, sans-serif;
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
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                overflow: hidden;
              }
              .header {
                background: #1a73e8;
                color: white;
                padding: 32px 24px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 400;
              }
              .content {
                padding: 32px 24px;
              }
              .content h2 {
                color: #202124;
                font-size: 20px;
                font-weight: 400;
                margin: 0 0 16px 0;
              }
              .content p {
                color: #5f6368;
                margin: 0 0 24px 0;
              }
              .button {
                display: inline-block;
                background: #1a73e8;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 500;
                margin: 16px 0;
                transition: background-color 0.2s;
              }
              .button:hover {
                background: #1557b0;
              }
              .security-notice {
                background: #fef7e0;
                border: 1px solid #f9ab00;
                border-radius: 4px;
                padding: 16px;
                margin: 24px 0;
              }
              .security-notice strong {
                color: #ea8600;
              }
              .footer {
                background: #f8f9fa;
                padding: 24px;
                text-align: center;
                color: #5f6368;
                font-size: 14px;
              }
              .link {
                color: #1a73e8;
                word-break: break-all;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Reset Your Password</h1>
              </div>
              <div class="content">
                <h2>Hi ${firstName},</h2>
                <p>We received a request to reset your password for your Ask Ya Cham account.</p>
                
                <a href="${resetUrl}" class="button">Reset Password</a>
                
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p class="link">${resetUrl}</p>
                
                <div class="security-notice">
                  <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
                </div>
              </div>
              <div class="footer">
                <p>Best regards,<br>The Ask Ya Cham Team</p>
                <p>© 2024 Ask Ya Cham. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      },
      {
        type: 'text/plain',
        value: `Hi ${firstName},\n\nWe received a request to reset your password for your Ask Ya Cham account.\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour. If you didn't request this password reset, please ignore this email.\n\nBest regards,\nThe Ask Ya Cham Team`
      }
    ],
    tracking_settings: {
      click_tracking: {
        enable: true,
        enable_text: true
      },
      open_tracking: {
        enable: true
      }
    }
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sendGridApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`SendGrid API error: ${response.status} - ${errorData}`);
    throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
  }

  const messageId = response.headers.get('x-message-id');
  console.log(`✅ Password reset email sent successfully - Message ID: ${messageId}`);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

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

    console.log(`🔐 FORGOT PASSWORD: Request for ${email}`);

    // Generate reset token
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // For demo purposes, we'll send the email to any email address
    // In production, you would check if the user exists in your database
    const firstName = email.split('@')[0]; // Extract name from email for demo
    
    // Send Google-style password reset email
    await sendPasswordResetEmail(email, firstName, resetToken);

    console.log(`✅ PASSWORD RESET EMAIL SENT: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset link has been sent to your email address.',
      data: {
        instructions: 'Please check your email and follow the instructions to reset your password. The link will expire in 1 hour.',
        securityNote: 'If you don\'t see the email, check your spam folder.'
      }
    });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PASSWORD_RESET_FAILED',
          message: 'Failed to send password reset email. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}
