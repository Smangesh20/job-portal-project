/**
 * Google-Style Error Handling System
 * Implements robust error handling with graceful degradation, offline detection,
 * cached responses, and user-friendly error messages
 */

export interface GoogleStyleError {
  type: 'network' | 'server' | 'timeout' | 'offline' | 'unknown'
  message: string
  userMessage: string
  canRetry: boolean
  retryAfter?: number
  fallbackData?: any
  timestamp: number
}

export interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

class GoogleStyleErrorHandler {
  private isOnline: boolean = navigator.onLine
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  }
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  constructor() {
    this.setupOnlineDetection()
    this.setupServiceWorker()
  }

  /**
   * Setup online/offline detection like Google
   */
  private setupOnlineDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.showConnectionRestored()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.showOfflineMessage()
    })
  }

  /**
   * Setup service worker for offline functionality
   */
  private setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, continue without it
      })
    }
  }

  /**
   * Google-style request with automatic retry and fallback
   */
  async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    fallbackData?: T
  ): Promise<T> {
    // Check if we have cached data first
    const cached = this.getCachedData<T>(url)
    if (cached && !this.isStale(cached)) {
      return cached.data
    }

    // If offline, return cached data or fallback
    if (!this.isOnline) {
      return this.handleOfflineRequest(url, fallbackData)
    }

    // Attempt request with retry logic
    return this.attemptRequestWithRetry(url, options, fallbackData)
  }

  /**
   * Attempt request with exponential backoff retry
   */
  private async attemptRequestWithRetry<T>(
    url: string,
    options: RequestInit,
    fallbackData?: T
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await this.makeSingleRequest(url, options)
        
        if (response.ok) {
          const data = await response.json()
          this.cacheData(url, data)
          return data
        }

        // Handle HTTP errors
        if (response.status >= 500) {
          throw new Error(`Server error: ${response.status}`)
        } else if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          throw new Error(`Rate limited. Retry after: ${retryAfter || '60'} seconds`)
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

      } catch (error) {
        lastError = error as Error
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes('HTTP 4')) {
          break
        }

        // If this is the last attempt, break
        if (attempt === this.retryConfig.maxRetries) {
          break
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt),
          this.retryConfig.maxDelay
        )

        await this.delay(delay)
      }
    }

    // All retries failed, return fallback or cached data
    return this.handleRequestFailure(url, lastError!, fallbackData)
  }

  /**
   * Make a single request with timeout
   */
  private async makeSingleRequest(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * Handle offline requests
   */
  private handleOfflineRequest<T>(url: string, fallbackData?: T): T {
    const cached = this.getCachedData<T>(url)
    
    if (cached) {
      this.showOfflineMessage('Using cached data')
      return cached.data
    }

    if (fallbackData) {
      this.showOfflineMessage('Using offline data')
      return fallbackData
    }

    throw new Error('No cached data available and you are offline')
  }

  /**
   * Handle request failure with fallback
   */
  private handleRequestFailure<T>(url: string, error: Error, fallbackData?: T): T {
    const cached = this.getCachedData<T>(url)
    
    if (cached) {
      this.showConnectionError('Using cached data due to connection issues')
      return cached.data
    }

    if (fallbackData) {
      this.showConnectionError('Using fallback data')
      return fallbackData
    }

    // Create Google-style error
    const googleError = this.createGoogleStyleError(error)
    this.showErrorToUser(googleError)
    throw googleError
  }

  /**
   * Create Google-style error object
   */
  private createGoogleStyleError(error: Error): GoogleStyleError {
    const errorMessage = error.message.toLowerCase()
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        type: 'network',
        message: error.message,
        userMessage: 'Check your internet connection and try again',
        canRetry: true,
        retryAfter: 5,
        timestamp: Date.now()
      }
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('abort')) {
      return {
        type: 'timeout',
        message: error.message,
        userMessage: 'Request timed out. Please try again',
        canRetry: true,
        retryAfter: 3,
        timestamp: Date.now()
      }
    }

    if (errorMessage.includes('server') || errorMessage.includes('5')) {
      return {
        type: 'server',
        message: error.message,
        userMessage: 'Our servers are temporarily unavailable. Please try again later',
        canRetry: true,
        retryAfter: 30,
        timestamp: Date.now()
      }
    }

    return {
      type: 'unknown',
      message: error.message,
      userMessage: 'Something went wrong. Please try again',
      canRetry: true,
      retryAfter: 5,
      timestamp: Date.now()
    }
  }

  /**
   * Cache data with TTL
   */
  private cacheData(url: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(url, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Get cached data
   */
  private getCachedData<T>(url: string): { data: T; timestamp: number; ttl: number } | null {
    const cached = this.cache.get(url)
    return cached || null
  }

  /**
   * Check if cached data is stale
   */
  private isStale(cached: { data: any; timestamp: number; ttl: number }): boolean {
    return Date.now() - cached.timestamp > cached.ttl
  }

  /**
   * Show connection restored message
   */
  private showConnectionRestored() {
    this.showToast('Connection restored!', 'success')
  }

  /**
   * Show offline message
   */
  private showOfflineMessage(message: string = 'You are offline. Some features may be limited.') {
    this.showToast(message, 'warning')
  }

  /**
   * Show connection error
   */
  private showConnectionError(message: string) {
    this.showToast(message, 'info')
  }

  /**
   * Show error to user
   */
  private showErrorToUser(error: GoogleStyleError) {
    this.showToast(error.userMessage, 'error')
  }

  /**
   * Show toast notification
   */
  private showToast(message: string, type: 'success' | 'warning' | 'error' | 'info') {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`
    toast.textContent = message

    document.body.appendChild(toast)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 5000)
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size
  }
}

// Create singleton instance
export const googleStyleErrorHandler = new GoogleStyleErrorHandler()

// Export for use in other files
export default googleStyleErrorHandler
