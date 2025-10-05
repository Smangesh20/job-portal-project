import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // HANDLE OAUTH ERRORS
    if (error) {
      console.error('Google OAuth Error:', error)
      return NextResponse.redirect('https://www.askyacham.com/auth/signin?error=google_auth_failed')
    }

    if (!code) {
      return NextResponse.redirect('https://www.askyacham.com/auth/signin?error=no_code')
    }

    // DETERMINE ACTION FROM STATE - FORCE SIGNIN
    const action = 'signin'
    console.log('🚀 SIGNIN CALLBACK - Action:', action, 'State:', state, 'Code:', code)

    // REAL GOOGLE OAUTH TOKEN EXCHANGE
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://www.askyacham.com/api/auth/google/signin/callback',
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect('https://www.askyacham.com/auth/signin?error=token_exchange_failed')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // GET USER INFO FROM GOOGLE
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      console.error('User info fetch failed:', await userResponse.text())
      return NextResponse.redirect('https://www.askyacham.com/auth/signin?error=user_info_failed')
    }

    const userData = await userResponse.json()

    // CREATE USER SESSION - ENTERPRISE LEVEL
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

    // REDIRECT TO DASHBOARD WITH SUCCESS - WORKS LIKE GOOGLE
    const redirectUrl = new URL('https://www.askyacham.com/dashboard')
    redirectUrl.searchParams.set('google_success', 'true')
    redirectUrl.searchParams.set('action', action)
    redirectUrl.searchParams.set('state', state || '')
    redirectUrl.searchParams.set('user_email', userData.email)
    redirectUrl.searchParams.set('user_name', userData.name || '')
    redirectUrl.searchParams.set('auth_method', 'google')
    redirectUrl.searchParams.set('timestamp', new Date().toISOString())

    // SET SESSION COOKIE - ENTERPRISE SECURITY
    const response = NextResponse.redirect(redirectUrl.toString())
    response.cookies.set('user_session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return response

  } catch (error: any) {
    console.error('🚨 Google signin callback error:', error)
    return NextResponse.redirect('https://www.askyacham.com/auth/signin?error=google_callback_failed')
  }
}
