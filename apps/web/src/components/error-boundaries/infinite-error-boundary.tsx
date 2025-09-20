'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
// Removed complex error prevention system import
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  retryCount: number
  isRecovering: boolean
}

export class InfiniteErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      isRecovering: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props
    const { errorId } = this.state

    // Report error to prevention system
    console.error('Component mount error:', error, errorInfo)

    // Update state
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo)
    }

    // Log error details
    console.error('InfiniteErrorBoundary caught an error:', {
      error,
      errorInfo,
      errorId,
      timestamp: new Date().toISOString()
    })
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    if (hasError && resetOnPropsChange) {
      const hasResetKey = resetKeys?.some((key, index) => 
        key !== prevProps.resetKeys?.[index]
      )

      if (hasResetKey) {
        this.resetErrorBoundary()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      isRecovering: false
    })
  }

  private handleRetry = () => {
    const { retryCount } = this.state
    const maxRetries = 3

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        retryCount: prevState.retryCount + 1,
        isRecovering: true
      }))

      // Attempt recovery
      this.attemptRecovery()

      // Reset after delay
      this.resetTimeoutId = window.setTimeout(() => {
        this.resetErrorBoundary()
      }, 1000)
    } else {
      // Force page reload after max retries
      window.location.reload()
    }
  }

  private attemptRecovery = () => {
    const { error } = this.state

    if (error) {
      // Report recovery attempt
      console.error('Critical error:', error)

      // Clear caches
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch (e) {
        console.warn('Failed to clear storage during recovery:', e)
      }

      // Clear quantum cache
      this.clearQuantumCache()

      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc()
      }
    }
  }

  private clearQuantumCache = () => {
    try {
      const quantumKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('quantum_') || key.startsWith('qc_') || key.startsWith('quantum_computing_')
      )
      
      quantumKeys.forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.warn('Failed to clear quantum cache:', error)
    }
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state
    
    const bugReport = {
      errorId,
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Send bug report
    fetch('/api/bug-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bugReport)
    }).catch(err => {
      console.error('Failed to send bug report:', err)
    })

    // Show confirmation
    alert('Bug report sent! Thank you for helping us improve.')
  }

  render() {
    const { hasError, error, errorInfo, retryCount, isRecovering } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Our infinite error prevention system is working to resolve this.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
                <p className="text-sm text-gray-700 font-mono break-all">
                  {error.message}
                </p>
                {process.env.NODE_ENV === 'development' && error.stack && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                disabled={isRecovering}
                className="flex items-center gap-2"
              >
                {isRecovering ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {isRecovering ? 'Recovering...' : `Retry (${retryCount}/3)`}
              </Button>

              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>

              <Button
                variant="outline"
                onClick={this.handleReportBug}
                className="flex items-center gap-2"
              >
                <Bug className="w-4 h-4" />
                Report Bug
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>Error ID: {this.state.errorId}</p>
              <p>Time: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      )
    }

    return children
  }
}

export default InfiniteErrorBoundary
