'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  name: string
  role: 'candidate' | 'employer' | 'admin'
  avatar?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    name: string
    email: string
    password: string
    role: 'candidate' | 'employer'
  }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
}

export type UseAuthReturn = AuthState & AuthActions

const AUTH_STORAGE_KEY = 'askyacham_auth'
const TOKEN_STORAGE_KEY = 'askyacham_token'

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)

        if (storedAuth && storedToken) {
          const user = JSON.parse(storedAuth)
          
          // Verify token is still valid
          try {
            const response = await fetch('/api/auth/verify', {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
              },
            })

            if (response.ok) {
              setState({
                user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
              })
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem(AUTH_STORAGE_KEY)
              localStorage.removeItem(TOKEN_STORAGE_KEY)
              setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
              })
            }
          } catch {
            // Network error, keep user logged in but mark as loading
            setState({
              user,
              isLoading: false,
              isAuthenticated: true,
              error: null,
            })
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Failed to initialize authentication',
        })
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      const { user, token } = data

      // Store auth data
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      localStorage.setItem(TOKEN_STORAGE_KEY, token)

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })

      // Redirect based on user role
      if (user.role === 'employer') {
        router.push('/employer/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [router])

  const register = useCallback(async (userData: {
    name: string
    email: string
    password: string
    role: 'candidate' | 'employer'
  }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      const { user, token } = data

      // Store auth data
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      localStorage.setItem(TOKEN_STORAGE_KEY, token)

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })

      // Redirect based on user role
      if (user.role === 'employer') {
        router.push('/employer/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear storage regardless of API call success
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      })

      router.push('/')
    }
  }, [router])

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    if (!state.user) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed')
      }

      const updatedUser = { ...state.user, ...data.user }
      
      // Update stored user data
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))

      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [state.user])

  const resetPassword = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed')
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  const verifyEmail = useCallback(async (token: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed')
      }

      if (state.user) {
        const updatedUser = { ...state.user, isVerified: true }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))
        
        setState(prev => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
          error: null,
        }))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [state.user])

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      
      if (!token) return

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
      } else {
        // Token refresh failed, logout user
        localStorage.removeItem(AUTH_STORAGE_KEY)
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        })
      }
    } catch (error) {
      console.error('Token refresh error:', error)
    }
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    verifyEmail,
    refreshToken,
    clearError,
  }
}