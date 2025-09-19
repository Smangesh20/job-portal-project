import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '@/types/auth'
import { localAuthService } from '@/lib/local-auth'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshTokenValue: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
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

      // Actions
      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshTokenValue: refreshToken })
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })

          const response = await localAuthService.login(email, password)

          if (response.success && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshTokenValue: response.data.refreshToken,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            throw new Error(response.error?.message || 'Login failed')
          }
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false
          })
          throw error
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null })

          const response = await localAuthService.register(data)

          if (response.success && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshTokenValue: response.data.refreshToken,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            throw new Error(response.error?.message || 'Registration failed')
          }
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false
          })
          throw error
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })

          // Get current refresh token and call local auth service logout
          const { refreshTokenValue } = get()
          if (refreshTokenValue) {
            await localAuthService.logout(refreshTokenValue)
          }

          // Clear state
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })

          // Clear localStorage
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        } catch (error) {
          // Even if logout fails, clear local state
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })

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

          // Use local auth service for token refresh
          const response = await localAuthService.refreshToken(refreshToken)

          if (response.success && response.data) {
            set({
              accessToken: response.data.accessToken,
              refreshTokenValue: response.data.refreshToken
            })
          } else {
            throw new Error('Token refresh failed')
          }
        } catch (error) {
          // If refresh fails, logout user
          await get().logout()
          throw error
        }
      },

      initialize: async () => {
        try {
          set({ isLoading: true })

          // Try to initialize from local auth service
          const response = await localAuthService.initialize()
          
          if (response.success && response.data?.user) {
            set({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshTokenValue: response.data.refreshToken,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            // No valid session found
            set({
              user: null,
              accessToken: null,
              refreshTokenValue: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        } catch (error) {
          // If initialization fails, set to unauthenticated state
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
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