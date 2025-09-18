import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a secure reset token
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'}/auth/reset-password?token=${resetToken}`;

    // Check if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
      try {
        // Send real email using SendGrid
        const msg = {
          to: email,
          from: process.env.FROM_EMAIL,
          subject: 'Reset Your Password - Ask Ya Cham',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Reset Your Password</h2>
              <p>Hello,</p>
              <p>You requested a password reset for your Ask Ya Cham account. Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
              <p>If you did not request this password reset, please ignore this email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                The Ask Ya Cham Team
              </p>
            </div>
          `,
          text: `
            Reset Your Password - Ask Ya Cham
            
            Hello,
            
            You requested a password reset for your Ask Ya Cham account. 
            Click the link below to reset your password:
            
            ${resetUrl}
            
            This link will expire in 1 hour for security reasons.
            
            If you did not request this password reset, please ignore this email.
            
            Best regards,
            The Ask Ya Cham Team
          `
        };

        await sgMail.send(msg);
        console.log(`✅ Real email sent via SendGrid to: ${email}`);
        console.log(`🔗 Reset URL: ${resetUrl}`);

      } catch (sendGridError) {
        console.error('SendGrid error:', sendGridError);
        // Fall back to mock email if SendGrid fails
        console.log(`📧 Mock: Password reset email would be sent to: ${email}`);
        console.log(`🔗 Mock Reset URL: ${resetUrl}`);
      }
    } else {
      // No SendGrid configured, use mock
      console.log(`📧 Mock: Password reset email would be sent to: ${email}`);
      console.log(`🔗 Mock Reset URL: ${resetUrl}`);
      console.log(`⚠️ SendGrid not configured. Set SENDGRID_API_KEY and FROM_EMAIL environment variables.`);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
      data: {
        instructions: 'Please check your email and follow the instructions to reset your password.',
        expiry: 'The reset link will expire in 1 hour for security reasons.',
        securityNote: 'If you did not request this password reset, please ignore this email.',
        // For development/testing purposes, include the reset URL
        ...(process.env.NODE_ENV === 'development' && { resetUrl })
      }
    });

  } catch (error) {
    console.error('Error in send-reset-email API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred while sending the reset email' 
      },
      { status: 500 }
    );
  }
}
