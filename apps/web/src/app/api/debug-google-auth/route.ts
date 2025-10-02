import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/callback`
    
    const debugInfo = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      },
      google: {
        clientId: clientId ? `${clientId.substring(0, 20)}...` : 'NOT SET',
        clientSecret: clientSecret ? 'SET' : 'NOT SET',
        redirectUri: redirectUri,
      },
      urls: {
        signupUrl: `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google?action=signup`,
        signinUrl: `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google?action=signin`,
        callbackUrl: `${process.env.NEXTAUTH_URL || 'https://www.askyacham.com'}/api/auth/google/callback`,
      },
      expectedGoogleUrls: {
        signup: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline&include_granted_scopes=true&prompt=consent&approval_prompt=force&state=signup-${Date.now()}`,
        signin: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline&include_granted_scopes=true&prompt=select_account&state=signin-${Date.now()}`,
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Google Auth Debug Info',
      data: debugInfo,
      instructions: {
        signup: 'Should show Google consent screen for new account creation',
        signin: 'Should show Google account selection for existing users',
        required: [
          'Google Console: Add redirect URI to authorized redirect URIs',
          'Vercel: Set NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
          'Domain: Use www.askyacham.com for all URLs'
        ]
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
