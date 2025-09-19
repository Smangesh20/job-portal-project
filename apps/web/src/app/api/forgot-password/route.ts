import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

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

    // Generate secure reset token
    const resetToken = 'token_' + Math.random().toString(36).substr(2, 32);
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'}/reset-password?token=${resetToken}`;

    // Send email via SendGrid
    const apiKey = process.env.SENDGRID_API_KEY || process.env.NEXT_PUBLIC_SENDGRID_API_KEY;
    
    if (!apiKey) {
      console.error('❌ SendGrid API key not found');
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'EMAIL_CONFIG_ERROR', 
            message: 'Email service not configured. Please try again later.' 
          } 
        },
        { status: 500 }
      );
    }

    sgMail.setApiKey(apiKey);
    
    const fromEmail = process.env.FROM_EMAIL || process.env.NEXT_PUBLIC_FROM_EMAIL || 'info@askyacham.com';

    // Google-style email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
        <style>
          body { 
            font-family: 'Google Sans', Roboto, Arial, sans-serif; 
            line-height: 1.6; 
            color: #202124; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 0; 
            background-color: #f8f9fa;
          }
          .container { 
            background: white; 
            margin: 40px auto; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            overflow: hidden;
          }
          .header { 
            background: #4285f4; 
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
          .greeting { 
            font-size: 18px; 
            margin-bottom: 16px; 
            color: #202124;
          }
          .message { 
            font-size: 14px; 
            color: #5f6368; 
            margin-bottom: 24px; 
            line-height: 1.5;
          }
          .button { 
            display: inline-block; 
            background: #1a73e8; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 4px; 
            font-size: 14px; 
            font-weight: 500; 
            margin: 16px 0; 
            transition: background-color 0.2s;
          }
          .button:hover { 
            background: #1557b0; 
          }
          .alternative { 
            margin-top: 24px; 
            padding: 16px; 
            background: #f8f9fa; 
            border-radius: 4px; 
            border-left: 4px solid #1a73e8;
          }
          .alternative p { 
            margin: 0 0 8px 0; 
            font-size: 14px; 
            color: #5f6368; 
          }
          .link { 
            word-break: break-all; 
            color: #1a73e8; 
            font-size: 12px; 
            font-family: monospace;
          }
          .security { 
            margin-top: 24px; 
            padding: 16px; 
            background: #fef7e0; 
            border-radius: 4px; 
            border-left: 4px solid #f9ab00;
          }
          .security p { 
            margin: 0; 
            font-size: 13px; 
            color: #5f6368; 
          }
          .footer { 
            text-align: center; 
            margin-top: 32px; 
            padding: 24px; 
            border-top: 1px solid #dadce0;
            color: #5f6368; 
            font-size: 12px; 
          }
          .logo { 
            font-size: 20px; 
            font-weight: 500; 
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset your password</h1>
          </div>
          <div class="content">
            <div class="greeting">Hi there,</div>
            <div class="message">
              We received a request to reset the password for your Ask Ya Cham account. 
              Click the button below to reset your password.
            </div>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset password</a>
            </div>
            
            <div class="alternative">
              <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
              <p class="link">${resetUrl}</p>
            </div>
            
            <div class="security">
              <p><strong>Security tip:</strong> This link will expire in 15 minutes. If you didn't request this password reset, you can safely ignore this email.</p>
            </div>
          </div>
          <div class="footer">
            <div class="logo">Ask Ya Cham</div>
            <p>This email was sent to ${email}</p>
            <p>© 2024 Ask Ya Cham. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Reset your password - Ask Ya Cham',
      text: `Reset your password by clicking this link: ${resetUrl}`,
      html: emailHtml,
    };

    console.log('📧 Sending password reset email via SendGrid:', {
      to: email,
      from: fromEmail,
      resetUrl: resetUrl
    });

    const response = await sgMail.send(msg);
    
    console.log('✅ Password reset email sent successfully:', response[0].headers['x-message-id']);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we\'ve sent you a password reset link. Please check your inbox and spam folder.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while processing your request. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}
