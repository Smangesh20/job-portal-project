import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 NUCLEAR CONSENT SCREEN - BREAK GOOGLE CACHE COMPLETELY
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/signup/callback`
    
    // 🚀 BREAK ALL CACHING - USE UNIQUE PARAMETERS
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    const randomId3 = Math.random().toString(36).substring(2, 15)
    
    // 🚀 FORCE NEW ACCOUNT CREATION - NO CACHE
    const state = `signup-${timestamp}-${randomId1}-${randomId2}-${randomId3}`
    const nonce = `signup-${timestamp}-${randomId1}-${randomId2}`
    
    // 🚀 NUCLEAR CONSENT PARAMETERS - FORCE CONSENT SCREEN
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.organization.read https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/drive.readonly',
      prompt: 'consent',
      access_type: 'offline',
      include_granted_scopes: 'true',
      max_auth_age: '0',
      authuser: '-1',
      hd: '',
      login_hint: '',
      nonce: nonce,
      state: state,
      // 🚀 NUCLEAR PARAMETERS TO BREAK CACHE
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
      // 🚀 ADDITIONAL CACHE BREAKING
      approval_prompt: 'force',
      approval_prompt_override: 'force'
    })
    
    // 🚀 USE DIFFERENT OAUTH ENDPOINT TO BYPASS CACHE
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`
    
    console.log('🚀 NUCLEAR CONSENT SCREEN URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE CONSENT SCREEN
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Google signup error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/signup?error=google_signup_failed`)
  }
}
