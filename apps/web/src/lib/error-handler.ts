/**
 * Comprehensive Error Handling System
 */

export interface ErrorContext {
  userId?: string
  sessionId?: string
  requestId?: string
  timestamp: Date
  userAgent?: string
  url?: string
  component?: string
  action?: string
  metadata?: Record<string, any>
}

export interface ErrorReport {
  id: string
  type: string
  message: string
  stack?: string
  context: ErrorContext
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  resolved: boolean
  resolvedAt?: Date
  resolution?: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorReports: Map<string, ErrorReport> = new Map()

  private constructor() {
    this.setupGlobalErrorHandlers()
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  private setupGlobalErrorHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError(new Error(event.message), {
          component: event.filename,
          url: event.filename,
          metadata: {
            line: event.lineno,
            column: event.colno,
            error: event.error
          }
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(
          event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          {
            metadata: {
              promise: true,
              reason: event.reason
            }
          }
        )
      })
    }
  }

  handleError(error: Error, context: Partial<ErrorContext> = {}): ErrorReport {
    const errorReport = this.createErrorReport(error, context)
    this.errorReports.set(errorReport.id, errorReport)
    this.logError(errorReport)
    return errorReport
  }

  private createErrorReport(error: Error, context: Partial<ErrorContext>): ErrorReport {
    const id = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const severity = this.determineSeverity(error)
    
    return {
      id,
      type: this.classifyError(error),
      message: error.message,
      stack: error.stack,
      context: {
        timestamp: new Date(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        ...context
      },
      severity,
      resolved: false
    }
  }

  private classifyError(error: Error): string {
    const message = error.message.toLowerCase()
    const name = error.name.toLowerCase()

    if (name.includes('network') || message.includes('fetch')) return 'NETWORK_ERROR'
    if (name.includes('timeout') || message.includes('timeout')) return 'TIMEOUT_ERROR'
    if (name.includes('validation') || message.includes('validation')) return 'VALIDATION_ERROR'
    if (name.includes('auth') || message.includes('unauthorized')) return 'AUTHENTICATION_ERROR'
    if (message.includes('forbidden') || message.includes('permission')) return 'AUTHORIZATION_ERROR'
    if (message.includes('rate limit') || message.includes('too many')) return 'RATE_LIMIT_ERROR'
    if (name.includes('syntax') || message.includes('parse')) return 'PARSING_ERROR'
    if (name.includes('quota') || message.includes('storage')) return 'STORAGE_ERROR'
    if (name.includes('type') || message.includes('undefined')) return 'RENDERING_ERROR'
    
    return 'UNKNOWN_ERROR'
  }

  private determineSeverity(error: Error): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const message = error.message.toLowerCase()
    
    if (message.includes('auth') || message.includes('storage')) return 'CRITICAL'
    if (message.includes('network') || message.includes('api') || message.includes('render')) return 'HIGH'
    if (message.includes('validation') || message.includes('timeout') || message.includes('rate')) return 'MEDIUM'
    
    return 'LOW'
  }

  private logError(errorReport: ErrorReport) {
    const logLevel = this.getLogLevel(errorReport.severity)
    const logData = {
      id: errorReport.id,
      type: errorReport.type,
      severity: errorReport.severity,
      message: errorReport.message,
      context: errorReport.context,
      timestamp: errorReport.context.timestamp
    }

    switch (logLevel) {
      case 'error':
        console.error('Error Report:', logData)
        break
      case 'warn':
        console.warn('Error Report:', logData)
        break
      case 'info':
        console.info('Error Report:', logData)
        break
      default:
        console.log('Error Report:', logData)
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(logData)
    }
  }

  private getLogLevel(severity: string): 'error' | 'warn' | 'info' | 'log' {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return 'error'
      case 'MEDIUM':
        return 'warn'
      case 'LOW':
        return 'info'
      default:
        return 'log'
    }
  }

  private async sendToLoggingService(logData: any) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      })
    } catch (error) {
      console.error('Failed to send error to logging service:', error)
    }
  }

  getErrorStats() {
    const errors = Array.from(this.errorReports.values())
    return {
      total: errors.length,
      resolved: errors.filter(e => e.resolved).length,
      unresolved: errors.filter(e => !e.resolved).length
    }
  }
}

export const errorHandler = ErrorHandler.getInstance()