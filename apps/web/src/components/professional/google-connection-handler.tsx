'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-react'

// GOOGLE-STYLE CONNECTION HANDLER - GRACEFUL ERROR HANDLING
export function GoogleConnectionHandler() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)

  // Google-style connection check
  const checkConnection = async () => {
    try {
      setConnectionStatus('checking')
      
      // Simple connection test
      const response = await fetch('/api/health', { 
        method: 'GET',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        setConnectionStatus('connected')
        setShowConnectionDialog(false)
      } else {
        setConnectionStatus('disconnected')
        setShowConnectionDialog(true)
      }
    } catch (error) {
      // Google-style: Handle gracefully
      setConnectionStatus('disconnected')
      setShowConnectionDialog(true)
    }
  }

  // Check connection on mount and periodically
  useEffect(() => {
    checkConnection()
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('connected')
      setShowConnectionDialog(false)
    }

    const handleOffline = () => {
      setConnectionStatus('disconnected')
      setShowConnectionDialog(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Google-style connection dialog
  if (showConnectionDialog && connectionStatus === 'disconnected') {
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
              Connection Issue
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              We're having trouble connecting. Please check your internet connection and try again.
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={async () => {
                  await checkConnection()
                  // Google-style: Simple approach, always close dialog after refresh attempt
                  setTimeout(() => setShowConnectionDialog(false), 1000)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Connection status indicator (optional)
  if (connectionStatus === 'checking') {
    return (
      <div className="fixed top-4 right-4 z-40">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Checking connection...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Google-style connection status component
export function GoogleConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-2 text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span>You are offline. Some features may be limited.</span>
        </div>
      </div>
    )
  }

  return null
}
