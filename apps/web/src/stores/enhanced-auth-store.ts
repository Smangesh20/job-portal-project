import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '@/types/auth'
import { enhancedAPIClient } from '@/lib/api-client'
// Simplified error details interface
interface ErrorDetails {
  message: string
  type: string
}
import { localAuthService, User } from '@/lib/local-auth'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshTokenValue: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  errorDetails: { message: string; type: string } | null
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setErrorDetails: (errorDetails: ErrorDetails | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  validateResetToken: (token: string) => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshTokenValue: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      errorDetails: null,

      // Actions
      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshTokenValue: refreshToken })
        // Store tokens in localStorage for persistence
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
          } catch (error) {
            }
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setErrorDetails: (errorDetails) => set({ errorDetails }),

      clearError: () => set({ error: null, errorDetails: null }),

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null, errorDetails: null })

          // Use local authentication service for persistent login
          const response = await localAuthService.login(email, password)

          if (!response.success) {
            throw new Error(response.error?.message || 'Login failed')
          }

          const { user, accessToken, refreshToken } = response.data!

          set({
            user: user as AuthUser,
            accessToken,
            refreshTokenValue: refreshToken,
            isAuthenticated: true,
            isLoading: false
          })

          // Store tokens
          get().setTokens(accessToken, refreshToken)

        } catch (error: any) {
          // Google-style: NEVER show any errors to users
          // Just silently handle the error and reset loading state
          console.log('Login error (handled silently):', error.message)
          
          set({
            error: null, // Never show errors to users
            errorDetails: null,
            isLoading: false
          })
          
          // Don't throw error - just return silently like Google does
          // The UI will just show the form again without any error message
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null, errorDetails: null })

          // Use local authentication service for persistent registration
          const response = await localAuthService.register(data)

          if (!response.success) {
            throw new Error(response.error?.message || 'Registration failed')
          }

          const { user, accessToken, refreshToken } = response.data!

          set({
            user: user as AuthUser,
            accessToken,
            refreshTokenValue: refreshToken,
            isAuthenticated: true,
            isLoading: false
          })

          // Store tokens
          get().setTokens(accessToken, refreshToken)

        } catch (error: any) {
          // Google-style: NEVER show any errors to users
          // Just silently handle the error and reset loading state
          console.log('Register error (handled silently):', error.message)
          
          set({
            error: null, // Never show errors to users
            errorDetails: null,
            isLoading: false
          })
          
          // Don't throw error - just return silently like Google does
          // The UI will just show the form again without any error message
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })

          // Use local authentication service for logout
          const { accessToken } = get()
          if (accessToken) {
            await localAuthService.logout(accessToken)
          }

          // Clear local state
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            errorDetails: null
          })

          // Clear localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('user')
            } catch (error) {
              }
          }

        } catch (error: any) {
          // Even if logout fails, clear local state
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      refreshToken: async () => {
        try {
          const { refreshTokenValue } = get()
          
          if (!refreshTokenValue) {
            throw new Error('No refresh token available')
          }

          // Use local authentication service for token refresh
          const response = await localAuthService.refreshToken(refreshTokenValue)

          if (!response.success) {
            throw new Error(response.error?.message || 'Token refresh failed')
          }

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data!

          set({
            accessToken: newAccessToken,
            refreshTokenValue: newRefreshToken
          })

          // Store new tokens
          get().setTokens(newAccessToken, newRefreshToken)

        } catch (error: any) {
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },

      initialize: async () => {
        try {
          set({ isLoading: true })

          if (typeof window === 'undefined') {
            set({ isLoading: false })
            return
          }

          const accessToken = localStorage.getItem('accessToken')
          const refreshToken = localStorage.getItem('refreshToken')

          if (!accessToken || !refreshToken) {
            set({ isLoading: false })
            return
          }

          // Set tokens
          set({ accessToken, refreshTokenValue: refreshToken })

          // Use local authentication service to verify token and get user info
          try {
            const response = await localAuthService.getCurrentUser(accessToken)
            
            if (response.success && response.data) {
              set({
                user: response.data.user as AuthUser,
                isAuthenticated: true,
                isLoading: false
              })
            } else {
              // If verification fails, clear auth state
              set({
                user: null,
                accessToken: null,
                refreshTokenValue: null,
                isAuthenticated: false,
                isLoading: false
              })
            }
          } catch (error) {
            // If verification fails, clear auth state
            set({
              user: null,
              accessToken: null,
              refreshTokenValue: null,
              isAuthenticated: false,
              isLoading: false
            })
          }

        } catch (error: any) {
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null, errorDetails: null })

          const response = await localAuthService.forgotPassword(email)

          if (!response.success) {
            throw new Error(response.error?.message || 'Failed to send reset email')
          }

          set({ isLoading: false })
        } catch (error: any) {
          const errorDetails = { message: error.message || 'Authentication error', type: 'AUTH_ERROR' }
          set({
            error: errorDetails.message,
            errorDetails: errorDetails,
            isLoading: false
          })
          throw error
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null, errorDetails: null })

          const response = await localAuthService.resetPassword(token, newPassword)

          if (!response.success) {
            throw new Error(response.error?.message || 'Failed to reset password')
          }

          set({ isLoading: false })
        } catch (error: any) {
          const errorDetails = { message: error.message || 'Authentication error', type: 'AUTH_ERROR' }
          set({
            error: errorDetails.message,
            errorDetails: errorDetails,
            isLoading: false
          })
          throw error
        }
      },

      validateResetToken: async (token: string) => {
        try {
          set({ isLoading: true, error: null, errorDetails: null })

          const response = await localAuthService.validateResetToken(token)

          if (!response.success) {
            throw new Error(response.error?.message || 'Invalid or expired token')
          }

          set({ isLoading: false })
        } catch (error: any) {
          const errorDetails = { message: error.message || 'Authentication error', type: 'AUTH_ERROR' }
          set({
            error: errorDetails.message,
            errorDetails: errorDetails,
            isLoading: false
          })
          throw error
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshTokenValue: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
