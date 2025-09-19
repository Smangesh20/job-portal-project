'use client'

import { useState, useEffect } from 'react'
import { WifiIcon, SignalSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className = '' }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)
  const [lastOfflineTime, setLastOfflineTime] = useState<Date | null>(null)

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      setShowStatus(true)
      setLastOfflineTime(null)
      
      // Hide status after 3 seconds
      setTimeout(() => setShowStatus(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowStatus(true)
      setLastOfflineTime(new Date())
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showStatus && isOnline) {
    return null
  }

  const getStatusMessage = () => {
    if (isOnline) {
      return 'Connection restored!'
    }
    
    if (lastOfflineTime) {
      const minutesOffline = Math.floor((Date.now() - lastOfflineTime.getTime()) / 60000)
      if (minutesOffline > 0) {
        return `Offline for ${minutesOffline} minute${minutesOffline > 1 ? 's' : ''}`
      }
    }
    
    return 'You are offline'
  }

  const getStatusColor = () => {
    if (isOnline) {
      return 'bg-green-500 text-white'
    }
    return 'bg-red-500 text-white'
  }

  const getStatusIcon = () => {
    if (isOnline) {
      return <WifiIcon className="w-4 h-4" />
    }
    return <SignalSlashIcon className="w-4 h-4" />
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${className}`}>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">
          {getStatusMessage()}
        </span>
      </div>
    </div>
  )
}

// Google-style connection banner
export function ConnectionBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showBanner || isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              You're offline. Some features may be limited.
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-black hover:text-gray-700"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Connection quality indicator
export function ConnectionQuality() {
  const [quality, setQuality] = useState<'good' | 'poor' | 'offline'>('good')

  useEffect(() => {
    const checkConnectionQuality = async () => {
      if (!navigator.onLine) {
        setQuality('offline')
        return
      }

      try {
        const start = Date.now()
        await fetch('/api/health', { 
          method: 'GET',
          cache: 'no-cache'
        })
        const duration = Date.now() - start

        if (duration < 1000) {
          setQuality('good')
        } else {
          setQuality('poor')
        }
      } catch (error) {
        setQuality('poor')
      }
    }

    // Check immediately
    checkConnectionQuality()

    // Check every 30 seconds
    const interval = setInterval(checkConnectionQuality, 30000)

    return () => clearInterval(interval)
  }, [])

  const getQualityColor = () => {
    switch (quality) {
      case 'good': return 'text-green-500'
      case 'poor': return 'text-yellow-500'
      case 'offline': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getQualityIcon = () => {
    switch (quality) {
      case 'good': return '🟢'
      case 'poor': return '🟡'
      case 'offline': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className={`flex items-center gap-1 text-xs ${getQualityColor()}`}>
      <span>{getQualityIcon()}</span>
      <span className="capitalize">{quality}</span>
    </div>
  )
}
