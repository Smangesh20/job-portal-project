'use client'

interface LogLevel {
  ERROR: 'error'
  WARN: 'warn'
  INFO: 'info'
  DEBUG: 'debug'
  TRACE: 'trace'
}

interface LogEntry {
  timestamp: string
  level: string
  message: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  requestId?: string
  stack?: string
  tags?: string[]
}

interface LoggerConfig {
  level: keyof LogLevel
  enableConsole: boolean
  enableStorage: boolean
  enableRemote: boolean
  maxStorageEntries: number
  remoteEndpoint?: string
}

class EnterpriseLogger {
  private config: LoggerConfig
  private logs: LogEntry[] = []
  private isInitialized = false

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: 'INFO',
      enableConsole: true,
      enableStorage: true,
      enableRemote: false,
      maxStorageEntries: 1000,
      ...config
    }
    this.initialize()
  }

  private initialize() {
    if (typeof window === 'undefined') return

    try {
      // Load existing logs from localStorage
      if (this.config.enableStorage) {
        const stored = localStorage.getItem('enterprise_logs')
        if (stored) {
          this.logs = JSON.parse(stored)
        }
      }

      // Set up global error handlers
      this.setupGlobalErrorHandlers()
      
      this.isInitialized = true
      this.info('Enterprise Logger initialized', { config: this.config })
    } catch (error) {
      console.error('Failed to initialize Enterprise Logger:', error)
    }
  }

  private setupGlobalErrorHandlers() {
    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.error('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      })
    })

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      })
    })

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        this.info('Page Load Performance', {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
          firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
        })
      })
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR']
    const currentLevelIndex = levels.indexOf(this.config.level)
    const messageLevelIndex = levels.indexOf(level.toUpperCase())
    return messageLevelIndex >= currentLevelIndex
  }

  private createLogEntry(level: string, message: string, context?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      context,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      requestId: this.generateRequestId(),
      tags: this.extractTags(message)
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user).id : undefined
    } catch {
      return undefined
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private extractTags(message: string): string[] {
    const tags: string[] = []
    if (message.toLowerCase().includes('error')) tags.push('error')
    if (message.toLowerCase().includes('warning')) tags.push('warning')
    if (message.toLowerCase().includes('performance')) tags.push('performance')
    if (message.toLowerCase().includes('security')) tags.push('security')
    if (message.toLowerCase().includes('user')) tags.push('user-action')
    if (message.toLowerCase().includes('api')) tags.push('api')
    return tags
  }

  private storeLog(entry: LogEntry) {
    if (!this.config.enableStorage) return

    try {
      this.logs.push(entry)
      
      // Keep only the most recent logs
      if (this.logs.length > this.config.maxStorageEntries) {
        this.logs = this.logs.slice(-this.config.maxStorageEntries)
      }

      localStorage.setItem('enterprise_logs', JSON.stringify(this.logs))
    } catch (error) {
      console.error('Failed to store log entry:', error)
    }
  }

  private sendToRemote(entry: LogEntry) {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return

    try {
      fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      }).catch(error => {
        console.error('Failed to send log to remote endpoint:', error)
      })
    } catch (error) {
      console.error('Failed to send log to remote endpoint:', error)
    }
  }

  private log(level: string, message: string, context?: Record<string, any>) {
    if (!this.shouldLog(level)) return

    const entry = this.createLogEntry(level, message, context)

    // Console output
    if (this.config.enableConsole) {
      const consoleMethod = level.toLowerCase() as keyof Console
      if (consoleMethod in console) {
        (console as any)[consoleMethod](`[${entry.timestamp}] ${entry.level}: ${message}`, context)
      } else {
        console.log(`[${entry.timestamp}] ${entry.level}: ${message}`, context)
      }
    }

    // Store locally
    this.storeLog(entry)

    // Send to remote
    this.sendToRemote(entry)
  }

  // Public logging methods
  error(message: string, context?: Record<string, any>) {
    this.log('ERROR', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('WARN', message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log('INFO', message, context)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('DEBUG', message, context)
  }

  trace(message: string, context?: Record<string, any>) {
    this.log('TRACE', message, context)
  }

  // Utility methods
  getLogs(level?: string, limit?: number): LogEntry[] {
    let filteredLogs = this.logs

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level.toUpperCase())
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit)
    }

    return filteredLogs
  }

  clearLogs() {
    this.logs = []
    if (this.config.enableStorage) {
      localStorage.removeItem('enterprise_logs')
    }
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'userId', 'sessionId', 'requestId', 'tags']
      const csvRows = [headers.join(',')]
      
      this.logs.forEach(log => {
        const row = [
          log.timestamp,
          log.level,
          `"${log.message.replace(/"/g, '""')}"`,
          log.userId || '',
          log.sessionId || '',
          log.requestId || '',
          log.tags?.join(';') || ''
        ]
        csvRows.push(row.join(','))
      })
      
      return csvRows.join('\n')
    }

    return JSON.stringify(this.logs, null, 2)
  }

  // Performance monitoring
  time(label: string) {
    const start = performance.now()
    return {
      end: () => {
        const duration = performance.now() - start
        this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` })
        return duration
      }
    }
  }

  // User action tracking
  trackUserAction(action: string, context?: Record<string, any>) {
    this.info(`User Action: ${action}`, { ...context, type: 'user-action' })
  }

  // API call tracking
  trackAPICall(method: string, url: string, status: number, duration: number, context?: Record<string, any>) {
    const level = status >= 400 ? 'ERROR' : status >= 300 ? 'WARN' : 'INFO'
    this.log(level, `API Call: ${method} ${url}`, {
      ...context,
      status,
      duration: `${duration}ms`,
      type: 'api-call'
    })
  }
}

// Create singleton instance
export const enterpriseLogger = new EnterpriseLogger({
  level: process.env.NODE_ENV === 'production' ? 'INFO' : 'DEBUG',
  enableConsole: true,
  enableStorage: true,
  enableRemote: false,
  maxStorageEntries: 1000
})

// Export types and class
export type { LogEntry, LoggerConfig }
export { EnterpriseLogger }
