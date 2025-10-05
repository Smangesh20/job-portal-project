import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Google OAuth Configuration - Exactly like Google
    const clientId = '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = 'https://www.askyacham.com/api/auth/google/signin/callback'
    
    // SIGNIN PARAMETERS - ACCOUNT SELECTION LIKE GOOGLE
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account', // ACCOUNT SELECTION FOR SIGNIN
      access_type: 'offline',
      include_granted_scopes: 'true',
      state: `signin-${timestamp}-${randomId1}-${randomId2}`,
      nonce: `signin-${timestamp}-${randomId1}-${randomId2}`
    })
    
    // GOOGLE OAUTH URL - EXACTLY LIKE GOOGLE
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 GOOGLE SIGNIN ACCOUNT SELECTION URL:', googleAuthUrl)
    
    return NextResponse.redirect(googleAuthUrl)
    
  } catch (error: any) {
    console.error('🚨 Google signin error:', error)
    return NextResponse.redirect('https://www.askyacham.com/auth/signin?error=google_signin_failed')
  }
}
