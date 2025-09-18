'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  HeartIcon,
  BookmarkIcon,
  BellAlertIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  BeakerIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface EnterpriseDashboardLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Overview and analytics'
  },
  {
    name: 'Job Search',
    href: '/jobs',
    icon: MagnifyingGlassIcon,
    description: 'Find your dream job'
  },
  {
    name: 'Applications',
    href: '/applications',
    icon: DocumentTextIcon,
    description: 'Track your applications'
  },
  {
    name: 'Saved Jobs',
    href: '/saved-jobs',
    icon: BookmarkIcon,
    description: 'Your favorite positions'
  },
  {
    name: 'Companies',
    href: '/companies',
    icon: BuildingOfficeIcon,
    description: 'Explore companies'
  },
  {
    name: 'Networking',
    href: '/networking',
    icon: UserGroupIcon,
    description: 'Connect with professionals'
  },
  {
    name: 'Learning',
    href: '/learning',
    icon: AcademicCapIcon,
    description: 'Upskill and grow'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    description: 'Career insights'
  }
]

const quantumFeatures = [
  {
    name: 'Quantum Matching',
    href: '/quantum-matching',
    icon: CpuChipIcon,
    description: 'Quantum computing-powered job matching',
    badge: 'NEW'
  },
  {
    name: 'Research Lab',
    href: '/research',
    icon: BeakerIcon,
    description: 'Quantum computing research',
    badge: 'BETA'
  },
  {
    name: 'Innovation Hub',
    href: '/innovation',
    icon: LightBulbIcon,
    description: 'Cutting-edge technology',
    badge: 'PRO'
  }
]

export function EnterpriseDashboardLayout({ children }: EnterpriseDashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen w-full flex" style={{backgroundColor: '#f8fafc', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)'}}>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)'}}>
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Header */}
        <div className="border-b border-slate-200/60 p-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Ask Ya Cham
                </h1>
                <p className="text-xs text-slate-500 font-medium">Quantum Platform</p>
              </div>
            </div>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 flex-1 overflow-y-auto">
            {/* Main Navigation */}
            <div className="mb-8">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Main Menu
              </div>
              <div>
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <div key={item.name} className="group">
                      <Link href={item.href} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-100/80 transition-all duration-200">
                        <item.icon className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 group-hover:text-blue-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500 group-hover:text-blue-600 truncate">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantum Features */}
            <div className="mt-8">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Quantum Features
              </div>
              <div>
                <div className="space-y-1">
                  {quantumFeatures.map((item) => (
                    <div key={item.name} className="group">
                      <Link href={item.href} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-transparent hover:border-blue-200/50">
                        <item.icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-slate-900 group-hover:text-blue-900 whitespace-nowrap">
                              {item.name}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 flex-shrink-0">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 group-hover:text-blue-600">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/60">
            <div className="space-y-3">
              {/* User Profile */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200/60">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Cog6ToothIcon className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <BellIcon className="h-4 w-4 mr-1" />
                  Notifications
                </Button>
              </div>
            </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col" style={{width: '100%', minHeight: '100vh'}}>
          {/* Top Navigation */}
          <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <div className="hidden lg:block">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                  </h2>
                  <p className="text-sm text-slate-500">
                    Ready to find your next opportunity?
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search jobs, companies..."
                      className="pl-10 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-slate-900">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user?.role || 'user'}
                        </p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Cog6ToothIcon className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BellIcon className="mr-2 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6" style={{backgroundColor: '#f8fafc', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)', width: '100%', minHeight: 'calc(100vh - 80px)'}}>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
    </div>
  )
}
