import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com'
    const redirectUri = 'https://www.askyacham.com/api/auth/google/signup/callback'
    
    const timestamp = Date.now()
    const randomId1 = Math.random().toString(36).substring(2, 15)
    const randomId2 = Math.random().toString(36).substring(2, 15)
    const randomId3 = Math.random().toString(36).substring(2, 15)
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'consent',
      access_type: 'offline',
      include_granted_scopes: 'true',
      max_auth_age: '0',
      nonce: `signup-${timestamp}-${randomId1}-${randomId2}`,
      state: `signup-${timestamp}-${randomId1}-${randomId2}-${randomId3}`
    })
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    return NextResponse.json({
      url: googleAuthUrl,
      params: Object.fromEntries(params),
      message: 'Test URL generated'
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
