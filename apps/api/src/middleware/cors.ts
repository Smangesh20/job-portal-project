import { Request, Response, NextFunction } from 'express'

// CORS configuration
interface CorsOptions {
  origin: string | string[] | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void)
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
  preflightContinue?: boolean
  optionsSuccessStatus?: number
}

// Environment-based CORS configuration
const getCorsOptions = (): CorsOptions => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://askyacham.com',
    'https://www.askyacham.com',
    'https://app.askyacham.com'
  ]

  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true)
      }

      // In development, allow localhost origins
      if (isDevelopment && origin.includes('localhost')) {
        return callback(null, true)
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // For production, be strict about origins
      if (isProduction) {
        const message = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`
        return callback(new Error(message), false)
      }

      // Allow in other environments
      callback(null, true)
    },
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
      'HEAD'
    ],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'X-API-Key',
      'X-Request-ID',
      'X-Forwarded-For',
      'X-Real-IP',
      'User-Agent'
    ],
    exposedHeaders: [
      'X-Request-ID',
      'X-Rate-Limit-Limit',
      'X-Rate-Limit-Remaining',
      'X-Rate-Limit-Reset',
      'X-Total-Count',
      'X-Page-Count'
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200,
    preflightContinue: false
  }
}

// CORS middleware
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const options = getCorsOptions()

  // Set CORS headers
  const setCorsHeaders = (origin: string | undefined) => {
    if (origin && options.origin) {
      if (typeof options.origin === 'function') {
        options.origin(origin, (err, allow) => {
          if (err || !allow) {
            res.status(403).json({
              success: false,
              message: 'CORS policy violation',
              error: err?.message || 'Origin not allowed'
            })
            return
          }
          setHeaders(origin)
        })
      } else if (Array.isArray(options.origin) && options.origin.includes(origin)) {
        setHeaders(origin)
      } else if (options.origin === origin) {
        setHeaders(origin)
      } else {
        res.status(403).json({
          success: false,
          message: 'CORS policy violation',
          error: 'Origin not allowed'
        })
        return
      }
    } else {
      setHeaders('*')
    }
  }

  const setHeaders = (origin: string | undefined) => {
    // Set Access-Control-Allow-Origin
    if (options.credentials && origin && origin !== '*') {
      res.setHeader('Access-Control-Allow-Origin', origin)
    } else if (origin === '*' || !origin) {
      res.setHeader('Access-Control-Allow-Origin', '*')
    }

    // Set Access-Control-Allow-Methods
    if (options.methods && options.methods.length > 0) {
      res.setHeader('Access-Control-Allow-Methods', options.methods.join(', '))
    }

    // Set Access-Control-Allow-Headers
    if (options.allowedHeaders && options.allowedHeaders.length > 0) {
      res.setHeader('Access-Control-Allow-Headers', options.allowedHeaders.join(', '))
    }

    // Set Access-Control-Expose-Headers
    if (options.exposedHeaders && options.exposedHeaders.length > 0) {
      res.setHeader('Access-Control-Expose-Headers', options.exposedHeaders.join(', '))
    }

    // Set Access-Control-Allow-Credentials
    if (options.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true')
    }

    // Set Access-Control-Max-Age
    if (options.maxAge) {
      res.setHeader('Access-Control-Max-Age', options.maxAge.toString())
    }

    // Add custom headers
    res.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId())
  }

  const origin = req.headers.origin as string | undefined

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    setCorsHeaders(origin)
    
    if (options.preflightContinue) {
      next()
    } else {
      res.status(options.optionsSuccessStatus || 200).end()
    }
    return
  }

  // Handle actual requests
  setCorsHeaders(origin)
  next()
}

// Generate unique request ID
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Security headers middleware
export const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  )
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.askyacham.com *.googleapis.com *.gstatic.com",
    "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
    "img-src 'self' data: blob: *.askyacham.com *.googleusercontent.com",
    "font-src 'self' *.googleapis.com *.gstatic.com",
    "connect-src 'self' *.askyacham.com wss: ws:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  res.setHeader('Content-Security-Policy', csp)
  
  // Strict Transport Security (HTTPS only)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  next()
}

// Request ID middleware
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || generateRequestId()
  req.headers['x-request-id'] = requestId
  res.setHeader('X-Request-ID', requestId)
  next()
}

// Custom CORS error handler
export const corsErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message.includes('CORS')) {
    res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: err.message,
      code: 'CORS_ERROR'
    })
  } else {
    next(err)
  }
}

// Development CORS middleware (more permissive)
export const developmentCorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
  }
  
  next()
}

// API-specific CORS middleware
export const apiCorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if request is for API routes
  if (req.path.startsWith('/api/')) {
    corsMiddleware(req, res, next)
  } else {
    next()
  }
}

// WebSocket CORS middleware
export const websocketCorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if request is for WebSocket upgrade
  if (req.headers.upgrade === 'websocket') {
    const origin = req.headers.origin
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
    
    if (origin && allowedOrigins.includes(origin)) {
      next()
    } else {
      res.status(403).json({
        success: false,
        message: 'WebSocket CORS policy violation',
        error: 'Origin not allowed for WebSocket connections'
      })
    }
  } else {
    next()
  }
}

// Export all CORS utilities
export {
  getCorsOptions,
  corsMiddleware,
  securityHeadersMiddleware,
  requestIdMiddleware,
  corsErrorHandler,
  developmentCorsMiddleware,
  apiCorsMiddleware,
  websocketCorsMiddleware
}
