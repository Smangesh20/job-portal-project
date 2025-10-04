import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 BREAK GOOGLE'S OAUTHCHOOSEACCOUNT - FORCE CONSENT SCREEN
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/signup/callback`
    
    // 🚀 BREAK CACHE WITH UNIQUE PARAMETERS
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    const randomId3 = Math.random().toString(36).substring(2, 15)
    
    const state = `signup-${timestamp}-${randomId1}-${randomId2}-${randomId3}`
    const nonce = `signup-${timestamp}-${randomId1}-${randomId2}`
    
    // 🚀 FORCE CONSENT SCREEN - BYPASS OAUTHCHOOSEACCOUNT
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.organization.read https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/photoslibrary.readonly',
      prompt: 'consent',
      access_type: 'offline',
      include_granted_scopes: 'true',
      max_auth_age: '0',
      authuser: '-1',
      hd: '',
      login_hint: '',
      nonce: nonce,
      state: state,
      // 🚀 FORCE CONSENT PARAMETERS
      flowName: 'GeneralOAuthFlow',
      hl: 'en',
      service: 'lso',
      o2v: '2',
      theme: 'mn',
      ddm: '0',
      // 🚀 ADDITIONAL PARAMETERS TO BREAK OAUTHCHOOSEACCOUNT
      gsiwebsdk: '3',
      frm: '0',
      bg: 'ffffff',
      kt: '0',
      ca: '1',
      continue: '',
      // 🚀 FORCE NEW CONSENT
      approval_prompt: 'force',
      approval_prompt_override: 'force'
    })
    
    // 🚀 USE DIFFERENT ENDPOINT TO BYPASS OAUTHCHOOSEACCOUNT
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 FORCE CONSENT SCREEN URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE CONSENT SCREEN
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Google signup error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/signup?error=google_signup_failed`)
  }
}
