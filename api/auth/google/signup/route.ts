import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Google OAuth Configuration - Exactly like Google
    const clientId = '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = 'https://www.askyacham.com/api/auth/google/signup/callback'
    
    // SIGNUP PARAMETERS - FORCE CONSENT SCREEN LIKE GOOGLE
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    const randomId3 = Math.random().toString(36).substring(2, 15)
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'consent', // FORCE CONSENT SCREEN FOR SIGNUP
      access_type: 'offline',
      include_granted_scopes: 'true',
      max_auth_age: '0',
      authuser: '-1',
      hd: '',
      login_hint: '',
      nonce: `signup-${timestamp}-${randomId1}-${randomId2}`,
      state: `signup-${timestamp}-${randomId1}-${randomId2}-${randomId3}`,
      // ADDITIONAL PARAMETERS TO BREAK CACHE
      flowName: 'GeneralOAuthFlow',
      hl: 'en',
      service: 'lso',
      o2v: '2',
      theme: 'mn',
      ddm: '0',
      gsiwebsdk: '3',
      frm: '0',
      bg: 'ffffff',
      kt: '0',
      ca: '1',
      continue: '',
      approval_prompt: 'force',
      approval_prompt_override: 'force',
      consent_mode: 'explicit',
      new_account: 'true'
    })
    
    // GOOGLE OAUTH URL - EXACTLY LIKE GOOGLE
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 GOOGLE SIGNUP CONSENT SCREEN URL:', googleAuthUrl)
    
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Google signup error:', error)
    return NextResponse.redirect('https://www.askyacham.com/auth/signup?error=google_signup_failed')
  }
}
