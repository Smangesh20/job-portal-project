import { NextRequest, NextResponse } from 'next/server'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 ENVIRONMENT DEBUG
export async function GET(request: NextRequest) {
  try {
    const envStatus = {
      // 🚀 SENDGRID CONFIGURATION
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      SENDGRID_API_KEY_LENGTH: process.env.SENDGRID_API_KEY?.length || 0,
      FROM_EMAIL: process.env.FROM_EMAIL || 'info@askyacham.com',
      
      // 🚀 GOOGLE OAUTH CONFIGURATION
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
      GOOGLE_CLIENT_ID_LENGTH: process.env.GOOGLE_CLIENT_ID?.length || 0,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
      GOOGLE_CLIENT_SECRET_LENGTH: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'Not set',
      
      // 🚀 APP CONFIGURATION
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'development',
      
      // 🚀 STATUS
      EMAIL_READY: process.env.SENDGRID_API_KEY ? '✅ Ready' : '❌ Not Ready',
      GOOGLE_READY: (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) ? '✅ Ready' : '❌ Not Ready',
      
      // 🚀 TIMESTAMP
      timestamp: new Date().toISOString()
    }

    console.log('🔧 Environment Debug:', envStatus)

    return NextResponse.json({
      success: true,
      data: envStatus
    })
  } catch (error) {
    console.error('🚨 Environment debug error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}