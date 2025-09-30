'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthUser } from '@/types/auth'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  errorDetails: { message: string; type: string } | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    errorDetails,
    login: loginStore,
    register: registerStore,
    logout: logoutStore,
    refreshAuthToken: refreshTokenStore,
    clearError: clearErrorStore,
    initialize
  } = useAuthStore()

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Skip initialization completely to prevent any blocking
    setIsInitialized(true)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 AUTH PROVIDER: Login attempt for', email)
      
      await loginStore(email, password)
      
      // Google-style: Check if login was successful
      const { isAuthenticated, user } = useAuthStore.getState()
      console.log('🔐 AUTH PROVIDER: Auth state after login', { isAuthenticated, user: user?.email })
      
      if (isAuthenticated) {
        // Success message will be shown in the login page component
        // Navigation is handled by the page component after showing success modal
        return true
      } else {
        throw new Error('Login failed - not authenticated')
      }
    } catch (error) {
      console.log('❌ AUTH PROVIDER: Login error', error)
      throw error
    }
  }

  const register = async (data: any) => {
    try {
      await registerStore(data)
      // Success message will be shown in the register page component
      // Navigation is handled by the page component after showing success modal
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutStore()
      // Don't redirect automatically - let the page handle navigation
      // router.push('/')
    } catch (error) {
      throw error
    }
  }

  const refreshToken = async () => {
    try {
      await refreshTokenStore()
    } catch (error) {
      // If refresh fails, logout user
      await logout()
      throw error
    }
  }

  const clearError = () => {
    clearErrorStore()
  }

  // Never show loading screens that could block the URL
  // Always render the children to keep URL visible

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    errorDetails,
    login,
    register,
    logout,
    refreshToken,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
