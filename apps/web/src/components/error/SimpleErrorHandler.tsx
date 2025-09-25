'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, AlertTriangle } from 'lucide-react'

// GOOGLE'S APPROACH - SIMPLE ERROR HANDLER
export function SimpleErrorHandler() {
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Google's approach - simple error handling
    const handleError = (event: ErrorEvent) => {
      // Google's approach - show simple message
      setErrorMessage('Something went wrong. Please refresh the page.')
      setShowError(true)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Google's approach - show simple message
      setErrorMessage('Something went wrong. Please refresh the page.')
      setShowError(true)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Google's approach - simple error dialog
  if (showError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {errorMessage}
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowError(false)}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}






