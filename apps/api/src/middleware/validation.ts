import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'

export const validateRequest = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)))

    // Check for validation errors
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.type === 'field' ? error.path : 'unknown',
          message: error.msg,
          value: error.type === 'field' ? error.value : undefined,
          type: error.type
        })),
        type: 'VALIDATION_ERROR'
      })
    }

    next()
  }
}

// Common validation rules
export const commonValidations = {
  // Email validation
  email: body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .withMessage('Invalid email format'),

  // Password validation
  password: body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

  // Name validation
  name: body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes')
    .trim()
    .escape(),

  // Phone validation
  phone: body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Must be a valid phone number'),

  // URL validation
  url: body('url')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Must be a valid URL'),

  // UUID validation
  uuid: (field: string) => param(field)
    .isUUID()
    .withMessage('Must be a valid UUID'),

  // Pagination validation
  pagination: {
    page: query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    
    limit: query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt()
  },

  // Job validation
  job: {
    title: body('title')
      .isLength({ min: 5, max: 100 })
      .withMessage('Job title must be between 5 and 100 characters')
      .trim()
      .escape(),

    description: body('description')
      .isLength({ min: 50, max: 5000 })
      .withMessage('Job description must be between 50 and 5000 characters')
      .trim(),

    requirements: body('requirements')
      .isArray({ min: 1 })
      .withMessage('At least one requirement must be provided')
      .custom((requirements) => {
        if (!requirements.every((req: any) => typeof req === 'string' && req.trim().length > 0)) {
          throw new Error('All requirements must be non-empty strings')
        }
        return true
      }),

    responsibilities: body('responsibilities')
      .isArray({ min: 1 })
      .withMessage('At least one responsibility must be provided')
      .custom((responsibilities) => {
        if (!responsibilities.every((resp: any) => typeof resp === 'string' && resp.trim().length > 0)) {
          throw new Error('All responsibilities must be non-empty strings')
        }
        return true
      }),

    salaryMin: body('salaryMin')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Minimum salary must be a non-negative integer'),

    salaryMax: body('salaryMax')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Maximum salary must be a non-negative integer')
      .custom((value, { req }) => {
        if (value && req.body.salaryMin && value < req.body.salaryMin) {
          throw new Error('Maximum salary must be greater than minimum salary')
        }
        return true
      }),

    location: body('location')
      .isLength({ min: 2, max: 100 })
      .withMessage('Location must be between 2 and 100 characters')
      .trim()
      .escape(),

    jobType: body('jobType')
      .isIn(['full-time', 'part-time', 'contract', 'freelance', 'internship'])
      .withMessage('Invalid job type'),

    experience: body('experience')
      .isIn(['entry-level', 'mid-level', 'senior-level', 'lead', 'principal', 'executive'])
      .withMessage('Invalid experience level')
  },

  // Company validation
  company: {
    name: body('name')
      .isLength({ min: 2, max: 100 })
      .withMessage('Company name must be between 2 and 100 characters')
      .trim()
      .escape(),

    description: body('description')
      .isLength({ min: 50, max: 2000 })
      .withMessage('Company description must be between 50 and 2000 characters')
      .trim(),

    industry: body('industry')
      .isLength({ min: 2, max: 50 })
      .withMessage('Industry must be between 2 and 50 characters')
      .trim()
      .escape(),

    size: body('size')
      .isIn(['startup', 'small', 'medium', 'large', 'enterprise'])
      .withMessage('Invalid company size'),

    location: body('location')
      .isObject()
      .withMessage('Location must be an object')
      .custom((location) => {
        if (!location.city || !location.state || !location.country) {
          throw new Error('Location must contain city, state, and country')
        }
        return true
      })
  },

  // User validation
  user: {
    bio: body('bio')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Bio must not exceed 1000 characters')
      .trim(),

    linkedinUrl: body('linkedinUrl')
      .optional()
      .isURL({ protocols: ['https'] })
      .withMessage('LinkedIn URL must be a valid HTTPS URL'),

    githubUrl: body('githubUrl')
      .optional()
      .isURL({ protocols: ['https'] })
      .withMessage('GitHub URL must be a valid HTTPS URL'),

    twitterUrl: body('twitterUrl')
      .optional()
      .isURL({ protocols: ['https'] })
      .withMessage('Twitter URL must be a valid HTTPS URL')
  },

  // Application validation
  application: {
    coverLetter: body('coverLetter')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Cover letter must not exceed 2000 characters')
      .trim(),

    resume: body('resume')
      .optional()
      .isURL()
      .withMessage('Resume must be a valid URL'),

    portfolio: body('portfolio')
      .optional()
      .isURL()
      .withMessage('Portfolio must be a valid URL')
  },

  // Review validation
  review: {
    rating: body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),

    title: body('title')
      .isLength({ min: 5, max: 100 })
      .withMessage('Review title must be between 5 and 100 characters')
      .trim()
      .escape(),

    review: body('review')
      .isLength({ min: 20, max: 1000 })
      .withMessage('Review must be between 20 and 1000 characters')
      .trim(),

    pros: body('pros')
      .optional()
      .isArray()
      .withMessage('Pros must be an array'),

    cons: body('cons')
      .optional()
      .isArray()
      .withMessage('Cons must be an array')
  },

  // Search validation
  search: {
    query: query('search')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters')
      .trim()
      .escape(),

    location: query('location')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Location must be between 2 and 100 characters')
      .trim()
      .escape(),

    jobType: query('jobType')
      .optional()
      .isIn(['full-time', 'part-time', 'contract', 'freelance', 'internship'])
      .withMessage('Invalid job type'),

    experience: query('experience')
      .optional()
      .isIn(['entry-level', 'mid-level', 'senior-level', 'lead', 'principal', 'executive'])
      .withMessage('Invalid experience level'),

    industry: query('industry')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Industry must be between 2 and 50 characters')
      .trim()
      .escape(),

    size: query('size')
      .optional()
      .isIn(['startup', 'small', 'medium', 'large', 'enterprise'])
      .withMessage('Invalid company size'),

    sortBy: query('sortBy')
      .optional()
      .isIn(['relevance', 'date', 'salary', 'match'])
      .withMessage('Invalid sort option'),

    sortOrder: query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  },

  // File validation
  file: {
    maxSize: (maxSizeMB: number = 10) => body('file')
      .custom((file) => {
        if (file && file.size > maxSizeMB * 1024 * 1024) {
          throw new Error(`File size must not exceed ${maxSizeMB}MB`)
        }
        return true
      }),

    allowedTypes: (types: string[]) => body('file')
      .custom((file) => {
        if (file && !types.includes(file.mimetype)) {
          throw new Error(`File type must be one of: ${types.join(', ')}`)
        }
        return true
      })
  }
}

// Custom validation helpers
export const customValidations = {
  // Validate salary range
  validateSalaryRange: body().custom((body) => {
    if (body.salaryMin && body.salaryMax && body.salaryMin > body.salaryMax) {
      throw new Error('Minimum salary cannot be greater than maximum salary')
    }
    return true
  }),

  // Validate date range
  validateDateRange: (startField: string, endField: string) => body().custom((body) => {
    if (body[startField] && body[endField]) {
      const startDate = new Date(body[startField])
      const endDate = new Date(body[endField])
      
      if (startDate >= endDate) {
        throw new Error(`${startField} must be before ${endField}`)
      }
    }
    return true
  }),

  // Validate unique field
  validateUniqueField: (model: any, field: string, message?: string) => body(field).custom(async (value) => {
    if (value) {
      const existing = await model.findUnique({
        where: { [field]: value }
      })
      
      if (existing) {
        throw new Error(message || `${field} already exists`)
      }
    }
    return true
  }),

  // Validate array of strings
  validateStringArray: (field: string, minLength: number = 1) => body(field)
    .isArray({ min: minLength })
    .withMessage(`${field} must be an array with at least ${minLength} item(s)`)
    .custom((array) => {
      if (!array.every((item: any) => typeof item === 'string' && item.trim().length > 0)) {
        throw new Error(`All items in ${field} must be non-empty strings`)
      }
      return true
    }),

  // Validate enum field
  validateEnum: (field: string, enumValues: string[]) => body(field)
    .isIn(enumValues)
    .withMessage(`${field} must be one of: ${enumValues.join(', ')}`),

  // Validate conditional field
  validateConditional: (condition: (body: any) => boolean, field: string, validations: any[]) => body().custom((body) => {
    if (condition(body)) {
      // Apply validations if condition is met
      return Promise.all(validations.map(validation => validation.run({ body })))
    }
    return true
  })
}

// Sanitization helpers
export const sanitization = {
  // Sanitize HTML
  sanitizeHtml: (field: string) => body(field)
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        return value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim()
      }
      return value
    }),

  // Sanitize phone number
  sanitizePhone: (field: string) => body(field)
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        return value.replace(/[^\d+\-\(\)\s]/g, '')
      }
      return value
    }),

  // Sanitize URL
  sanitizeUrl: (field: string) => body(field)
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        return value.trim().toLowerCase()
      }
      return value
    }),

  // Remove extra whitespace
  trimWhitespace: (field: string) => body(field)
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        return value.replace(/\s+/g, ' ').trim()
      }
      return value
    })
}

// Error handling middleware
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
      type: 'VALIDATION_ERROR'
    })
  }
  
  next()
}

// Export validation utilities
export { validateRequest, commonValidations, customValidations, sanitization }
