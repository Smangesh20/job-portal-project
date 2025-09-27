import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 GOOGLE AUTH API CALLED!')
    
    const { action } = await request.json()
    
    // 🚀 WORKING GOOGLE CLIENT ID - REAL AND VALID
    const GOOGLE_CLIENT_ID = '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`
    
    console.log('🚀 Google Client ID:', GOOGLE_CLIENT_ID)
    console.log('🚀 Redirect URI:', REDIRECT_URI)
    
    // 🚀 CONSTRUCT GOOGLE OAUTH URL
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `state=${action || 'login'}&` +
      `access_type=offline&` +
      `prompt=consent`
    
    console.log('🚀 Google OAuth URL:', googleUrl)
    
    return NextResponse.json({
      success: true,
      message: '🚀 GOOGLE AUTH INITIATED!',
      data: {
        authUrl: googleUrl,
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: REDIRECT_URI
      }
    })

  } catch (error: any) {
    console.error('🚨 Google auth error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to initiate Google auth',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      service: 'Google Auth API',
      status: 'Active',
      lastUpdated: new Date().toISOString()
    }
  })
}