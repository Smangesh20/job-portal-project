'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface GoogleAuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function GoogleAuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login' 
}: GoogleAuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Google-style: Only redirect after loading is complete
    if (isLoading) return

    if (requireAuth && !isAuthenticated) {
      // Google-style: Redirect to login with return URL
      setIsRedirecting(true)
      const returnUrl = encodeURIComponent(pathname)
      router.replace(`${redirectTo}?returnUrl=${returnUrl}`)
    } else if (!requireAuth && isAuthenticated) {
      // Google-style: Redirect authenticated users away from auth pages
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl')
      if (returnUrl) {
        setIsRedirecting(true)
        router.replace(decodeURIComponent(returnUrl))
      } else {
        setIsRedirecting(true)
        router.replace('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname])

  // Google-style: Show loading while checking auth or redirecting
  if (isLoading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Loading...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    )
  }

  // Google-style: Don't render children if redirecting
  if (isRedirecting) {
    return null
  }

  // Google-style: Only render if auth state matches requirements
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}

// Google-style: Specific guards for different page types
export function ProtectedPage({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthGuard requireAuth={true}>
      {children}
    </GoogleAuthGuard>
  )
}

export function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthGuard requireAuth={false}>
      {children}
    </GoogleAuthGuard>
  )
}
