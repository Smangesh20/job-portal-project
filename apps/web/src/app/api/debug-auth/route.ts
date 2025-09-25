import { NextRequest, NextResponse } from 'next/server'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 DEBUG AUTHENTICATION
export async function GET() {
  try {
    console.log('🔧 DEBUG AUTHENTICATION - Environment Check:')
    
    // 🚀 CHECK GOOGLE OAUTH ENVIRONMENT
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'}/api/auth/google/callback`
    
    console.log('  - GOOGLE_CLIENT_ID:', googleClientId ? 'SET' : 'MISSING')
    console.log('  - GOOGLE_CLIENT_SECRET:', googleClientSecret ? 'SET' : 'MISSING')
    console.log('  - GOOGLE_REDIRECT_URI:', googleRedirectUri)
    
    // 🚀 CHECK EMAIL ENVIRONMENT
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'
    
    console.log('  - SENDGRID_API_KEY:', sendGridApiKey ? 'SET' : 'MISSING')
    console.log('  - FROM_EMAIL:', fromEmail)
    
    // 🚀 CHECK APP ENVIRONMENT
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const nodeEnv = process.env.NODE_ENV
    
    console.log('  - NEXT_PUBLIC_APP_URL:', appUrl || 'MISSING')
    console.log('  - NODE_ENV:', nodeEnv || 'MISSING')

    return NextResponse.json({
      success: true,
      data: {
        google: {
          clientId: googleClientId ? 'SET' : 'MISSING',
          clientSecret: googleClientSecret ? 'SET' : 'MISSING',
          redirectUri: googleRedirectUri,
          demoMode: !googleClientId || !googleClientSecret
        },
        email: {
          sendGridApiKey: sendGridApiKey ? 'SET' : 'MISSING',
          fromEmail: fromEmail
        },
        app: {
          url: appUrl || 'MISSING',
          environment: nodeEnv || 'MISSING'
        }
      }
    })

  } catch (error) {
    console.error('🚨 Debug authentication error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to debug authentication',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
