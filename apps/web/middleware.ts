import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is coming from www.askyacham.com
  if (request.nextUrl.hostname === 'www.askyacham.com') {
    console.log('🔍 Middleware redirect: www.askyacham.com -> askyacham.com')
    
    // Create new URL without www
    const newUrl = new URL(request.url)
    newUrl.hostname = 'askyacham.com'
    
    console.log('🔍 Redirecting to:', newUrl.toString())
    
    // Return permanent redirect
    return NextResponse.redirect(newUrl, 301)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
