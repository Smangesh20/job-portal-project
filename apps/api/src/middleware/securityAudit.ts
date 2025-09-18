import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger'
import { performanceUtils } from '@/utils/performance'
import { metrics } from '@/utils/metrics'
import crypto from 'crypto'

// Security audit configuration
interface SecurityAuditConfig {
  enabled: boolean
  logLevel: 'low' | 'medium' | 'high' | 'critical'
  blockSuspiciousRequests: boolean
  rateLimitThreshold: number
  suspiciousPatterns: RegExp[]
  allowedUserAgents: RegExp[]
  blockedIPs: string[]
  trustedIPs: string[]
  auditRetentionDays: number
}

// Security event types
type SecurityEventType = 
  | 'suspicious_request'
  | 'rate_limit_exceeded'
  | 'invalid_user_agent'
  | 'blocked_ip_access'
  | 'sql_injection_attempt'
  | 'xss_attempt'
  | 'path_traversal_attempt'
  | 'file_upload_abuse'
  | 'authentication_failure'
  | 'authorization_violation'
  | 'data_breach_attempt'
  | 'ddos_attack'
  | 'bot_detection'
  | 'unusual_behavior'

// Security event interface
interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  ip: string
  userAgent: string
  userId?: string
  sessionId?: string
  requestId: string
  method: string
  path: string
  query?: string
  headers: Record<string, string>
  body?: any
  responseCode?: number
  description: string
  riskScore: number
  mitigation?: string
  blocked: boolean
  metadata?: Record<string, any>
}

// Security audit class
export class SecurityAuditor {
  private static instance: SecurityAuditor
  private config: SecurityAuditConfig
  private events: SecurityEvent[] = []
  private suspiciousIPs: Map<string, number> = new Map()
  private blockedIPs: Set<string> = new Set()
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map()

  private constructor(config: SecurityAuditConfig) {
    this.config = config
    this.loadBlockedIPs()
    this.startCleanupInterval()
  }

  static getInstance(config?: SecurityAuditConfig): SecurityAuditor {
    if (!SecurityAuditor.instance) {
      const defaultConfig: SecurityAuditConfig = {
        enabled: process.env.SECURITY_AUDIT_ENABLED !== 'false',
        logLevel: (process.env.SECURITY_AUDIT_LEVEL as any) || 'medium',
        blockSuspiciousRequests: process.env.BLOCK_SUSPICIOUS_REQUESTS === 'true',
        rateLimitThreshold: parseInt(process.env.SECURITY_RATE_LIMIT_THRESHOLD || '100'),
        suspiciousPatterns: [
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
          /<script[^>]*>.*?<\/script>/gi,
          /javascript:/gi,
          /vbscript:/gi,
          /onload\s*=/gi,
          /onerror\s*=/gi,
          /\.\.\//g,
          /\.\.\\/g,
          /%2e%2e%2f/gi,
          /%2e%2e%5c/gi
        ],
        allowedUserAgents: [
          /^Mozilla\/\d+\.\d+/,
          /^curl\/\d+\.\d+/,
          /^PostmanRuntime\/\d+\.\d+/,
          /^insomnia\/\d+\.\d+/
        ],
        blockedIPs: [],
        trustedIPs: [],
        auditRetentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '90')
      }
      
      SecurityAuditor.instance = new SecurityAuditor(config || defaultConfig)
    }
    return SecurityAuditor.instance
  }

  /**
   * Audit incoming request for security threats
   */
  auditRequest(req: Request, res: Response, next: NextFunction): void {
    if (!this.config.enabled) {
      return next()
    }

    const startTime = Date.now()
    const requestId = req.headers['x-request-id'] as string || crypto.randomUUID()
    const ip = this.getClientIP(req)
    const userAgent = req.headers['user-agent'] || ''

    // Add request ID to request object
    req.securityAudit = {
      requestId,
      startTime,
      ip,
      userAgent
    }

    // Check if IP is blocked
    if (this.blockedIPs.has(ip)) {
      this.logSecurityEvent({
        type: 'blocked_ip_access',
        severity: 'high',
        ip,
        userAgent,
        requestId,
        method: req.method,
        path: req.path,
        query: req.query ? JSON.stringify(req.query) : undefined,
        headers: this.sanitizeHeaders(req.headers),
        description: 'Blocked IP attempted to access the system',
        riskScore: 100,
        blocked: true
      })
      
      return res.status(403).json({
        error: 'Access denied',
        code: 'BLOCKED_IP'
      })
    }

    // Check rate limiting
    if (this.isRateLimited(ip)) {
      this.logSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        ip,
        userAgent,
        requestId,
        method: req.method,
        path: req.path,
        description: 'Rate limit exceeded for IP address',
        riskScore: 70,
        blocked: true
      })
      
      return res.status(429).json({
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED'
      })
    }

    // Check user agent
    if (!this.isValidUserAgent(userAgent)) {
      this.logSecurityEvent({
        type: 'invalid_user_agent',
        severity: 'medium',
        ip,
        userAgent,
        requestId,
        method: req.method,
        path: req.path,
        description: 'Invalid or suspicious user agent detected',
        riskScore: 60,
        blocked: this.config.blockSuspiciousRequests
      })
      
      if (this.config.blockSuspiciousRequests) {
        return res.status(400).json({
          error: 'Invalid user agent',
          code: 'INVALID_USER_AGENT'
        })
      }
    }

    // Check for suspicious patterns in request
    const suspiciousPatterns = this.detectSuspiciousPatterns(req)
    if (suspiciousPatterns.length > 0) {
      const riskScore = this.calculateRiskScore(suspiciousPatterns)
      const severity = this.getSeverityFromRiskScore(riskScore)
      
      this.logSecurityEvent({
        type: this.getEventTypeFromPatterns(suspiciousPatterns),
        severity,
        ip,
        userAgent,
        requestId,
        method: req.method,
        path: req.path,
        query: req.query ? JSON.stringify(req.query) : undefined,
        headers: this.sanitizeHeaders(req.headers),
        body: this.sanitizeBody(req.body),
        description: `Suspicious patterns detected: ${suspiciousPatterns.join(', ')}`,
        riskScore,
        blocked: this.config.blockSuspiciousRequests && severity === 'critical'
      })
      
      if (this.config.blockSuspiciousRequests && severity === 'critical') {
        return res.status(400).json({
          error: 'Suspicious request detected',
          code: 'SUSPICIOUS_REQUEST'
        })
      }
    }

    // Track request for rate limiting
    this.trackRequest(ip)

    // Override response end to capture response details
    const originalEnd = res.end
    res.end = function(chunk?: any, encoding?: any) {
      const duration = Date.now() - startTime
      
      // Log performance metrics
      metrics.http.requests(req.method, req.path, res.statusCode, duration)
      
      // Check for suspicious response patterns
      if (res.statusCode >= 500) {
        SecurityAuditor.getInstance().logSecurityEvent({
          type: 'ddos_attack',
          severity: 'medium',
          ip,
          userAgent,
          requestId,
          method: req.method,
          path: req.path,
          responseCode: res.statusCode,
          description: 'High error rate detected',
          riskScore: 50,
          blocked: false
        })
      }
      
      return originalEnd.call(this, chunk, encoding)
    }

    next()
  }

  /**
   * Log a security event
   */
  logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }

    // Add to events array
    this.events.push(securityEvent)

    // Update suspicious IP tracking
    if (event.severity === 'high' || event.severity === 'critical') {
      const currentCount = this.suspiciousIPs.get(event.ip) || 0
      this.suspiciousIPs.set(event.ip, currentCount + 1)
      
      // Block IP if too many suspicious activities
      if (currentCount + 1 >= 5) {
        this.blockedIPs.add(event.ip)
        logger.warn(`IP ${event.ip} has been blocked due to suspicious activity`)
      }
    }

    // Log based on severity
    const logMessage = `Security Event: ${event.type} - ${event.description} (IP: ${event.ip}, Risk: ${event.riskScore})`
    
    switch (event.severity) {
      case 'critical':
        logger.error(logMessage, { securityEvent })
        break
      case 'high':
        logger.warn(logMessage, { securityEvent })
        break
      case 'medium':
        logger.info(logMessage, { securityEvent })
        break
      case 'low':
        logger.debug(logMessage, { securityEvent })
        break
    }

    // Send alert for critical events
    if (event.severity === 'critical') {
      this.sendSecurityAlert(securityEvent)
    }
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown'
    )
  }

  /**
   * Check if request is rate limited
   */
  private isRateLimited(ip: string): boolean {
    const now = Date.now()
    const limit = this.rateLimits.get(ip)
    
    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(ip, {
        count: 1,
        resetTime: now + 60000 // 1 minute window
      })
      return false
    }
    
    if (limit.count >= this.config.rateLimitThreshold) {
      return true
    }
    
    limit.count++
    return false
  }

  /**
   * Track request for rate limiting
   */
  private trackRequest(ip: string): void {
    const now = Date.now()
    const limit = this.rateLimits.get(ip)
    
    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(ip, {
        count: 1,
        resetTime: now + 60000 // 1 minute window
      })
    } else {
      limit.count++
    }
  }

  /**
   * Check if user agent is valid
   */
  private isValidUserAgent(userAgent: string): boolean {
    if (!userAgent) return false
    
    return this.config.allowedUserAgents.some(pattern => pattern.test(userAgent))
  }

  /**
   * Detect suspicious patterns in request
   */
  private detectSuspiciousPatterns(req: Request): string[] {
    const patterns: string[] = []
    const requestString = JSON.stringify({
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query
    })

    for (const pattern of this.config.suspiciousPatterns) {
      if (pattern.test(requestString)) {
        patterns.push(pattern.source)
      }
    }

    return patterns
  }

  /**
   * Calculate risk score based on detected patterns
   */
  private calculateRiskScore(patterns: string[]): number {
    let score = 0
    
    for (const pattern of patterns) {
      if (pattern.includes('SELECT') || pattern.includes('INSERT') || pattern.includes('UPDATE')) {
        score += 40 // SQL injection
      } else if (pattern.includes('script') || pattern.includes('javascript')) {
        score += 35 // XSS
      } else if (pattern.includes('..')) {
        score += 30 // Path traversal
      } else {
        score += 20 // Other suspicious patterns
      }
    }
    
    return Math.min(score, 100)
  }

  /**
   * Get severity from risk score
   */
  private getSeverityFromRiskScore(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical'
    if (riskScore >= 60) return 'high'
    if (riskScore >= 40) return 'medium'
    return 'low'
  }

  /**
   * Get event type from detected patterns
   */
  private getEventTypeFromPatterns(patterns: string[]): SecurityEventType {
    for (const pattern of patterns) {
      if (pattern.includes('SELECT') || pattern.includes('INSERT')) {
        return 'sql_injection_attempt'
      } else if (pattern.includes('script') || pattern.includes('javascript')) {
        return 'xss_attempt'
      } else if (pattern.includes('..')) {
        return 'path_traversal_attempt'
      }
    }
    return 'suspicious_request'
  }

  /**
   * Sanitize headers for logging
   */
  private sanitizeHeaders(headers: any): Record<string, string> {
    const sanitized: Record<string, string> = {}
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token']
    
    for (const [key, value] of Object.entries(headers)) {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = String(value)
      }
    }
    
    return sanitized
  }

  /**
   * Sanitize request body for logging
   */
  private sanitizeBody(body: any): any {
    if (!body) return body
    
    const sanitized = { ...body }
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'ssn', 'creditCard']
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    }
    
    return sanitized
  }

  /**
   * Load blocked IPs from configuration
   */
  private loadBlockedIPs(): void {
    for (const ip of this.config.blockedIPs) {
      this.blockedIPs.add(ip)
    }
  }

  /**
   * Send security alert for critical events
   */
  private async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    try {
      // This would typically send alerts via email, Slack, PagerDuty, etc.
      logger.critical(`SECURITY ALERT: ${event.type} detected from IP ${event.ip}`, {
        event,
        timestamp: event.timestamp,
        riskScore: event.riskScore
      })
      
      // Increment security alert metric
      metrics.system.securityAlerts(event.type, event.severity)
    } catch (error) {
      logger.error('Failed to send security alert:', error)
    }
  }

  /**
   * Start cleanup interval for old events
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupOldEvents()
    }, 24 * 60 * 60 * 1000) // Daily cleanup
  }

  /**
   * Clean up old security events
   */
  private cleanupOldEvents(): void {
    const cutoffTime = new Date()
    cutoffTime.setDate(cutoffTime.getDate() - this.config.auditRetentionDays)
    
    this.events = this.events.filter(event => 
      new Date(event.timestamp) > cutoffTime
    )
    
    logger.info(`Cleaned up old security events. Current count: ${this.events.length}`)
  }

  /**
   * Get security statistics
   */
  getSecurityStats(): {
    totalEvents: number
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
    blockedIPs: number
    suspiciousIPs: number
    topThreats: Array<{ type: string; count: number }>
  } {
    const eventsByType = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const eventsBySeverity = this.events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topThreats = Object.entries(eventsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }))

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      topThreats
    }
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  /**
   * Block an IP address
   */
  blockIP(ip: string, reason: string): void {
    this.blockedIPs.add(ip)
    logger.warn(`IP ${ip} has been blocked: ${reason}`)
    
    this.logSecurityEvent({
      type: 'blocked_ip_access',
      severity: 'high',
      ip,
      userAgent: 'System',
      requestId: crypto.randomUUID(),
      method: 'SYSTEM',
      path: '/admin/block-ip',
      description: `IP blocked by admin: ${reason}`,
      riskScore: 100,
      blocked: true
    })
  }

  /**
   * Unblock an IP address
   */
  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip)
    this.suspiciousIPs.delete(ip)
    logger.info(`IP ${ip} has been unblocked`)
  }
}

// Security audit middleware
export const securityAuditMiddleware = (config?: SecurityAuditConfig) => {
  const auditor = SecurityAuditor.getInstance(config)
  return auditor.auditRequest.bind(auditor)
}

// Export security audit utilities
export {
  SecurityAuditor,
  securityAuditMiddleware
}

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      securityAudit?: {
        requestId: string
        startTime: number
        ip: string
        userAgent: string
      }
    }
  }
}
