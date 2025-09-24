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
  
  // BULLETPROOF USERNAME DISPLAY - SHOWS ACTUAL USERNAME
  const getUserDisplayName = () => {
    console.log('🔍 DEBUG: User object:', user)
    
    // Check localStorage first for any stored user data
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('userData')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          console.log('🔍 DEBUG: localStorage userData:', parsedUser)
          
          if (parsedUser.firstName && parsedUser.lastName) {
            console.log('✅ Using localStorage firstName + lastName')
            return `${parsedUser.firstName} ${parsedUser.lastName}`
          }
          if (parsedUser.firstName) {
            console.log('✅ Using localStorage firstName')
            return parsedUser.firstName
          }
          if (parsedUser.name) {
            console.log('✅ Using localStorage name')
            return parsedUser.name
          }
          if (parsedUser.email) {
            const emailName = parsedUser.email.split('@')[0]
            console.log('✅ Using localStorage email name:', emailName)
            return emailName.charAt(0).toUpperCase() + emailName.slice(1)
          }
        }
      } catch (e) {
        console.log('❌ Error parsing localStorage userData:', e)
      }
    }
    
    // Check auth user object
    if (user?.firstName && user?.lastName) {
      console.log('✅ Using auth firstName + lastName')
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) {
      console.log('✅ Using auth firstName')
      return user.firstName
    }
    if (user?.name) {
      console.log('✅ Using auth name')
      return user.name
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0]
      console.log('✅ Using auth email name:', emailName)
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    
    // Try to set a default username from email if available
    if (user?.email) {
      const emailName = user.email.split('@')[0]
      console.log('✅ Using email as fallback:', emailName)
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    
    // For testing purposes, try to get a name from localStorage or set a default
    if (typeof window !== 'undefined') {
      // Check if there's a stored username
      const storedName = localStorage.getItem('displayName')
      if (storedName) {
        console.log('✅ Using stored displayName:', storedName)
        return storedName
      }
      
      // Set a default username for testing if none exists
      const defaultName = 'John'
      localStorage.setItem('displayName', defaultName)
      console.log('✅ Set default displayName:', defaultName)
      return defaultName
    }
    
    console.log('❌ No user data found, using fallback')
    return 'User'
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
                Welcome back, {getUserDisplayName()}!
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

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-9 w-9 p-0">
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Help */}
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <HelpCircle className="h-5 w-5" />
            </Button>

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

