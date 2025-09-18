/**
 * World-Class Professional Error Handling System
 * Provides detailed, user-friendly error messages for enterprise-level UX
 */

export interface ErrorDetails {
  title: string
  message: string
  type: 'validation' | 'network' | 'server' | 'authentication' | 'unknown'
  severity: 'low' | 'medium' | 'high' | 'critical'
  action?: string
  code?: string
}

export class ProfessionalErrorHandler {
  /**
   * Parse API error and return detailed error information
   */
  static parseError(error: any): ErrorDetails {
    // Network errors
    if (!error.response) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to our servers. Please check your internet connection and try again.',
        type: 'network',
        severity: 'medium',
        action: 'Check your internet connection and retry',
        code: 'NETWORK_ERROR'
      }
    }

    const status = error.response?.status
    const data = error.response?.data
    const message = data?.message || data?.error || 'An unexpected error occurred'

    // HTTP Status Code based error handling
    switch (status) {
      case 400:
        return this.handleValidationError(data, message)
      case 401:
        return {
          title: 'Authentication Required',
          message: 'Your session has expired. Please log in again to continue.',
          type: 'authentication',
          severity: 'medium',
          action: 'Please log in again',
          code: 'UNAUTHORIZED'
        }
      case 403:
        return {
          title: 'Access Denied',
          message: 'You do not have permission to perform this action.',
          type: 'authentication',
          severity: 'high',
          action: 'Contact support if you believe this is an error',
          code: 'FORBIDDEN'
        }
      case 404:
        return {
          title: 'Service Not Found',
          message: 'The requested service is temporarily unavailable.',
          type: 'server',
          severity: 'medium',
          action: 'Please try again later',
          code: 'NOT_FOUND'
        }
      case 409:
        return this.handleConflictError(data, message)
      case 422:
        return this.handleValidationError(data, message)
      case 429:
        return {
          title: 'Too Many Requests',
          message: 'You have made too many requests. Please wait a moment before trying again.',
          type: 'server',
          severity: 'low',
          action: 'Please wait and try again',
          code: 'RATE_LIMIT'
        }
      case 500:
        return {
          title: 'Server Error',
          message: 'Our servers are experiencing issues. Our team has been notified and is working to resolve this.',
          type: 'server',
          severity: 'critical',
          action: 'Please try again in a few minutes',
          code: 'SERVER_ERROR'
        }
      case 502:
      case 503:
      case 504:
        return {
          title: 'Service Unavailable',
          message: 'Our services are temporarily unavailable due to maintenance. Please try again later.',
          type: 'server',
          severity: 'high',
          action: 'Please try again later',
          code: 'SERVICE_UNAVAILABLE'
        }
      default:
        return {
          title: 'Unexpected Error',
          message: message || 'An unexpected error occurred. Please try again.',
          type: 'unknown',
          severity: 'medium',
          action: 'Please try again or contact support',
          code: 'UNKNOWN_ERROR'
        }
    }
  }

  /**
   * Handle validation errors with specific field guidance
   */
  private static handleValidationError(data: any, message: string): ErrorDetails {
    const errors = data?.errors || data?.validation || []
    
    if (errors.length > 0) {
      const fieldErrors = errors.map((err: any) => {
        const field = err.field || err.path || 'field'
        const msg = err.message || err.msg || 'Invalid value'
        return `${this.capitalizeFirst(field)}: ${msg}`
      }).join('. ')

      return {
        title: 'Validation Error',
        message: `Please correct the following issues: ${fieldErrors}`,
        type: 'validation',
        severity: 'low',
        action: 'Please review and correct the highlighted fields',
        code: 'VALIDATION_ERROR'
      }
    }

    // Common validation error patterns
    if (message.toLowerCase().includes('email')) {
      return {
        title: 'Invalid Email Address',
        message: 'Please enter a valid email address (e.g., john@example.com).',
        type: 'validation',
        severity: 'low',
        action: 'Please check your email format',
        code: 'INVALID_EMAIL'
      }
    }

    if (message.toLowerCase().includes('password')) {
      return {
        title: 'Password Requirements Not Met',
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.',
        type: 'validation',
        severity: 'low',
        action: 'Please create a stronger password',
        code: 'WEAK_PASSWORD'
      }
    }

    if (message.toLowerCase().includes('required')) {
      return {
        title: 'Missing Required Information',
        message: 'Please fill in all required fields to continue.',
        type: 'validation',
        severity: 'low',
        action: 'Please complete all required fields',
        code: 'MISSING_FIELDS'
      }
    }

    return {
      title: 'Invalid Input',
      message: message || 'Please check your input and try again.',
      type: 'validation',
      severity: 'low',
      action: 'Please review your information',
      code: 'INVALID_INPUT'
    }
  }

  /**
   * Handle conflict errors (e.g., email already exists)
   */
  private static handleConflictError(data: any, message: string): ErrorDetails {
    if (message.toLowerCase().includes('email') || message.toLowerCase().includes('already exists')) {
      return {
        title: 'Email Already Registered',
        message: 'An account with this email address already exists. Please use a different email or try signing in.',
        type: 'validation',
        severity: 'medium',
        action: 'Use a different email or sign in with existing account',
        code: 'EMAIL_EXISTS'
      }
    }

    if (message.toLowerCase().includes('username')) {
      return {
        title: 'Username Already Taken',
        message: 'This username is already taken. Please choose a different username.',
        type: 'validation',
        severity: 'low',
        action: 'Please choose a different username',
        code: 'USERNAME_EXISTS'
      }
    }

    return {
      title: 'Conflict Error',
      message: message || 'This action conflicts with existing data. Please check your information.',
      type: 'validation',
      severity: 'medium',
      action: 'Please review your information',
      code: 'CONFLICT_ERROR'
    }
  }

  /**
   * Get error severity color
   */
  static getErrorColor(severity: string): string {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  /**
   * Get error icon based on type
   */
  static getErrorIcon(type: string): string {
    switch (type) {
      case 'validation': return 'ExclamationTriangleIcon'
      case 'network': return 'WifiIcon'
      case 'server': return 'ServerIcon'
      case 'authentication': return 'LockClosedIcon'
      case 'unknown': return 'QuestionMarkCircleIcon'
      default: return 'ExclamationTriangleIcon'
    }
  }

  /**
   * Capitalize first letter of string
   */
  private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * Format error for display
   */
  static formatError(error: any): ErrorDetails {
    return this.parseError(error)
  }
}

/**
 * Legacy AppError class for backward compatibility
 */
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Handle API errors with retry logic
 */
export function handleApiError(error: any): AppError {
  if (error.response) {
    // Server responded with error status
    const statusCode = error.response.status
    const message = error.response.data?.message || error.message || 'API request failed'
    return new AppError(message, statusCode, true)
  } else if (error.request) {
    // Network error
    return new AppError('Network error - please check your connection', 0, false)
  } else {
    // Other error
    return new AppError(error.message || 'An unexpected error occurred', 500, false)
  }
}

/**
 * Retry operation with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}