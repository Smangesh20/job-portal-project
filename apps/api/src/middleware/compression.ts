import { Request, Response, NextFunction } from 'express'
import { gzip, deflate, brotliCompress } from 'zlib'
import { promisify } from 'util'

// Promisify compression functions
const gzipAsync = promisify(gzip)
const deflateAsync = promisify(deflate)
const brotliCompressAsync = promisify(brotliCompress)

// Compression configuration
interface CompressionOptions {
  level?: number
  threshold?: number
  filter?: (req: Request, res: Response) => boolean
  chunkSize?: number
  windowBits?: number
  memLevel?: number
  strategy?: number
}

// Default compression options
const defaultOptions: CompressionOptions = {
  level: 6, // Compression level (1-9, 6 is good balance)
  threshold: 1024, // Only compress responses larger than 1KB
  chunkSize: 16 * 1024, // 16KB chunks
  windowBits: 15,
  memLevel: 8,
  strategy: 0
}

// Check if response should be compressed
const shouldCompress = (req: Request, res: Response): boolean => {
  // Don't compress if already compressed
  if (res.getHeader('Content-Encoding')) {
    return false
  }

  // Don't compress if content-length is too small
  const contentLength = res.getHeader('Content-Length')
  if (contentLength && parseInt(contentLength as string) < defaultOptions.threshold!) {
    return false
  }

  // Don't compress certain content types
  const contentType = res.getHeader('Content-Type') as string
  if (contentType) {
    const noCompressTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/zip',
      'application/gzip',
      'application/x-gzip',
      'application/octet-stream'
    ]

    if (noCompressTypes.some(type => contentType.includes(type))) {
      return false
    }
  }

  // Don't compress if client doesn't support compression
  const acceptEncoding = req.headers['accept-encoding'] as string
  if (!acceptEncoding) {
    return false
  }

  return true
}

// Get best compression method based on client support
const getCompressionMethod = (req: Request): 'gzip' | 'deflate' | 'brotli' | null => {
  const acceptEncoding = req.headers['accept-encoding'] as string
  
  if (!acceptEncoding) {
    return null
  }

  // Check for Brotli support (best compression)
  if (acceptEncoding.includes('br')) {
    return 'brotli'
  }

  // Check for Gzip support
  if (acceptEncoding.includes('gzip')) {
    return 'gzip'
  }

  // Check for Deflate support
  if (acceptEncoding.includes('deflate')) {
    return 'deflate'
  }

  return null
}

// Compress response data
const compressData = async (data: Buffer, method: string): Promise<Buffer> => {
  switch (method) {
    case 'gzip':
      return gzipAsync(data)
    case 'deflate':
      return deflateAsync(data)
    case 'brotli':
      return brotliCompressAsync(data)
    default:
      throw new Error(`Unsupported compression method: ${method}`)
  }
}

// Compression middleware
export const compressionMiddleware = (options: CompressionOptions = {}) => {
  const opts = { ...defaultOptions, ...options }

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip compression if not needed
    if (!shouldCompress(req, res)) {
      return next()
    }

    // Get compression method
    const method = getCompressionMethod(req)
    if (!method) {
      return next()
    }

    // Store original methods
    const originalWrite = res.write
    const originalEnd = res.end
    const originalWriteHead = res.writeHead

    // Buffer to store response data
    let responseBuffer = Buffer.alloc(0)
    let statusCode: number | undefined
    let headers: any = {}

    // Override writeHead to capture status and headers
    res.writeHead = function(code: number, headersOrMessage?: any, message?: string) {
      statusCode = code
      
      if (typeof headersOrMessage === 'object') {
        headers = { ...headersOrMessage }
      } else if (headersOrMessage) {
        headers['Content-Type'] = headersOrMessage
      }
      
      if (message) {
        headers['Content-Type'] = message
      }

      return this
    }

    // Override write to capture data
    res.write = function(chunk: any, encoding?: any): boolean {
      if (chunk) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
        responseBuffer = Buffer.concat([responseBuffer, buffer])
      }
      return true
    }

    // Override end to compress and send
    res.end = async function(chunk?: any, encoding?: any): Promise<Response> {
      try {
        // Add final chunk if provided
        if (chunk) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
          responseBuffer = Buffer.concat([responseBuffer, buffer])
        }

        // Compress the response
        const compressedData = await compressData(responseBuffer, method)
        
        // Set compression headers
        res.setHeader('Content-Encoding', method)
        res.setHeader('Content-Length', compressedData.length.toString())
        res.setHeader('Vary', 'Accept-Encoding')

        // Add compression ratio header for debugging
        if (process.env.NODE_ENV === 'development') {
          const ratio = ((responseBuffer.length - compressedData.length) / responseBuffer.length * 100).toFixed(2)
          res.setHeader('X-Compression-Ratio', `${ratio}%`)
        }

        // Restore original writeHead and call it
        res.writeHead = originalWriteHead
        if (statusCode) {
          res.writeHead(statusCode, headers)
        }

        // Send compressed data
        return originalEnd.call(this, compressedData)
      } catch (error) {
        console.error('Compression error:', error)
        // Fallback to uncompressed response
        res.setHeader('Content-Length', responseBuffer.length.toString())
        return originalEnd.call(this, responseBuffer)
      }
    }

    next()
  }
}

// Static file compression middleware
export const staticCompressionMiddleware = (options: CompressionOptions = {}) => {
  const opts = { ...defaultOptions, ...options }

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only compress static files
    if (!req.path.match(/\.(css|js|html|json|xml|txt|svg)$/)) {
      return next()
    }

    // Check if file should be compressed
    if (!shouldCompress(req, res)) {
      return next()
    }

    // Get compression method
    const method = getCompressionMethod(req)
    if (!method) {
      return next()
    }

    // Store original methods
    const originalWrite = res.write
    const originalEnd = res.end

    // Buffer to store response data
    let responseBuffer = Buffer.alloc(0)

    // Override write to capture data
    res.write = function(chunk: any, encoding?: any): boolean {
      if (chunk) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
        responseBuffer = Buffer.concat([responseBuffer, buffer])
      }
      return true
    }

    // Override end to compress and send
    res.end = async function(chunk?: any, encoding?: any): Promise<Response> {
      try {
        // Add final chunk if provided
        if (chunk) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
          responseBuffer = Buffer.concat([responseBuffer, buffer])
        }

        // Compress the response
        const compressedData = await compressData(responseBuffer, method)
        
        // Set compression headers
        res.setHeader('Content-Encoding', method)
        res.setHeader('Content-Length', compressedData.length.toString())
        res.setHeader('Vary', 'Accept-Encoding')

        // Send compressed data
        return originalEnd.call(this, compressedData)
      } catch (error) {
        console.error('Static compression error:', error)
        // Fallback to uncompressed response
        return originalEnd.call(this, responseBuffer)
      }
    }

    next()
  }
}

// API response compression middleware
export const apiCompressionMiddleware = (options: CompressionOptions = {}) => {
  const opts = { ...defaultOptions, ...options }

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only compress API responses
    if (!req.path.startsWith('/api/')) {
      return next()
    }

    // Check if response should be compressed
    if (!shouldCompress(req, res)) {
      return next()
    }

    // Get compression method
    const method = getCompressionMethod(req)
    if (!method) {
      return next()
    }

    // Store original methods
    const originalJson = res.json
    const originalSend = res.send

    // Override json to compress JSON responses
    res.json = async function(obj: any): Promise<Response> {
      try {
        const jsonString = JSON.stringify(obj)
        const compressedData = await compressData(Buffer.from(jsonString, 'utf8'), method)
        
        // Set compression headers
        res.setHeader('Content-Encoding', method)
        res.setHeader('Content-Length', compressedData.length.toString())
        res.setHeader('Vary', 'Accept-Encoding')
        res.setHeader('Content-Type', 'application/json')

        // Add compression ratio header for debugging
        if (process.env.NODE_ENV === 'development') {
          const ratio = ((jsonString.length - compressedData.length) / jsonString.length * 100).toFixed(2)
          res.setHeader('X-Compression-Ratio', `${ratio}%`)
        }

        return originalSend.call(this, compressedData)
      } catch (error) {
        console.error('API compression error:', error)
        // Fallback to uncompressed response
        return originalJson.call(this, obj)
      }
    }

    // Override send to compress text responses
    res.send = async function(body: any): Promise<Response> {
      try {
        if (typeof body === 'string' && body.length > opts.threshold!) {
          const compressedData = await compressData(Buffer.from(body, 'utf8'), method)
          
          // Set compression headers
          res.setHeader('Content-Encoding', method)
          res.setHeader('Content-Length', compressedData.length.toString())
          res.setHeader('Vary', 'Accept-Encoding')

          return originalSend.call(this, compressedData)
        } else {
          return originalSend.call(this, body)
        }
      } catch (error) {
        console.error('API send compression error:', error)
        // Fallback to uncompressed response
        return originalSend.call(this, body)
      }
    }

    next()
  }
}

// Compression statistics middleware
export const compressionStatsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  const originalEnd = res.end

  res.end = function(chunk?: any, encoding?: any): Response {
    const endTime = Date.now()
    const duration = endTime - startTime

    // Add performance headers
    res.setHeader('X-Response-Time', `${duration}ms`)
    
    if (res.getHeader('Content-Encoding')) {
      const contentLength = res.getHeader('Content-Length')
      if (contentLength) {
        res.setHeader('X-Compressed-Size', contentLength)
      }
    }

    return originalEnd.call(this, chunk, encoding)
  }

  next()
}

// Pre-compressed file serving middleware
export const preCompressedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const acceptEncoding = req.headers['accept-encoding'] as string
  
  if (!acceptEncoding) {
    return next()
  }

  // Check for pre-compressed files
  if (acceptEncoding.includes('br')) {
    // Try Brotli compressed file
    const brotliFile = req.path + '.br'
    // In a real implementation, you'd check if the file exists and serve it
    // For now, we'll just pass through
  } else if (acceptEncoding.includes('gzip')) {
    // Try Gzip compressed file
    const gzipFile = req.path + '.gz'
    // In a real implementation, you'd check if the file exists and serve it
    // For now, we'll just pass through
  }

  next()
}

// Export all compression utilities
export {
  compressionMiddleware,
  staticCompressionMiddleware,
  apiCompressionMiddleware,
  compressionStatsMiddleware,
  preCompressedMiddleware,
  shouldCompress,
  getCompressionMethod,
  compressData
}
