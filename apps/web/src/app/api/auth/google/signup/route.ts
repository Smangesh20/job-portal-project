import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 BULLETPROOF CONSENT SCREEN FOR SIGNUP - FORCE NEW ACCOUNT CREATION
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const redirectUri = 'https://www.askyacham.com/api/auth/google/signup/callback'
    
    // 🚀 ULTRA AGGRESSIVE CONSENT FORCING - WORKS LIKE GOOGLE
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid%20email%20profile&` +
      `prompt=consent&` +
      `access_type=offline&` +
      `include_granted_scopes=true&` +
      `max_auth_age=0&` +
      `authuser=-1&` +
      `state=signup-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    
    console.log('🚀 BULLETPROOF CONSENT SCREEN URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE CONSENT SCREEN - FORCE NEW ACCOUNT
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Google signup error:', error)
    return NextResponse.redirect('https://www.askyacham.com/signup?error=google_signup_failed')
  }
}
