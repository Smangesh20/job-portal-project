import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { getRedisService } from '../utils/redis';

export interface ErrorPreventionConfig {
  maxRequestSize: number; // in bytes
  maxArrayLength: number;
  maxStringLength: number;
  maxNestingDepth: number;
  enableRequestValidation: boolean;
  enableResponseValidation: boolean;
  enableCircularReferenceDetection: boolean;
  enableMemoryLeakDetection: boolean;
  maxConcurrentRequests: number;
  requestTimeout: number; // in milliseconds
}

const defaultConfig: ErrorPreventionConfig = {
  maxRequestSize: 10 * 1024 * 1024, // 10MB
  maxArrayLength: 1000,
  maxStringLength: 10000,
  maxNestingDepth: 10,
  enableRequestValidation: true,
  enableResponseValidation: true,
  enableCircularReferenceDetection: true,
  enableMemoryLeakDetection: true,
  maxConcurrentRequests: 100,
  requestTimeout: 30000 // 30 seconds
};

export class ErrorPreventionService {
  private redis: any;
  private config: ErrorPreventionConfig;
  private activeRequests: Map<string, number>;
  private memoryUsage: { [key: string]: number };

  constructor() {
    this.redis = getRedisService();
    this.config = { ...defaultConfig };
    this.activeRequests = new Map();
    this.memoryUsage = {};

    // Start memory monitoring
    if (this.config.enableMemoryLeakDetection) {
      this.startMemoryMonitoring();
    }
  }

  /**
   * Validate request size and structure
   */
  validateRequest(req: Request, res: Response, next: NextFunction): void {
    try {
      // Check request size
      const contentLength = parseInt(req.get('Content-Length') || '0');
      if (contentLength > this.config.maxRequestSize) {
        res.status(413).json({
          success: false,
          error: {
            code: 'REQUEST_TOO_LARGE',
            message: `Request size exceeds maximum allowed size of ${this.config.maxRequestSize} bytes`
          }
        });
        return;
      }

      // Check concurrent requests
      const clientIP = req.ip || 'unknown';
      const currentRequests = this.activeRequests.get(clientIP) || 0;
      
      if (currentRequests >= this.config.maxConcurrentRequests) {
        res.status(429).json({
          success: false,
          error: {
            code: 'TOO_MANY_CONCURRENT_REQUESTS',
            message: 'Too many concurrent requests from this IP'
          }
        });
        return;
      }

      // Increment active requests
      this.activeRequests.set(clientIP, currentRequests + 1);

      // Set up request timeout
      const timeout = setTimeout(() => {
        res.status(408).json({
          success: false,
          error: {
            code: 'REQUEST_TIMEOUT',
            message: 'Request timeout'
          }
        });
      }, this.config.requestTimeout);

      // Store timeout for cleanup
      (req as any).timeout = timeout;

      // Validate request body structure
      if (this.config.enableRequestValidation && req.body) {
        const validationResult = this.validateObjectStructure(req.body);
        if (!validationResult.isValid) {
          res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_REQUEST_STRUCTURE',
              message: 'Request structure is invalid',
              details: validationResult.errors
            }
          });
          return;
        }
      }

      next();
    } catch (error) {
      logger.error('Request validation error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed'
        }
      });
    }
  }

  /**
   * Clean up request resources
   */
  cleanupRequest(req: Request, res: Response, next: NextFunction): void {
    // Clear timeout
    if ((req as any).timeout) {
      clearTimeout((req as any).timeout);
    }

    // Decrement active requests
    const clientIP = req.ip || 'unknown';
    const currentRequests = this.activeRequests.get(clientIP) || 0;
    if (currentRequests > 0) {
      this.activeRequests.set(clientIP, currentRequests - 1);
    }

    next();
  }

  /**
   * Validate object structure
   */
  private validateObjectStructure(obj: any, depth: number = 0): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (depth > this.config.maxNestingDepth) {
      errors.push(`Object nesting depth exceeds maximum of ${this.config.maxNestingDepth}`);
      return { isValid: false, errors };
    }

    if (Array.isArray(obj)) {
      if (obj.length > this.config.maxArrayLength) {
        errors.push(`Array length exceeds maximum of ${this.config.maxArrayLength}`);
      }

      for (let i = 0; i < obj.length; i++) {
        const result = this.validateObjectStructure(obj[i], depth + 1);
        if (!result.isValid) {
          errors.push(`Array element at index ${i}: ${result.errors.join(', ')}`);
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      // Check for circular references
      if (this.config.enableCircularReferenceDetection) {
        const circularRef = this.detectCircularReference(obj);
        if (circularRef) {
          errors.push('Circular reference detected in object');
        }
      }

      for (const key in obj) {
        if (typeof key === 'string' && key.length > this.config.maxStringLength) {
          errors.push(`Object key length exceeds maximum of ${this.config.maxStringLength}`);
        }

        const result = this.validateObjectStructure(obj[key], depth + 1);
        if (!result.isValid) {
          errors.push(`Object property '${key}': ${result.errors.join(', ')}`);
        }
      }
    } else if (typeof obj === 'string' && obj.length > this.config.maxStringLength) {
      errors.push(`String length exceeds maximum of ${this.config.maxStringLength}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Detect circular references
   */
  private detectCircularReference(obj: any, seen: Set<any> = new Set()): boolean {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    if (seen.has(obj)) {
      return true;
    }

    seen.add(obj);

    for (const key in obj) {
      if (this.detectCircularReference(obj[key], seen)) {
        return true;
      }
    }

    seen.delete(obj);
    return false;
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const currentTime = Date.now();

      // Store memory usage
      this.memoryUsage[currentTime] = memUsage.heapUsed;

      // Clean up old memory usage data (keep last 100 entries)
      const keys = Object.keys(this.memoryUsage).map(Number).sort((a, b) => b - a);
      if (keys.length > 100) {
        keys.slice(100).forEach(key => {
          delete this.memoryUsage[key];
        });
      }

      // Check for memory leaks
      if (keys.length >= 10) {
        const recent = keys.slice(0, 10).map(key => this.memoryUsage[key]);
        const older = keys.slice(10, 20).map(key => this.memoryUsage[key]);
        
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        
        if (recentAvg > olderAvg * 1.5) {
          logger.warn('Potential memory leak detected', {
            recentAverage: recentAvg,
            olderAverage: olderAvg,
            increase: ((recentAvg - olderAvg) / olderAvg) * 100
          });
        }
      }

      // Force garbage collection if memory usage is high
      if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
        if (global.gc) {
          global.gc();
          logger.info('Forced garbage collection due to high memory usage');
        }
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Validate response before sending
   */
  validateResponse(req: Request, res: Response, next: NextFunction): void {
    if (!this.config.enableResponseValidation) {
      next();
      return;
    }

    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function(data: any) {
      try {
        // Validate response size
        const responseSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
        if (responseSize > 10 * 1024 * 1024) { // 10MB
          logger.warn('Large response detected', {
            size: responseSize,
            path: req.path,
            method: req.method
          });
        }

        // Check for circular references in response
        if (typeof data === 'object' && data !== null) {
          const circularRef = this.detectCircularReference(data);
          if (circularRef) {
            logger.error('Circular reference in response', {
              path: req.path,
              method: req.method
            });
            return originalSend.call(this, {
              success: false,
              error: {
                code: 'CIRCULAR_REFERENCE',
                message: 'Response contains circular reference'
              }
            });
          }
        }

        return originalSend.call(this, data);
      } catch (error) {
        logger.error('Response validation error:', error);
        return originalSend.call(this, {
          success: false,
          error: {
            code: 'RESPONSE_VALIDATION_ERROR',
            message: 'Response validation failed'
          }
        });
      }
    }.bind(this);

    res.json = function(data: any) {
      try {
        // Validate JSON response
        const jsonString = JSON.stringify(data);
        const responseSize = Buffer.byteLength(jsonString, 'utf8');
        
        if (responseSize > 10 * 1024 * 1024) { // 10MB
          logger.warn('Large JSON response detected', {
            size: responseSize,
            path: req.path,
            method: req.method
          });
        }

        return originalJson.call(this, data);
      } catch (error) {
        logger.error('JSON response validation error:', error);
        return originalJson.call(this, {
          success: false,
          error: {
            code: 'JSON_VALIDATION_ERROR',
            message: 'JSON response validation failed'
          }
        });
      }
    }.bind(this);

    next();
  }

  /**
   * Handle uncaught exceptions
   */
  handleUncaughtException(): void {
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      
      // Log to external service if available
      this.logCriticalError('UNCAUGHT_EXCEPTION', error);
      
      // Graceful shutdown
      process.exit(1);
    });
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(): void {
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection:', { reason, promise });
      
      // Log to external service if available
      this.logCriticalError('UNHANDLED_REJECTION', reason);
    });
  }

  /**
   * Log critical errors
   */
  private async logCriticalError(type: string, error: any): Promise<void> {
    try {
      const errorData = {
        type,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      };

      // Store in Redis for monitoring
      const errorKey = `critical_error:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      await this.redis.set(errorKey, JSON.stringify(errorData), 24 * 60 * 60); // 24 hours

      // Send to external monitoring service if configured
      if (process.env.SENTRY_DSN) {
        // This would typically send to Sentry or similar service
        logger.info('Critical error logged to external service', { type });
      }
    } catch (logError) {
      logger.error('Failed to log critical error:', logError);
    }
  }

  /**
   * Get system health status
   */
  getHealthStatus(): any {
    const memUsage = process.memoryUsage();
    const activeRequestsCount = Array.from(this.activeRequests.values()).reduce((a, b) => a + b, 0);
    
    return {
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss
      },
      requests: {
        active: activeRequestsCount,
        maxConcurrent: this.config.maxConcurrentRequests
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}

export const errorPreventionService = new ErrorPreventionService();

// Middleware functions
export const validateRequest = errorPreventionService.validateRequest.bind(errorPreventionService);
export const cleanupRequest = errorPreventionService.cleanupRequest.bind(errorPreventionService);
export const validateResponse = errorPreventionService.validateResponse.bind(errorPreventionService);
