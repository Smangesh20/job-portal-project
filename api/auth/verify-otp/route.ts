import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp, action } = body

    // Validate input
    if (!email || !otp || !action) {
      return NextResponse.json({
        success: false,
        error: 'Email, OTP, and action are required'
      }, { status: 400 })
    }

    // Validate OTP format
    const otpRegex = /^\d{6}$/
    if (!otpRegex.test(otp)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid OTP format'
      }, { status: 400 })
    }

    // In production, verify OTP from database/Redis
    // For now, we'll simulate verification
    const isValidOtp = true // In production, check against stored OTP
    
    if (!isValidOtp) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired verification code'
      }, { status: 400 })
    }

    // Create user session
    const user = {
      id: `email_${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: email.split('@')[0],
      picture: null,
      verified_email: true,
      provider: 'email',
      action,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    }

    // Generate session token
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Return success response with user data
    return NextResponse.json({
      success: true,
      message: action === 'signup' ? 'Account created successfully!' : 'Welcome back!',
      user,
      token: sessionToken
    })

  } catch (error: any) {
    console.error('🚨 Verify OTP error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to verify code'
    }, { status: 500 })
  }
}
