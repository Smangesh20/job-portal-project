import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { logger } from '@/utils/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Security middleware configuration
export const securityConfig = {
  // Helmet configuration for security headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health' || req.path === '/api/health';
    }
  },

  // Slow down configuration
  slowDown: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per windowMs without delay
    delayMs: 500, // add 500ms delay per request after delayAfter
    maxDelayMs: 20000, // max delay of 20 seconds
  },

  // Security headers
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  }
};

// Comprehensive security middleware
export class SecurityHardening {
  private suspiciousIPs: Map<string, { count: number; lastSeen: Date }> = new Map();
  private blockedIPs: Set<string> = new Set();

  /**
   * Apply all security middleware
   */
  public applySecurityMiddleware(app: any): void {
    // Helmet for security headers
    app.use(helmet(securityConfig.helmet));

    // Rate limiting
    app.use(rateLimit(securityConfig.rateLimit));

    // Slow down
    app.use(slowDown(securityConfig.slowDown));

    // Custom security headers
    app.use(this.addSecurityHeaders.bind(this));

    // IP filtering and blocking
    app.use(this.ipFiltering.bind(this));

    // Request sanitization
    app.use(this.requestSanitization.bind(this));

    // SQL injection protection
    app.use(this.sqlInjectionProtection.bind(this));

    // XSS protection
    app.use(this.xssProtection.bind(this));

    // CSRF protection
    app.use(this.csrfProtection.bind(this));

    // Request size limiting
    app.use(this.requestSizeLimit.bind(this));

    // Security logging
    app.use(this.securityLogging.bind(this));
  }

  /**
   * Add custom security headers
   */
  private addSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
    Object.entries(securityConfig.securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    next();
  }

  /**
   * IP filtering and blocking
   */
  private ipFiltering(req: Request, res: Response, next: NextFunction): void {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Check if IP is blocked
    if (this.blockedIPs.has(ip)) {
      logger.warn(`Blocked IP attempted access: ${ip}`);
      res.status(403).json({
        success: false,
        error: 'Access denied',
        code: 'IP_BLOCKED'
      });
      return;
    }

    // Track suspicious activity
    this.trackSuspiciousActivity(ip, req);
    
    next();
  }

  /**
   * Track suspicious activity
   */
  private trackSuspiciousActivity(ip: string, req: Request): void {
    const now = new Date();
    const suspicious = this.suspiciousIPs.get(ip);

    if (suspicious) {
      const timeDiff = now.getTime() - suspicious.lastSeen.getTime();
      
      // Reset count if more than 1 hour has passed
      if (timeDiff > 60 * 60 * 1000) {
        suspicious.count = 1;
        suspicious.lastSeen = now;
      } else {
        suspicious.count++;
        suspicious.lastSeen = now;
      }

      // Block IP if suspicious activity detected
      if (suspicious.count > 100) {
        this.blockedIPs.add(ip);
        logger.error(`IP blocked due to suspicious activity: ${ip}`);
        
        // Log security event
        this.logSecurityEvent('IP_BLOCKED', ip, req, {
          reason: 'Suspicious activity',
          count: suspicious.count
        });
      }
    } else {
      this.suspiciousIPs.set(ip, { count: 1, lastSeen: now });
    }
  }

  /**
   * Request sanitization
   */
  private requestSanitization(req: Request, res: Response, next: NextFunction): void {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = this.sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = this.sanitizeObject(req.params);
    }

    next();
  }

  /**
   * Sanitize object recursively
   */
  private sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = this.sanitizeString(key);
      sanitized[sanitizedKey] = this.sanitizeObject(value);
    }

    return sanitized;
  }

  /**
   * Sanitize string
   */
  private sanitizeString(str: any): string {
    if (typeof str !== 'string') {
      return str;
    }

    return str
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[;]/g, '') // Remove semicolons
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * SQL injection protection
   */
  private sqlInjectionProtection(req: Request, res: Response, next: NextFunction): void {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(;|\-\-|\/\*|\*\/)/g,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
      /(\b(OR|AND)\s+'.*'\s*=\s*'.*')/gi
    ];

    const checkForSQLInjection = (obj: any): boolean => {
      if (typeof obj === 'string') {
        return sqlPatterns.some(pattern => pattern.test(obj));
      }

      if (typeof obj === 'object' && obj !== null) {
        return Object.values(obj).some(value => checkForSQLInjection(value));
      }

      return false;
    };

    if (checkForSQLInjection(req.body) || checkForSQLInjection(req.query) || checkForSQLInjection(req.params)) {
      logger.warn(`SQL injection attempt detected from IP: ${req.ip}`);
      
      this.logSecurityEvent('SQL_INJECTION_ATTEMPT', req.ip || 'unknown', req, {
        body: req.body,
        query: req.query,
        params: req.params
      });

      res.status(400).json({
        success: false,
        error: 'Invalid request format',
        code: 'INVALID_REQUEST'
      });
      return;
    }

    next();
  }

  /**
   * XSS protection
   */
  private xssProtection(req: Request, res: Response, next: NextFunction): void {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^>]*>/gi,
      /<object\b[^>]*>/gi,
      /<embed\b[^>]*>/gi,
      /<link\b[^>]*>/gi,
      /<meta\b[^>]*>/gi
    ];

    const checkForXSS = (obj: any): boolean => {
      if (typeof obj === 'string') {
        return xssPatterns.some(pattern => pattern.test(obj));
      }

      if (typeof obj === 'object' && obj !== null) {
        return Object.values(obj).some(value => checkForXSS(value));
      }

      return false;
    };

    if (checkForXSS(req.body) || checkForXSS(req.query) || checkForXSS(req.params)) {
      logger.warn(`XSS attempt detected from IP: ${req.ip}`);
      
      this.logSecurityEvent('XSS_ATTEMPT', req.ip || 'unknown', req, {
        body: req.body,
        query: req.query,
        params: req.params
      });

      res.status(400).json({
        success: false,
        error: 'Invalid request format',
        code: 'INVALID_REQUEST'
      });
      return;
    }

    next();
  }

  /**
   * CSRF protection
   */
  private csrfProtection(req: Request, res: Response, next: NextFunction): void {
    // Skip CSRF check for GET requests and health checks
    if (req.method === 'GET' || req.path === '/health' || req.path === '/api/health') {
      next();
      return;
    }

    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionToken = req.session?.csrfToken;

    if (!token || !sessionToken || token !== sessionToken) {
      logger.warn(`CSRF token mismatch from IP: ${req.ip}`);
      
      this.logSecurityEvent('CSRF_ATTEMPT', req.ip || 'unknown', req, {
        providedToken: token,
        expectedToken: sessionToken
      });

      res.status(403).json({
        success: false,
        error: 'CSRF token mismatch',
        code: 'CSRF_ERROR'
      });
      return;
    }

    next();
  }

  /**
   * Request size limiting
   */
  private requestSizeLimit(req: Request, res: Response, next: NextFunction): void {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (contentLength > maxSize) {
      logger.warn(`Request too large from IP: ${req.ip}, size: ${contentLength}`);
      
      res.status(413).json({
        success: false,
        error: 'Request too large',
        code: 'REQUEST_TOO_LARGE'
      });
      return;
    }

    next();
  }

  /**
   * Security logging
   */
  private securityLogging(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Log suspicious patterns
      if (res.statusCode >= 400) {
        this.logSecurityEvent('HTTP_ERROR', ip, req, {
          statusCode: res.statusCode,
          duration,
          userAgent: req.get('User-Agent'),
          referer: req.get('Referer')
        });
      }

      // Log slow requests
      if (duration > 5000) {
        logger.warn(`Slow request detected: ${req.method} ${req.originalUrl} - ${duration}ms from IP: ${ip}`);
      }
    });

    next();
  }

  /**
   * Log security event to database
   */
  private async logSecurityEvent(eventType: string, ip: string, req: Request, metadata?: any): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          eventType,
          severity: this.getSeverityFromEventType(eventType),
          description: `Security event: ${eventType}`,
          ipAddress: ip,
          userAgent: req.get('User-Agent') || '',
          deviceFingerprint: req.get('X-Device-Fingerprint') || '',
          metadata: {
            ...metadata,
            url: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      logger.error('Failed to log security event:', error);
    }
  }

  /**
   * Get severity from event type
   */
  private getSeverityFromEventType(eventType: string): string {
    const severityMap: Record<string, string> = {
      'IP_BLOCKED': 'HIGH',
      'SQL_INJECTION_ATTEMPT': 'HIGH',
      'XSS_ATTEMPT': 'HIGH',
      'CSRF_ATTEMPT': 'MEDIUM',
      'HTTP_ERROR': 'LOW',
      'SUSPICIOUS_ACTIVITY': 'MEDIUM'
    };

    return severityMap[eventType] || 'LOW';
  }

  /**
   * Generate CSRF token
   */
  public generateCSRFToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  /**
   * Get security statistics
   */
  public getSecurityStats(): any {
    return {
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      totalRequests: this.suspiciousIPs.size
    };
  }

  /**
   * Clear blocked IPs (admin function)
   */
  public clearBlockedIPs(): void {
    this.blockedIPs.clear();
    logger.info('All blocked IPs cleared');
  }

  /**
   * Unblock specific IP (admin function)
   */
  public unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    this.suspiciousIPs.delete(ip);
    logger.info(`IP unblocked: ${ip}`);
  }
}

// Create singleton instance
export const securityHardening = new SecurityHardening();

// Export middleware functions
export const applySecurityMiddleware = securityHardening.applySecurityMiddleware.bind(securityHardening);
export const generateCSRFToken = securityHardening.generateCSRFToken.bind(securityHardening);
export const getSecurityStats = securityHardening.getSecurityStats.bind(securityHardening);
export const clearBlockedIPs = securityHardening.clearBlockedIPs.bind(securityHardening);
export const unblockIP = securityHardening.unblockIP.bind(securityHardening);

// Additional security utilities
export const securityUtils = {
  /**
   * Validate file upload security
   */
  validateFileUpload: (file: any): { valid: boolean; error?: string } => {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File too large' };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: 'File type not allowed' };
    }

    // Check for malicious file extensions
    const maliciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const hasMaliciousExtension = maliciousExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );

    if (hasMaliciousExtension) {
      return { valid: false, error: 'Malicious file extension detected' };
    }

    return { valid: true };
  },

  /**
   * Generate secure random string
   */
  generateSecureToken: (length: number = 32): string => {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  },

  /**
   * Hash sensitive data
   */
  hashSensitiveData: (data: string): string => {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  },

  /**
   * Validate password strength
   */
  validatePasswordStrength: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};
