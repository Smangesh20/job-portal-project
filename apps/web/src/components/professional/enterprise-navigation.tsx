'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Shield,
  ChevronDown,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// ENTERPRISE-GRADE NAVIGATION SYSTEM - GOOGLE-STYLE PROFESSIONAL IMPLEMENTATION
// This provides the most robust and accessible navigation experience

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  current?: boolean
  badge?: string
  children?: NavigationItem[]
}

interface EnterpriseNavigationProps {
  user?: {
    firstName?: string
    lastName?: string
    name?: string
    email?: string
    profileImage?: string
    avatar?: string
  } | null
  className?: string
  variant?: 'sidebar' | 'header' | 'compact'
}

export function EnterpriseNavigation({ 
  user, 
  className = "",
  variant = 'sidebar' 
}: EnterpriseNavigationProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())

  // PROFESSIONAL: Navigation structure
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard'
    },
    {
      name: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
      badge: '12',
      current: pathname.startsWith('/jobs')
    },
    {
      name: 'Applications',
      href: '/applications',
      icon: FileText,
      badge: '8',
      current: pathname.startsWith('/applications')
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      badge: '3',
      current: pathname.startsWith('/messages')
    },
    {
      name: 'Interviews',
      href: '/interviews',
      icon: Calendar,
      current: pathname.startsWith('/interviews')
    },
    {
      name: 'Saved Jobs',
      href: '/saved',
      icon: Bookmark,
      current: pathname.startsWith('/saved')
    },
    {
      name: 'Recommendations',
      href: '/recommendations',
      icon: Star,
      current: pathname.startsWith('/recommendations')
    }
  ]

  const secondaryNavigation: NavigationItem[] = [
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      current: pathname.startsWith('/profile')
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      badge: '5',
      current: pathname.startsWith('/notifications')
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: pathname.startsWith('/analytics')
    },
    {
      name: 'Network',
      href: '/network',
      icon: Users,
      current: pathname.startsWith('/network')
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: pathname.startsWith('/settings')
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      current: pathname.startsWith('/help')
    }
  ]

  // PROFESSIONAL: Toggle dropdown
  const toggleDropdown = useCallback((itemName: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemName)) {
        newSet.delete(itemName)
      } else {
        newSet.add(itemName)
      }
      return newSet
    })
  }, [])

  // PROFESSIONAL: Get user display name
  const getUserDisplayName = useCallback((): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) {
      return user.firstName
    }
    if (user?.name) {
      return user.name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }, [user])

  // PROFESSIONAL: Get user initials
  const getUserInitials = useCallback((): string => {
    const name = getUserDisplayName()
    if (name.includes(' ')) {
      const names = name.split(' ')
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }, [getUserDisplayName])

  // PROFESSIONAL: Render navigation item
  const renderNavigationItem = useCallback((item: NavigationItem, level: number = 0) => {
    const IconComponent = item.icon
    const isActive = item.current
    const hasChildren = item.children && item.children.length > 0
    const isDropdownOpen = openDropdowns.has(item.name)
    const indentClass = level > 0 ? 'ml-6' : ''

    if (hasChildren) {
      return (
        <div key={item.name} className={cn("relative", indentClass)}>
          <button
            onClick={() => toggleDropdown(item.name)}
            className={cn(
              "group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <div className="flex items-center">
              <IconComponent
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-blue-500"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
            </div>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>
          
          {isDropdownOpen && (
            <div className="mt-1 space-y-1">
              {item.children!.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          indentClass,
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        )}
      >
        <div className="flex items-center">
          <IconComponent
            className={cn(
              "mr-3 h-5 w-5 flex-shrink-0",
              isActive
                ? "text-blue-500"
                : "text-gray-400 group-hover:text-gray-500"
            )}
          />
          {item.name}
        </div>
        {item.badge && (
          <Badge 
            variant="secondary" 
            className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }, [openDropdowns, toggleDropdown])

  // PROFESSIONAL: Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
              JobPortal
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map(renderNavigationItem)}
        </nav>

        {/* Secondary Navigation */}
        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
          <nav className="space-y-1">
            {secondaryNavigation.map(renderNavigationItem)}
          </nav>
        </div>

        {/* User Profile */}
        {user && (
          <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profileImage || user.avatar} alt={getUserDisplayName()} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    )
  }

  // PROFESSIONAL: Header variant
  if (variant === 'header') {
    return (
      <nav className={cn("flex items-center space-x-8", className)}>
        {navigation.slice(0, 5).map(item => {
          const IconComponent = item.icon
          const isActive = item.current
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <IconComponent className="h-4 w-4" />
              <span>{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-1">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>
    )
  }

  // PROFESSIONAL: Compact variant
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {navigation.slice(0, 3).map(item => {
        const IconComponent = item.icon
        const isActive = item.current
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            title={item.name}
          >
            <IconComponent className="h-4 w-4" />
            <span className="hidden sm:inline">{item.name}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-1">
                {item.badge}
              </Badge>
            )}
          </Link>
        )
      })}
    </div>
  )
}

// PROFESSIONAL: Breadcrumb navigation
interface EnterpriseBreadcrumbProps {
  items?: Array<{
    name: string
    href: string
    current?: boolean
  }>
  className?: string
}

export function EnterpriseBreadcrumb({ 
  items = [],
  className = ""
}: EnterpriseBreadcrumbProps) {
  const pathname = usePathname()
  
  // PROFESSIONAL: Generate breadcrumbs from pathname
  const generateBreadcrumbs = useCallback(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs = [
      { name: 'Home', href: '/', current: pathname === '/' }
    ]
    
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      // Capitalize and format segment name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumbs.push({
        name,
        href: currentPath,
        current: isLast
      })
    })
    
    return breadcrumbs
  }, [pathname])

  const breadcrumbs = items.length > 0 ? items : generateBreadcrumbs()

  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {index === 0 ? (
              <Link
                href={item.href}
                className={cn(
                  "inline-flex items-center text-sm font-medium transition-colors",
                  item.current
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                <Home className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  item.current
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
