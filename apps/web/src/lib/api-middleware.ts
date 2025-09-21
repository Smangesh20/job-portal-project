/**
 * Enterprise API Middleware
 * Google-style comprehensive API middleware for security and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecurityMiddleware } from './security';
import { errorHandler } from './error-handler';
import { performanceMonitor } from './performance';
import { monitoringSystem } from './monitoring';

export interface APIMiddlewareOptions {
  requireAuth?: boolean;
  rateLimit?: boolean;
  validateInput?: boolean;
  logRequest?: boolean;
  monitorPerformance?: boolean;
}

export function createAPIMiddleware(options: APIMiddlewareOptions = {}) {
  return async function apiMiddleware(
    handler: (request: NextRequest, context: any) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, context: any) => {
      const startTime = performance.now();
      const requestId = `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create security instance
      const security = createSecurityMiddleware({
        rateLimitWindowMs: 15 * 60 * 1000,
        rateLimitMaxRequests: 100,
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key',
        sessionTimeout: 24 * 60 * 60 * 1000,
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000
      });
      
      try {
        // 1. Security validation
        const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
        
        // Rate limiting
        if (options.rateLimit !== false) {
          if (!security.rateLimit(clientIP)) {
            return NextResponse.json(
              { 
                success: false, 
                error: { 
                  code: 'RATE_LIMIT_EXCEEDED', 
                  message: 'Too many requests. Please try again later.' 
                },
                requestId
              },
              { status: 429 }
            );
          }
        }

        // 2. Authentication check
        if (options.requireAuth) {
          const token = request.headers.get('authorization')?.replace('Bearer ', '');
          if (!token) {
            return NextResponse.json(
              { 
                success: false, 
                error: { 
                  code: 'UNAUTHORIZED', 
                  message: 'Authentication required' 
                },
                requestId
              },
              { status: 401 }
            );
          }

          const validation = security.validateJWT(token);
          if (!validation.isValid) {
            return NextResponse.json(
              { 
                success: false, 
                error: { 
                  code: 'INVALID_TOKEN', 
                  message: 'Invalid or expired token' 
                },
                requestId
              },
              { status: 401 }
            );
          }
        }

        // 3. Input validation
        if (options.validateInput !== false) {
          if (request.method === 'POST' || request.method === 'PUT') {
            try {
              const body = await request.json();
              const sanitizedBody = sanitizeRequestBody(body, security);
              request.json = () => Promise.resolve(sanitizedBody);
            } catch (error) {
              return NextResponse.json(
                { 
                  success: false, 
                  error: { 
                    code: 'INVALID_JSON', 
                    message: 'Invalid JSON body' 
                  },
                  requestId
                },
                { status: 400 }
              );
            }
          }
        }

        // 4. Log request
        if (options.logRequest !== false) {
          console.log(`🚀 ENTERPRISE API: ${request.method} ${request.url} - ${requestId}`);
        }

        // 5. Execute handler
        const response = await handler(request, context);

        // 6. Performance monitoring
        if (options.monitorPerformance !== false) {
          const duration = performance.now() - startTime;
          performanceMonitor.recordMetric('api-duration', duration, 'ms', {
            url: request.url,
            userAgent: request.headers.get('user-agent') || ''
          });
        }

        // 7. Add response headers
        if (response instanceof NextResponse) {
          response.headers.set('X-Request-ID', requestId);
          response.headers.set('X-Response-Time', (performance.now() - startTime).toString());
          response.headers.set('X-Server-Version', '1.0.0');
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

        // Create error response
        const errorResponse = NextResponse.json(
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

        // Add security headers
        errorResponse.headers.set('X-Request-ID', requestId);
        errorResponse.headers.set('X-Response-Time', (performance.now() - startTime).toString());

        return errorResponse;
      }
    };
  };
}

// Sanitize request body
function sanitizeRequestBody(body: any, security: any): any {
  if (typeof body === 'string') {
    return security.sanitizeInput(body);
  }
  
  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item, security));
  }
  
  if (typeof body === 'object' && body !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(body)) {
      const sanitizedKey = security.sanitizeInput(key);
      sanitized[sanitizedKey] = sanitizeRequestBody(value, security);
    }
    return sanitized;
  }
  
  return body;
}

// Pre-configured middleware options
export const middlewareOptions = {
  // Public API (no auth required)
  public: {
    requireAuth: false,
    rateLimit: true,
    validateInput: true,
    logRequest: true,
    monitorPerformance: true
  },
  
  // Protected API (auth required)
  protected: {
    requireAuth: true,
    rateLimit: true,
    validateInput: true,
    logRequest: true,
    monitorPerformance: true
  },
  
  // Admin API (high security)
  admin: {
    requireAuth: true,
    rateLimit: true,
    validateInput: true,
    logRequest: true,
    monitorPerformance: true
  },
  
  // Read-only API (minimal validation)
  readOnly: {
    requireAuth: false,
    rateLimit: true,
    validateInput: false,
    logRequest: true,
    monitorPerformance: true
  }
};

// Export pre-configured middleware
export const publicAPIMiddleware = createAPIMiddleware(middlewareOptions.public);
export const protectedAPIMiddleware = createAPIMiddleware(middlewareOptions.protected);
export const adminAPIMiddleware = createAPIMiddleware(middlewareOptions.admin);
export const readOnlyAPIMiddleware = createAPIMiddleware(middlewareOptions.readOnly);
