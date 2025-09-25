import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'user' | 'employer' | 'admin'
  permissions: string[]
  profileImage?: string
  isVerified: boolean
  isActive: boolean
  lastLoginAt?: string
  authMethod?: string
  mfaEnabled?: boolean
  trustedDevices?: string[]
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  errorDetails: { message: string; type: string } | null
  requiresMfa: boolean
  mfaToken: string | null
  isNewUser: boolean
  trustedDevice: boolean
  lastActivity: number
  sessionTimeout: number
  realTimeConnected: boolean
  securityAlerts: SecurityAlert[]
}

export interface SecurityAlert {
  id: string
  type: 'login' | 'device' | 'mfa' | 'password' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: number
  read: boolean
  action?: string
  metadata?: any
}

export interface AuthActions {
  // Basic auth actions
  setUser: (user: AuthUser | null) => void
  setTokens: (accessToken: string | null, refreshToken: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null, details?: { message: string; type: string }) => void
  clearError: () => void
  
  // Enhanced auth actions
  login: (email: string, password: string) => Promise<void>
  loginWithOtp: (email: string, otp: string, type: string) => Promise<void>
  socialLogin: (provider: string, data: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  
  // MFA actions
  setupMfa: () => Promise<any>
  verifyMfaSetup: (token: string) => Promise<boolean>
  verifyMfa: (token: string) => Promise<boolean>
  
  // Security actions
  trustDevice: () => Promise<void>
  getSecurityStatus: () => Promise<any>
  addSecurityAlert: (alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'read'>) => void
  markAlertRead: (alertId: string) => void
  clearAlerts: () => void
  
  // Real-time actions
  setRealTimeConnected: (connected: boolean) => void
  updateLastActivity: () => void
  checkSessionTimeout: () => void
  
  // Password recovery
  sendPasswordRecovery: (email: string) => Promise<void>
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>
  
  // Initialize
  initialize: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

// Google-like real-time authentication store
export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      errorDetails: null,
      requiresMfa: false,
      mfaToken: null,
      isNewUser: false,
      trustedDevice: false,
      lastActivity: Date.now(),
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      realTimeConnected: false,
      securityAlerts: [],

      // Actions
      setUser: (user) => {
        set((state) => {
          state.user = user
          state.isAuthenticated = !!user
        })
      },

      setTokens: (accessToken, refreshToken) => {
        set((state) => {
          state.accessToken = accessToken
          state.refreshToken = refreshToken
          
          if (accessToken) {
            localStorage.setItem('accessToken', accessToken)
          }
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
          }
        })
      },

      setLoading: (isLoading) => {
        set((state) => {
          state.isLoading = isLoading
        })
      },

      setError: (error, details) => {
        set((state) => {
          state.error = error
          state.errorDetails = details || null
        })
      },

      clearError: () => {
        set((state) => {
          state.error = null
          state.errorDetails = null
        })
      },

      // Enhanced login with Google-like features
      login: async (email: string, password: string) => {
    try {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          const response = await fetch('/api/auth/google-like/enhanced-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (data.success) {
            set((state) => {
              state.user = data.data.user
              state.accessToken = data.data.accessToken
              state.refreshToken = data.data.refreshToken
              state.isAuthenticated = true
              state.requiresMfa = data.data.requiresMfa || false
              state.mfaToken = data.data.mfaToken || null
              state.trustedDevice = data.data.trustedDevice || false
              state.isLoading = false
              state.lastActivity = Date.now()
            })

            // Add security alert for login
            if (!get().trustedDevice) {
              get().addSecurityAlert({
                type: 'login',
                severity: 'low',
                message: 'New login from untrusted device',
                metadata: { device: 'Unknown', location: 'Unknown' }
              })
            }
          } else {
            set((state) => {
              state.error = data.error || 'Login failed'
              state.isLoading = false
            })
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Login failed'
            state.isLoading = false
          })
        }
      },

      // OTP-based passwordless login
      loginWithOtp: async (email: string, otp: string, type: string) => {
        try {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          const response = await fetch('/api/auth/google-like/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, token: otp, type }),
          })

          const data = await response.json()

          if (data.success) {
            set((state) => {
              state.user = data.data.user
              state.accessToken = data.data.accessToken
              state.refreshToken = data.data.refreshToken
              state.isAuthenticated = true
              state.isNewUser = data.data.isNewUser || false
              state.trustedDevice = data.data.trustedDevice || false
              state.isLoading = false
              state.lastActivity = Date.now()
            })

            // Add security alert for OTP login
            get().addSecurityAlert({
              type: 'login',
              severity: 'low',
              message: `Passwordless login via ${type.toLowerCase()}`,
              metadata: { method: type }
            })
          } else {
            set((state) => {
              state.error = data.error || 'OTP verification failed'
              state.isLoading = false
            })
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'OTP verification failed'
            state.isLoading = false
          })
        }
      },

      // Social authentication
      socialLogin: async (provider: string, data: any) => {
        try {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          const response = await fetch('/api/auth/google-like/social', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider,
              providerId: data.id,
              email: data.email,
              name: data.name,
              avatar: data.avatar,
              data
            }),
          })

          const responseData = await response.json()

          if (responseData.success) {
            set((state) => {
              state.user = responseData.data.user
              state.accessToken = responseData.data.accessToken
              state.refreshToken = responseData.data.refreshToken
              state.isAuthenticated = true
              state.isNewUser = responseData.data.isNewUser || false
              state.trustedDevice = responseData.data.trustedDevice || false
              state.isLoading = false
              state.lastActivity = Date.now()
            })

            // Add security alert for social login
            get().addSecurityAlert({
              type: 'login',
              severity: 'low',
              message: `Social login with ${provider}`,
              metadata: { provider }
            })
          } else {
            set((state) => {
              state.error = responseData.error || 'Social login failed'
              state.isLoading = false
            })
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Social login failed'
            state.isLoading = false
          })
        }
      },

      // Registration
      register: async (data) => {
        try {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          // Use OTP registration
          const response = await fetch('/api/auth/google-like/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.email,
              token: data.otp,
              type: 'REGISTER'
            }),
          })

          const responseData = await response.json()

          if (responseData.success) {
            set((state) => {
              state.user = responseData.data.user
              state.accessToken = responseData.data.accessToken
              state.refreshToken = responseData.data.refreshToken
              state.isAuthenticated = true
              state.isNewUser = true
              state.isLoading = false
              state.lastActivity = Date.now()
            })

            // Add security alert for registration
            get().addSecurityAlert({
              type: 'security',
              severity: 'low',
              message: 'New account created',
              metadata: { method: 'OTP' }
            })
          } else {
            set((state) => {
              state.error = responseData.error || 'Registration failed'
              state.isLoading = false
            })
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Registration failed'
            state.isLoading = false
          })
        }
      },

      // Logout
      logout: async () => {
        try {
          // Clear local storage
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          
          set((state) => {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.requiresMfa = false
            state.mfaToken = null
            state.isNewUser = false
            state.trustedDevice = false
            state.realTimeConnected = false
            state.securityAlerts = []
          })
        } catch (error) {
          console.error('Logout error:', error)
        }
      },

      // Token refresh
      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get()
          
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          })

          const data = await response.json()

          if (data.success) {
            set((state) => {
              state.accessToken = data.data.accessToken
              state.refreshToken = data.data.refreshToken
              state.lastActivity = Date.now()
            })
          } else {
            // Refresh failed, logout user
            get().logout()
          }
        } catch (error) {
          get().logout()
        }
      },

      // MFA setup
      setupMfa: async () => {
        try {
          const response = await fetch('/api/auth/google-like/setup-mfa', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().accessToken}`
            }
          })

          const data = await response.json()

          if (data.success) {
            return data.data
          } else {
            throw new Error(data.error || 'MFA setup failed')
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message
          })
          throw error
        }
      },

      // Verify MFA setup
      verifyMfaSetup: async (token: string) => {
        try {
          const response = await fetch('/api/auth/google-like/verify-mfa-setup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().accessToken}`
            },
            body: JSON.stringify({ token })
          })

          const data = await response.json()

          if (data.success) {
            set((state) => {
              if (state.user) {
                state.user.mfaEnabled = true
              }
            })

            get().addSecurityAlert({
              type: 'mfa',
              severity: 'medium',
              message: 'Two-factor authentication enabled',
              action: 'MFA enabled'
            })

            return true
          } else {
            throw new Error(data.error || 'MFA verification failed')
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message
          })
          return false
        }
      },

      // Verify MFA during login
      verifyMfa: async (token: string) => {
        try {
          const { mfaToken } = get()
          
          const response = await fetch('/api/auth/google-like/verify-mfa', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mfaToken, token })
          })

          const data = await response.json()

          if (data.success) {
            set((state) => {
              state.requiresMfa = false
              state.mfaToken = null
              state.lastActivity = Date.now()
            })

            get().addSecurityAlert({
              type: 'mfa',
              severity: 'low',
              message: 'MFA verification successful',
              action: 'MFA verified'
            })

            return true
          } else {
            throw new Error(data.error || 'MFA verification failed')
          }
        } catch (error: any) {
          get().addSecurityAlert({
            type: 'mfa',
            severity: 'medium',
            message: 'MFA verification failed',
            action: 'Security risk'
          })
          return false
        }
      },

      // Trust device
      trustDevice: async () => {
        try {
          const response = await fetch('/api/auth/google-like/trust-device', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().accessToken}`
            }
          })

          const data = await response.json()

          if (data.success) {
            set((state) => {
              state.trustedDevice = true
            })

            get().addSecurityAlert({
              type: 'device',
              severity: 'low',
              message: 'Device marked as trusted',
              action: 'Device trusted'
            })
          }
        } catch (error) {
          console.error('Trust device error:', error)
        }
      },

      // Get security status
      getSecurityStatus: async () => {
        try {
          const response = await fetch('/api/auth/google-like/security-status', {
            headers: {
              'Authorization': `Bearer ${get().accessToken}`
            }
          })

          const data = await response.json()

          if (data.success) {
            return data.data
          }
        } catch (error) {
          console.error('Get security status error:', error)
        }
        return null
      },

      // Security alerts
      addSecurityAlert: (alert) => {
        set((state) => {
          const newAlert: SecurityAlert = {
            ...alert,
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            read: false
          }
          state.securityAlerts.unshift(newAlert)
          
          // Keep only last 50 alerts
          if (state.securityAlerts.length > 50) {
            state.securityAlerts = state.securityAlerts.slice(0, 50)
          }
        })
      },

      markAlertRead: (alertId) => {
        set((state) => {
          const alert = state.securityAlerts.find(a => a.id === alertId)
          if (alert) {
            alert.read = true
          }
        })
      },

      clearAlerts: () => {
        set((state) => {
          state.securityAlerts = []
        })
      },

      // Real-time connection
      setRealTimeConnected: (connected) => {
        set((state) => {
          state.realTimeConnected = connected
        })
      },

      // Activity tracking
      updateLastActivity: () => {
        set((state) => {
          state.lastActivity = Date.now()
        })
      },

      // Session timeout check
      checkSessionTimeout: () => {
        const { lastActivity, sessionTimeout, isAuthenticated } = get()
        
        if (isAuthenticated && Date.now() - lastActivity > sessionTimeout) {
          get().addSecurityAlert({
            type: 'security',
            severity: 'medium',
            message: 'Session expired due to inactivity',
            action: 'Auto logout'
          })
          get().logout()
        }
      },

      // Password recovery
      sendPasswordRecovery: async (email: string) => {
        try {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          const response = await fetch('/api/auth/google-like/password-recovery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          })

          const data = await response.json()

          if (data.success) {
            get().addSecurityAlert({
              type: 'password',
              severity: 'low',
              message: 'Password recovery requested',
              action: 'Recovery initiated'
            })
          } else {
            set((state) => {
              state.error = data.error || 'Password recovery failed'
            })
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Password recovery failed'
          })
        } finally {
          set((state) => {
            state.isLoading = false
          })
        }
      },

      // Reset password
      resetPassword: async (email: string, token: string, newPassword: string) => {
        try {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          const response = await fetch('/api/auth/google-like/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, token, newPassword }),
          })

          const data = await response.json()

          if (data.success) {
            get().addSecurityAlert({
              type: 'password',
              severity: 'medium',
              message: 'Password reset successfully',
              action: 'Password changed'
            })
          } else {
            set((state) => {
              state.error = data.error || 'Password reset failed'
            })
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Password reset failed'
          })
        } finally {
          set((state) => {
            state.isLoading = false
          })
        }
      },

      // Initialize store
      initialize: async () => {
        try {
          const accessToken = localStorage.getItem('accessToken')
          const refreshToken = localStorage.getItem('refreshToken')

          if (accessToken && refreshToken) {
            set((state) => {
              state.accessToken = accessToken
              state.refreshToken = refreshToken
            })

            // Verify token and get user info
            try {
              const response = await fetch('/api/auth/me', {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              })

              const data = await response.json()

              if (data.success) {
                set((state) => {
                  state.user = data.data.user
                  state.isAuthenticated = true
                  state.lastActivity = Date.now()
                })
              } else {
                // Token invalid, refresh it
                await get().refreshAccessToken()
              }
            } catch (error) {
              // Token invalid, clear it
              get().logout()
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
        }
      }
    })),
    {
      name: 'enhanced-auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        requiresMfa: state.requiresMfa,
        mfaToken: state.mfaToken,
        trustedDevice: state.trustedDevice,
        lastActivity: state.lastActivity,
        securityAlerts: state.securityAlerts
      })
    }
  )
)

// Auto-refresh token every 10 minutes
setInterval(() => {
  const { isAuthenticated, refreshToken } = useAuthStore.getState()
  if (isAuthenticated && refreshToken) {
    useAuthStore.getState().refreshAccessToken()
  }
}, 10 * 60 * 1000)

// Check session timeout every minute
setInterval(() => {
  useAuthStore.getState().checkSessionTimeout()
}, 60 * 1000)