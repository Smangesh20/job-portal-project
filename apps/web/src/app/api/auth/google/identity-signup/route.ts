import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 GOOGLE IDENTITY SERVICES - FORCE CONSENT SCREEN
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/identity-signup/callback`
    
    // 🚀 GOOGLE IDENTITY SERVICES APPROACH
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    
    // 🚀 USE IDENTITY SERVICES PARAMETERS
    const state = `identity-signup-${timestamp}-${randomId1}-${randomId2}`
    const nonce = `identity-${timestamp}-${randomId1}`
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'consent',
      access_type: 'offline',
      include_granted_scopes: 'true',
      max_auth_age: '0',
      authuser: '-1',
      hd: '',
      login_hint: '',
      nonce: nonce,
      state: state,
      // 🚀 IDENTITY SERVICES SPECIFIC PARAMETERS
      flowName: 'GeneralOAuthFlow',
      hl: 'en',
      service: 'lso',
      o2v: '2',
      theme: 'mn',
      ddm: '0',
      // 🚀 FORCE CONSENT WITH ADDITIONAL PARAMETERS
      continue: '',
      gsiwebsdk: '3',
      frm: '0',
      bg: 'ffffff',
      kt: '0',
      ca: '1'
    })
    
    // 🚀 USE GOOGLE IDENTITY SERVICES ENDPOINT
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 IDENTITY SERVICES CONSENT SCREEN URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE CONSENT SCREEN
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Identity signup error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/signup?error=identity_signup_failed`)
  }
}
