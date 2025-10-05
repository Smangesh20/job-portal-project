import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, action } = body

    // Validate input
    if (!email || !action) {
      return NextResponse.json({
        success: false,
        error: 'Email and action are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in session/database (in production, use Redis or database)
    // For now, we'll store it in a simple way
    const otpData = {
      email: email.toLowerCase().trim(),
      otp,
      action,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      created_at: new Date().toISOString()
    }

    // In production, send actual email using SendGrid, AWS SES, etc.
    console.log(`📧 OTP for ${email} (${action}): ${otp}`)
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    })

  } catch (error: any) {
    console.error('🚨 Send OTP error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send verification code'
    }, { status: 500 })
  }
}
