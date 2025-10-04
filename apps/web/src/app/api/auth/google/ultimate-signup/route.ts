import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 ULTIMATE CONSENT SCREEN - FORCE NEW ACCOUNT CREATION
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/ultimate-signup/callback`
    
    // 🚀 ULTIMATE APPROACH - USE COMPLETELY DIFFERENT OAUTH FLOW
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    
    // 🚀 USE COMPLETELY DIFFERENT OAUTH FLOW
    const state = `ultimate-signup-${timestamp}-${randomId1}-${randomId2}`
    
    // 🚀 USE COMPLETELY DIFFERENT OAUTH FLOW - THIS WILL FORCE CONSENT SCREEN
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
      state: state,
      // 🚀 ULTIMATE PARAMETERS TO FORCE CONSENT
      flowName: 'GeneralOAuthFlow',
      hl: 'en',
      service: 'lso',
      o2v: '2',
      theme: 'mn',
      ddm: '0',
      // 🚀 ADDITIONAL ULTIMATE PARAMETERS
      gsiwebsdk: '3',
      frm: '0',
      bg: 'ffffff',
      kt: '0',
      ca: '1',
      continue: '',
      ddm: '0'
    })
    
    // 🚀 USE COMPLETELY DIFFERENT OAUTH FLOW TO BREAK CACHE
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 ULTIMATE CONSENT SCREEN URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE CONSENT SCREEN
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Ultimate signup error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/signup?error=ultimate_signup_failed`)
  }
}
