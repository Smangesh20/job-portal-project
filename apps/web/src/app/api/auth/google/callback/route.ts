import { NextRequest, NextResponse } from 'next/server'
import { useAuthStore } from '@/stores/enhanced-auth-store'

// 🚀 GOOGLE OAUTH CALLBACK HANDLER
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // 🚀 HANDLE OAUTH ERRORS
    if (error) {
      console.error(`🚨 Google OAuth error: ${error}`)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=${encodeURIComponent(error)}`
      )
    }

    // 🚀 VALIDATE REQUIRED PARAMETERS
    if (!code || !state) {
      console.error('🚨 Missing code or state parameter')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=missing_parameters`
      )
    }

    // 🚀 VERIFY STATE PARAMETER
    if (!global.oauthStates || !global.oauthStates.has(state)) {
      console.error('🚨 Invalid or expired state parameter')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=invalid_state`
      )
    }

    const stateData = global.oauthStates.get(state)
    if (!stateData || Date.now() > stateData.expiresAt) {
      console.error('🚨 Expired state parameter')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=expired_state`
      )
    }

    // 🚀 EXCHANGE CODE FOR ACCESS TOKEN
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('🚨 Failed to exchange code for token')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=token_exchange_failed`
      )
    }

    const tokenData = await tokenResponse.json()
    const { access_token } = tokenData

    // 🚀 GET USER INFO FROM GOOGLE
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error('🚨 Failed to get user info from Google')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=user_info_failed`
      )
    }

    const userData = await userResponse.json()
    console.log('🚀 Google user data:', userData)

    // 🚀 CREATE OR UPDATE USER
    const user = {
      id: userData.id,
      email: userData.email,
      firstName: userData.given_name || '',
      lastName: userData.family_name || '',
      name: userData.name || `${userData.given_name} ${userData.family_name}`,
      profileImage: userData.picture,
      isVerified: true,
      isActive: true,
      authMethod: 'google',
      role: 'CANDIDATE' as const,
      permissions: ['read', 'write'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // 🚀 STORE USER IN SESSION (In production, use database)
    if (!global.users) {
      global.users = new Map()
    }
    global.users.set(user.email, user)

    // 🚀 CREATE SESSION
    const sessionId = generateSecureState()
    if (!global.sessions) {
      global.sessions = new Map()
    }
    global.sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // 🚀 CLEAN UP STATE
    global.oauthStates.delete(state)

    // 🚀 SET SESSION COOKIE AND REDIRECT
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    console.log('🚀 Google OAuth successful, redirecting to dashboard')
    return response

  } catch (error) {
    console.error('🚨 Google OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=callback_error`
    )
  }
}

// 🚀 GENERATE SECURE STATE
function generateSecureState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}
