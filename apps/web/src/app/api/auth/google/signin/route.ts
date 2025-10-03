import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 ACCOUNT SELECTION FOR SIGNIN - WORKS LIKE GOOGLE
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/signin/callback`
    
    // 🚀 ACCOUNT SELECTION PARAMETERS - EXACTLY LIKE GOOGLE
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      access_type: 'offline',
      state: `signin-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    })
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 ACCOUNT SELECTION URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE ACCOUNT SELECTION
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Google signin error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/login?error=google_signin_failed`)
  }
}
