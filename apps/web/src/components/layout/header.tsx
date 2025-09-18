'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BellIcon,
  UserIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import MainNavigation from '@/components/navigation/main-nav'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const { user } = useAuthStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show a loading state instead of null to prevent hydration mismatch
  if (!isClient) {
    return (
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AYC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Ask Ya Cham</h1>
                <p className="text-xs text-gray-500 -mt-1">Job Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const isAuthPage = pathname.startsWith('/auth/')
  const isTermsPage = pathname === '/terms' || pathname === '/privacy'

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">AYC</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                Ask Ya Cham
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Job Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation - Only show on non-auth pages */}
          {!isAuthPage && !isTermsPage && (
            <div className="hidden lg:flex items-center space-x-8">
              <MainNavigation />
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search - Only show on non-auth pages */}
            {!isAuthPage && !isTermsPage && (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Search Jobs
              </Button>
            )}

            {/* User actions */}
            {user && user.id ? (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                >
                  <BellIcon className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>

                {/* Saved Jobs */}
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                >
                  <BookmarkIcon className="h-4 w-4" />
                  Saved
                </Button>

                {/* Profile */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {!isAuthPage && !isTermsPage && (
                  <>
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu button - Only show on non-auth pages */}
            {!isAuthPage && !isTermsPage && (
              <div className="lg:hidden">
                <MainNavigation />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

