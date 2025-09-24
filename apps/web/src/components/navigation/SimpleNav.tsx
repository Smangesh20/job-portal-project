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

  // Google's approach - complete navigation with ALL features
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    {
      name: 'Jobs', href: '/jobs', icon: Briefcase, badge: '12',
      children: [
        { name: 'All Jobs', href: '/jobs', icon: Briefcase },
        { name: 'Applied Jobs', href: '/jobs/applied', icon: FileCheck, badge: '8' },
        { name: 'Saved Jobs', href: '/jobs/saved', icon: Bookmark, badge: '5' },
        { name: 'Recommended', href: '/jobs/recommended', icon: Star, badge: '10' }
      ]
    },
    {
      name: 'Companies', href: '/companies', icon: Building2, badge: '50',
      children: [
        { name: 'All Companies', href: '/companies', icon: Building2 },
        { name: 'Top Companies', href: '/companies/top', icon: TrendingUp, badge: '25' },
        { name: 'Startups', href: '/companies/startups', icon: Rocket, badge: '15' },
        { name: 'Fortune 500', href: '/companies/fortune-500', icon: BarChart3, badge: '10' }
      ]
    },
    {
      name: 'Applications', href: '/applications', icon: FileText, badge: '8',
      children: [
        { name: 'All Applications', href: '/applications', icon: FileText },
        { name: 'Pending', href: '/applications/pending', icon: Clock },
        { name: 'Interviewed', href: '/applications/interviewed', icon: Calendar },
        { name: 'Rejected', href: '/applications/rejected', icon: X }
      ]
    },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: '3' },
    { name: 'Interviews', href: '/interviews', icon: Calendar },
    {
      name: 'AI & Insights', href: '/ai-insights', icon: BrainCircuit, badge: 'NEW',
      children: [
        { name: 'AI Insights', href: '/ai-insights', icon: Brain },
        { name: 'Quantum Matching', href: '/quantum-matching', icon: Zap },
        { name: 'Resume Matching', href: '/resume-matching', icon: Lightbulb }
      ]
    },
    {
      name: 'Career Tools', href: '/career-tools', icon: Award,
      children: [
        { name: 'Resume Builder', href: '/career-tools/resume', icon: FileText, badge: 'New' },
        { name: 'Interview Prep', href: '/career-tools/interview', icon: Calendar, badge: 'New' },
        { name: 'Skills Assessment', href: '/career-tools/skills', icon: Target, badge: 'New' },
        { name: 'Career Path', href: '/career-tools/path', icon: Users, badge: 'New' }
      ]
    },
    {
      name: 'Resources', href: '/resources', icon: BookOpen,
      children: [
        { name: 'Learning', href: '/learning', icon: GraduationCap },
        { name: 'Networking', href: '/networking', icon: Network },
        { name: 'Research', href: '/research', icon: Search },
        { name: 'Innovation', href: '/innovation', icon: Lightbulb }
      ]
    },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
    { name: 'Privacy', href: '/privacy', icon: Shield }
  ]

  // Google's approach - render with dropdowns, never fails
  const renderNavItem = (item: any, level: number = 0) => {
    const IconComponent = item.icon
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    const hasChildren = item.children && item.children.length > 0
    const isDropdownOpen = item.children && item.children.some((child: any) => pathname.startsWith(child.href))

    if (hasChildren) {
      return (
        <div key={item.name} className={cn("relative", level > 0 ? 'ml-4' : '')}>
          <button
            onClick={() => {
              // For a truly interactive dropdown, you'd manage `openDropdowns` state here
              // For now, it's always open if a child is active
            }}
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
            {item.badge && (
              <Badge
                variant={item.badge === 'NEW' || item.badge === 'New' ? 'default' : 'secondary'}
                className={cn(
                  "ml-auto text-xs",
                  (item.badge === 'NEW' || item.badge === 'New')
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                )}
              >
                {item.badge}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Always open dropdowns in vertical sidebar */}
          <div className="mt-1 space-y-1 ml-2 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
            {item.children!.map((child: any) => renderNavItem(child, level + 1))}
          </div>
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          level > 0 ? 'ml-4' : '',
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        )}
        onClick={() => setIsMobileOpen(false)}
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
            variant={item.badge === 'NEW' || item.badge === 'New' ? 'default' : 'secondary'}
            className={cn(
              "ml-auto text-xs",
              (item.badge === 'NEW' || item.badge === 'New')
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
