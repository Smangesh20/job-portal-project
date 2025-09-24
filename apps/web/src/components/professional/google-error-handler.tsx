'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Home, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Server,
  Globe
} from 'lucide-react'

// Google-style connection status
interface ConnectionState {
  isOnline: boolean
  quality: 'excellent' | 'good' | 'poor' | 'offline'
  lastCheck: Date
  retryCount: number
  isRetrying: boolean
}

// Google-style error handler with professional UX
export function GoogleErrorHandler() {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    quality: 'good',
    lastCheck: new Date(),
    retryCount: 0,
    isRetrying: false
  })

  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Google-style connection quality check
  const checkConnectionQuality = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.onLine) {
      setConnectionState(prev => ({ ...prev, quality: 'offline', isOnline: false }))
      return
    }

    try {
      const start = Date.now()
      const response = await fetch('/api/health', { 
        method: 'GET',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      
      const duration = Date.now() - start
      
      if (response.ok) {
        if (duration < 500) {
          setConnectionState(prev => ({ ...prev, quality: 'excellent', isOnline: true, retryCount: 0 }))
        } else if (duration < 1500) {
          setConnectionState(prev => ({ ...prev, quality: 'good', isOnline: true, retryCount: 0 }))
        } else {
          setConnectionState(prev => ({ ...prev, quality: 'poor', isOnline: true, retryCount: 0 }))
        }
      } else {
        setConnectionState(prev => ({ ...prev, quality: 'poor', isOnline: true }))
      }
    } catch (error) {
      setConnectionState(prev => ({ 
        ...prev, 
        quality: 'offline', 
        isOnline: false,
        retryCount: prev.retryCount + 1
      }))
    }
  }, [])

  // Auto-retry with exponential backoff
  const retryConnection = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, isRetrying: true }))
    
    const delay = Math.min(1000 * Math.pow(2, connectionState.retryCount), 30000)
    await new Promise(resolve => setTimeout(resolve, delay))
    
    await checkConnectionQuality()
    setConnectionState(prev => ({ ...prev, isRetrying: false }))
  }, [checkConnectionQuality, connectionState.retryCount])

  // Monitor connection status
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial check
    checkConnectionQuality()

    // Listen for online/offline events
    const handleOnline = () => {
      setConnectionState(prev => ({ ...prev, isOnline: true, retryCount: 0 }))
      checkConnectionQuality()
    }

    const handleOffline = () => {
      setConnectionState(prev => ({ ...prev, isOnline: false, quality: 'offline' }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Regular health checks
    const interval = setInterval(checkConnectionQuality, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [checkConnectionQuality])

  // Auto-retry on connection issues
  useEffect(() => {
    if (connectionState.quality === 'offline' && connectionState.retryCount < 5) {
      const timer = setTimeout(retryConnection, 2000)
      return () => clearTimeout(timer)
    }
  }, [connectionState.quality, connectionState.retryCount, retryConnection])

  const getConnectionStatus = () => {
    if (connectionState.isRetrying) {
      return {
        icon: <RefreshCw className="w-4 h-4 animate-spin" />,
        text: 'Reconnecting...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200'
      }
    }

    switch (connectionState.quality) {
      case 'excellent':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Connected',
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200'
        }
      case 'good':
        return {
          icon: <Wifi className="w-4 h-4" />,
          text: 'Connected',
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200'
        }
      case 'poor':
        return {
          icon: <Wifi className="w-4 h-4" />,
          text: 'Slow connection',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200'
        }
      case 'offline':
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: 'No connection',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        }
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          text: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200'
        }
    }
  }

  const status = getConnectionStatus()

  // Don't show anything if connection is good
  if (connectionState.quality === 'excellent' || connectionState.quality === 'good') {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className={`border ${status.bgColor}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={status.color}>
                {status.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${status.color}`}>
                  {status.text}
                </p>
                <p className="text-xs text-gray-500">
                  {connectionState.quality === 'offline' && connectionState.retryCount > 0 && 
                    `Retry ${connectionState.retryCount}/5`
                  }
                </p>
              </div>
            </div>
            
            {connectionState.quality === 'offline' && (
              <Button
                size="sm"
                variant="outline"
                onClick={retryConnection}
                disabled={connectionState.isRetrying}
                className="ml-2"
              >
                {connectionState.isRetrying ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Google-style offline fallback
export function OfflineFallback() {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-2xl">You're offline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please check your internet connection and try again.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p>We'll automatically retry when you're back online.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Google-style service status
export function ServiceStatus() {
  const [services, setServices] = useState({
    api: 'operational',
    database: 'operational',
    auth: 'operational'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'outage': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4" />
      case 'degraded': return <AlertTriangle className="w-4 h-4" />
      case 'outage': return <Server className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="w-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(services).map(([service, status]) => (
            <div key={service} className="flex items-center justify-between text-xs">
              <span className="capitalize">{service}</span>
              <div className={`flex items-center ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
