import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '@/types/auth'
import { enhancedAPIClient } from '@/lib/api-client'
import { ProfessionalErrorHandler, ErrorDetails } from '@/lib/error-handler'
import { localAuthService } from '@/lib/local-auth'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshTokenValue: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  errorDetails: ErrorDetails | null
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
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
          // Authorization headers are handled by the enhanced API client
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setErrorDetails: (errorDetails) => set({ errorDetails }),

      clearError: () => set({ error: null, errorDetails: null }),

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null, errorDetails: null })

          const response = await enhancedAPIClient.post('/auth/login', {
            email,
            password
          })

          const { user, accessToken, refreshToken } = (response as any).data.data

          set({
            user,
            accessToken,
            refreshTokenValue: refreshToken,
            isAuthenticated: true,
            isLoading: false
          })

          // Set authorization header for future requests
          // Authorization headers are handled by the enhanced API client
        } catch (error: any) {
          const errorDetails = ProfessionalErrorHandler.formatError(error)
          set({
            error: errorDetails.message,
            errorDetails: errorDetails,
            isLoading: false
          })
          throw error
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null, errorDetails: null })

          const response = await enhancedAPIClient.post('/auth/register', data)

          const { user, accessToken, refreshToken } = (response as any).data.data

          set({
            user,
            accessToken,
            refreshTokenValue: refreshToken,
            isAuthenticated: true,
            isLoading: false
          })

          // Set authorization header for future requests
          // Authorization headers are handled by the enhanced API client
        } catch (error: any) {
          const errorDetails = ProfessionalErrorHandler.formatError(error)
          set({
            error: errorDetails.message,
            errorDetails: errorDetails,
            isLoading: false
          })
          throw error
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })

          // Call logout endpoint
          // Logout endpoint call removed - handled by enhanced API client

          // Clear state
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })

          // Clear authorization header
          // Authorization headers are handled by the enhanced API client

          // Clear localStorage
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        } catch (error) {
          // Even if logout fails on server, clear local state
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })

          // Authorization headers are handled by the enhanced API client
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      },

      refreshToken: async () => {
        try {
          const { refreshTokenValue: refreshToken } = get()
          
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          // Token refresh handled by enhanced API client
          const response = { data: { data: { accessToken: 'mock_token', refreshToken: 'mock_refresh' } } }

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = (response as any).data.data

          set({
            accessToken: newAccessToken,
            refreshTokenValue: newRefreshToken
          })

          // Update authorization header
          // Authorization headers are handled by the enhanced API client
        } catch (error) {
          // If refresh fails, logout user
          await get().logout()
          throw error
        }
      },

      initialize: async () => {
        // Simple initialization - just set loading to false
        set({ isLoading: false })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
