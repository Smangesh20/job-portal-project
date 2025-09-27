import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 BULLETPROOF GOOGLE OAUTH INITIATED!')
    
    // 🚀 ALWAYS SUCCESS - NO EXTERNAL DEPENDENCIES
    const clientId = '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/bulletproof/callback`
    const state = Math.random().toString(36).substring(2, 15)
    
    console.log('🚀 Google Client ID:', clientId)
    console.log('🚀 Redirect URI:', redirectUri)
    
    // 🚀 CONSTRUCT GOOGLE OAUTH URL
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid%20email%20profile&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`
    
    console.log('🚀 Google OAuth URL:', googleUrl)
    
    return NextResponse.json({
      success: true,
      message: '🚀 GOOGLE OAUTH INITIATED SUCCESSFULLY!',
      data: {
        authUrl: googleUrl,
        clientId,
        redirectUri,
        state
      }
    })

  } catch (error: any) {
    console.error('🚨 Bulletproof Google OAuth error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to initiate bulletproof Google OAuth',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      service: 'Bulletproof Google OAuth',
      status: 'Active',
      description: 'Always works - no external dependencies',
      lastUpdated: new Date().toISOString()
    }
  })
}

