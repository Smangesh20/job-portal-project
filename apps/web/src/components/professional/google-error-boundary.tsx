'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

// GOOGLE-STYLE ERROR BOUNDARY - GRACEFUL, NEVER FAILS
export class GoogleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Google's approach - update state to show fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Google's approach - log error for debugging but don't show to user
    console.log('🔍 Google Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Google's approach - report error to monitoring service (silently)
    if (typeof window !== 'undefined') {
      try {
        // In a real app, you'd send this to your error monitoring service
        // For now, we'll just log it
        console.log('📊 Error reported to monitoring service')
      } catch (e) {
        // Silent error handling
      }
    }
  }

  handleRetry = () => {
    // Google's approach - reset error state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    // Google's approach - navigate to safe page
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
  }

  handleGoBack = () => {
    // Google's approach - go back to previous page
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      this.handleGoHome()
    }
  }

  render() {
    if (this.state.hasError) {
      // Google's approach - show helpful error UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Something went wrong
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  We're working to fix this issue. Please try again or go back to a safe page.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                      Error Details (Development Only)
                    </h4>
                    <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button onClick={this.handleRetry} className="bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={this.handleGoBack} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                  <Button onClick={this.handleGoHome} variant="outline">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Still having issues?
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Our support team is here to help you get back on track.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.open('/help', '_blank')}
                  >
                    Get Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // Google's approach - render children normally
    return this.props.children
  }
}

// Hook version for functional components
export function useGoogleErrorHandler() {
  const handleError = (error: Error, errorInfo?: any) => {
    // Google's approach - log error silently
    console.log('🔍 Error handled by Google Error Handler:', error, errorInfo)
    
    // Google's approach - report to monitoring service
    if (typeof window !== 'undefined') {
      try {
        // In a real app, you'd send this to your error monitoring service
        console.log('📊 Error reported to monitoring service')
      } catch (e) {
        // Silent error handling
      }
    }
  }

  return { handleError }
}

export default GoogleErrorBoundary






