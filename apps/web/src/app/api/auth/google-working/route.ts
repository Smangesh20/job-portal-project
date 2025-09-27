import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 WORKING GOOGLE CLIENT ID - REAL AND VALID
const WORKING_GOOGLE_CLIENT_ID = '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 WORKING GOOGLE AUTH INITIATED!')
    
    const { provider } = await request.json()
    
    if (provider !== 'google') {
      return NextResponse.json({
        success: false,
        error: 'Invalid provider'
      }, { status: 400 })
    }

    // 🚀 CONSTRUCT WORKING GOOGLE OAUTH URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/google-success`
    const state = Math.random().toString(36).substring(2, 15)
    
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${WORKING_GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`
    
    console.log('🚀 Working Google URL:', googleUrl)
    console.log('🚀 Client ID:', WORKING_GOOGLE_CLIENT_ID)
    console.log('🚀 Redirect URI:', redirectUri)
    
    return NextResponse.json({
      success: true,
      message: '🚀 WORKING GOOGLE AUTH INITIATED!',
      data: {
        authUrl: googleUrl,
        clientId: WORKING_GOOGLE_CLIENT_ID,
        redirectUri,
        state
      }
    })

  } catch (error: any) {
    console.error('🚨 Working Google auth error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to initiate working Google auth',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      service: 'Working Google Auth',
      status: 'Active',
      clientId: WORKING_GOOGLE_CLIENT_ID,
      lastUpdated: new Date().toISOString()
    }
  })
}
