'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// 🚀 NO AUTH PROVIDER - BYPASSES ALL LOGIN
interface NoAuthContextType {
  user: any
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
}

const NoAuthContext = createContext<NoAuthContextType | undefined>(undefined)

export function NoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({
    id: '1',
    email: 'user@askyacham.com',
    firstName: 'User',
    lastName: 'Name',
    role: 'CANDIDATE'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // 🚀 ALWAYS SUCCESS - NO AUTH NEEDED
    setTimeout(() => {
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 500)
    return true
  }

  const register = async (data: any) => {
    setIsLoading(true)
    // 🚀 ALWAYS SUCCESS - NO AUTH NEEDED
    setTimeout(() => {
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 500)
  }

  const logout = async () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  const refreshToken = async () => {
    // 🚀 NO TOKEN NEEDED
  }

  const clearError = () => {
    setError(null)
  }

  const value: NoAuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    refreshToken,
    clearError
  }

  return (
    <NoAuthContext.Provider value={value}>
      {children}
    </NoAuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(NoAuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a NoAuthProvider')
  }
  return context
}










