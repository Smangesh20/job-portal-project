import { NextRequest, NextResponse } from 'next/server'
import { securitySystem } from '@/lib/security-system'

// 🚀 RESET PASSWORD ENDPOINT
export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json()
    const ip = request.ip || 'unknown'

    // 🚀 SECURITY VALIDATION
    if (securitySystem.isIPBlocked(ip)) {
      return NextResponse.json({
        success: false,
        error: 'Access denied'
      }, { status: 403 })
    }

    // 🚀 INPUT VALIDATION
    if (!email || !code || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'Email, verification code, and new password are required'
      }, { status: 400 })
    }

    // 🚀 SANITIZE INPUTS
    const sanitizedEmail = securitySystem.sanitizeInput(email)
    const sanitizedCode = securitySystem.sanitizeInput(code)

    // 🚀 VALIDATE PASSWORD
    const passwordValidation = securitySystem.validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      }, { status: 400 })
    }

    // 🚀 CHECK RESET CODE STORE
    if (!global.resetCodes) {
      return NextResponse.json({
        success: false,
        error: 'No reset code found for this email'
      }, { status: 400 })
    }

    const storedData = global.resetCodes.get(sanitizedEmail.toLowerCase())
    
    if (!storedData) {
      return NextResponse.json({
        success: false,
        error: 'No reset code found for this email'
      }, { status: 400 })
    }

    // 🚀 CHECK EXPIRATION
    if (Date.now() > storedData.expiresAt) {
      global.resetCodes.delete(sanitizedEmail.toLowerCase())
      return NextResponse.json({
        success: false,
        error: 'Reset code has expired. Please request a new one.'
      }, { status: 400 })
    }

    // 🚀 CHECK VERIFICATION
    if (!storedData.verified) {
      return NextResponse.json({
        success: false,
        error: 'Reset code has not been verified. Please verify the code first.'
      }, { status: 400 })
    }

    // 🚀 VERIFY CODE
    if (storedData.code !== sanitizedCode) {
      return NextResponse.json({
        success: false,
        error: 'Invalid verification code'
      }, { status: 400 })
    }

    // 🚀 HASH NEW PASSWORD
    const { hash, salt } = securitySystem.hashPassword(newPassword)

    // 🚀 UPDATE USER PASSWORD (In production, update in database)
    if (!global.users) {
      global.users = new Map()
    }
    
    const user = global.users.get(sanitizedEmail.toLowerCase())
    if (user) {
      user.passwordHash = hash
      user.passwordSalt = salt
      user.updatedAt = new Date().toISOString()
      user.lastPasswordChange = new Date().toISOString()
    }

    // 🚀 CLEAN UP RESET CODE
    global.resetCodes.delete(sanitizedEmail.toLowerCase())

    // 🚀 LOG SECURITY EVENT
    securitySystem.logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'medium',
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      details: { 
        email: sanitizedEmail,
        action: 'password_reset_completed',
        timestamp: new Date().toISOString()
      },
      blocked: false
    })

    console.log(`🚀 Password reset successfully for ${sanitizedEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
      data: {
        email: sanitizedEmail,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Password reset error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// 🚀 TYPES
declare global {
  var resetCodes: Map<string, {
    code: string
    expiresAt: number
    attempts: number
    createdAt: number
    verified?: boolean
    verifiedAt?: number
  }>
  var users: Map<string, any>
}