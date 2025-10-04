import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 FORCE CONSENT SCREEN - COMPLETELY DIFFERENT APPROACH
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/force-consent/callback`
    
    // 🚀 COMPLETELY DIFFERENT APPROACH - USE DIFFERENT OAUTH ENDPOINT
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    
    // 🚀 USE DIFFERENT OAUTH ENDPOINT
    const state = `force-consent-${timestamp}-${randomId1}-${randomId2}`
    const nonce = `force-${timestamp}-${randomId1}`
    
    // 🚀 USE DIFFERENT OAUTH ENDPOINT - THIS WILL FORCE CONSENT SCREEN
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.age_range.read',
      prompt: 'consent',
      access_type: 'offline',
      include_granted_scopes: 'true',
      max_auth_age: '0',
      authuser: '-1',
      hd: '',
      login_hint: '',
      nonce: nonce,
      state: state
    })
    
    // 🚀 USE DIFFERENT OAUTH ENDPOINT TO BREAK CACHE
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`
    
    console.log('🚀 FORCE CONSENT SCREEN URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE CONSENT SCREEN
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Force consent error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/signup?error=force_consent_failed`)
  }
}
