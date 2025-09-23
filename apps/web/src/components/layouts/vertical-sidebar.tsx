'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Search,
  MapPin,
  Filter,
  ChevronDown
} from 'lucide-react'

// VERTICAL SIDEBAR - ALWAYS VISIBLE ON LEFT SIDE
export function VerticalSidebar() {
  const { user, logout } = useAuthUnified()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')

  // Filter options
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
  const locations = ['San Francisco', 'New York', 'London', 'Remote', 'Hybrid']
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta']

  const handleLogout = async () => {
    try {
      console.log('🏢 Professional logout initiated')
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('search', searchQuery.trim())
    if (locationQuery.trim()) params.set('location', locationQuery.trim())
    if (selectedJobType) params.set('type', selectedJobType)
    if (selectedLocation) params.set('location_filter', selectedLocation)
    if (selectedCompany) params.set('company', selectedCompany)
    router.push(`/jobs?${params.toString()}`)
  }

  // Get user display name - BULLETPROOF
  const getUserDisplayName = () => {
    if (user?.firstName) return user.firstName
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, badge: '12' },
    { name: 'Companies', href: '/companies', icon: Building2, badge: '5' },
    { name: 'Applications', href: '/applications', icon: FileText, badge: '8' },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: '3' },
    { name: 'Interviews', href: '/interviews', icon: Calendar },
    { name: 'Saved Jobs', href: '/saved', icon: Bookmark },
    { name: 'Recommendations', href: '/recommendations', icon: Star }
  ]

  const secondaryItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: '5' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Network', href: '/network', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle }
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

      {/* VERTICAL SIDEBAR - ALWAYS VISIBLE ON DESKTOP */}
      <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto ${
        isMobileMenuOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                JobPortal
              </span>
            </div>
            
            {/* Welcome Message - SHOWS ACTUAL USERNAME */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Welcome back, {getUserDisplayName()}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ready to find your next opportunity?
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Quick Search</h3>
            </div>
            
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Location..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>

              {/* Filter Dropdowns - ALL WORKING */}
              <div className="space-y-2">
                {/* Job Type Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-between text-xs"
                    >
                      {selectedJobType || "Job Type"}
                      <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Job Types</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedJobType('')}>
                      All Types
                    </DropdownMenuItem>
                    {jobTypes.map((type) => (
                      <DropdownMenuItem 
                        key={type}
                        onClick={() => setSelectedJobType(type)}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Location Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-between text-xs"
                    >
                      {selectedLocation || "Location"}
                      <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Locations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedLocation('')}>
                      All Locations
                    </DropdownMenuItem>
                    {locations.map((location) => (
                      <DropdownMenuItem 
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                      >
                        {location}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Company Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-between text-xs"
                    >
                      {selectedCompany || "Company"}
                      <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Companies</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedCompany('')}>
                      All Companies
                    </DropdownMenuItem>
                    {companies.map((company) => (
                      <DropdownMenuItem 
                        key={company}
                        onClick={() => setSelectedCompany(company)}
                      >
                        {company}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button type="submit" size="sm" className="w-full">
                Search Jobs
              </Button>
            </form>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 px-4 py-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent
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
                        variant="secondary" 
                        className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                )
              })}
            </nav>
          </div>

          {/* Secondary Navigation */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  >
                    <div className="flex items-center">
                      <IconComponent className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                      {item.name}
                    </div>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                )
              })}
            </nav>
          </div>

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

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
