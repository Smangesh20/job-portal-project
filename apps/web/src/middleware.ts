import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// GOOGLE-STYLE MIDDLEWARE - NEVER FAILS, ALWAYS HELPFUL
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Google's approach - handle common routing issues gracefully
  try {
    // Handle trailing slashes consistently
    if (pathname.length > 1 && pathname.endsWith('/')) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.slice(0, -1)
      return NextResponse.redirect(url)
    }

    // Handle common typos and redirects
    const redirects: Record<string, string> = {
      '/job': '/jobs',
      '/company': '/companies',
      '/application': '/applications',
      '/career-tool': '/career-tools',
      '/ai-insight': '/ai-insights',
      '/quantum-match': '/quantum-matching',
      '/resume-match': '/resume-matching',
      '/job-applied': '/jobs/applied',
      '/job-saved': '/jobs/saved',
      '/job-recommended': '/jobs/recommended',
      '/application-pending': '/applications/pending',
      '/application-interviewed': '/applications/interviewed',
      '/application-rejected': '/applications/rejected',
      '/company-top': '/companies/top',
      '/company-startup': '/companies/startups',
      '/company-fortune': '/companies/fortune-500',
      '/career-resume': '/career-tools/resume',
      '/career-interview': '/career-tools/interview',
      '/career-skills': '/career-tools/skills',
      '/career-path': '/career-tools/path',
      '/resource-learning': '/learning',
      '/resource-networking': '/networking',
      '/resource-research': '/research',
      '/resource-innovation': '/innovation'
    }

    // Check for redirects
    if (redirects[pathname]) {
      const url = request.nextUrl.clone()
      url.pathname = redirects[pathname]
      return NextResponse.redirect(url, 301)
    }

    // Google's approach - add security headers
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // Cache headers for static assets
    if (pathname.startsWith('/_next/static/') || pathname.startsWith('/api/')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    return response

  } catch (error) {
    // Google's approach - never fail, always return a response
    console.log('🔍 Middleware error handled gracefully:', error)
    return NextResponse.next()
  }
}

// Google's approach - apply middleware to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}