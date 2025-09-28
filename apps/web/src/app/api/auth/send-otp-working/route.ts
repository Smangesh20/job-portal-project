import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// 🚀 SENDGRID EMAIL - YOUR CONFIGURED VARIABLES
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    // 🚀 GENERATE OTP - WORKS LIKE GOOGLE
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 🚀 EMAIL CONTENT - ENTERPRISE LEVEL
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'noreply@yourapp.com',
      subject: '🔐 Your Verification Code - Secure Access',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Verification Code</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Your verification code is:</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otp}</span>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              This code will expire in 5 minutes. If you didn't request this code, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    }
    
    // 🚀 SEND EMAIL - WORKS LIKE GOOGLE
    await sgMail.send(msg)
    
    // 🚀 RETURN SUCCESS - ENTERPRISE LEVEL
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      otp: otp, // For development - remove in production
    })
    
  } catch (error) {
    console.error('SendGrid Email Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
