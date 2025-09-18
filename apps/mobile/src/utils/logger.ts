import { Platform } from 'react-native'

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string
  level: string
  message: string
  data?: any
  platform: string
  userId?: string
  consciousnessLevel?: number
  quantumState?: string
}

class Logger {
  private logLevel: LogLevel
  private logs: LogEntry[] = []
  private maxLogs = 1000

  constructor() {
    this.logLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.INFO
  }

  private formatMessage(level: string, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      platform: Platform.OS,
    }
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console logging for development
    if (__DEV__) {
      const consoleMethod = entry.level === 'ERROR' ? 'error' :
                           entry.level === 'WARN' ? 'warn' :
                           entry.level === 'INFO' ? 'info' : 'log'
      
      console[consoleMethod](`[${entry.timestamp}] ${entry.level}: ${entry.message}`, entry.data || '')
    }
  }

  error(message: string, data?: any) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.addLog(this.formatMessage('ERROR', message, data))
    }
  }

  warn(message: string, data?: any) {
    if (this.logLevel >= LogLevel.WARN) {
      this.addLog(this.formatMessage('WARN', message, data))
    }
  }

  info(message: string, data?: any) {
    if (this.logLevel >= LogLevel.INFO) {
      this.addLog(this.formatMessage('INFO', message, data))
    }
  }

  debug(message: string, data?: any) {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.addLog(this.formatMessage('DEBUG', message, data))
    }
  }

  // Consciousness-aware logging
  logConsciousnessEvent(event: string, consciousnessLevel: number, data?: any) {
    const entry = this.formatMessage('INFO', `Consciousness Event: ${event}`, data)
    entry.consciousnessLevel = consciousnessLevel
    this.addLog(entry)
  }

  // Quantum security logging
  logQuantumEvent(event: string, quantumState: string, data?: any) {
    const entry = this.formatMessage('INFO', `Quantum Event: ${event}`, data)
    entry.quantumState = quantumState
    this.addLog(entry)
  }

  // User action logging
  logUserAction(action: string, userId?: string, data?: any) {
    const entry = this.formatMessage('INFO', `User Action: ${action}`, data)
    entry.userId = userId
    this.addLog(entry)
  }

  // Performance logging
  logPerformance(operation: string, duration: number, data?: any) {
    this.info(`Performance: ${operation} took ${duration}ms`, data)
  }

  // Error with context
  logError(error: Error, context?: string, userId?: string) {
    const entry = this.formatMessage('ERROR', `Error: ${error.message}`, {
      stack: error.stack,
      context,
    })
    entry.userId = userId
    this.addLog(entry)
  }

  // Get logs for debugging
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Export logs for analysis
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Set log level
  setLogLevel(level: LogLevel) {
    this.logLevel = level
  }

  // Get current log level
  getLogLevel(): LogLevel {
    return this.logLevel
  }
}

export const logger = new Logger()
