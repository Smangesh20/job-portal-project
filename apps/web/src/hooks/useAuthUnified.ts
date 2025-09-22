'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  role?: string
  isVerified?: boolean
  isActive?: boolean
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
    // Clear any corrupted localStorage data first
    const clearCorruptedData = () => {
      try {
        const userData = localStorage.getItem('userData')
        if (userData === 'undefined' || userData === 'null' || userData === '') {
          console.log('🚀 GOOGLE-STYLE: Clearing corrupted localStorage data')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userData')
        }
      } catch (error) {
        console.log('🚀 GOOGLE-STYLE: Error checking localStorage, clearing all auth data')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userData')
      }
    }

    const checkAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const userData = localStorage.getItem('userData')
        
        console.log('🚀 GOOGLE-STYLE: Checking auth - token:', !!accessToken, 'userData:', !!userData)
        
        if (accessToken && userData && userData !== 'undefined' && userData !== 'null') {
          try {
            const user = JSON.parse(userData)
            console.log('🚀 GOOGLE-STYLE: User found in localStorage:', user)
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } catch (parseError) {
            console.log('🚀 GOOGLE-STYLE: Invalid userData, clearing storage:', userData)
            // Clear corrupted data
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userData')
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            })
          }
        } else {
          console.log('🚀 GOOGLE-STYLE: No valid auth data found')
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

    // Always check auth, but don't show errors on login page
    if (typeof window !== 'undefined') {
      clearCorruptedData()
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
        localStorage.setItem('userData', JSON.stringify(data.data.user || {}))

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
        // Store user data (registration doesn't return tokens)
        console.log('🚀 REGISTRATION: Storing user data from API response:', data.data.user)
        
        // ENSURE DATA IS COMPLETE BEFORE SAVING
        const completeUserData = {
          firstName: data.data.user.firstName || userData.firstName,
          lastName: data.data.user.lastName || userData.lastName,
          email: data.data.user.email || userData.email,
          name: `${data.data.user.firstName || userData.firstName} ${data.data.user.lastName || userData.lastName}`,
          ...data.data.user
        }
        
        console.log('🚀 REGISTRATION: Complete user data being saved:', completeUserData)
        localStorage.setItem('userData', JSON.stringify(completeUserData))
        console.log('🚀 REGISTRATION: User data saved to localStorage successfully')

        // Update state (but don't set as authenticated since user needs to login)
        setAuthState({
          user: completeUserData,
          isAuthenticated: false, // User needs to login after registration
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
