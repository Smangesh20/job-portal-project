'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Home, 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  Settings,
  Bell,
  User,
  FileText,
  TrendingUp,
  Users,
  BarChart3,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Search,
  Bookmark,
  Star,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: true
  },
  {
    name: 'Jobs',
    href: '/jobs',
    icon: Briefcase,
    current: false,
    badge: '12'
  },
  {
    name: 'Applications',
    href: '/applications',
    icon: FileText,
    current: false,
    badge: '8'
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    current: false,
    badge: '3'
  },
  {
    name: 'Interviews',
    href: '/interviews',
    icon: Calendar,
    current: false
  },
  {
    name: 'Saved Jobs',
    href: '/saved',
    icon: Bookmark,
    current: false
  },
  {
    name: 'Recommendations',
    href: '/recommendations',
    icon: Star,
    current: false
  }
]

const secondaryNavigation = [
  {
    name: 'Profile',
    href: '/profile',
    icon: User
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3
  },
  {
    name: 'Network',
    href: '/network',
    icon: Users
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Help',
    href: '/help',
    icon: HelpCircle
  }
]

export function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null, // Use default avatar
    initials: 'JD'
  }

  return (
    <>
      {/* Mobile menu button - Enhanced */}
      <div className="lg:hidden mobile-fixed mobile-top-4 mobile-left-4 mobile-z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white dark:bg-gray-800 mobile-scale-95 mobile-touch-manipulation mobile-shadow-lg"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar - Mobile Optimized */}
      <div className={cn(
        "mobile-fixed mobile-inset-y-0 mobile-left-0 mobile-z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform mobile-transition-all lg:translate-x-0 mobile-backdrop-blur-lg",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo - Mobile Optimized */}
        <div className="flex items-center h-16 mobile-px border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mobile-gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mobile-scale-95">
              <span className="text-white font-bold mobile-text-xs">AYC</span>
            </div>
            <span className="mobile-text-xl font-bold text-gray-900 dark:text-white">Ask Ya Cham</span>
          </div>
        </div>

        {/* User Profile - Mobile Optimized */}
        <div className="mobile-px mobile-py border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mobile-gap-2">
            <Avatar className="h-10 w-10 mobile-scale-95">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="mobile-text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="mobile-text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Search - Mobile Optimized */}
        <div className="mobile-px mobile-py border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent mobile-focus-visible mobile-touch-manipulation"
            />
          </div>
        </div>

        {/* Main Navigation - Mobile Optimized */}
        <nav className="flex-1 mobile-px mobile-py mobile-gap-2 overflow-y-auto mobile-scroll-smooth">
          {navigation.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center mobile-px mobile-py mobile-text-sm font-medium rounded-lg mobile-transition-all mobile-touch-manipulation",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <IconComponent
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 mobile-scale-95",
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2 mobile-text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
          <nav className="space-y-1">
            {secondaryNavigation.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <IconComponent
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
