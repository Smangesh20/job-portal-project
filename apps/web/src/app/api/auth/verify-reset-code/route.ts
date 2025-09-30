import { NextRequest, NextResponse } from 'next/server'
import { securitySystem } from '@/lib/security-system'

// 🚀 VERIFY RESET CODE ENDPOINT
export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()
    const ip = request.ip || 'unknown'

    // 🚀 SECURITY VALIDATION
    if (securitySystem.isIPBlocked(ip)) {
      return NextResponse.json({
        success: false,
        error: 'Access denied'
      }, { status: 403 })
    }

    // 🚀 INPUT VALIDATION
    if (!email || !code) {
      return NextResponse.json({
        success: false,
        error: 'Email and verification code are required'
      }, { status: 400 })
    }

    // 🚀 SANITIZE INPUTS
    const sanitizedEmail = securitySystem.sanitizeInput(email)
    const sanitizedCode = securitySystem.sanitizeInput(code)

    // 🚀 CHECK RESET CODE STORE
    if (!global.resetCodes) {
      global.resetCodes = new Map()
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

    // 🚀 CHECK ATTEMPTS
    if (storedData.attempts >= 3) {
      global.resetCodes.delete(sanitizedEmail.toLowerCase())
      return NextResponse.json({
        success: false,
        error: 'Too many failed attempts. Please request a new reset code.'
      }, { status: 400 })
    }

    // 🚀 VERIFY CODE
    if (storedData.code !== sanitizedCode) {
      storedData.attempts += 1
      return NextResponse.json({
        success: false,
        error: 'Invalid verification code'
      }, { status: 400 })
    }

    // 🚀 SUCCESS - MARK AS VERIFIED
    storedData.verified = true
    storedData.verifiedAt = Date.now()

    console.log(`🚀 Reset code verified successfully for ${sanitizedEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Reset code verified successfully',
      data: {
        email: sanitizedEmail,
        verified: true
      }
    })

  } catch (error) {
    console.error('❌ Reset code verification error:', error)
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
}






