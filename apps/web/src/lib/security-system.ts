// 🚀 ENTERPRISE SECURITY SYSTEM
// Comprehensive security measures to protect against all known threats

import { createHash, randomBytes, createHmac } from 'crypto'

// 🚀 SECURITY INTERFACES
export interface SecurityConfig {
  maxLoginAttempts: number
  lockoutDuration: number
  sessionTimeout: number
  passwordMinLength: number
  requireSpecialChars: boolean
  enableRateLimiting: boolean
  enableCSRFProtection: boolean
  enableXSSProtection: boolean
  enableClickjackingProtection: boolean
  enableContentSecurityPolicy: boolean
}

export interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'suspicious_activity' | 'rate_limit_exceeded' | 'csrf_attack' | 'xss_attempt' | 'brute_force'
  severity: 'low' | 'medium' | 'high' | 'critical'
  ip: string
  userAgent: string
  timestamp: number
  details: any
  blocked: boolean
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests: boolean
  skipFailedRequests: boolean
}

// 🚀 DEFAULT SECURITY CONFIGURATION
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  passwordMinLength: 8,
  requireSpecialChars: true,
  enableRateLimiting: true,
  enableCSRFProtection: true,
  enableXSSProtection: true,
  enableClickjackingProtection: true,
  enableContentSecurityPolicy: true
}

// 🚀 SECURITY SYSTEM CLASS
export class EnterpriseSecuritySystem {
  private config: SecurityConfig
  private securityEvents: Map<string, SecurityEvent[]> = new Map()
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map()
  private blockedIPs: Set<string> = new Set()
  private suspiciousPatterns: RegExp[] = []

  constructor(config: SecurityConfig = DEFAULT_SECURITY_CONFIG) {
    this.config = config
    this.initializeSecurityPatterns()
  }

  // 🚀 INITIALIZE SECURITY PATTERNS
  private initializeSecurityPatterns() {
    this.suspiciousPatterns = [
      // SQL Injection patterns
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
      
      // XSS patterns
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      
      // Path traversal
      /\.\.\//g,
      /\.\.\\/g,
      
      // Command injection
      /[;&|`$()]/g,
      
      // LDAP injection
      /[()=*!&|]/g,
      
      // NoSQL injection
      /\$where/gi,
      /\$ne/gi,
      /\$gt/gi,
      /\$lt/gi,
      /\$regex/gi
    ]
  }

  // 🚀 RATE LIMITING
  public checkRateLimit(ip: string, endpoint: string): { allowed: boolean; remaining: number; resetTime: number } {
    const key = `${ip}:${endpoint}`
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 100

    const current = this.rateLimitStore.get(key)
    
    if (!current || now > current.resetTime) {
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      }
    }

    if (current.count >= maxRequests) {
      this.logSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        ip,
        userAgent: '',
        details: { endpoint, count: current.count },
        blocked: true
      })
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    current.count++
    return {
      allowed: true,
      remaining: maxRequests - current.count,
      resetTime: current.resetTime
    }
  }

  // 🚀 INPUT SANITIZATION
  public sanitizeInput(input: string): string {
    if (typeof input !== 'string') return ''
    
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '')
    
    // Remove control characters except newlines and tabs
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    
    // Check for suspicious patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(sanitized)) {
        this.logSecurityEvent({
          type: 'xss_attempt',
          severity: 'high',
          ip: 'unknown',
          userAgent: 'unknown',
          details: { input: sanitized, pattern: pattern.toString() },
          blocked: true
        })
        throw new Error('Suspicious input detected')
      }
    }
    
    // HTML encode special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
    
    return sanitized
  }

  // 🚀 PASSWORD VALIDATION
  public validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`)
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (this.config.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    // Check against common passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ]
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a more secure password')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // 🚀 CSRF TOKEN GENERATION
  public generateCSRFToken(): string {
    return randomBytes(32).toString('hex')
  }

  // 🚀 CSRF TOKEN VALIDATION
  public validateCSRFToken(token: string, sessionToken: string): boolean {
    if (!token || !sessionToken) return false
    return token === sessionToken
  }

  // 🚀 SESSION SECURITY
  public generateSecureSessionId(): string {
    return randomBytes(32).toString('hex')
  }

  public hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const actualSalt = salt || randomBytes(32).toString('hex')
    const hash = createHmac('sha256', actualSalt).update(password).digest('hex')
    return { hash, salt: actualSalt }
  }

  public verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashPassword(password, salt)
    return computedHash === hash
  }

  // 🚀 IP BLOCKING
  public blockIP(ip: string, reason: string, duration: number = 24 * 60 * 60 * 1000) {
    this.blockedIPs.add(ip)
    
    this.logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'high',
      ip,
      userAgent: '',
      details: { reason, duration },
      blocked: true
    })
    
    // Auto-unblock after duration
    setTimeout(() => {
      this.blockedIPs.delete(ip)
    }, duration)
  }

  public isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  // 🚀 SECURITY HEADERS
  public getSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    
    if (this.config.enableXSSProtection) {
      headers['X-XSS-Protection'] = '1; mode=block'
    }
    
    if (this.config.enableClickjackingProtection) {
      headers['X-Frame-Options'] = 'DENY'
    }
    
    headers['X-Content-Type-Options'] = 'nosniff'
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    
    if (this.config.enableContentSecurityPolicy) {
      headers['Content-Security-Policy'] = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.askyacham.com",
        "frame-src 'self' https://accounts.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    }
    
    return headers
  }

  // 🚀 SECURITY EVENT LOGGING
  public logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      ...event
    }
    
    const ip = event.ip
    if (!this.securityEvents.has(ip)) {
      this.securityEvents.set(ip, [])
    }
    
    this.securityEvents.get(ip)!.push(securityEvent)
    
    // Keep only last 100 events per IP
    const events = this.securityEvents.get(ip)!
    if (events.length > 100) {
      events.splice(0, events.length - 100)
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚨 Security Event: ${event.type} - ${event.severity}`, securityEvent)
    }
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToSecurityMonitoring(securityEvent)
    }
  }

  // 🚀 GET SECURITY EVENTS
  public getSecurityEvents(ip?: string): SecurityEvent[] {
    if (ip) {
      return this.securityEvents.get(ip) || []
    }
    
    const allEvents: SecurityEvent[] = []
    for (const events of this.securityEvents.values()) {
      allEvents.push(...events)
    }
    
    return allEvents.sort((a, b) => b.timestamp - a.timestamp)
  }

  // 🚀 BRUTE FORCE DETECTION
  public checkBruteForce(ip: string, username: string): boolean {
    const events = this.getSecurityEvents(ip)
    const recentEvents = events.filter(e => 
      e.type === 'login_attempt' && 
      Date.now() - e.timestamp < 15 * 60 * 1000 // Last 15 minutes
    )
    
    if (recentEvents.length >= this.config.maxLoginAttempts) {
      this.blockIP(ip, 'Brute force attack detected', this.config.lockoutDuration)
      return true
    }
    
    return false
  }

  // 🚀 SECURITY SCAN
  public performSecurityScan(): {
    vulnerabilities: string[]
    recommendations: string[]
    score: number
  } {
    const vulnerabilities: string[] = []
    const recommendations: string[] = []
    let score = 100
    
    // Check configuration
    if (!this.config.enableRateLimiting) {
      vulnerabilities.push('Rate limiting is disabled')
      recommendations.push('Enable rate limiting to prevent abuse')
      score -= 20
    }
    
    if (!this.config.enableCSRFProtection) {
      vulnerabilities.push('CSRF protection is disabled')
      recommendations.push('Enable CSRF protection')
      score -= 15
    }
    
    if (!this.config.enableXSSProtection) {
      vulnerabilities.push('XSS protection is disabled')
      recommendations.push('Enable XSS protection')
      score -= 15
    }
    
    if (this.config.passwordMinLength < 8) {
      vulnerabilities.push('Password minimum length is too short')
      recommendations.push('Increase password minimum length to 8+ characters')
      score -= 10
    }
    
    // Check for blocked IPs
    if (this.blockedIPs.size > 0) {
      recommendations.push(`Monitor ${this.blockedIPs.size} blocked IP addresses`)
    }
    
    // Check security events
    const recentEvents = this.getSecurityEvents().filter(e => 
      Date.now() - e.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    )
    
    if (recentEvents.length > 100) {
      vulnerabilities.push('High number of security events detected')
      recommendations.push('Review and investigate security events')
      score -= 10
    }
    
    return {
      vulnerabilities,
      recommendations,
      score: Math.max(0, score)
    }
  }

  // 🚀 UTILITY FUNCTIONS
  private generateEventId(): string {
    return `evt_${Date.now()}_${randomBytes(8).toString('hex')}`
  }

  private async sendToSecurityMonitoring(event: SecurityEvent) {
    // In production, integrate with security monitoring services like:
    // - AWS CloudWatch
    // - Datadog
    // - New Relic
    // - Custom SIEM system
    
    try {
      // Example: Send to external monitoring service
      // await fetch('https://monitoring.askyacham.com/security-events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // })
    } catch (error) {
      console.error('Failed to send security event to monitoring:', error)
    }
  }

  // 🚀 CLEANUP OLD DATA
  public cleanup() {
    const now = Date.now()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
    
    // Clean up old security events
    for (const [ip, events] of this.securityEvents.entries()) {
      const recentEvents = events.filter(e => now - e.timestamp < maxAge)
      if (recentEvents.length === 0) {
        this.securityEvents.delete(ip)
      } else {
        this.securityEvents.set(ip, recentEvents)
      }
    }
    
    // Clean up old rate limit data
    for (const [key, data] of this.rateLimitStore.entries()) {
      if (now > data.resetTime) {
        this.rateLimitStore.delete(key)
      }
    }
  }
}

// 🚀 GLOBAL SECURITY INSTANCE
export const securitySystem = new EnterpriseSecuritySystem()

// 🚀 SECURITY MIDDLEWARE
export function createSecurityMiddleware() {
  return (req: any, res: any, next: any) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown'
    
    // Check if IP is blocked
    if (securitySystem.isIPBlocked(ip)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }
    
    // Check rate limit
    const rateLimit = securitySystem.checkRateLimit(ip, req.path)
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests'
      })
    }
    
    // Add security headers
    const headers = securitySystem.getSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value)
    })
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', 100)
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining)
    res.setHeader('X-RateLimit-Reset', rateLimit.resetTime)
    
    next()
  }
}

// 🚀 EXPORT TYPES
export type { SecurityConfig, SecurityEvent, RateLimitConfig }
