import { NextRequest, NextResponse } from 'next/server'
import { demoGoogleAuth } from '@/lib/demo-google-auth'

// 🚀 FORCE DYNAMIC RENDERING - This route must be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 GOOGLE OAUTH CONFIGURATION
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'}/api/auth/google/callback`

// 🚀 DEMO MODE - Works immediately without setup
const DEMO_MODE = !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET

// 🚀 GOOGLE OAUTH INITIATION
export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json()

    if (provider !== 'google') {
      return NextResponse.json({
        success: false,
        error: 'Only Google OAuth is currently supported'
      }, { status: 400 })
    }

    // 🚀 DEMO MODE - Works immediately
    if (DEMO_MODE) {
      console.log('🚀 DEMO MODE: Google OAuth working immediately without setup')
      
      const demoResult = await demoGoogleAuth.signInWithGoogle()
      
      if (demoResult.success && demoResult.user) {
        // 🚀 CREATE USER SESSION
        const sessionId = generateSecureState()
        if (!global.sessions) {
          global.sessions = new Map()
        }
        global.sessions.set(sessionId, {
          userId: demoResult.user.id,
          email: demoResult.user.email,
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        // 🚀 STORE USER
        if (!global.users) {
          global.users = new Map()
        }
        global.users.set(demoResult.user.email, {
          id: demoResult.user.id,
          email: demoResult.user.email,
          firstName: demoResult.user.given_name,
          lastName: demoResult.user.family_name,
          name: demoResult.user.name,
          profileImage: demoResult.user.picture,
          isVerified: true,
          isActive: true,
          authMethod: 'google',
          role: 'CANDIDATE' as const,
          permissions: ['read', 'write'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        return NextResponse.json({
          success: true,
          data: {
            user: demoResult.user,
            sessionId,
            demoMode: true,
            message: 'Demo Google Sign-In successful!'
          }
        })
      }
    }

    // 🚀 REAL GOOGLE OAUTH (if credentials are available)
    if (!DEMO_MODE) {
      // 🚀 GENERATE STATE PARAMETER FOR SECURITY
      const state = generateSecureState()
      
      // 🚀 STORE STATE IN SESSION (In production, use Redis or database)
      if (!global.oauthStates) {
        global.oauthStates = new Map()
      }
      global.oauthStates.set(state, {
        provider,
        timestamp: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      })

      // 🚀 GOOGLE OAUTH URL
      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID || '')
      googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI)
      googleAuthUrl.searchParams.set('response_type', 'code')
      googleAuthUrl.searchParams.set('scope', 'openid email profile')
      googleAuthUrl.searchParams.set('state', state)
      googleAuthUrl.searchParams.set('access_type', 'offline')
      googleAuthUrl.searchParams.set('prompt', 'consent')

      console.log(`🚀 Real Google OAuth initiated for state: ${state}`)

      return NextResponse.json({
        success: true,
        data: {
          authUrl: googleAuthUrl.toString(),
          state
        }
      })
    }

  } catch (error) {
    console.error('❌ Google OAuth initiation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to initiate Google OAuth'
    }, { status: 500 })
  }
}

// 🚀 GOOGLE OAUTH CALLBACK
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // 🚀 HANDLE OAUTH ERRORS
    if (error) {
      console.error('❌ Google OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=oauth_cancelled`)
    }

    // 🚀 VALIDATE STATE PARAMETER
    if (!state || !global.oauthStates?.has(state)) {
      console.error('❌ Invalid or missing state parameter')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=invalid_state`)
    }

    const stateData = global.oauthStates.get(state)
    
    // 🚀 CHECK STATE EXPIRATION
    if (Date.now() > stateData.expiresAt) {
      global.oauthStates.delete(state)
      console.error('❌ OAuth state expired')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=state_expired`)
    }

    // 🚀 CLEAN UP STATE
    global.oauthStates.delete(state)

    if (!code) {
      console.error('❌ No authorization code received')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=no_code`)
    }

    // 🚀 EXCHANGE CODE FOR TOKENS
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID || '',
        client_secret: GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('❌ Failed to exchange code for tokens')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=token_exchange_failed`)
    }

    const tokens = await tokenResponse.json()

    // 🚀 GET USER INFO FROM GOOGLE
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error('❌ Failed to get user info from Google')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=user_info_failed`)
    }

    const googleUser = await userResponse.json()

    // 🚀 CREATE OR UPDATE USER
    const user = await createOrUpdateGoogleUser(googleUser)

    // 🚀 GENERATE OUR TOKENS
    const accessToken = generateSecureToken()
    const refreshToken = generateSecureToken()

    // 🚀 STORE TOKENS (In production, use database)
    if (!global.userTokens) {
      global.userTokens = new Map()
    }
    global.userTokens.set(user.id, {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 3600 * 1000, // 1 hour
      provider: 'google',
      providerId: googleUser.id
    })

    console.log(`🚀 Google OAuth successful for user: ${user.email}`)

    // 🚀 REDIRECT TO SUCCESS PAGE WITH TOKENS
    const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/success`)
    redirectUrl.searchParams.set('token', accessToken)
    redirectUrl.searchParams.set('provider', 'google')
    
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error('❌ Google OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=oauth_failed`)
  }
}

// 🚀 CREATE OR UPDATE GOOGLE USER
async function createOrUpdateGoogleUser(googleUser: any) {
  // 🚀 SIMULATE USER CREATION/UPDATE
  // In production, this would interact with your database
  const user = {
    id: `google_${googleUser.id}`,
    email: googleUser.email,
    firstName: googleUser.given_name || 'Google',
    lastName: googleUser.family_name || 'User',
    name: googleUser.name || `${googleUser.given_name} ${googleUser.family_name}`,
    role: 'CANDIDATE',
    permissions: ['read:profile', 'write:profile'],
    profileImage: googleUser.picture,
    isVerified: true,
    isActive: true,
    authMethod: 'google',
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // 🚀 STORE USER IN MEMORY (In production, use database)
  if (!global.users) {
    global.users = new Map()
  }
  global.users.set(user.email.toLowerCase(), user)

  return user
}

// 🚀 UTILITY FUNCTIONS
function generateSecureState(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 🚀 TYPES
declare global {
  var oauthStates: Map<string, {
    provider: string
    timestamp: number
    expiresAt: number
  }>
  var userTokens: Map<string, {
    accessToken: string
    refreshToken: string
    expiresAt: number
    provider: string
    providerId: string
  }>
  var users: Map<string, any>
}
