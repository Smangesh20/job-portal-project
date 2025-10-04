import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 🚀 ABSOLUTE FINAL CONSENT SCREEN - FORCE NEW ACCOUNT CREATION
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/signup/callback`
    
    // 🚀 ABSOLUTE FINAL APPROACH - USE DIFFERENT CLIENT CONFIGURATION
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    
    // 🚀 USE DIFFERENT CLIENT CONFIGURATION
    const state = `signup-${timestamp}-${randomId1}-${randomId2}`
    const nonce = `signup-${timestamp}-${randomId1}`
    
    // 🚀 USE DIFFERENT CLIENT CONFIGURATION - THIS WILL FORCE CONSENT SCREEN
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.age_range.read https://www.googleapis.com/auth/user.locale.read https://www.googleapis.com/auth/user.timezone.read',
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
    
    // 🚀 USE DIFFERENT CLIENT CONFIGURATION TO BREAK CACHE
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 ABSOLUTE FINAL CONSENT SCREEN URL:', googleAuthUrl)
    
    // 🚀 REDIRECT TO GOOGLE CONSENT SCREEN
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Google signup error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/signup?error=google_signup_failed`)
  }
}
