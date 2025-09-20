import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { securityHeaders } from '@/lib/security/security-headers'

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next()

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Additional security measures
  response.headers.set('X-Robots-Tag', 'index, follow')
  response.headers.set('X-Powered-By', 'AskYaCham')
  
  // Rate limiting headers
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '99')
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 900000).toISOString())

  // Cache control for different types of content
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  } else if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (request.nextUrl.pathname.startsWith('/images/') || request.nextUrl.pathname.startsWith('/icons/')) {
    response.headers.set('Cache-Control', 'public, max-age=86400')
  } else {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  }

  // Security logging
  if (process.env.NODE_ENV === 'production') {
    console.log(`[SECURITY] ${request.method} ${request.nextUrl.pathname} - ${request.ip} - ${request.headers.get('user-agent')}`)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
