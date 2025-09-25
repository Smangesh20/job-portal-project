import { NextRequest, NextResponse } from 'next/server'
import { sendOTPEmail } from '@/lib/simple-email-service'

// 🚀 FORCE DYNAMIC RENDERING - This route must be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 ENTERPRISE OTP GENERATION AND SENDING
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // 🚀 VALIDATION
    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Valid email address is required'
      }, { status: 400 })
    }

    // 🚀 GENERATE SECURE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // 🚀 STORE OTP IN MEMORY (In production, use Redis or database)
    if (!global.otpStore) {
      global.otpStore = new Map()
    }
    
    global.otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt: expiresAt.getTime(),
      attempts: 0,
      createdAt: Date.now()
    })

    // 🚀 SEND EMAIL WITH OTP
    try {
      const emailResult = await sendOTPEmail(email, otp)
      
      if (!emailResult.success) {
        console.error('🚨 Failed to send OTP email:', emailResult.error)
        return NextResponse.json({
          success: false,
          error: 'Failed to send verification email. Please try again.'
        }, { status: 500 })
      }

      console.log(`🚀 OTP sent successfully to ${email}`)

      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully',
        data: {
          email,
          expiresIn: 300 // 5 minutes in seconds
        }
      })

    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError)
      
      // 🚀 FALLBACK: Return OTP in response for development
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          message: 'Verification code generated (development mode)',
          data: {
            email,
            otp, // Only in development
            expiresIn: 300
          }
        })
      }

      return NextResponse.json({
        success: false,
        error: 'Failed to send verification code. Please try again.'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ OTP generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// 🚀 VERIFY OTP ENDPOINT
export async function PUT(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    // 🚀 VALIDATION
    if (!email || !otp) {
      return NextResponse.json({
        success: false,
        error: 'Email and OTP are required'
      }, { status: 400 })
    }

    // 🚀 CHECK OTP STORE
    if (!global.otpStore) {
      return NextResponse.json({
        success: false,
        error: 'No OTP found for this email'
      }, { status: 400 })
    }

    const storedData = global.otpStore.get(email.toLowerCase())
    
    if (!storedData) {
      return NextResponse.json({
        success: false,
        error: 'No OTP found for this email'
      }, { status: 400 })
    }

    // 🚀 CHECK EXPIRATION
    if (Date.now() > storedData.expiresAt) {
      global.otpStore.delete(email.toLowerCase())
      return NextResponse.json({
        success: false,
        error: 'OTP has expired. Please request a new one.'
      }, { status: 400 })
    }

    // 🚀 CHECK ATTEMPTS
    if (storedData.attempts >= 3) {
      global.otpStore.delete(email.toLowerCase())
      return NextResponse.json({
        success: false,
        error: 'Too many failed attempts. Please request a new OTP.'
      }, { status: 400 })
    }

    // 🚀 VERIFY OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1
      return NextResponse.json({
        success: false,
        error: 'Invalid verification code'
      }, { status: 400 })
    }

    // 🚀 SUCCESS - CLEAN UP OTP
    global.otpStore.delete(email.toLowerCase())

    // 🚀 GENERATE AUTH TOKENS
    const accessToken = generateSecureToken()
    const refreshToken = generateSecureToken()

    // 🚀 CREATE USER SESSION
    const user = {
      id: generateUserId(),
      email: email.toLowerCase(),
      firstName: 'User',
      lastName: 'Name',
      name: 'User Name',
      role: 'CANDIDATE',
      permissions: ['read:profile', 'write:profile'],
      isVerified: true,
      isActive: true,
      authMethod: 'otp',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log(`🚀 OTP verified successfully for ${email}`)

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user,
        accessToken,
        refreshToken,
        expiresIn: 3600 // 1 hour
      }
    })

  } catch (error) {
    console.error('❌ OTP verification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// 🚀 UTILITY FUNCTIONS
function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 🚀 TYPES
declare global {
  var otpStore: Map<string, {
    otp: string
    expiresAt: number
    attempts: number
    createdAt: number
  }>
}
