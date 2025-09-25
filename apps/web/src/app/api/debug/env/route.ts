import { NextRequest, NextResponse } from 'next/server'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 ENVIRONMENT DEBUG ENDPOINT
export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      // 🚀 GOOGLE OAUTH
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '❌ Missing',
      
      // 🚀 EMAIL SERVICE
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      FROM_EMAIL: process.env.FROM_EMAIL || '❌ Missing',
      
      // 🚀 APP CONFIG
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '❌ Missing',
      NODE_ENV: process.env.NODE_ENV || '❌ Missing',
      
      // 🚀 COMPUTED VALUES
      computed: {
        googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'}/api/auth/google/callback`,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'
      }
    }

    console.log('🔧 Environment Check:', envCheck)

    return NextResponse.json({
      success: true,
      data: envCheck,
      message: 'Environment variables checked successfully'
    })

  } catch (error) {
    console.error('🚨 Environment check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
