import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 TEST GOOGLE OAUTH - VERIFY ROUTING
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'signin'
    
    // 🚀 GOOGLE CLIENT ID - YOUR CONFIGURED VARIABLES
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const redirectUri = process.env.GOOGLE_REDIRECT_URL || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`
    
    // 🚀 GOOGLE OAUTH URL - EXACTLY LIKE GOOGLE
    const scope = 'openid email profile'
    const responseType = 'code'
    const accessType = 'offline'
    const prompt = action === 'signup' ? 'consent' : 'select_account'
    const state = `${action}-${Date.now()}`
    
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', clientId)
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
    googleAuthUrl.searchParams.set('scope', scope)
    googleAuthUrl.searchParams.set('response_type', responseType)
    googleAuthUrl.searchParams.set('access_type', accessType)
    googleAuthUrl.searchParams.set('prompt', prompt)
    googleAuthUrl.searchParams.set('state', state)
    
    // 🚀 RETURN TEST DATA - VERIFY ROUTING WORKS
    return NextResponse.json({
      success: true,
      message: '🚀 GOOGLE OAUTH TEST ROUTE WORKING!',
      data: {
        action,
        clientId: clientId.substring(0, 20) + '...',
        redirectUri,
        googleAuthUrl: googleAuthUrl.toString(),
        environment: {
          NEXT_PUBLIC_GOOGLE_CLIENT_ID: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
          GOOGLE_REDIRECT_URL: !!process.env.GOOGLE_REDIRECT_URL,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL
        }
      }
    })
    
  } catch (error) {
    console.error('Google OAuth Test Error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Google OAuth test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
