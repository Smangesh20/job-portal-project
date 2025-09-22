'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bell, 
  Search, 
  Settings,
  User,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { getUserDisplayName, getUserInitials } from '@/utils/user-name'

function Header() {
  const [notifications] = useState(3)
  const { theme, setTheme } = useTheme()
  const { user } = useAuthUnified()
  
  const displayName = getUserDisplayName(user)
  const userInitials = getUserInitials(user)
  const userEmail = user?.email || 'user@example.com'

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side - Actions and Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Help */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage || user?.avatar || undefined} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userEmail}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
