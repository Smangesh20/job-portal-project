import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { logger } from '../utils/logger';

// Production security middleware
export const productionSecurityMiddleware = (app: any) => {
  // Helmet security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "ws:", "wss:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Strict rate limiting for production
  const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 50 : 1000, // Stricter in production
    message: {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests from this IP, please try again later.',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      res.status(429).json({
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many requests from this IP, please try again later.',
        },
      });
    },
  });

  // Apply rate limiting to all routes
  app.use(strictLimiter);

  // Additional security middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Remove powered-by header
    res.removeHeader('X-Powered-By');

    // Add security headers
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');

    // Block suspicious user agents
    const userAgent = req.get('User-Agent') || '';
    if (userAgent.includes('bot') && !userAgent.includes('googlebot')) {
      logger.warn('Blocked suspicious user agent', { userAgent, ip: req.ip });
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Access denied',
        },
      });
    }

    next();
  });

  // Block access to sensitive endpoints in production
  app.use('/api/debug', (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Blocked debug endpoint access', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found',
        },
      });
    }
    next();
  });

  // Block access to development files
  app.use('/api/dev', (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found',
        },
      });
    }
    next();
  });
};

// Authentication protection for sensitive routes
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  // In a real implementation, you would verify the JWT token here
  next();
};

// Admin-only access protection
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // This should check if the user has admin role
  // For now, we'll just require authentication
  requireAuth(req, res, next);
};

// IP whitelist middleware (for admin access)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || '';
    
    if (!allowedIPs.includes(clientIP)) {
      logger.warn('Blocked IP not in whitelist', {
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Access denied from this IP address',
        },
      });
    }
    
    next();
  };
};

// Request logging for security monitoring
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log suspicious activities
    if (res.statusCode >= 400) {
      logger.warn('Security event detected', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Log all requests in production for monitoring
    if (process.env.NODE_ENV === 'production') {
      logger.info('API request', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        duration: `${duration}ms`,
      });
    }
  });
  
  next();
};

