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
  Bell,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  TrendingUp,
  Rocket,
  Target,
  Brain,
  BookOpen,
  Award,
  Zap,
  Lightbulb,
  FileCheck,
  UserCheck,
  GraduationCap,
  BrainCircuit,
  Network,
  Search,
  Shield,
  Clock
} from 'lucide-react'

// CLEAN SIDEBAR - GOOGLE STYLE LAYOUT
export function CleanSidebar() {
  const { user, logout } = useAuthUnified()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      console.log('🏢 Professional logout initiated')
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: pathname === '/dashboard' },
    {
      name: 'Jobs', href: '/jobs', icon: Briefcase, badge: '12', current: pathname.startsWith('/jobs'),
      children: [
        { name: 'All Jobs', href: '/jobs', icon: Briefcase },
        { name: 'Applied Jobs', href: '/jobs/applied', icon: FileCheck, badge: '8' },
        { name: 'Saved Jobs', href: '/jobs/saved', icon: Bookmark, badge: '5' },
        { name: 'Recommended', href: '/jobs/recommended', icon: Star, badge: '10' }
      ]
    },
    {
      name: 'Companies', href: '/companies', icon: Building2, badge: '50', current: pathname.startsWith('/companies'),
      children: [
        { name: 'All Companies', href: '/companies', icon: Building2 },
        { name: 'Top Companies', href: '/companies/top', icon: TrendingUp, badge: '25' },
        { name: 'Startups', href: '/companies/startups', icon: Rocket, badge: '15' },
        { name: 'Fortune 500', href: '/companies/fortune-500', icon: BarChart3, badge: '10' }
      ]
    },
    {
      name: 'Applications', href: '/applications', icon: FileText, badge: '8', current: pathname.startsWith('/applications'),
      children: [
        { name: 'All Applications', href: '/applications', icon: FileText },
        { name: 'Pending', href: '/applications/pending', icon: Clock },
        { name: 'Interviewed', href: '/applications/interviewed', icon: Calendar },
        { name: 'Rejected', href: '/applications/rejected', icon: X }
      ]
    },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: '3', current: pathname.startsWith('/messages') },
    { name: 'Interviews', href: '/interviews', icon: Calendar, current: pathname.startsWith('/interviews') },
    {
      name: 'AI & Insights', href: '/ai-insights', icon: BrainCircuit, badge: 'NEW', current: pathname.startsWith('/ai-insights'),
      children: [
        { name: 'AI Insights', href: '/ai-insights', icon: Brain },
        { name: 'Quantum Matching', href: '/quantum-matching', icon: Zap },
        { name: 'Resume Matching', href: '/resume-matching', icon: Lightbulb }
      ]
    },
    {
      name: 'Career Tools', href: '/career-tools', icon: Award, current: pathname.startsWith('/career-tools'),
      children: [
        { name: 'Resume Builder', href: '/career-tools/resume', icon: FileText, badge: 'New' },
        { name: 'Interview Prep', href: '/career-tools/interview', icon: Calendar, badge: 'New' },
        { name: 'Skills Assessment', href: '/career-tools/skills', icon: Target, badge: 'New' },
        { name: 'Career Path', href: '/career-tools/path', icon: Users, badge: 'New' }
      ]
    },
    {
      name: 'Resources', href: '/resources', icon: BookOpen, current: pathname.startsWith('/resources'),
      children: [
        { name: 'Learning', href: '/learning', icon: GraduationCap },
        { name: 'Networking', href: '/networking', icon: Network },
        { name: 'Research', href: '/research', icon: Search },
        { name: 'Innovation', href: '/innovation', icon: Lightbulb }
      ]
    },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, current: pathname.startsWith('/analytics') },
    { name: 'Profile', href: '/profile', icon: User, current: pathname.startsWith('/profile') },
    { name: 'Settings', href: '/settings', icon: Settings, current: pathname.startsWith('/settings') },
    { name: 'Help', href: '/help', icon: HelpCircle, current: pathname.startsWith('/help') },
    { name: 'Privacy', href: '/privacy', icon: Shield, current: pathname.startsWith('/privacy') }
  ]

  return (
    <>
      {/* Mobile menu button - ONLY FOR MOBILE */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header - Only Logo */}
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
            {navigationItems.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        item.current
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === 'New' ? 'default' : 'secondary'}
                      className={`ml-auto text-xs ${
                        item.badge === 'New' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </a>
                
                {/* Sub-items */}
                {item.children && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <child.icon className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                          {child.name}
                        </div>
                        {child.badge && (
                          <Badge 
                            variant="secondary"
                            className="ml-auto text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {child.badge}
                          </Badge>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Logout Section */}
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

      {/* Desktop Sidebar - GOOGLE STYLE */}
      <div className="hidden lg:flex flex-col h-full">
        {/* Header - Only Logo */}
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
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.name}>
              <a
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      item.current
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </div>
                {item.badge && (
                  <Badge 
                    variant={item.badge === 'New' ? 'default' : 'secondary'}
                    className={`ml-auto text-xs ${
                      item.badge === 'New' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </a>
              
              {/* Sub-items */}
              {item.children && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <a
                      key={child.name}
                      href={child.href}
                      className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    >
                      <div className="flex items-center">
                        <child.icon className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                        {child.name}
                      </div>
                      {child.badge && (
                        <Badge 
                          variant="secondary"
                          className="ml-auto text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {child.badge}
                        </Badge>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Section */}
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