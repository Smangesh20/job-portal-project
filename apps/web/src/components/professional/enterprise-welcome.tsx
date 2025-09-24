'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Edit3, User, Mail, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ENTERPRISE-GRADE WELCOME MESSAGE SYSTEM - GOOGLE-STYLE PROFESSIONAL IMPLEMENTATION
// This provides the most robust and personalized welcome experience

interface UserData {
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  profileImage?: string
  avatar?: string
}

interface EnterpriseWelcomeProps {
  user: UserData | null | undefined
  className?: string
  variant?: 'default' | 'compact' | 'large' | 'hero'
  showEditButton?: boolean
  onNameUpdate?: (name: string) => void
}

export function EnterpriseWelcome({
  user,
  className = "",
  variant = 'default',
  showEditButton = true,
  onNameUpdate
}: EnterpriseWelcomeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [displayName, setDisplayName] = useState('User')
  const [isLoading, setIsLoading] = useState(true)

  // PROFESSIONAL: Comprehensive name detection system
  const detectUserName = useCallback((): string => {
    console.log('🏢 ENTERPRISE: Detecting user name from all sources...')
    
    // 1. Check auth context user first
    if (user) {
      console.log('🏢 ENTERPRISE: Auth context user found:', user)
      
      // Try firstName + lastName (full name)
      if (user.firstName && user.lastName) {
        const fullName = `${user.firstName} ${user.lastName}`
        console.log('🏢 ENTERPRISE: ✅ Found full name in auth context:', fullName)
        return fullName
      }
      
      // Try firstName only
      if (user.firstName) {
        console.log('🏢 ENTERPRISE: ✅ Found first name in auth context:', user.firstName)
        return user.firstName
      }
      
      // Try name field
      if (user.name) {
        console.log('🏢 ENTERPRISE: ✅ Found name field in auth context:', user.name)
        return user.name
      }
      
      // Try email to create name
      if (user.email) {
        const emailName = user.email.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🏢 ENTERPRISE: ✅ Found email name in auth context:', capitalizedName)
        return capitalizedName
      }
    }
    
    // 2. Check localStorage sources
    if (typeof window !== 'undefined') {
      try {
        // Check userData
        const userData = localStorage.getItem('userData')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          console.log('🏢 ENTERPRISE: localStorage userData found:', parsedUser)
          
          // Try firstName + lastName
          if (parsedUser.firstName && parsedUser.lastName) {
            const fullName = `${parsedUser.firstName} ${parsedUser.lastName}`
            console.log('🏢 ENTERPRISE: ✅ Found full name in localStorage:', fullName)
            return fullName
          }
          
          // Try firstName only
          if (parsedUser.firstName) {
            console.log('🏢 ENTERPRISE: ✅ Found first name in localStorage:', parsedUser.firstName)
            return parsedUser.firstName
          }
          
          // Try name field
          if (parsedUser.name) {
            console.log('🏢 ENTERPRISE: ✅ Found name field in localStorage:', parsedUser.name)
            return parsedUser.name
          }
          
          // Try email
          if (parsedUser.email) {
            const emailName = parsedUser.email.split('@')[0]
            const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
            console.log('🏢 ENTERPRISE: ✅ Found email name in localStorage:', capitalizedName)
            return capitalizedName
          }
        }
        
        // Check other localStorage sources
        const sources = [
          'customDisplayName',
          'userFirstName',
          'userLastName',
          'userName',
          'userEmail'
        ]
        
        for (const source of sources) {
          const value = localStorage.getItem(source)
          if (value) {
            let name = value
            if (source === 'userEmail') {
              name = value.split('@')[0]
              name = name.charAt(0).toUpperCase() + name.slice(1)
            }
            console.log(`🏢 ENTERPRISE: ✅ Found name in ${source}:`, name)
            return name
          }
        }
      } catch (e) {
        console.log('🏢 ENTERPRISE: Error parsing localStorage:', e)
      }
    }
    
    console.log('🏢 ENTERPRISE: ❌ No name found, using fallback')
    return 'User'
  }, [user])

  // PROFESSIONAL: Auto-detect name on mount and user changes
  useEffect(() => {
    setIsLoading(true)
    const detectedName = detectUserName()
    setDisplayName(detectedName)
    setIsLoading(false)
  }, [user])

  // PROFESSIONAL: Save name to multiple locations
  const saveUserName = useCallback((name: string) => {
    console.log('🏢 ENTERPRISE: Saving user name:', name)
    
    if (typeof window === 'undefined') return
    
    try {
      // Get current userData or create new
      const userData = localStorage.getItem('userData')
      let userObj: any = {}
      
      if (userData) {
        try {
          userObj = JSON.parse(userData)
        } catch (e) {
          console.log('🏢 ENTERPRISE: Error parsing userData, creating new user object')
        }
      }
      
      // Set the name in multiple fields for maximum compatibility
      userObj.firstName = name.trim()
      userObj.lastName = name.trim()
      userObj.name = name.trim()
      
      // Save back to localStorage in multiple locations
      localStorage.setItem('userData', JSON.stringify(userObj))
      localStorage.setItem('customDisplayName', name.trim())
      localStorage.setItem('userFirstName', name.trim())
      localStorage.setItem('userLastName', name.trim())
      localStorage.setItem('userName', name.trim())
      
      console.log('🏢 ENTERPRISE: ✅ Name saved successfully in localStorage')
      
      // Update display
      setDisplayName(name.trim())
      
      // Call callback if provided
      if (onNameUpdate) {
        onNameUpdate(name.trim())
      }
      
    } catch (error) {
      console.error('🏢 ENTERPRISE: Error saving user name:', error)
    }
  }, [onNameUpdate])

  // PROFESSIONAL: Handle edit start
  const handleStartEdit = useCallback(() => {
    setEditName(displayName)
    setIsEditing(true)
  }, [displayName])

  // PROFESSIONAL: Handle edit save
  const handleSaveEdit = useCallback(() => {
    if (editName.trim()) {
      saveUserName(editName.trim())
      setIsEditing(false)
    }
  }, [editName, saveUserName])

  // PROFESSIONAL: Handle edit cancel
  const handleCancelEdit = useCallback(() => {
    setEditName('')
    setIsEditing(false)
  }, [])

  // PROFESSIONAL: Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }, [handleSaveEdit, handleCancelEdit])

  // PROFESSIONAL: Generate welcome message
  const getWelcomeMessage = useCallback((): string => {
    if (isLoading) {
      return 'Welcome!'
    }
    
    const name = displayName
    if (name && name !== 'User' && name !== 'Guest') {
      // Check if it's a full name (has space)
      if (name.includes(' ')) {
        const firstName = name.split(' ')[0]
        return `Welcome back, ${firstName}!`
      }
      return `Welcome back, ${name}!`
    }
    
    return 'Welcome back!'
  }, [displayName, isLoading])

  // PROFESSIONAL: Get user initials
  const getUserInitials = useCallback((): string => {
    if (isLoading || !displayName || displayName === 'User' || displayName === 'Guest') {
      return 'U'
    }
    
    // Try to get initials from full name
    if (displayName.includes(' ')) {
      const names = displayName.split(' ')
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
      }
    }
    
    // Single name
    return displayName.charAt(0).toUpperCase()
  }, [displayName, isLoading])

  // PROFESSIONAL: Variant-based styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: "py-2",
          title: "text-lg font-semibold",
          subtitle: "text-sm",
          editButton: "h-6 w-6"
        }
      case 'large':
        return {
          container: "py-6",
          title: "text-4xl font-bold",
          subtitle: "text-lg",
          editButton: "h-8 w-8"
        }
      case 'hero':
        return {
          container: "py-8",
          title: "text-5xl font-extrabold",
          subtitle: "text-xl",
          editButton: "h-10 w-10"
        }
      default:
        return {
          container: "py-4",
          title: "text-3xl font-bold",
          subtitle: "text-base",
          editButton: "h-6 w-6"
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <div className={cn("w-full", variantStyles.container, className)}>
      {isEditing ? (
        // PROFESSIONAL: Edit mode
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your name"
              className="text-lg font-semibold border-2 border-blue-500 focus:border-blue-600"
              autoFocus
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={!editName.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // PROFESSIONAL: Display mode
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* User avatar/initials */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.profileImage || user?.avatar ? (
                  <img
                    src={user.profileImage || user.avatar}
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  getUserInitials()
                )}
              </div>
            </div>
            
            {/* Welcome message */}
            <div>
              <h1 className={cn(
                "text-gray-900 dark:text-white transition-all duration-200",
                variantStyles.title
              )}>
                {getWelcomeMessage()}
              </h1>
              <p className={cn(
                "text-gray-600 dark:text-gray-400 mt-1",
                variantStyles.subtitle
              )}>
                Here's what's happening with your job search today.
              </p>
            </div>
          </div>
          
          {/* Edit button */}
          {showEditButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartEdit}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Edit your name"
            >
              <Edit3 className={variantStyles.editButton} />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// PROFESSIONAL: Quick name setter component
interface QuickNameSetterProps {
  currentName?: string
  onNameSet?: (name: string) => void
  className?: string
}

export function QuickNameSetter({
  currentName = 'User',
  onNameSet,
  className = ""
}: QuickNameSetterProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')

  const handleSave = useCallback(() => {
    if (name.trim() && onNameSet) {
      onNameSet(name.trim())
      setIsEditing(false)
      setName('')
    }
  }, [name, onNameSet])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setName('')
    }
  }, [handleSave])

  if (isEditing) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Set your name:</span>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your name"
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={handleSave} disabled={!name.trim()}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Current name:</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
          <Edit3 className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentName}
        </p>
      </div>
    </div>
  )
}


