'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export function useAuthUnified() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const userData = localStorage.getItem('userData')
        
        if (accessToken && userData) {
          const user = JSON.parse(userData)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      }
    }

    // Only check auth if we're not on login page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
      checkAuth()
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store tokens and user data
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('userData', JSON.stringify(data.data.user))

        // Update state
        setAuthState({
          user: data.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })

        return { success: true }
      } else {
        const errorMessage = data.error?.message || 'Login failed'
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }))
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      const errorMessage = 'Network error. Please try again.'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store tokens and user data
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('userData', JSON.stringify(data.data.user))

        // Update state
        setAuthState({
          user: data.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })

        return { success: true }
      } else {
        const errorMessage = data.error?.message || 'Registration failed'
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }))
        return { success: false, error: errorMessage }
      }
    } catch (error: any) {
      const errorMessage = 'Network error. Please try again.'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userData')

    // Update state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })

    // Redirect to login
    router.push('/auth/login')
  }

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  return {
    ...authState,
    login,
    register,
    logout,
    clearError
  }
}
