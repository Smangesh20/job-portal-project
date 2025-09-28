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
    
    // 🚀 DETERMINE ACTION FROM STATE
    let action = 'signin'
    if (state?.includes('signup')) {
      action = 'signup'
    } else if (state?.includes('signin')) {
      action = 'signin'
    }
    
    // 🚀 EXCHANGE CODE FOR TOKEN - YOUR CONFIGURED VARIABLES
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'demo_secret'
    // 🚀 USE EXACT REDIRECT URI FROM YOUR GOOGLE CONSOLE
    const redirectUri = process.env.GOOGLE_REDIRECT_URL || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google-working/callback`
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
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
    redirectUrl.searchParams.set('state', state || '')
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
