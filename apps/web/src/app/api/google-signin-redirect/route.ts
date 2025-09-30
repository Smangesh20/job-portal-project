import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 GOOGLE SIGN-IN REDIRECT - WORKS LIKE GOOGLE
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 GOOGLE SIGN-IN REDIRECT - STARTING...')
    
    const { provider } = await request.json()

    if (provider !== 'google') {
      return NextResponse.json({
        success: false,
        error: 'Only Google OAuth is currently supported'
      }, { status: 400 })
    }

    // 🚀 GOOGLE OAUTH CONFIGURATION
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'}/api/auth/google/callback`

    console.log('🔍 Environment Check:')
    console.log('  - GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'SET' : 'MISSING')
    console.log('  - GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING')
    console.log('  - GOOGLE_REDIRECT_URI:', GOOGLE_REDIRECT_URI)

    // 🚀 GENERATE STATE PARAMETER FOR SECURITY
    const state = generateSecureState()
    
    // 🚀 STORE STATE IN SESSION
    if (!global.oauthStates) {
      global.oauthStates = new Map()
    }
    global.oauthStates.set(state, {
      provider,
      timestamp: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    })

    // 🚀 GOOGLE OAUTH URL (Real Google OAuth flow)
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID || 'demo_client_id')
    googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'openid email profile')
    googleAuthUrl.searchParams.set('state', state)
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'consent')

    console.log(`🚀 Google OAuth URL: ${googleAuthUrl.toString()}`)

    // 🚀 RETURN REDIRECT RESPONSE (WORKS LIKE GOOGLE)
    return NextResponse.json({
      success: true,
      redirect: true,
      data: {
        authUrl: googleAuthUrl.toString(),
        state,
        provider: 'google',
        redirectUri: GOOGLE_REDIRECT_URI
      },
      message: '🚀 Google Sign-In redirect ready!'
    })

  } catch (error) {
    console.error('❌ Google Sign-In redirect error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to initiate Google Sign-In redirect'
    }, { status: 500 })
  }
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

// 🚀 TYPES
declare global {
  var oauthStates: Map<string, {
    provider: string
    timestamp: number
    expiresAt: number
  }>
}







