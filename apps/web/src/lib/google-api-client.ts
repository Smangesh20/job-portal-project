// Google-style API client with robust error handling and retry logic

interface ApiClientConfig {
  baseURL: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

interface RequestOptions extends RequestInit {
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

class GoogleApiClient {
  private config: ApiClientConfig
  private requestQueue: Map<string, Promise<any>> = new Map()

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    }
  }

  // Generate unique request key for deduplication
  private getRequestKey(url: string, options: RequestOptions): string {
    return `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || {})}`
  }

  // Exponential backoff delay
  private getRetryDelay(attempt: number): number {
    return Math.min(this.config.retryDelay * Math.pow(2, attempt), 30000)
  }

  // Check if error is retryable
  private isRetryableError(error: any): boolean {
    if (!error) return false
    
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) return true
    
    // HTTP status codes that are retryable
    if (error.status >= 500) return true
    if (error.status === 408) return true // Request timeout
    if (error.status === 429) return true // Too many requests
    
    return false
  }

  // Make request with retry logic
  private async makeRequestWithRetry(
    url: string, 
    options: RequestOptions, 
    attempt: number = 0
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      // If response is not ok and retryable, retry
      if (!response.ok && this.isRetryableError({ status: response.status }) && attempt < (options.retryAttempts || this.config.retryAttempts)) {
        const delay = this.getRetryDelay(attempt)
        console.log(`🔄 Retrying request in ${delay}ms (attempt ${attempt + 1})`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.makeRequestWithRetry(url, options, attempt + 1)
      }

      return response
    } catch (error: any) {
      clearTimeout(timeoutId)

      // If error is retryable and we haven't exceeded retry attempts
      if (this.isRetryableError(error) && attempt < (options.retryAttempts || this.config.retryAttempts)) {
        const delay = this.getRetryDelay(attempt)
        console.log(`🔄 Retrying request in ${delay}ms (attempt ${attempt + 1})`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.makeRequestWithRetry(url, options, attempt + 1)
      }

      throw error
    }
  }

  // Main request method with deduplication
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`
    const requestKey = this.getRequestKey(url, options)

    // Check if request is already in progress
    if (this.requestQueue.has(requestKey)) {
      console.log('🔄 Deduplicating request:', endpoint)
      return this.requestQueue.get(requestKey)!
    }

    // Create new request
    const requestPromise = this.executeRequest<T>(url, options)
    this.requestQueue.set(requestKey, requestPromise)

    try {
      const result = await requestPromise
      return result
    } finally {
      // Clean up request queue
      this.requestQueue.delete(requestKey)
    }
  }

  // Execute the actual request
  private async executeRequest<T>(url: string, options: RequestOptions): Promise<T> {
    try {
      const response = await this.makeRequestWithRetry(url, options)

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return await response.text() as T
    } catch (error: any) {
      console.error('🚨 API Request failed:', error)
      
      // Transform error for better handling
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection')
      }
      
      if (error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection')
      }

      throw error
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T = any>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T = any>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', { timeout: 5000, retryAttempts: 1 })
      return true
    } catch {
      return false
    }
  }
}

// Create singleton instance
export const apiClient = new GoogleApiClient()

// Export class for custom instances
export { GoogleApiClient }

// Utility function for handling API errors
export const handleApiError = (error: any): string => {
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please check your connection and try again.'
  }
  
  if (error.message.includes('Network error')) {
    return 'Network error. Please check your internet connection.'
  }
  
  if (error.message.includes('HTTP 500')) {
    return 'Server error. Please try again later.'
  }
  
  if (error.message.includes('HTTP 404')) {
    return 'Resource not found.'
  }
  
  if (error.message.includes('HTTP 401')) {
    return 'Authentication required. Please log in again.'
  }
  
  if (error.message.includes('HTTP 403')) {
    return 'Access denied. You don\'t have permission to perform this action.'
  }
  
  return error.message || 'An unexpected error occurred. Please try again.'
}
