'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthUser } from '@/types/auth'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const {
    user,
    isLoading,
    isAuthenticated,
    login: loginStore,
    register: registerStore,
    logout: logoutStore,
    refreshToken: refreshTokenStore,
    initialize
  } = useAuthStore()

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Initialization timeout')), 5000)
        )
        
        await Promise.race([initialize(), timeoutPromise])
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initAuth()
  }, [initialize])

  const login = async (email: string, password: string) => {
    try {
      await loginStore(email, password)
      // Success message will be shown in the login page component
      // Navigation is handled by the page component after showing success modal
    } catch (error) {
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
      router.push('/')
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

  // Show loading spinner only for auth operations, not during initialization
  if (isLoading && isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken
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
