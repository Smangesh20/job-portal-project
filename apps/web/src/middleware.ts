/**
 * Enterprise Middleware System
 * Google-style comprehensive middleware for security, performance, and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityHeaders, createSecurityMiddleware } from './lib/security';
import { errorHandler } from './lib/error-handler';
import { performanceMonitor } from './lib/performance';
import { monitoringSystem } from './lib/monitoring';

// Security configuration
const securityConfig = {
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutes
};

// Create security middleware
const security = createSecurityMiddleware(securityConfig);

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    // 1. Security Headers
    const response = NextResponse.next();
    
    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // 2. Rate Limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!security.rateLimit(clientIP)) {
      return new NextResponse('Rate limit exceeded', { status: 429 });
    }

    // 3. Input Validation
    const url = new URL(request.url);
    const sanitizedPath = security.sanitizeInput(url.pathname);
    
    if (sanitizedPath !== url.pathname) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // 4. CSRF Protection
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
      const csrfToken = request.headers.get('x-csrf-token');
      const sessionToken = request.cookies.get('csrf-token')?.value;
      
      if (!csrfToken || !security.validateCSRFToken(csrfToken, sessionToken || '')) {
        return new NextResponse('CSRF token validation failed', { status: 403 });
      }
    }

    // 5. Authentication Check
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (token && !security.validateJWT(token).isValid) {
      return new NextResponse('Invalid token', { status: 401 });
    }

    // 6. Failed Login Tracking
    if (url.pathname.includes('/api/auth/login')) {
      if (!security.trackFailedLogin(clientIP)) {
        return new NextResponse('Account temporarily locked', { status: 423 });
      }
    }

    // 7. Performance Monitoring
    const duration = Date.now() - startTime;
    performanceMonitor.recordMetric('middleware-duration', duration, 'ms', {
      url: request.url,
      userAgent: request.headers.get('user-agent') || ''
    });

    // 8. Request Logging
    console.log(`🚀 ENTERPRISE: ${request.method} ${url.pathname} - ${duration}ms`);

    // 9. Add request metadata
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Response-Time', duration.toString());
    response.headers.set('X-Server-Version', '1.0.0');

    return response;

  } catch (error) {
    // Error handling
    const errorResult = errorHandler.handleAPIError(error as Error, {
      requestId,
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || 'unknown',
      timestamp: Date.now()
    });

    // Create error response
    const errorResponse = new NextResponse(
      JSON.stringify({
        success: false,
        error: {
          code: errorResult.statusCode.toString(),
          message: errorResult.userMessage
        },
        requestId
      }),
      {
        status: errorResult.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId
        }
      }
    );

    // Apply security headers to error response
    Object.entries(securityHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });

    return errorResponse;
  }
}

// Configure middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// API Route Middleware
export function apiMiddleware(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const startTime = Date.now();
    const requestId = `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // 1. Security validation
      const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
      
      // Rate limiting
      if (!security.rateLimit(clientIP)) {
        return NextResponse.json(
          { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
          { status: 429 }
        );
      }

      // 2. Input sanitization
      if (request.method === 'POST' || request.method === 'PUT') {
        try {
          const body = await request.json();
          const sanitizedBody = sanitizeRequestBody(body);
          request.json = () => Promise.resolve(sanitizedBody);
        } catch (error) {
          return NextResponse.json(
            { success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } },
            { status: 400 }
          );
        }
      }

      // 3. Authentication
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (token) {
        const validation = security.validateJWT(token);
        if (!validation.isValid) {
          return NextResponse.json(
            { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
            { status: 401 }
          );
        }
      }

      // 4. Execute handler
      const response = await handler(request, context);

      // 5. Performance monitoring
      const duration = Date.now() - startTime;
      performanceMonitor.recordMetric('api-duration', duration, 'ms', {
        url: request.url,
        userAgent: request.headers.get('user-agent') || ''
      });

      // 6. Add response headers
      if (response instanceof NextResponse) {
        response.headers.set('X-Request-ID', requestId);
        response.headers.set('X-Response-Time', duration.toString());
      }

      return response;

    } catch (error) {
      const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
      const errorResult = errorHandler.handleAPIError(error as Error, {
        requestId,
        url: request.url,
        method: request.method,
        userAgent: request.headers.get('user-agent') || '',
        ip: clientIP,
        timestamp: Date.now()
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: errorResult.statusCode.toString(),
            message: errorResult.userMessage
          },
          requestId
        },
        { status: errorResult.statusCode }
      );
    }
  };
}

// Sanitize request body
function sanitizeRequestBody(body: any): any {
  if (typeof body === 'string') {
    return security.sanitizeInput(body);
  }
  
  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item));
  }
  
  if (typeof body === 'object' && body !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(body)) {
      const sanitizedKey = security.sanitizeInput(key);
      sanitized[sanitizedKey] = sanitizeRequestBody(value);
    }
    return sanitized;
  }
  
  return body;
}

// Health check endpoint
export async function healthCheck(request: NextRequest) {
  try {
    const healthStatus = monitoringSystem.getHealthStatus();
    
    return NextResponse.json({
      success: true,
      data: {
        status: healthStatus.overall,
        timestamp: Date.now(),
        version: '1.0.0',
        checks: healthStatus.checks,
        uptime: process.uptime()
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: 'Health check failed'
        }
      },
      { status: 500 }
    );
  }
}
