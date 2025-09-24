'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Bell, 
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  HelpCircle
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { useRouter } from 'next/navigation'

// ULTRA MINIMAL HEADER - PERFECT ALIGNMENT, NO NAVIGATION DUPLICATION
function MinimalHeader() {
  const [notifications] = useState(3)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuthUnified()
  const router = useRouter()
  
  // GOOGLE-STYLE USERNAME DISPLAY - PROFESSIONAL AND CLEAN
  const getUserDisplayName = () => {
    // Check auth user object first (most reliable)
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
      const emailName = user.email.split('@')[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    
    // Check localStorage for stored user data
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('userData')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          if (parsedUser.firstName && parsedUser.lastName) {
            return `${parsedUser.firstName} ${parsedUser.lastName}`
          }
          if (parsedUser.firstName) {
            return parsedUser.firstName
          }
          if (parsedUser.name) {
            return parsedUser.name
          }
          if (parsedUser.email) {
            const emailName = parsedUser.email.split('@')[0]
            return emailName.charAt(0).toUpperCase() + emailName.slice(1)
          }
        }
      } catch (e) {
        // Silent error handling
      }
    }
    
    // Return empty string for clean "Welcome back" message
    return ''
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = async () => {
    try {
      console.log('🏢 Professional logout initiated')
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-20 shadow-sm">
      <div className="px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side - Welcome Message with Perfect Alignment */}
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getUserDisplayName() ? `Welcome back, ${getUserDisplayName()}` : 'Welcome back'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ready to find your next opportunity?
              </p>
            </div>
          </div>

          {/* Right side - ONLY Essential Elements, Perfect Spacing */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="font-medium">New job match</span>
                    <span className="text-sm text-gray-500">Senior Developer at TechCorp</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="font-medium">Application update</span>
                    <span className="text-sm text-gray-500">Your application is under review</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="font-medium">Interview scheduled</span>
                    <span className="text-sm text-gray-500">Tomorrow at 2:00 PM</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

                  {/* Theme Toggle - Google Style */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleTheme} 
                    className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>

                  {/* Help - Google Style */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Help and support"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.open('/help', '_blank')}>
                        <div className="flex flex-col">
                          <span className="font-medium">Help Center</span>
                          <span className="text-sm text-gray-500">Get help with using the platform</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open('/contact', '_blank')}>
                        <div className="flex flex-col">
                          <span className="font-medium">Contact Support</span>
                          <span className="text-sm text-gray-500">Get in touch with our team</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open('/faq', '_blank')}>
                        <div className="flex flex-col">
                          <span className="font-medium">FAQ</span>
                          <span className="text-sm text-gray-500">Frequently asked questions</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.open('/feedback', '_blank')}>
                        <div className="flex flex-col">
                          <span className="font-medium">Send Feedback</span>
                          <span className="text-sm text-gray-500">Help us improve the platform</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage || user?.avatar || ''} alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MinimalHeader

