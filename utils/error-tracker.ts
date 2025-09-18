import { logger } from './logger';

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  userAgent?: string;
  ip?: string;
  timestamp?: Date;
  [key: string]: any;
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private errorCounts: Map<string, number> = new Map();
  private errorHistory: Array<{
    type: string;
    message: string;
    timestamp: Date;
    context?: ErrorContext;
  }> = [];
  private maxErrorsPerType = 10;
  private maxHistorySize = 1000;

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  trackError(error: Error, context?: ErrorContext): void {
    const errorType = error.constructor.name;
    const count = this.errorCounts.get(errorType) || 0;
    
    this.errorCounts.set(errorType, count + 1);
    
    // Add to history
    this.errorHistory.push({
      type: errorType,
      message: error.message,
      timestamp: new Date(),
      context
    });

    // Maintain history size
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
    }

    // Log the error
    logger.error('Error tracked', {
      type: errorType,
      message: error.message,
      stack: error.stack,
      context,
      count: count + 1,
      timestamp: new Date().toISOString()
    });

    // Alert if too many errors of same type
    if (count + 1 >= this.maxErrorsPerType) {
      this.alert(errorType, count + 1, error.message);
    }
  }

  private alert(errorType: string, count: number, message: string): void {
    const alertMessage = `ALERT: Too many ${errorType} errors detected: ${count}. Latest message: ${message}`;
    
    logger.error(alertMessage, {
      errorType,
      count,
      message,
      timestamp: new Date().toISOString(),
      severity: 'HIGH'
    });

    // Here you would typically send to monitoring service
    // Example: sendToSlack(alertMessage);
    // Example: sendToPagerDuty(alertMessage);
  }

  getErrorStats(): {
    totalErrors: number;
    errorCounts: Record<string, number>;
    recentErrors: Array<{
      type: string;
      message: string;
      timestamp: Date;
    }>;
  } {
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
    
    return {
      totalErrors,
      errorCounts: Object.fromEntries(this.errorCounts),
      recentErrors: this.errorHistory.slice(-10).map(({ context, ...error }) => error)
    };
  }

  resetCounts(): void {
    this.errorCounts.clear();
    this.errorHistory = [];
    logger.info('Error counts and history reset');
  }

  setMaxErrorsPerType(max: number): void {
    this.maxErrorsPerType = max;
    logger.info(`Max errors per type set to: ${max}`);
  }
}

// Global error handler
export function setupGlobalErrorHandling(): void {
  const errorTracker = ErrorTracker.getInstance();

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    errorTracker.trackError(error, {
      type: 'uncaughtException',
      timestamp: new Date()
    });
    
    logger.error('Uncaught Exception:', error);
    
    // Graceful shutdown
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    
    errorTracker.trackError(error, {
      type: 'unhandledRejection',
      timestamp: new Date(),
      promise: promise.toString()
    });
    
    logger.error('Unhandled Rejection:', { reason, promise });
  });

  // Handle warnings
  process.on('warning', (warning: Error) => {
    errorTracker.trackError(warning, {
      type: 'warning',
      timestamp: new Date()
    });
    
    logger.warn('Process Warning:', warning);
  });
}

// Express error handler middleware
export function expressErrorHandler(error: Error, req: any, res: any, next: any): void {
  const errorTracker = ErrorTracker.getInstance();
  
  const context: ErrorContext = {
    userId: req.user?.id,
    requestId: req.id,
    endpoint: req.path,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date()
  };

  errorTracker.trackError(error, context);

  // Send error response
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred',
      requestId: req.id
    }
  });
}

export default ErrorTracker;
