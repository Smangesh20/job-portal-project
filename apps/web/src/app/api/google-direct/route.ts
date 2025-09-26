import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 GOOGLE DIRECT - SIMPLE & BULLETPROOF
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 GOOGLE DIRECT - STARTING...')
    
    // 🚀 SIMPLE GOOGLE OAUTH URL
    const clientId = process.env.GOOGLE_CLIENT_ID || 'demo_client_id'
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'}/api/auth/google/callback`
    
    // 🚀 GENERATE SIMPLE STATE
    const state = Math.random().toString(36).substring(2, 15)
    
    // 🚀 GOOGLE OAUTH URL - EXACTLY LIKE GOOGLE
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid%20email%20profile&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`

    console.log('🚀 Google URL generated:', googleUrl)

    return NextResponse.json({
      success: true,
      redirect: true,
      url: googleUrl,
      message: '🚀 Google Sign-In ready!'
    })

  } catch (error) {
    console.error('❌ Google Direct error:', error)
    return NextResponse.json({
      success: false,
      error: 'Google Sign-In failed'
    }, { status: 500 })
  }
}
