import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 🚀 GOOGLE OAUTH 2.0 - WORKS LIKE GOOGLE - IMMEDIATE REDIRECT
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'signin'
  
  // 🚀 GOOGLE CLIENT ID - YOUR CONFIGURED VARIABLES
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
  const redirectUri = process.env.GOOGLE_REDIRECT_URL || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`
  
  // 🚀 GOOGLE OAUTH URL - EXACTLY LIKE GOOGLE
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=openid%20email%20profile&` +
    `access_type=offline&` +
    `prompt=${action === 'signup' ? 'consent' : 'select_account'}&` +
    `state=${action}-${Date.now()}`
  
  // 🚀 IMMEDIATE REDIRECT TO GOOGLE - WORKS LIKE GOOGLE
  return NextResponse.redirect(googleAuthUrl)
}