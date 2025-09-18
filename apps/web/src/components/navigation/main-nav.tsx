'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  BriefcaseIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/stores/enhanced-auth-store'

export default function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
      description: 'Dashboard and overview'
    },
    {
      name: 'Jobs',
      href: '/jobs',
      icon: BriefcaseIcon,
      description: 'Find your dream job'
    },
    {
      name: 'Companies',
      href: '/companies',
      icon: BuildingOfficeIcon,
      description: 'Explore companies'
    },
    {
      name: 'Search',
      href: '/search',
      icon: MagnifyingGlassIcon,
      description: 'Advanced job search'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      description: 'Manage your profile',
      requiresAuth: true
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      description: 'Account settings',
      requiresAuth: true
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      description: 'Job search analytics',
      requiresAuth: true
    }
  ]

  const supportItems = [
    {
      name: 'Help Center',
      href: '/help',
      icon: QuestionMarkCircleIcon,
      description: 'Get help and support'
    },
    {
      name: 'Contact Us',
      href: '/contact',
      icon: EnvelopeIcon,
      description: 'info.askyacham@gmail.com'
    },
    {
      name: 'Live Chat',
      href: '/chat',
      icon: ChatBubbleLeftRightIcon,
      description: 'Chat with our team'
    },
    {
      name: 'Phone Support',
      href: 'tel:+1-800-ASK-YACHAM',
      icon: PhoneIcon,
      description: '+1-800-ASK-YACHAM'
    }
  ]

  const legalItems = [
    {
      name: 'Terms of Service',
      href: '/terms',
      icon: DocumentTextIcon,
      description: 'Read our terms'
    },
    {
      name: 'Privacy Policy',
      href: '/privacy',
      icon: ShieldCheckIcon,
      description: 'Your privacy matters'
    },
    {
      name: 'About Us',
      href: '/about',
      icon: InformationCircleIcon,
      description: 'Learn about Ask Ya Cham'
    }
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <Bars3Icon className="h-5 w-5" />
          Menu
        </Button>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        {navigationItems.map((item) => {
          if (item.requiresAuth && !user) return null
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
        
        {/* Support dropdown */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <QuestionMarkCircleIcon className="h-4 w-4" />
            Support
          </Button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              {supportItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <item.icon className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal dropdown */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <DocumentTextIcon className="h-4 w-4" />
            Legal
          </Button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              {legalItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <item.icon className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 h-full bg-white shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AYC</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Ask Ya Cham</span>
                  <span className="text-sm text-gray-500 ml-2">Job Portal</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="px-6 space-y-8">
                  {/* Main Navigation */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Navigation
                    </h3>
                    <div className="space-y-2">
                      {navigationItems.map((item) => {
                        if (item.requiresAuth && !user) return null
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                              pathname === item.href
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <div>
                              <div>{item.name}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Support */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Support
                    </h3>
                    <div className="space-y-2">
                      {supportItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <item.icon className="h-5 w-5" />
                          <div>
                            <div>{item.name}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Legal */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Legal
                    </h3>
                    <div className="space-y-2">
                      {legalItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <item.icon className="h-5 w-5" />
                          <div>
                            <div>{item.name}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login">
                      <Button className="w-full" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

