import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // NUCLEAR MIDDLEWARE - Check if the request is coming from www.askyacham.com
  if (request.nextUrl.hostname === 'www.askyacham.com') {
    console.log('💥 NUCLEAR MIDDLEWARE REDIRECT: www.askyacham.com -> askyacham.com')
    
    // Create new URL without www
    const newUrl = new URL(request.url)
    newUrl.hostname = 'askyacham.com'
    
    console.log('💥 Redirecting to:', newUrl.toString())
    
    // Return immediate redirect with aggressive headers
    const response = NextResponse.redirect(newUrl, 301)
    
    // Add aggressive headers to prevent any caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match ALL paths including static files to ensure complete redirect
     */
    '/(.*)',
  ],
}
