import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 WORKING GOOGLE OAUTH INITIATED!')
    
    // 🚀 USE WORKING GOOGLE CLIENT ID
    const workingClientId = '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/google-success`
    const state = Math.random().toString(36).substring(2, 15)
    
    console.log('🚀 Working Google Client ID:', workingClientId)
    console.log('🚀 Redirect URI:', redirectUri)
    
    // 🚀 CONSTRUCT WORKING GOOGLE OAUTH URL
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${workingClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`
    
    console.log('🚀 Working Google OAuth URL:', googleUrl)
    
    return NextResponse.json({
      success: true,
      message: '🚀 WORKING GOOGLE OAUTH INITIATED!',
      data: {
        authUrl: googleUrl,
        clientId: workingClientId,
        redirectUri,
        state
      }
    })

  } catch (error: any) {
    console.error('🚨 Working Google OAuth error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to initiate working Google OAuth',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      service: 'Working Google OAuth',
      status: 'Active',
      description: 'Uses working Google Client ID',
      lastUpdated: new Date().toISOString()
    }
  })
}








