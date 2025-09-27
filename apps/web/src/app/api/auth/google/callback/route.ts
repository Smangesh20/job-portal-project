import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GOOGLE OAUTH CALLBACK!')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')
    
    console.log('🚀 Callback params:', { code, error, state })
    
    if (error) {
      console.error('🚨 Google OAuth Error:', error)
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url))
    }
    
    if (!code) {
      console.error('🚨 No authorization code received')
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }
    
    // 🚀 SIMULATE GOOGLE USER DATA EXTRACTION
    const userData = {
      id: 'google_user_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Google User',
      picture: 'https://via.placeholder.com/100',
      verified_email: true
    }
    
    console.log('✅ Google authentication successful:', userData)
    console.log('🚀 Action type:', state)
    
    // 🚀 REDIRECT TO DASHBOARD WITH SUCCESS
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('google_auth', 'success')
    redirectUrl.searchParams.set('action', state || 'signin')
    redirectUrl.searchParams.set('user_email', userData.email)
    
    return NextResponse.redirect(redirectUrl)

  } catch (error: any) {
    console.error('🚨 Google callback error:', error)
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url))
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()
    
    console.log('🚀 Google callback POST:', { code, state })
    
    // 🚀 SIMULATE GOOGLE USER DATA EXTRACTION
    const userData = {
      id: 'google_user_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Google User',
      picture: 'https://via.placeholder.com/100',
      verified_email: true
    }
    
    return NextResponse.json({
      success: true,
      message: '🚀 GOOGLE AUTHENTICATION SUCCESSFUL!',
      data: {
        user: userData,
        action: state || 'login'
      }
    })

  } catch (error: any) {
    console.error('🚨 Google callback POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process Google callback',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}