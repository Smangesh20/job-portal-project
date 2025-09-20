/**
 * Comprehensive Input Validation System
 * Protects against injection attacks, XSS, and data corruption
 */

import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string()
  .email('Invalid email format')
  .min(5, 'Email too short')
  .max(254, 'Email too long')
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain uppercase, lowercase, number, and special character')

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')

export const phoneSchema = z.string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
  .min(10, 'Phone number too short')
  .max(16, 'Phone number too long')

export const urlSchema = z.string()
  .url('Invalid URL format')
  .max(2048, 'URL too long')
  .regex(/^https?:\/\//, 'URL must start with http:// or https://')

// Sanitization functions
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .replace(/iframe/gi, '') // Remove iframe tags
    .replace(/object/gi, '') // Remove object tags
    .replace(/embed/gi, '') // Remove embed tags
    .replace(/link/gi, '') // Remove link tags
    .replace(/meta/gi, '') // Remove meta tags
    .replace(/style/gi, '') // Remove style tags
    .trim()
}

export const sanitizeSql = (input: string): string => {
  return input
    .replace(/['"]/g, '') // Remove quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
    .replace(/union/gi, '') // Remove UNION
    .replace(/select/gi, '') // Remove SELECT
    .replace(/insert/gi, '') // Remove INSERT
    .replace(/update/gi, '') // Remove UPDATE
    .replace(/delete/gi, '') // Remove DELETE
    .replace(/drop/gi, '') // Remove DROP
    .replace(/create/gi, '') // Remove CREATE
    .replace(/alter/gi, '') // Remove ALTER
    .replace(/exec/gi, '') // Remove EXEC
    .replace(/execute/gi, '') // Remove EXECUTE
    .trim()
}

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace invalid chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 255) // Limit length
}

// Validation middleware
export const validateInput = (schema: z.ZodSchema, input: any) => {
  try {
    return { success: true, data: schema.parse(input) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] }
  }
}

// Rate limiting
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}

// File upload validation
export const fileUploadSchema = z.object({
  fieldname: z.string(),
  originalname: z.string().max(255),
  encoding: z.string(),
  mimetype: z.string().regex(/^(image|application|text)\//, 'Invalid file type'),
  size: z.number().max(10 * 1024 * 1024, 'File too large'), // 10MB max
  buffer: z.instanceof(Buffer)
})

// CSRF protection
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken && token.length === 64
}
