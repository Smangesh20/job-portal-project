import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { logger } from '../utils/logger'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  isEmailVerified: boolean
  twoFactorEnabled: boolean
  consciousnessLevel: number
  quantumSecurityEnabled: boolean
  createdAt: string
  lastLoginAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  enableTwoFactor: () => Promise<void>
  verifyTwoFactor: (code: string) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => Promise<void>
  refreshToken: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  agreeToTerms: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Check for stored auth token and user data
      // This would typically involve checking AsyncStorage or SecureStore
      const storedUser = await getStoredUser()
      if (storedUser) {
        setUser(storedUser)
        logger.info('User authenticated from storage', { userId: storedUser.id })
      }
    } catch (error) {
      logger.error('Failed to initialize auth', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStoredUser = async (): Promise<User | null> => {
    // This would typically retrieve from AsyncStorage or SecureStore
    // For now, return null to simulate no stored user
    return null
  }

  const storeUser = async (userData: User) => {
    // This would typically store in AsyncStorage or SecureStore
    logger.info('User data stored', { userId: userData.id })
  }

  const clearStoredUser = async () => {
    // This would typically clear AsyncStorage or SecureStore
    logger.info('User data cleared from storage')
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true)
      logger.info('Login attempt', { email })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
        twoFactorEnabled: false,
        consciousnessLevel: 45,
        quantumSecurityEnabled: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }

      setUser(userData)
      
      if (rememberMe) {
        await storeUser(userData)
      }

      logger.logUserAction('login', userData.id)
    } catch (error) {
      logger.error('Login failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      logger.info('Registration attempt', { email: userData.email })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock user data
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isEmailVerified: false,
        twoFactorEnabled: false,
        consciousnessLevel: 25,
        quantumSecurityEnabled: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }

      setUser(newUser)
      logger.logUserAction('register', newUser.id)
    } catch (error) {
      logger.error('Registration failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (user) {
        logger.logUserAction('logout', user.id)
      }

      setUser(null)
      await clearStoredUser()
      logger.info('User logged out successfully')
    } catch (error) {
      logger.error('Logout failed', error)
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true)
      logger.info('Password reset requested', { email })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      logger.info('Password reset email sent', { email })
    } catch (error) {
      logger.error('Password reset failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true)
      logger.info('Password reset attempt', { token: token.substring(0, 8) + '...' })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      logger.info('Password reset successful')
    } catch (error) {
      logger.error('Password reset failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true)
      logger.info('Email verification attempt', { token: token.substring(0, 8) + '...' })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (user) {
        setUser({ ...user, isEmailVerified: true })
        logger.logUserAction('email_verified', user.id)
      }
    } catch (error) {
      logger.error('Email verification failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const enableTwoFactor = async () => {
    try {
      setIsLoading(true)
      logger.info('Two-factor authentication enable attempt', { userId: user?.id })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (user) {
        setUser({ ...user, twoFactorEnabled: true })
        logger.logUserAction('2fa_enabled', user.id)
      }
    } catch (error) {
      logger.error('Two-factor authentication enable failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    try {
      logger.info('Two-factor authentication verification attempt', { userId: user?.id })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock verification (in real app, this would validate against the server)
      const isValid = code.length === 6 && /^\d+$/.test(code)

      if (isValid && user) {
        logger.logUserAction('2fa_verified', user.id)
      } else {
        logger.warn('Two-factor authentication verification failed', { userId: user?.id })
      }

      return isValid
    } catch (error) {
      logger.error('Two-factor authentication verification failed', error)
      return false
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true)
      logger.info('Profile update attempt', { userId: user?.id, updates: Object.keys(userData) })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (user) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        await storeUser(updatedUser)
        logger.logUserAction('profile_updated', user.id)
      }
    } catch (error) {
      logger.error('Profile update failed', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      if (!user) return

      logger.info('Token refresh attempt', { userId: user.id })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Update last login time
      setUser({ ...user, lastLoginAt: new Date().toISOString() })

      logger.info('Token refreshed successfully', { userId: user.id })
    } catch (error) {
      logger.error('Token refresh failed', error)
      // On token refresh failure, logout user
      await logout()
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    enableTwoFactor,
    verifyTwoFactor,
    updateProfile,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
