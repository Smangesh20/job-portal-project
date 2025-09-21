import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Development protection middleware
export const developmentProtection = (req: Request, res: Response, next: NextFunction) => {
  // Block access to development features in production
  if (process.env.NODE_ENV === 'production') {
    const blockedPaths = [
      '/api/debug',
      '/api/dev',
      '/api/test',
      '/api/stats',
      '/api/metrics',
      '/api/health/detailed',
      '/api/admin/debug',
      '/api/admin/test',
    ];

    const isBlockedPath = blockedPaths.some(path => req.path.startsWith(path));
    
    if (isBlockedPath) {
      logger.warn('Blocked development endpoint access in production', {
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found',
        },
      });
    }

    // Block access to source maps and development files
    if (req.path.includes('.map') || req.path.includes('webpack') || req.path.includes('hot-reload')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
        },
      });
    }
  }

  next();
};

// Hide development information in production
export const hideDevelopmentInfo = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    // Remove development headers
    res.removeHeader('X-Powered-By');
    
    // Override error responses to hide stack traces
    const originalJson = res.json;
    res.json = function(data: any) {
      if (data && data.error && data.error.stack) {
        delete data.error.stack;
        data.error.message = 'An error occurred';
      }
      return originalJson.call(this, data);
    };
  }

  next();
};

// Disable debugging in production
export const disableDebugging = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    // Disable console.log in production (if possible)
    if (req.query.debug || req.headers['x-debug']) {
      logger.warn('Debug request blocked in production', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        query: req.query,
      });
      
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Debug mode is disabled in production',
        },
      });
    }
  }

  next();
};

// Environment variable protection
export const protectEnvironmentVariables = (req: Request, res: Response, next: NextFunction) => {
  // Block requests that might expose environment variables
  const sensitivePaths = [
    '/.env',
    '/env',
    '/config',
    '/settings',
    '/admin/config',
    '/api/config',
  ];

  const isSensitivePath = sensitivePaths.some(path => req.path.includes(path));
  
  if (isSensitivePath) {
    logger.warn('Blocked sensitive path access', {
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    });
  }

  next();
};

// Block common attack patterns
export const blockAttackPatterns = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  const path = req.path.toLowerCase();
  
  // Block common attack patterns
  const attackPatterns = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'zap',
    'burp',
    'w3af',
    'acunetix',
    'nessus',
    'openvas',
    '..',
    '../',
    '.../',
    '....//',
    '..../',
    '....//',
    '/etc/passwd',
    '/etc/shadow',
    '/proc/version',
    '/proc/cpuinfo',
    'cmd.exe',
    'powershell',
    'bash',
    'sh',
    'phpinfo',
    'info.php',
    'test.php',
    'admin.php',
    'login.php',
    'wp-admin',
    'wp-login',
    'xmlrpc.php',
    'readme.txt',
    'license.txt',
    'changelog.txt',
  ];

  // Check user agent
  const suspiciousUA = attackPatterns.some(pattern => 
    userAgent.toLowerCase().includes(pattern)
  );

  // Check path
  const suspiciousPath = attackPatterns.some(pattern => 
    path.includes(pattern)
  );

  if (suspiciousUA || suspiciousPath) {
    logger.warn('Blocked suspicious request', {
      ip: req.ip,
      userAgent,
      path: req.path,
      suspiciousUA,
      suspiciousPath,
    });
    
    return res.status(403).json({
      success: false,
      error: {
        code: 'ACCESS_DENIED',
        message: 'Access denied',
      },
    });
  }

  next();
};

