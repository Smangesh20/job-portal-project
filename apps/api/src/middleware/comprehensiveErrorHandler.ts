import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { PrismaClient } from '@prisma/client';
import { 
  AuthenticationError, 
  ValidationError, 
  RateLimitError,
  AccountLockedError,
  EmailNotVerifiedError,
  TwoFactorRequiredError,
  CustomError,
  ErrorCode
} from '@ask-ya-cham/types';

const prisma = new PrismaClient();

export interface ErrorContext {
  requestId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'validation' | 'business' | 'system' | 'security';
  metadata?: any;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsByEndpoint: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  recentErrors: ErrorContext[];
}

class ComprehensiveErrorHandler {
  private errorMetrics: ErrorMetrics = {
    totalErrors: 0,
    errorsByCategory: {},
    errorsByEndpoint: {},
    errorsBySeverity: {},
    recentErrors: []
  };

  private readonly MAX_RECENT_ERRORS = 1000;
  private readonly CRITICAL_ERROR_THRESHOLD = 10; // Alert after 10 critical errors

  /**
   * Main error handling middleware
   */
  public handleError = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const context = this.createErrorContext(error, req);
    
    // Log error
    this.logError(error, context);
    
    // Track metrics
    this.updateMetrics(context);
    
    // Check for critical error alerts
    this.checkCriticalErrorAlerts(context);
    
    // Send appropriate response
    this.sendErrorResponse(error, context, res);
  };

  /**
   * Create error context from request and error
   */
  private createErrorContext(error: any, req: Request): ErrorContext {
    const requestId = req.headers['x-request-id'] as string || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      requestId,
      userId: (req as any).user?.id,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      endpoint: req.originalUrl,
      method: req.method,
      timestamp: new Date(),
      severity: this.determineSeverity(error),
      category: this.determineCategory(error),
      metadata: {
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
      }
    };
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
    if (error instanceof CustomError) {
      switch (error.code) {
        case ErrorCode.AUTH_ERROR:
        case ErrorCode.VALIDATION_ERROR:
          return 'low';
        case ErrorCode.AUTHORIZATION_ERROR:
        case ErrorCode.ACCOUNT_LOCKED:
          return 'medium';
        case ErrorCode.SECURITY_ERROR:
        case ErrorCode.SUSPICIOUS_ACTIVITY:
          return 'high';
        default:
          return 'medium';
      }
    }

    if (error.name === 'ValidationError') return 'low';
    if (error.name === 'CastError') return 'low';
    if (error.name === 'JsonWebTokenError') return 'medium';
    if (error.name === 'TokenExpiredError') return 'medium';
    if (error.name === 'MulterError') return 'low';
    
    // System errors
    if (error.code === 'ECONNREFUSED') return 'critical';
    if (error.code === 'ENOTFOUND') return 'critical';
    if (error.code === 'ETIMEDOUT') return 'high';
    
    return 'medium';
  }

  /**
   * Determine error category
   */
  private determineCategory(error: any): 'authentication' | 'authorization' | 'validation' | 'business' | 'system' | 'security' {
    if (error instanceof AuthenticationError) return 'authentication';
    if (error instanceof ValidationError) return 'validation';
    if (error instanceof RateLimitError) return 'security';
    if (error instanceof AccountLockedError) return 'security';
    if (error instanceof EmailNotVerifiedError) return 'authentication';
    if (error instanceof TwoFactorRequiredError) return 'authentication';
    
    if (error.name === 'ValidationError') return 'validation';
    if (error.name === 'JsonWebTokenError') return 'authentication';
    if (error.name === 'TokenExpiredError') return 'authentication';
    
    if (error.code?.startsWith('ECONN') || error.code?.startsWith('ENOTFOUND')) return 'system';
    
    return 'business';
  }

  /**
   * Log error with context
   */
  private async logError(error: any, context: ErrorContext): Promise<void> {
    const logData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode
      },
      context,
      timestamp: new Date().toISOString()
    };

    // Log to console based on severity
    switch (context.severity) {
      case 'critical':
        logger.error('CRITICAL ERROR:', logData);
        break;
      case 'high':
        logger.error('HIGH SEVERITY ERROR:', logData);
        break;
      case 'medium':
        logger.warn('MEDIUM SEVERITY ERROR:', logData);
        break;
      case 'low':
        logger.info('LOW SEVERITY ERROR:', logData);
        break;
    }

    // Store in database for critical and high severity errors
    if (context.severity === 'critical' || context.severity === 'high') {
      try {
        await this.storeErrorInDatabase(error, context);
      } catch (dbError) {
        logger.error('Failed to store error in database:', dbError);
      }
    }
  }

  /**
   * Store error in database
   */
  private async storeErrorInDatabase(error: any, context: ErrorContext): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          userId: context.userId,
          eventType: 'ERROR_OCCURRED',
          severity: context.severity.toUpperCase(),
          description: `${error.name}: ${error.message}`,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          deviceFingerprint: context.requestId,
          metadata: {
            error: {
              name: error.name,
              message: error.message,
              code: error.code,
              statusCode: error.statusCode
            },
            context: {
              endpoint: context.endpoint,
              method: context.method,
              category: context.category
            }
          }
        }
      });
    } catch (dbError) {
      logger.error('Failed to store error in security events:', dbError);
    }
  }

  /**
   * Update error metrics
   */
  private updateMetrics(context: ErrorContext): void {
    this.errorMetrics.totalErrors++;
    
    // Update category metrics
    this.errorMetrics.errorsByCategory[context.category] = 
      (this.errorMetrics.errorsByCategory[context.category] || 0) + 1;
    
    // Update endpoint metrics
    this.errorMetrics.errorsByEndpoint[context.endpoint] = 
      (this.errorMetrics.errorsByEndpoint[context.endpoint] || 0) + 1;
    
    // Update severity metrics
    this.errorMetrics.errorsBySeverity[context.severity] = 
      (this.errorMetrics.errorsBySeverity[context.severity] || 0) + 1;
    
    // Add to recent errors
    this.errorMetrics.recentErrors.unshift(context);
    
    // Keep only recent errors
    if (this.errorMetrics.recentErrors.length > this.MAX_RECENT_ERRORS) {
      this.errorMetrics.recentErrors = this.errorMetrics.recentErrors.slice(0, this.MAX_RECENT_ERRORS);
    }
  }

  /**
   * Check for critical error alerts
   */
  private checkCriticalErrorAlerts(context: ErrorContext): void {
    if (context.severity === 'critical') {
      const criticalErrors = this.errorMetrics.errorsBySeverity.critical || 0;
      
      if (criticalErrors >= this.CRITICAL_ERROR_THRESHOLD) {
        this.sendCriticalErrorAlert(context);
      }
    }
  }

  /**
   * Send critical error alert
   */
  private async sendCriticalErrorAlert(context: ErrorContext): Promise<void> {
    try {
      // Log critical alert
      logger.error('CRITICAL ERROR ALERT:', {
        message: `Critical error threshold exceeded: ${this.errorMetrics.errorsBySeverity.critical} critical errors`,
        context,
        metrics: this.errorMetrics
      });

      // Store alert in database
      await prisma.securityEvent.create({
        data: {
          userId: context.userId,
          eventType: 'CRITICAL_ERROR_ALERT',
          severity: 'CRITICAL',
          description: `Critical error threshold exceeded: ${this.errorMetrics.errorsBySeverity.critical} critical errors`,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          deviceFingerprint: context.requestId,
          metadata: {
            threshold: this.CRITICAL_ERROR_THRESHOLD,
            actualCount: this.errorMetrics.errorsBySeverity.critical,
            metrics: this.errorMetrics
          }
        }
      });

      // Here you could integrate with external alerting systems
      // e.g., Slack, PagerDuty, email notifications, etc.
      
    } catch (alertError) {
      logger.error('Failed to send critical error alert:', alertError);
    }
  }

  /**
   * Send error response to client
   */
  private sendErrorResponse(error: any, context: ErrorContext, res: Response): void {
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let message = 'Something went wrong!';

    // Determine status code and error message
    if (error instanceof CustomError) {
      statusCode = error.statusCode || 500;
      errorCode = error.code || 'CUSTOM_ERROR';
      message = error.message;
    } else if (error.statusCode) {
      statusCode = error.statusCode;
      errorCode = error.code || 'HTTP_ERROR';
      message = error.message;
    } else {
      // Map error types to status codes
      switch (error.name) {
        case 'ValidationError':
          statusCode = 400;
          errorCode = 'VALIDATION_ERROR';
          message = 'Validation failed';
          break;
        case 'CastError':
          statusCode = 400;
          errorCode = 'INVALID_ID';
          message = 'Invalid ID format';
          break;
        case 'JsonWebTokenError':
          statusCode = 401;
          errorCode = 'INVALID_TOKEN';
          message = 'Invalid token';
          break;
        case 'TokenExpiredError':
          statusCode = 401;
          errorCode = 'TOKEN_EXPIRED';
          message = 'Token expired';
          break;
        case 'MulterError':
          statusCode = 400;
          errorCode = 'FILE_UPLOAD_ERROR';
          message = 'File upload error';
          break;
        default:
          statusCode = 500;
          errorCode = 'INTERNAL_ERROR';
          message = 'Internal server error';
      }
    }

    // Don't leak error details in production for system errors
    if (process.env.NODE_ENV === 'production' && context.severity === 'critical') {
      message = 'Something went wrong!';
      errorCode = 'INTERNAL_ERROR';
    }

    // Send response
    res.status(statusCode).json({
      success: false,
      error: message,
      code: errorCode,
      requestId: context.requestId,
      timestamp: context.timestamp.toISOString(),
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error
      })
    });
  }

  /**
   * Get error metrics
   */
  public getErrorMetrics(): ErrorMetrics {
    return { ...this.errorMetrics };
  }

  /**
   * Reset error metrics
   */
  public resetErrorMetrics(): void {
    this.errorMetrics = {
      totalErrors: 0,
      errorsByCategory: {},
      errorsByEndpoint: {},
      errorsBySeverity: {},
      recentErrors: []
    };
  }

  /**
   * Get error statistics
   */
  public getErrorStatistics(): any {
    const metrics = this.errorMetrics;
    
    return {
      totalErrors: metrics.totalErrors,
      errorRate: this.calculateErrorRate(),
      topErrorCategories: this.getTopCategories(),
      topErrorEndpoints: this.getTopEndpoints(),
      severityDistribution: metrics.errorsBySeverity,
      recentErrorTrend: this.getRecentErrorTrend()
    };
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(): number {
    // This would need to be implemented with request counting
    return 0;
  }

  /**
   * Get top error categories
   */
  private getTopCategories(): Array<{ category: string; count: number }> {
    return Object.entries(this.errorMetrics.errorsByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  }

  /**
   * Get top error endpoints
   */
  private getTopEndpoints(): Array<{ endpoint: string; count: number }> {
    return Object.entries(this.errorMetrics.errorsByEndpoint)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));
  }

  /**
   * Get recent error trend
   */
  private getRecentErrorTrend(): any {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentErrors = this.errorMetrics.recentErrors.filter(
      error => error.timestamp > oneHourAgo
    );
    
    return {
      errorsLastHour: recentErrors.length,
      criticalErrorsLastHour: recentErrors.filter(e => e.severity === 'critical').length,
      highSeverityErrorsLastHour: recentErrors.filter(e => e.severity === 'high').length
    };
  }
}

// Create singleton instance
const errorHandler = new ComprehensiveErrorHandler();

// Export middleware and utilities
export { errorHandler };
export const handleError = errorHandler.handleError;
export const getErrorMetrics = errorHandler.getErrorMetrics.bind(errorHandler);
export const getErrorStatistics = errorHandler.getErrorStatistics.bind(errorHandler);
export const resetErrorMetrics = errorHandler.resetErrorMetrics.bind(errorHandler);

// Error prevention utilities
export const preventCommonErrors = {
  /**
   * Validate required fields
   */
  validateRequired: (data: any, requiredFields: string[]): void => {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }
  },

  /**
   * Validate email format
   */
  validateEmail: (email: string): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  },

  /**
   * Validate password strength
   */
  validatePassword: (password: string): void => {
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      throw new ValidationError('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      throw new ValidationError('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      throw new ValidationError('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      throw new ValidationError('Password must contain at least one special character');
    }
  },

  /**
   * Sanitize input to prevent injection attacks
   */
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[;]/g, '') // Remove semicolons
      .trim();
  },

  /**
   * Validate file upload
   */
  validateFileUpload: (file: any, allowedTypes: string[], maxSize: number): void => {
    if (!file) {
      throw new ValidationError('No file provided');
    }
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ValidationError(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    if (file.size > maxSize) {
      throw new ValidationError(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
    }
  }
};
