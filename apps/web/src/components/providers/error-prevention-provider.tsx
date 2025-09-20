'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
// Removed error prevention system import

interface ErrorPreventionContextType {
  errorStats: any
  isQuantumFallbackMode: boolean
  refreshErrorStats: () => void
}

const ErrorPreventionContext = createContext<ErrorPreventionContextType | undefined>(undefined)

interface ErrorPreventionProviderProps {
  children: ReactNode
}

export function ErrorPreventionProvider({ children }: ErrorPreventionProviderProps) {
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') {
      return
    }

    // Initialize error prevention system silently
  }, [])

  const refreshErrorStats = () => {
    return [] // Simplified error history
  }

  const contextValue: ErrorPreventionContextType = {
    errorStats: [], // Simplified error stats
    isQuantumFallbackMode: false, // Simplified for now
    refreshErrorStats
  }

  return (
    <ErrorPreventionContext.Provider value={contextValue}>
      {children}
    </ErrorPreventionContext.Provider>
  )
}

export function useErrorPrevention() {
  const context = useContext(ErrorPreventionContext)
  if (context === undefined) {
    throw new Error('useErrorPrevention must be used within an ErrorPreventionProvider')
  }
  return context
}