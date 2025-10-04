import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 DEDICATED CONSENT SCREEN ROUTE - FORCE CONSENT
    const clientId = '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/signup/callback`
    
    // 🚀 FORCE CONSENT SCREEN - USE DIFFERENT OAUTH FLOW
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    const randomId3 = Math.random().toString(36).substring(2, 15)
    
    // 🚀 UNIQUE STATE FOR CONSENT SCREEN
    const state = `consent-${timestamp}-${randomId1}-${randomId2}-${randomId3}`
    
    // 🚀 CONSENT SCREEN PARAMETERS - FORCE NEW ACCOUNT CREATION
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.organization.read https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/gmail.readonly',
      prompt: 'consent',
      access_type: 'offline',
      include_granted_scopes: 'true',
      max_auth_age: '0',
      authuser: '-1',
      hd: '',
      login_hint: '',
      nonce: `consent-${timestamp}-${randomId1}`,
      state: state,
      // 🚀 ADDITIONAL PARAMETERS TO FORCE CONSENT
      approval_prompt: 'force',
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
      // 🚀 FORCE CONSENT SCREEN
      force_consent: 'true',
      consent_mode: 'explicit',
      new_account: 'true'
    })
    
    // 🚀 USE DIFFERENT OAUTH ENDPOINT
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`
    
    console.log('🚀 DEDICATED CONSENT SCREEN URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO CONSENT SCREEN
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Consent screen error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/signup?error=consent_screen_failed`)
  }
}
