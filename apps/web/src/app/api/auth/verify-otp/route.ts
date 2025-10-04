import { NextRequest, NextResponse } from 'next/server'

// 🚀 FORCE DYNAMIC RENDERING - This route must be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 ENTERPRISE OTP VERIFICATION
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    // 🚀 VALIDATION
    if (!email || !otp) {
      return NextResponse.json({
        success: false,
        error: 'Email and OTP are required'
      }, { status: 400 })
    }

    if (!otp.match(/^\d{6}$/)) {
      return NextResponse.json({
        success: false,
        error: 'OTP must be a 6-digit number'
      }, { status: 400 })
    }

    // 🚀 GET STORED OTP
    if (!global.otpStore) {
      return NextResponse.json({
        success: false,
        error: 'No OTP found. Please request a new one.'
      }, { status: 400 })
    }

    const storedOtpData = global.otpStore.get(email.toLowerCase())
    if (!storedOtpData) {
      return NextResponse.json({
        success: false,
        error: 'No OTP found for this email. Please request a new one.'
      }, { status: 400 })
    }

    // 🚀 CHECK EXPIRATION
    if (Date.now() > storedOtpData.expiresAt) {
      global.otpStore.delete(email.toLowerCase())
      return NextResponse.json({
        success: false,
        error: 'OTP has expired. Please request a new one.'
      }, { status: 400 })
    }

    // 🚀 CHECK ATTEMPTS
    if (storedOtpData.attempts >= 3) {
      global.otpStore.delete(email.toLowerCase())
      return NextResponse.json({
        success: false,
        error: 'Too many failed attempts. Please request a new OTP.'
      }, { status: 400 })
    }

    // 🚀 VERIFY OTP
    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts += 1
      return NextResponse.json({
        success: false,
        error: `Invalid OTP. ${3 - storedOtpData.attempts} attempts remaining.`
      }, { status: 400 })
    }

    // 🚀 OTP VERIFIED - CREATE OR GET USER
    let user = null
    if (!global.users) {
      global.users = new Map()
    }

    // Check if user exists
    user = global.users.get(email.toLowerCase())
    
    if (!user) {
      // Create new user
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        firstName: '',
        lastName: '',
        name: email.split('@')[0],
        role: 'CANDIDATE' as const,
        permissions: ['read', 'write'],
        isVerified: true,
        isActive: true,
        authMethod: 'otp',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      global.users.set(email.toLowerCase(), user)
    } else {
      // Update existing user
      user.isVerified = true
      user.authMethod = 'otp'
      user.updatedAt = new Date().toISOString()
      global.users.set(email.toLowerCase(), user)
    }

    // 🚀 CREATE SESSION
    const sessionId = generateSecureState()
    if (!global.sessions) {
      global.sessions = new Map()
    }
    global.sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // 🚀 CLEAN UP OTP
    global.otpStore.delete(email.toLowerCase())

    console.log(`🚀 OTP verified successfully for ${email}`)

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
          authMethod: user.authMethod
        },
        sessionId
      }
    })

  } catch (error) {
    console.error('🚨 OTP verification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error. Please try again.'
    }, { status: 500 })
  }
}

// 🚀 GENERATE SECURE STATE
function generateSecureState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}










