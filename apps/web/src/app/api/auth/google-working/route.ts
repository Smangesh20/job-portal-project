import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 GOOGLE OAUTH 2.0 - WORKS LIKE GOOGLE
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'signin'
    
    // 🚀 GOOGLE CLIENT ID - YOUR CONFIGURED VARIABLES
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    // 🚀 USE EXACT REDIRECT URI FROM YOUR GOOGLE CONSOLE
    const redirectUri = process.env.GOOGLE_REDIRECT_URL || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google-working/callback`
    
    // 🚀 GOOGLE OAUTH URL - EXACTLY LIKE GOOGLE
    const scope = 'openid email profile'
    const responseType = 'code'
    const accessType = 'offline'
    const prompt = action === 'signup' ? 'consent' : 'select_account'
    const state = `${action}-${Date.now()}`
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=${responseType}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=${accessType}&` +
      `prompt=${prompt}&` +
      `state=${encodeURIComponent(state)}`
    
    // 🚀 REDIRECT TO GOOGLE OAUTH - WORKS LIKE GOOGLE
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error) {
    console.error('Google OAuth Error:', error)
    return NextResponse.json({ error: 'Google authentication failed' }, { status: 500 })
  }
}