import { NextRequest, NextResponse } from 'next/server';
import { securitySystem } from '@/lib/security-system';
import { sendPasswordResetEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    const ip = request.ip || 'unknown';

    console.log(`🔐 FORGOT PASSWORD REQUEST: ${email}`);

    // 🚀 SECURITY VALIDATION
    if (securitySystem.isIPBlocked(ip)) {
      return NextResponse.json({
        success: false,
        error: 'Access denied'
      }, { status: 403 })
    }

    // 🚀 RATE LIMITING
    const rateLimit = securitySystem.checkRateLimit(ip, '/api/auth/forgot-password')
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Too many requests. Please try again later.'
      }, { status: 429 })
    }

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

    // 🚀 SANITIZE INPUT
    const sanitizedEmail = securitySystem.sanitizeInput(email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
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

    // 🚀 GENERATE SECURE RESET CODE
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 🚀 STORE RESET CODE
    if (!global.resetCodes) {
      global.resetCodes = new Map();
    }
    
    global.resetCodes.set(sanitizedEmail.toLowerCase(), {
      code: resetCode,
      expiresAt: expiresAt.getTime(),
      attempts: 0,
      createdAt: Date.now()
    });

    // 🚀 CREATE RESET URL
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com';
    const resetUrl = `${frontendUrl}/auth/enhanced-forgot-password`;
    
    // 🚀 SEND EMAIL USING ENTERPRISE EMAIL SERVICE
    console.log(`📧 Sending password reset email to: ${sanitizedEmail}`);
    
    try {
      const emailResponse = await sendPasswordResetEmail(sanitizedEmail, resetUrl);
      
      if (emailResponse.success) {
        console.log(`✅ PASSWORD RESET EMAIL SENT: ${sanitizedEmail} - Message ID: ${emailResponse.messageId}`);
      } else {
        console.error(`❌ Failed to send password reset email: ${emailResponse.error}`);
        throw new Error(emailResponse.error || 'Failed to send email');
      }
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // 🚀 FALLBACK: Return success for security (don't reveal if email exists)
      // In production, you might want to queue the email for retry
    }

    // 🚀 LOG SECURITY EVENT
    securitySystem.logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'low',
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      details: { 
        email: sanitizedEmail,
        action: 'password_reset_requested',
        expiresAt: expiresAt.toISOString()
      },
      blocked: false
    });

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we\'ve sent you a password reset code. Please check your inbox and spam folder.',
      data: {
        instructions: 'Please check your email and enter the 6-digit verification code to reset your password. The code will expire in 15 minutes.',
        securityNote: 'For security reasons, we do not reveal whether an email address is registered with our system.',
        timestamp: new Date().toISOString(),
        expiresIn: 900 // 15 minutes in seconds
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