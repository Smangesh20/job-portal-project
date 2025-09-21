/**
 * Enterprise Error Handling System
 * Google-style comprehensive error management
 */

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  timestamp: number;
  userAgent?: string;
  ip?: string;
  url?: string;
  method?: string;
}

export interface ErrorLog {
  id: string;
  type: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  createdAt: number;
  resolvedAt?: number;
}

// Error types
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NETWORK: 'network',
  DATABASE: 'database',
  EXTERNAL_API: 'external_api',
  INTERNAL: 'internal',
  CLIENT: 'client',
  SERVER: 'server'
} as const;

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

// Error store (in production, use proper logging service)
const errorStore = new Map<string, ErrorLog>();

// Circuit breaker for external services
const circuitBreakers = new Map<string, {
  failures: number;
  lastFailure: number;
  state: 'closed' | 'open' | 'half-open';
  threshold: number;
  timeout: number;
}>();

class EnterpriseErrorHandler {
  private static instance: EnterpriseErrorHandler;
  
  public static getInstance(): EnterpriseErrorHandler {
    if (!EnterpriseErrorHandler.instance) {
      EnterpriseErrorHandler.instance = new EnterpriseErrorHandler();
    }
    return EnterpriseErrorHandler.instance;
  }

  // Log error
  public logError(
    error: Error | string,
    type: string = ERROR_TYPES.INTERNAL,
    severity: string = ERROR_SEVERITY.MEDIUM,
    context: Partial<ErrorContext> = {}
  ): string {
    const errorId = this.generateErrorId();
    const timestamp = Date.now();
    
    const errorLog: ErrorLog = {
      id: errorId,
      type,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      context: {
        timestamp,
        ...context
      },
      severity: severity as any,
      resolved: false,
      createdAt: timestamp
    };

    errorStore.set(errorId, errorLog);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 ENTERPRISE ERROR [${severity.toUpperCase()}]:`, {
        id: errorId,
        type,
        message: errorLog.message,
        context: errorLog.context
      });
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorLog);
    }

    return errorId;
  }

  // Handle API errors
  public handleAPIError(error: any, context: Partial<ErrorContext> = {}): {
    errorId: string;
    userMessage: string;
    statusCode: number;
  } {
    let type: string = ERROR_TYPES.INTERNAL;
    let severity: string = ERROR_SEVERITY.MEDIUM;
    let userMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      type = ERROR_TYPES.VALIDATION;
      severity = ERROR_SEVERITY.LOW;
      userMessage = 'Invalid input data';
      statusCode = 400;
    } else if (error.name === 'UnauthorizedError') {
      type = ERROR_TYPES.AUTHENTICATION;
      severity = ERROR_SEVERITY.MEDIUM;
      userMessage = 'Authentication required';
      statusCode = 401;
    } else if (error.name === 'ForbiddenError') {
      type = ERROR_TYPES.AUTHORIZATION;
      severity = ERROR_SEVERITY.MEDIUM;
      userMessage = 'Access denied';
      statusCode = 403;
    } else if (error.name === 'NotFoundError') {
      type = ERROR_TYPES.CLIENT;
      severity = ERROR_SEVERITY.LOW;
      userMessage = 'Resource not found';
      statusCode = 404;
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      type = ERROR_TYPES.NETWORK;
      severity = ERROR_SEVERITY.HIGH;
      userMessage = 'Service temporarily unavailable';
      statusCode = 503;
    } else if (error.code === 'ER_DUP_ENTRY') {
      type = ERROR_TYPES.DATABASE;
      severity = ERROR_SEVERITY.MEDIUM;
      userMessage = 'Duplicate entry';
      statusCode = 409;
    }

    const errorId = this.logError(error, type, severity, context);

    return {
      errorId,
      userMessage,
      statusCode
    };
  }

  // Circuit breaker for external services
  public checkCircuitBreaker(serviceName: string, threshold: number = 5, timeout: number = 60000): boolean {
    const now = Date.now();
    const breaker = circuitBreakers.get(serviceName) || {
      failures: 0,
      lastFailure: 0,
      state: 'closed' as const,
      threshold,
      timeout
    };

    // Reset if timeout has passed
    if (breaker.state === 'open' && now - breaker.lastFailure > timeout) {
      breaker.state = 'half-open';
      breaker.failures = 0;
    }

    circuitBreakers.set(serviceName, breaker);

    return breaker.state !== 'open';
  }

  // Record circuit breaker failure
  public recordCircuitBreakerFailure(serviceName: string): void {
    const breaker = circuitBreakers.get(serviceName);
    if (breaker) {
      breaker.failures++;
      breaker.lastFailure = Date.now();
      
      if (breaker.failures >= breaker.threshold) {
        breaker.state = 'open';
      }
      
      circuitBreakers.set(serviceName, breaker);
    }
  }

  // Record circuit breaker success
  public recordCircuitBreakerSuccess(serviceName: string): void {
    const breaker = circuitBreakers.get(serviceName);
    if (breaker) {
      breaker.failures = 0;
      breaker.state = 'closed';
      circuitBreakers.set(serviceName, breaker);
    }
  }

  // Retry mechanism with exponential backoff
  public async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    context: Partial<ErrorContext> = {}
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          this.logError(
            lastError,
            ERROR_TYPES.EXTERNAL_API,
            ERROR_SEVERITY.HIGH,
            { ...context, requestId: `retry_${attempt}` }
          );
          throw lastError;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }

  // Cache management
  public invalidateCache(pattern: string): void {
    // In production, implement proper cache invalidation
    console.log(`🚀 ENTERPRISE: Invalidating cache pattern: ${pattern}`);
  }

  // Browser cache management
  public generateCacheBustingKey(): string {
    return `v=${Date.now()}`;
  }

  // Get error statistics
  public getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    unresolved: number;
  } {
    const errors = Array.from(errorStore.values());
    
    const byType = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: errors.length,
      byType,
      bySeverity,
      unresolved: errors.filter(e => !e.resolved).length
    };
  }

  // Resolve error
  public resolveError(errorId: string): boolean {
    const error = errorStore.get(errorId);
    if (error) {
      error.resolved = true;
      error.resolvedAt = Date.now();
      errorStore.set(errorId, error);
      return true;
    }
    return false;
  }

  // Private methods
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private sendToMonitoringService(errorLog: ErrorLog): void {
    // In production, send to monitoring service (e.g., Sentry, DataDog, etc.)
    console.log('🚨 ENTERPRISE: Sending error to monitoring service:', errorLog.id);
  }
}

// Singleton instance
export const errorHandler = EnterpriseErrorHandler.getInstance();

// React error boundary
export class EnterpriseErrorBoundary extends Error {
  constructor(message: string, public errorId: string) {
    super(message);
    this.name = 'EnterpriseErrorBoundary';
  }
}

// Error boundary hook
export function useErrorHandler() {
  const handleError = (error: Error, context: Partial<ErrorContext> = {}) => {
    return errorHandler.logError(error, ERROR_TYPES.CLIENT, ERROR_SEVERITY.MEDIUM, context);
  };

  const handleAPIError = (error: any, context: Partial<ErrorContext> = {}) => {
    return errorHandler.handleAPIError(error, context);
  };

  return {
    handleError,
    handleAPIError,
    errorStats: errorHandler.getErrorStats()
  };
}

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorHandler.logError(
      event.error || event.message,
      ERROR_TYPES.CLIENT,
      ERROR_SEVERITY.MEDIUM,
      {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.logError(
      event.reason,
      ERROR_TYPES.CLIENT,
      ERROR_SEVERITY.HIGH,
      {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    );
  });
}