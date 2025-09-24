'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LogOut,
  Menu,
  X,
  Home,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
  Calendar,
  Bookmark,
  Star,
  User,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  Clock,
  TrendingUp,
  BookOpen,
  Network,
  Award,
  ClipboardCheck,
  Shield,
  Rocket,
  Target,
  Brain,
  Zap,
  Lightbulb,
  FileCheck,
  UserCheck,
  GraduationCap,
  BrainCircuit,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// GOOGLE'S APPROACH - SIMPLE, NEVER FAILS
export function SimpleNav() {
  const { user, logout } = useAuthUnified()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Google's approach - simple logout, never fails
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      // Google's approach - silent error handling
      router.push('/auth/login')
    }
  }

  // Google's approach - simple navigation items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, badge: '12' },
    { name: 'Companies', href: '/companies', icon: Building2, badge: '50' },
    { name: 'Applications', href: '/applications', icon: FileText, badge: '8' },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: '3' },
    { name: 'Interviews', href: '/interviews', icon: Calendar },
    { name: 'AI Insights', href: '/ai-insights', icon: BrainCircuit, badge: 'NEW' },
    { name: 'Career Tools', href: '/career-tools', icon: Award },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
    { name: 'Privacy', href: '/privacy', icon: Shield }
  ]

  // Google's approach - simple render, never fails
  const renderNavItem = (item: any) => {
    const IconComponent = item.icon
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        )}
        onClick={() => setIsMobileOpen(false)}
      >
        <div className="flex items-center">
          <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
          {item.name}
        </div>
        {item.badge && (
          <Badge
            variant={item.badge === 'NEW' ? 'default' : 'secondary'}
            className={cn(
              "text-xs",
              item.badge === 'NEW'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            )}
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  // Google's approach - simple structure, never fails
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                JobPortal
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map(renderNavItem)}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              JobPortal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(renderNavItem)}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}
