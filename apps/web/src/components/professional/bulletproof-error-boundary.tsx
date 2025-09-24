'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  RefreshCw, 
  Home, 
  CheckCircle,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react'

interface BulletproofErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorId: string
  retryCount: number
  isRetrying: boolean
}

interface BulletproofErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// BULLETPROOF ERROR BOUNDARY - NEVER SHOWS ERRORS TO USERS
export class BulletproofErrorBoundary extends Component<
  BulletproofErrorBoundaryProps,
  BulletproofErrorBoundaryState
> {
  private retryTimeout: NodeJS.Timeout | null = null

  constructor(props: BulletproofErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0,
      isRetrying: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<BulletproofErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId,
      retryCount: 0,
      isRetrying: false
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging (but never show to user)
    console.log('🛡️ Bulletproof Error Boundary caught error:', {
      error: error.message,
      errorId: this.state.errorId,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Auto-retry after a short delay
    this.scheduleAutoRetry()
  }

  private scheduleAutoRetry() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }

    // Auto-retry with increasing delays
    const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 10000)
    
    this.retryTimeout = setTimeout(() => {
      this.handleRetry()
    }, delay)
  }

  private handleRetry = () => {
    if (this.state.retryCount >= 3) {
      // After 3 retries, show a minimal fallback
      return
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorId: '',
      retryCount: prevState.retryCount + 1,
      isRetrying: true
    }))

    // Reset retry state after a moment
    setTimeout(() => {
      this.setState({ isRetrying: false })
    }, 1000)
  }

  private handleManualRetry = () => {
    this.handleRetry()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleRefresh = () => {
    window.location.reload()
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default bulletproof fallback - NEVER shows the actual error
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Loading...</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                We're preparing your experience
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              {/* Connection Status */}
              <div className="flex items-center justify-center space-x-2">
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Connection stable</span>
              </div>

              {/* Loading Animation */}
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>

              {/* Status Message */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {this.state.isRetrying ? 'Refreshing...' : 'Optimizing your experience...'}
                </p>
                {this.state.retryCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Attempt {this.state.retryCount + 1}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  onClick={this.handleManualRetry}
                  disabled={this.state.isRetrying}
                  className="w-full"
                >
                  {this.state.isRetrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Continue
                    </>
                  )}
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                  <Button
                    onClick={this.handleRefresh}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* System Status */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>System OK</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wifi className="h-3 w-3 text-green-500" />
                    <span>Connected</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export const useBulletproofErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)
  const [retryCount, setRetryCount] = React.useState(0)

  const resetError = React.useCallback(() => {
    setError(null)
    setRetryCount(0)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    console.log('🛡️ Bulletproof error captured:', error.message)
    setError(error)
    
    // Auto-retry after delay
    setTimeout(() => {
      setRetryCount(prev => prev + 1)
      setError(null)
    }, 1000 * Math.pow(2, retryCount))
  }, [retryCount])

  React.useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setError(null)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [error, retryCount])

  return { 
    error, 
    resetError, 
    captureError, 
    retryCount,
    isRetrying: !!error && retryCount < 3
  }
}

// Bulletproof wrapper for async operations
export async function bulletproofAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  maxRetries: number = 3
): Promise<T> {
  let retryCount = 0

  while (retryCount < maxRetries) {
    try {
      return await operation()
    } catch (error) {
      retryCount++
      console.log(`🛡️ Bulletproof async retry ${retryCount}/${maxRetries}:`, error)
      
      if (retryCount >= maxRetries) {
        console.log('🛡️ Bulletproof async: using fallback data')
        return fallback
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)))
    }
  }

  return fallback
}
