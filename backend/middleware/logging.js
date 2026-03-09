/**
 * Logging Middleware
 * Provides structured logging for requests and errors using Winston
 */

const winston = require('winston');
const featureFlags = require('./featureFlags');
const { getCorrelationId } = require('./correlation');

/**
 * Sanitize sensitive data from logs
 * Removes passwords, tokens, and other sensitive information
 */
function sanitizeLogData(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }

  const sensitiveFields = [
    'password', 'token', 'authorization', 'cookie', 'secret', 'key',
    'passwd', 'pass', 'auth', 'jwt', 'bearer', 'apikey', 'api_key',
    'client_secret', 'refresh_token', 'access_token', 'session_id',
    'ssn', 'social_security', 'credit_card', 'creditcard', 'cvv',
    'pin', 'otp', 'verification_code', 'reset_token'
  ];

  const sensitivePatterns = [
    /password/i,
    /token/i,
    /secret/i,
    /key/i,
    /auth/i,
    /bearer/i,
    /jwt/i
  ];

  const sanitized = {};

  for (const [key, value] of Object.entries(data)) {
    const keyLower = key.toLowerCase();
    
    // Check if field name is in sensitive fields list
    const isSensitiveField = sensitiveFields.includes(keyLower) ||
                            sensitivePatterns.some(pattern => pattern.test(key));
    
    if (isSensitiveField) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeLogData(value);
    } else if (typeof value === 'string') {
      // Check for sensitive patterns in string values
      sanitized[key] = sanitizeStringValue(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize sensitive patterns in string values
 */
function sanitizeStringValue(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // Patterns for sensitive data in strings
  const patterns = [
    // JWT tokens
    { pattern: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g, replacement: '[JWT_TOKEN]' },
    // API keys (common formats)
    { pattern: /[A-Za-z0-9]{32,}/g, replacement: '[API_KEY]' },
    // Email addresses in sensitive contexts
    { pattern: /Bearer\s+[A-Za-z0-9-._~+/]+=*/gi, replacement: 'Bearer [TOKEN]' },
    // Basic auth
    { pattern: /Basic\s+[A-Za-z0-9+/=]+/gi, replacement: 'Basic [CREDENTIALS]' }
  ];

  let sanitized = str;
  for (const { pattern, replacement } of patterns) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  return sanitized;
}

/**
 * Custom log format for structured logging
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, correlationId, ...meta }) => {
    const logEntry = {
      timestamp,
      level,
      message,
      correlationId: correlationId || 'unknown',
      ...sanitizeLogData(meta)
    };
    return JSON.stringify(logEntry);
  })
);

/**
 * Development log format (more readable)
 */
const devFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, correlationId, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(sanitizeLogData(meta), null, 2)}` : '';
    return `${timestamp} [${correlationId || 'unknown'}] ${level}: ${message}${metaStr}`;
  })
);

/**
 * Create Winston logger instance
 */
function createLogger() {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  const transports = [
    new winston.transports.Console({
      format: isDevelopment ? devFormat : logFormat,
      level: isDevelopment ? 'debug' : 'info'
    })
  ];

  // Add file transports for production
  if (!isDevelopment) {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    );
  }

  return winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: logFormat,
    transports,
    exitOnError: false,
    // Handle uncaught exceptions and rejections
    exceptionHandlers: [
      new winston.transports.Console({
        format: isDevelopment ? devFormat : logFormat
      })
    ],
    rejectionHandlers: [
      new winston.transports.Console({
        format: isDevelopment ? devFormat : logFormat
      })
    ]
  });
}

/**
 * Basic logger implementation (fallback when Winston is not available or structured logging is disabled)
 */
class BasicLogger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  log(level, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...sanitizeLogData(metadata)
    };

    console.log(JSON.stringify(logEntry, null, 2));
  }

  error(message, metadata = {}) {
    this.log('error', message, metadata);
  }

  warn(message, metadata = {}) {
    this.log('warn', message, metadata);
  }

  info(message, metadata = {}) {
    this.log('info', message, metadata);
  }

  debug(message, metadata = {}) {
    this.log('debug', message, metadata);
  }
}

/**
 * Enhanced logger wrapper that adds correlation ID and sanitization
 */
class EnhancedLogger {
  constructor(winstonLogger) {
    this.winston = winstonLogger;
    this.fallback = new BasicLogger();
  }

  _log(level, message, metadata = {}, req = null) {
    const correlationId = req ? getCorrelationId(req) : metadata.correlationId;
    const sanitizedMeta = sanitizeLogData(metadata);
    
    const logData = {
      ...sanitizedMeta,
      correlationId
    };

    if (featureFlags.isEnabled('STRUCTURED_LOGGING')) {
      this.winston[level](message, logData);
    } else {
      this.fallback[level](message, logData);
    }
  }

  error(message, metadata = {}, req = null) {
    this._log('error', message, metadata, req);
  }

  warn(message, metadata = {}, req = null) {
    this._log('warn', message, metadata, req);
  }

  info(message, metadata = {}, req = null) {
    this._log('info', message, metadata, req);
  }

  debug(message, metadata = {}, req = null) {
    this._log('debug', message, metadata, req);
  }

  // Convenience method for logging with request context
  withRequest(req) {
    return {
      error: (message, metadata = {}) => this.error(message, metadata, req),
      warn: (message, metadata = {}) => this.warn(message, metadata, req),
      info: (message, metadata = {}) => this.info(message, metadata, req),
      debug: (message, metadata = {}) => this.debug(message, metadata, req)
    };
  }
}

// Create logger instance
const winstonLogger = createLogger();
const logger = new EnhancedLogger(winstonLogger);

/**
 * Request logging middleware
 * Logs incoming requests with correlation ID and structured data
 */
function requestLogger(req, res, next) {
  if (!featureFlags.isEnabled('STRUCTURED_LOGGING')) {
    return next();
  }

  const startTime = Date.now();
  const correlationId = getCorrelationId(req);
  const requestLogger = logger.withRequest(req);

  // Log request start
  requestLogger.info('Request started', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
    query: sanitizeLogData(req.query),
    params: sanitizeLogData(req.params)
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    requestLogger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
      responseSize: res.get('Content-Length') || 0
    });

    originalEnd.apply(this, args);
  };

  next();
}

/**
 * Error logging middleware
 * Logs errors with full context and correlation ID
 */
function errorLogger(err, req, res, next) {
  if (!featureFlags.isEnabled('STRUCTURED_LOGGING')) {
    return next(err);
  }

  const correlationId = getCorrelationId(req);
  const errorLogger = logger.withRequest(req);

  // Determine error severity
  const severity = getErrorSeverity(err);
  const logLevel = severity === 'critical' ? 'error' : 
                   severity === 'high' ? 'error' : 
                   severity === 'medium' ? 'warn' : 'info';

  errorLogger[logLevel]('Error occurred', {
    error: {
      message: err.message,
      stack: err.stack,
      code: err.errorCode || err.code,
      statusCode: err.statusCode || 500,
      name: err.name,
      severity
    },
    request: {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous',
      body: sanitizeLogData(req.body),
      query: sanitizeLogData(req.query),
      params: sanitizeLogData(req.params)
    }
  });

  // Alert for critical errors
  if (severity === 'critical') {
    alertCriticalError(err, req, correlationId);
  }

  next(err);
}

/**
 * Determine error severity based on error type and status code
 */
function getErrorSeverity(err) {
  const statusCode = err.statusCode || 500;
  
  // Critical errors
  if (statusCode >= 500 && statusCode < 600) {
    if (err.name === 'MongoNetworkError' || 
        err.name === 'MongoTimeoutError' ||
        err.message.includes('ECONNREFUSED') ||
        err.message.includes('out of memory')) {
      return 'critical';
    }
    return 'high';
  }
  
  // Authentication/Authorization errors
  if (statusCode === 401 || statusCode === 403) {
    return 'medium';
  }
  
  // Client errors
  if (statusCode >= 400 && statusCode < 500) {
    return 'low';
  }
  
  return 'medium';
}

/**
 * Alert administrators for critical errors
 */
function alertCriticalError(err, req, correlationId) {
  // In a real implementation, this would send alerts via email, Slack, etc.
  logger.error('CRITICAL ERROR ALERT', {
    correlationId,
    alert: true,
    error: {
      message: err.message,
      stack: err.stack,
      code: err.errorCode || err.code
    },
    request: {
      method: req.method,
      url: req.url,
      userId: req.user?.id || 'anonymous'
    },
    timestamp: new Date().toISOString()
  });
}

/**
 * Create a child logger with additional context
 */
function createChildLogger(context = {}) {
  return {
    error: (message, metadata = {}) => logger.error(message, { ...context, ...metadata }),
    warn: (message, metadata = {}) => logger.warn(message, { ...context, ...metadata }),
    info: (message, metadata = {}) => logger.info(message, { ...context, ...metadata }),
    debug: (message, metadata = {}) => logger.debug(message, { ...context, ...metadata })
  };
}

/**
 * Log performance metrics
 */
function logPerformance(operation, duration, metadata = {}) {
  const performanceLogger = createChildLogger({ component: 'performance' });
  
  performanceLogger.info('Performance metric', {
    operation,
    duration: `${duration}ms`,
    ...metadata
  });
}

/**
 * Log security events
 */
function logSecurityEvent(event, severity = 'medium', metadata = {}) {
  const securityLogger = createChildLogger({ component: 'security' });
  
  const logLevel = severity === 'critical' ? 'error' : 
                   severity === 'high' ? 'warn' : 'info';
  
  securityLogger[logLevel]('Security event', {
    event,
    severity,
    ...metadata
  });
}

module.exports = {
  logger,
  requestLogger,
  errorLogger,
  sanitizeLogData,
  sanitizeStringValue,
  createChildLogger,
  logPerformance,
  logSecurityEvent,
  getErrorSeverity,
  alertCriticalError
};