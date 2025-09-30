import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 GOOGLE DEBUG API CALLED!')
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'NOT SET',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'NOT SET',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'NOT SET',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'
      },
      alternatives: {
        googleAccountChooser: 'https://accounts.google.com/accountchooser',
        googleSignIn: 'https://accounts.google.com/signin/v2/identifier',
        gmailSignIn: 'https://mail.google.com/mail/?authuser=0'
      },
      workingClientIds: [
        '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com',
        'demo_client_id',
        'test_client_id'
      ],
      solutions: [
        'Use Google Account Chooser (bypasses OAuth)',
        'Use Direct Google Sign-In',
        'Use Gmail Sign-In',
        'Use alternative OAuth providers'
      ]
    }
    
    console.log('🚀 Debug Info:', debugInfo)
    
    return NextResponse.json({
      success: true,
      message: '🚀 GOOGLE DEBUG INFO RETRIEVED!',
      data: debugInfo,
      recommendations: [
        'Try Google Account Chooser method',
        'Use alternative client ID',
        'Check environment variables',
        'Use direct Google URLs'
      ]
    })

  } catch (error: any) {
    console.error('🚨 Google debug error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get Google debug info',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      service: 'Google Debug API',
      status: 'Active',
      description: 'Provides Google OAuth debugging information',
      lastUpdated: new Date().toISOString()
    }
  })
}





