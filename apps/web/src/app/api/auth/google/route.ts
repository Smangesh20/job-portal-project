import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'signin'
    
    // 🚀 BULLETPROOF GOOGLE OAUTH CONFIGURATION
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/callback`
    
    // 🚀 GENERATE SECURE STATE
    const state = `${action}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    
    // 🚀 GOOGLE OAUTH PARAMETERS - EXACTLY LIKE GOOGLE
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      include_granted_scopes: 'true',
      state: state,
    })
    
    // 🚀 FORCE CONSENT SCREEN FOR SIGNUP, ACCOUNT SELECTION FOR SIGNIN
    if (action === 'signup') {
      params.set('prompt', 'consent select_account') // Force new consent for signup
    } else {
      params.set('prompt', 'select_account') // Account selection for signin
    }
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 GOOGLE OAUTH URL:', googleAuthUrl)
    console.log('🚀 Action:', action)
    console.log('🚀 Client ID:', clientId)
    console.log('🚀 Redirect URI:', redirectUri)
    
    // 🚀 REDIRECT TO GOOGLE
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Google auth error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/login?error=google_auth_init_failed`)
  }
}