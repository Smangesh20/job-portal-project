import crypto from 'crypto'
import { Request } from 'express'

// Type definitions
export interface PaginationOptions {
  page: number
  limit: number
  total: number
}

export interface PaginationResult {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  offset: number
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterOptions {
  [key: string]: any
}

// Utility functions
export const helpers = {
  /**
   * Generate pagination metadata
   */
  generatePagination: (options: PaginationOptions): PaginationResult => {
    const { page, limit, total } = options
    
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      offset
    }
  },

  /**
   * Parse pagination from request query
   */
  parsePagination: (req: Request): { page: number; limit: number } => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    
    return { page, limit }
  },

  /**
   * Parse sort options from request query
   */
  parseSort: (req: Request, defaultField: string = 'createdAt', defaultDirection: 'asc' | 'desc' = 'desc'): SortOptions => {
    const sortBy = req.query.sortBy as string || defaultField
    const sortOrder = req.query.sortOrder as string || defaultDirection
    
    return {
      field: sortBy,
      direction: sortOrder === 'asc' ? 'asc' : 'desc'
    }
  },

  /**
   * Generate random string
   */
  generateRandomString: (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  },

  /**
   * Generate UUID v4
   */
  generateUUID: (): string => {
    return crypto.randomUUID()
  },

  /**
   * Generate slug from string
   */
  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  },

  /**
   * Format currency
   */
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  /**
   * Format date
   */
  formatDate: (date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    switch (format) {
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      case 'relative':
        return helpers.getRelativeTime(dateObj)
      default:
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
    }
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  getRelativeTime: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    }
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
    }
    
    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
  },

  /**
   * Sanitize HTML
   */
  sanitizeHtml: (html: string): string => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
  },

  /**
   * Truncate text
   */
  truncateText: (text: string, length: number = 100, suffix: string = '...'): string => {
    if (text.length <= length) {
      return text
    }
    
    return text.substring(0, length).trim() + suffix
  },

  /**
   * Capitalize first letter
   */
  capitalizeFirst: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  },

  /**
   * Convert camelCase to kebab-case
   */
  camelToKebab: (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  },

  /**
   * Convert kebab-case to camelCase
   */
  kebabToCamel: (str: string): string => {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
  },

  /**
   * Convert snake_case to camelCase
   */
  snakeToCamel: (str: string): string => {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
  },

  /**
   * Convert camelCase to snake_case
   */
  camelToSnake: (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
  },

  /**
   * Deep clone object
   */
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T
    }
    
    if (obj instanceof Array) {
      return obj.map(item => helpers.deepClone(item)) as unknown as T
    }
    
    if (typeof obj === 'object') {
      const cloned = {} as T
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = helpers.deepClone(obj[key])
        }
      }
      return cloned
    }
    
    return obj
  },

  /**
   * Merge objects deeply
   */
  deepMerge: <T>(target: T, source: Partial<T>): T => {
    const result = { ...target }
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key]
        const targetValue = result[key]
        
        if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
          if (typeof targetValue === 'object' && targetValue !== null && !Array.isArray(targetValue)) {
            result[key] = helpers.deepMerge(targetValue, sourceValue as any)
          } else {
            result[key] = helpers.deepClone(sourceValue)
          }
        } else {
          result[key] = sourceValue as T[Extract<keyof T, string>]
        }
      }
    }
    
    return result
  },

  /**
   * Check if value is empty
   */
  isEmpty: (value: any): boolean => {
    if (value === null || value === undefined) {
      return true
    }
    
    if (typeof value === 'string') {
      return value.trim().length === 0
    }
    
    if (Array.isArray(value)) {
      return value.length === 0
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length === 0
    }
    
    return false
  },

  /**
   * Check if value is not empty
   */
  isNotEmpty: (value: any): boolean => {
    return !helpers.isEmpty(value)
  },

  /**
   * Generate hash from string
   */
  generateHash: (str: string, algorithm: string = 'sha256'): string => {
    return crypto.createHash(algorithm).update(str).digest('hex')
  },

  /**
   * Generate random number between min and max
   */
  randomBetween: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  /**
   * Sleep for specified milliseconds
   */
  sleep: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  /**
   * Retry function with exponential backoff
   */
  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxAttempts) {
          throw lastError
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1)
        await helpers.sleep(delay)
      }
    }
    
    throw lastError!
  },

  /**
   * Debounce function
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  /**
   * Throttle function
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void => {
    let inThrottle: boolean
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  /**
   * Format file size
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * Get file extension
   */
  getFileExtension: (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  },

  /**
   * Check if email is valid
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Check if URL is valid
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * Extract domain from URL
   */
  extractDomain: (url: string): string => {
    try {
      return new URL(url).hostname
    } catch {
      return ''
    }
  },

  /**
   * Generate random color
   */
  generateRandomColor: (): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  },

  /**
   * Calculate percentage
   */
  calculatePercentage: (value: number, total: number): number => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  },

  /**
   * Get client IP from request
   */
  getClientIP: (req: Request): string => {
    return (
      req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress ||
      '127.0.0.1'
    ).split(',')[0].trim()
  },

  /**
   * Parse user agent
   */
  parseUserAgent: (userAgent: string): { browser: string; os: string; device: string } => {
    const browser = /Chrome\/(\d+)/.test(userAgent) ? 'Chrome' :
                   /Firefox\/(\d+)/.test(userAgent) ? 'Firefox' :
                   /Safari\/(\d+)/.test(userAgent) ? 'Safari' :
                   /Edge\/(\d+)/.test(userAgent) ? 'Edge' : 'Unknown'
    
    const os = /Windows/.test(userAgent) ? 'Windows' :
              /Mac OS X/.test(userAgent) ? 'macOS' :
              /Linux/.test(userAgent) ? 'Linux' :
              /Android/.test(userAgent) ? 'Android' :
              /iOS/.test(userAgent) ? 'iOS' : 'Unknown'
    
    const device = /Mobile/.test(userAgent) ? 'Mobile' :
                  /Tablet/.test(userAgent) ? 'Tablet' : 'Desktop'
    
    return { browser, os, device }
  },

  /**
   * Generate QR code data URL
   */
  generateQRCode: (data: string): string => {
    // This is a placeholder - in production, you'd use a QR code library
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" fill="black">QR Code for: ${data}</text>
      </svg>
    `).toString('base64')}`
  }
}

// Export all helpers
export { helpers }
