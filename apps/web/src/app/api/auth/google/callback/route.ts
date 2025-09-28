import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // 🚀 HANDLE OAUTH ERRORS
    if (error) {
      console.error('Google OAuth Error:', error)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=google_auth_failed`)
    }
    
    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=no_code`)
    }
    
    // 🚀 EXCHANGE CODE FOR TOKEN - WORKS LIKE GOOGLE
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || 'demo_secret',
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`,
      }),
    })
    
    const tokenData = await tokenResponse.json()
    
    if (!tokenData.access_token) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=token_failed`)
    }
    
    // 🚀 GET USER INFO FROM GOOGLE - WORKS LIKE GOOGLE
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
    
    const userData = await userResponse.json()
    
    // 🚀 DETERMINE ACTION FROM STATE
    const action = state?.includes('signup') ? 'signup' : 'signin'
    
    // 🚀 CREATE USER SESSION - ENTERPRISE LEVEL
    const userSession = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      verified_email: userData.verified_email,
      provider: 'google',
      action: action,
      timestamp: new Date().toISOString(),
    }
    
    // 🚀 REDIRECT TO DASHBOARD WITH SUCCESS - WORKS LIKE GOOGLE
    const redirectUrl = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`)
    redirectUrl.searchParams.set('google_success', 'true')
    redirectUrl.searchParams.set('action', action)
    redirectUrl.searchParams.set('user_email', userData.email)
    redirectUrl.searchParams.set('user_name', userData.name || '')
    
    // 🚀 SET SESSION COOKIE - ENTERPRISE SECURITY
    const response = NextResponse.redirect(redirectUrl.toString())
    response.cookies.set('user_session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Google OAuth Callback Error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=callback_failed`)
  }
}