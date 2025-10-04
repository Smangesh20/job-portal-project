import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 CONSENT SIGNUP - FORCE NEW ACCOUNT CREATION
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/consent-signup/callback`
    
    // 🚀 CONSENT APPROACH - USE COMPLETELY DIFFERENT FLOW
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    
    // 🚀 USE CONSENT FLOW
    const state = `consent-signup-${timestamp}-${randomId1}-${randomId2}`
    const nonce = `consent-${timestamp}-${randomId1}`
    
    // 🚀 USE CONSENT FLOW - THIS WILL FORCE CONSENT SCREEN
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.age_range.read https://www.googleapis.com/auth/user.locale.read https://www.googleapis.com/auth/user.timezone.read https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.organization.read',
      prompt: 'consent',
      access_type: 'offline',
      include_granted_scopes: 'true',
      max_auth_age: '0',
      authuser: '-1',
      hd: '',
      login_hint: '',
      nonce: nonce,
      state: state,
      // 🚀 FORCE CONSENT WITH ADDITIONAL PARAMETERS
      flowName: 'GeneralOAuthFlow',
      hl: 'en',
      service: 'lso',
      o2v: '2',
      theme: 'mn',
      ddm: '0'
    })
    
    // 🚀 USE CONSENT ENDPOINT
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 CONSENT SIGNUP URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE CONSENT SCREEN
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Consent signup error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/signup?error=consent_signup_failed`)
  }
}
