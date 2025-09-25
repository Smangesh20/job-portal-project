import { NextRequest, NextResponse } from 'next/server'
import { sendOTPEmail } from '@/lib/simple-email-service'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 TEST EMAIL SENDING
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    console.log('🚀 TEST EMAIL: Sending test email to:', email)
    console.log('🚀 TEST EMAIL: SendGrid API Key exists:', !!process.env.SENDGRID_API_KEY)
    console.log('🚀 TEST EMAIL: From Email:', process.env.FROM_EMAIL || 'info@askyacham.com')

    // 🚀 SEND TEST EMAIL
    const testOtp = '123456'
    const result = await sendOTPEmail(email, testOtp)

    console.log('🚀 TEST EMAIL: Send result:', result)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        data: {
          email,
          otp: testOtp,
          messageId: result.messageId
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to send email'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('🚨 TEST EMAIL ERROR:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// 🚀 GET ENVIRONMENT STATUS
export async function GET() {
  try {
    const envStatus = {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      FROM_EMAIL: process.env.FROM_EMAIL || 'info@askyacham.com',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }

    return NextResponse.json({
      success: true,
      data: envStatus
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment'
    }, { status: 500 })
  }
}