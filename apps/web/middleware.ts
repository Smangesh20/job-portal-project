import { NextRequest, NextResponse } from 'next/server'

// Security and authentication middleware
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const userSession = request.cookies.get('user_session')?.value;
  const isAuthenticated = !!(accessToken || userSession); // Check both tokens

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password',
    '/login', '/signup', '/signin', '/register',
    '/api/auth/google/signup', '/api/auth/google/signin',
    '/api/auth/google/signup/callback', '/api/auth/google/signin/callback'
  ];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname) || 
                       request.nextUrl.pathname.startsWith('/api/auth/');

  // If user is trying to access auth pages while logged in, redirect to dashboard
  if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access dashboard, redirect to login
  if (!isAuthenticated && request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated user tries to access homepage, redirect to dashboard
  if (isAuthenticated && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // HSTS header for HTTPS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' ws: wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  )

  // Rate limiting headers (basic)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  response.headers.set('X-Rate-Limit-Remaining', '100')

  // Protect sensitive routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Add API-specific security headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  // Protect admin routes (if any)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In a real implementation, you would check authentication here
    // For now, we'll just add extra security headers
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  // Block access to sensitive files
  if (
    request.nextUrl.pathname.includes('.env') ||
    request.nextUrl.pathname.includes('package.json') ||
    request.nextUrl.pathname.includes('package-lock.json') ||
    request.nextUrl.pathname.includes('yarn.lock') ||
    request.nextUrl.pathname.includes('.git') ||
    request.nextUrl.pathname.includes('node_modules')
  ) {
    return new NextResponse('Not Found', { status: 404 })
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

