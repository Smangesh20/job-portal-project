/**
 * Validation Middleware
 * Provides comprehensive input validation and sanitization using Joi
 */

const Joi = require('joi');
const featureFlags = require('./featureFlags');
const { ValidationError } = require('../utils/errorClasses');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorConstants');

/**
 * Joi Validation Schemas for all API endpoints
 */

// Common validation patterns
const commonPatterns = {
  email: Joi.string().email().trim().lowercase(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
  phoneNumber: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).message('Invalid phone number format'),
  url: Joi.string().uri(),
  positiveInteger: Joi.number().integer().positive(),
  nonNegativeInteger: Joi.number().integer().min(0),
  dateString: Joi.date().iso(),
  futureDate: Joi.date().greater('now')
};

// Authentication schemas
const authSchemas = {
  signup: Joi.object({
    email: commonPatterns.email.required(),
    password: commonPatterns.password.required(),
    type: Joi.string().valid('recruiter', 'applicant').required(),
    name: Joi.string().min(2).max(100).trim().required(),
    contactNumber: Joi.when('type', {
      is: 'recruiter',
      then: commonPatterns.phoneNumber.required(),
      otherwise: commonPatterns.phoneNumber.optional()
    }),
    bio: Joi.string().max(500).trim().optional(),
    skills: Joi.array().items(Joi.string().min(1).max(50).trim()).max(20).optional(),
    education: Joi.array().items(
      Joi.object({
        institutionName: Joi.string().min(2).max(200).trim().required(),
        startYear: Joi.number().integer().min(1950).max(new Date().getFullYear()).required(),
        endYear: Joi.number().integer().min(Joi.ref('startYear')).max(new Date().getFullYear() + 10).optional()
      })
    ).max(10).optional()
  }),

  login: Joi.object({
    email: commonPatterns.email.required(),
    password: Joi.string().required()
  }),

  otpRequest: Joi.object({
    identifier: Joi.string().trim().required(),
    intent: Joi.string().valid('login', 'signup', 'auto').default('auto').optional(),
    type: Joi.string().valid('recruiter', 'applicant').default('applicant').optional(),
    name: Joi.string().min(2).max(100).trim().optional(),
    contactNumber: commonPatterns.phoneNumber.optional(),
    bio: Joi.string().max(500).trim().optional()
  }),

  otpVerify: Joi.object({
    identifier: Joi.string().trim().required(),
    otp: Joi.string().pattern(/^\d{6}$/).required(),
    intent: Joi.string().valid('login', 'signup', 'auto').default('auto').optional(),
    type: Joi.string().valid('recruiter', 'applicant').default('applicant').optional(),
    name: Joi.string().min(2).max(100).trim().optional(),
    contactNumber: commonPatterns.phoneNumber.optional(),
    bio: Joi.string().max(500).trim().optional()
  })
};

// Job management schemas
const jobSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(100).trim().required(),
    maxApplicants: commonPatterns.positiveInteger.max(1000).required(),
    maxPositions: commonPatterns.positiveInteger.max(100).required(),
    deadline: commonPatterns.futureDate.required(),
    skillsets: Joi.array().items(Joi.string().min(1).max(50).trim()).min(1).max(20).required(),
    jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').required(),
    duration: Joi.number().integer().min(0).max(60).when('jobType', {
      is: Joi.valid('contract', 'internship'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    salary: commonPatterns.nonNegativeInteger.max(10000000).required(),
    location: Joi.string().min(2).max(100).trim().optional(),
    description: Joi.string().max(2000).trim().optional(),
    requirements: Joi.string().max(1000).trim().optional(),
    benefits: Joi.string().max(1000).trim().optional()
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(100).trim().optional(),
    maxApplicants: commonPatterns.positiveInteger.max(1000).optional(),
    maxPositions: commonPatterns.positiveInteger.max(100).optional(),
    deadline: commonPatterns.futureDate.optional(),
    skillsets: Joi.array().items(Joi.string().min(1).max(50).trim()).min(1).max(20).optional(),
    jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').optional(),
    duration: Joi.number().integer().min(0).max(60).optional(),
    salary: commonPatterns.nonNegativeInteger.max(10000000).optional(),
    location: Joi.string().min(2).max(100).trim().optional(),
    description: Joi.string().max(2000).trim().optional(),
    requirements: Joi.string().max(1000).trim().optional(),
    benefits: Joi.string().max(1000).trim().optional()
  }).min(1), // At least one field must be provided for update

  query: Joi.object({
    q: Joi.string().max(100).trim().optional(), // Search query
    jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').optional(),
    salary: Joi.object({
      min: commonPatterns.nonNegativeInteger.optional(),
      max: commonPatterns.nonNegativeInteger.optional()
    }).optional(),
    location: Joi.string().max(100).trim().optional(),
    skills: Joi.array().items(Joi.string().min(1).max(50).trim()).max(10).optional(),
    page: commonPatterns.positiveInteger.default(1).optional(),
    limit: Joi.number().integer().min(1).max(100).default(10).optional(),
    sort: Joi.string().valid('salary', 'deadline', 'createdAt', '-salary', '-deadline', '-createdAt').default('-createdAt').optional()
  })
};

// Application schemas
const applicationSchemas = {
  create: Joi.object({
    sop: Joi.string().min(50).max(1000).trim().required() // Statement of Purpose
  }),

  update: Joi.object({
    status: Joi.string().valid('applied', 'shortlisted', 'accepted', 'rejected', 'deleted', 'cancelled', 'finished').required()
  }),

  query: Joi.object({
    status: Joi.string().valid('applied', 'shortlisted', 'accepted', 'rejected', 'deleted', 'cancelled', 'finished').optional(),
    jobId: commonPatterns.objectId.optional(),
    page: commonPatterns.positiveInteger.default(1).optional(),
    limit: Joi.number().integer().min(1).max(100).default(10).optional(),
    sort: Joi.string().valid('dateOfApplication', 'status', '-dateOfApplication', '-status').default('-dateOfApplication').optional()
  })
};

// User profile schemas
const userSchemas = {
  update: Joi.object({
    name: Joi.string().min(2).max(100).trim().optional(),
    bio: Joi.string().max(500).trim().optional(),
    contactNumber: commonPatterns.phoneNumber.optional(),
    skills: Joi.array().items(Joi.string().min(1).max(50).trim()).max(20).optional(),
    education: Joi.array().items(
      Joi.object({
        institutionName: Joi.string().min(2).max(200).trim().required(),
        startYear: Joi.number().integer().min(1950).max(new Date().getFullYear()).required(),
        endYear: Joi.number().integer().min(Joi.ref('startYear')).max(new Date().getFullYear() + 10).optional()
      })
    ).max(10).optional(),
    profile: Joi.string().optional() // Profile image filename
  }).min(1) // At least one field must be provided for update
};

// Rating schemas
const ratingSchemas = {
  create: Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    category: Joi.string().valid('applicant', 'job').required(),
    applicantId: Joi.when('category', {
      is: 'applicant',
      then: commonPatterns.objectId.required(),
      otherwise: Joi.forbidden()
    }),
    jobId: Joi.when('category', {
      is: 'job',
      then: commonPatterns.objectId.required(),
      otherwise: Joi.forbidden()
    })
  })
};

// File upload schemas
const fileSchemas = {
  resume: Joi.object({
    // File validation will be handled by multer middleware
    // This schema validates any additional data sent with file upload
  }),

  profile: Joi.object({
    // File validation will be handled by multer middleware
    // This schema validates any additional data sent with file upload
  })
};

// Parameter validation schemas
const paramSchemas = {
  objectId: Joi.object({
    id: commonPatterns.objectId.required()
  }),

  filename: Joi.object({
    file: Joi.string().pattern(/^[a-zA-Z0-9._-]+$/).max(255).required()
  })
};

/**
 * Comprehensive validation schemas organized by endpoint
 */
const validationSchemas = {
  // Authentication routes
  'POST /auth/signup': authSchemas.signup,
  'POST /auth/login': authSchemas.login,
  'POST /auth/otp/request': authSchemas.otpRequest,
  'POST /auth/otp/verify': authSchemas.otpVerify,

  // Job management routes
  'POST /api/jobs': jobSchemas.create,
  'GET /api/jobs': jobSchemas.query,
  'PUT /api/jobs/:id': jobSchemas.update,
  'DELETE /api/jobs/:id': paramSchemas.objectId,
  'GET /api/jobs/:id': paramSchemas.objectId,

  // Application routes
  'POST /api/jobs/:id/applications': applicationSchemas.create,
  'GET /api/jobs/:id/applications': applicationSchemas.query,
  'GET /api/applications': applicationSchemas.query,
  'PUT /api/applications/:id': applicationSchemas.update,

  // User profile routes
  'PUT /api/user': userSchemas.update,
  'GET /api/user': Joi.object({}), // No validation needed for getting own profile
  'GET /api/user/:id': paramSchemas.objectId,

  // Rating routes
  'PUT /api/rating': ratingSchemas.create,
  'GET /api/rating': Joi.object({}), // No validation needed for getting own rating

  // File upload routes
  'POST /upload/resume': fileSchemas.resume,
  'POST /upload/profile': fileSchemas.profile,

  // Download routes (parameter validation)
  'GET /download/resume/:file': paramSchemas.filename,
  'GET /download/profile/:file': paramSchemas.filename,

  // Applicants route
  'GET /api/applicants': Joi.object({
    jobId: commonPatterns.objectId.optional(),
    status: Joi.string().valid('accepted').optional(),
    page: commonPatterns.positiveInteger.default(1).optional(),
    limit: Joi.number().integer().min(1).max(100).default(10).optional()
  })
};

/**
 * Create validation middleware factory function
 * @param {Joi.Schema|string} schema - Joi schema object or endpoint identifier
 * @param {object} options - Validation options
 * @param {string} options.source - Source of data to validate ('body', 'query', 'params')
 * @param {boolean} options.allowUnknown - Allow unknown fields
 * @param {boolean} options.stripUnknown - Strip unknown fields
 * @param {boolean} options.abortEarly - Stop validation on first error
 */
function validateRequest(schema, options = {}) {
  return async (req, res, next) => {
    // Skip validation if feature flag is disabled
    if (!featureFlags.isEnabled('INPUT_VALIDATION')) {
      return next();
    }

    try {
      let joiSchema;
      
      // If schema is a string, look it up in validationSchemas
      if (typeof schema === 'string') {
        joiSchema = validationSchemas[schema];
        if (!joiSchema) {
          console.warn(`No validation schema found for endpoint: ${schema}`);
          return next();
        }
      } else if (schema && typeof schema.validate === 'function') {
        joiSchema = schema;
      } else {
        console.warn('Invalid schema provided to validateRequest middleware');
        return next();
      }

      // Determine data source
      const source = options.source || 'body';
      let dataToValidate;
      
      switch (source) {
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'body':
        default:
          dataToValidate = req.body;
          break;
      }

      // Joi validation options
      const joiOptions = {
        allowUnknown: options.allowUnknown || false,
        stripUnknown: options.stripUnknown || true,
        abortEarly: options.abortEarly || false,
        convert: true, // Convert strings to numbers, etc.
        presence: 'optional' // Fields are optional by default unless marked required
      };

      // Validate data with Joi
      const { error, value } = joiSchema.validate(dataToValidate, joiOptions);
      
      if (error) {
        // Convert Joi validation errors to our standard format
        const validationErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message.replace(/"/g, ''), // Remove quotes from Joi messages
          code: getValidationErrorCode(detail.type),
          value: detail.context?.value
        }));

        const validationError = new ValidationError(
          'Validation failed',
          validationErrors
        );
        return next(validationError);
      }

      // Replace the original data with validated and sanitized data
      switch (source) {
        case 'query':
          req.query = value;
          break;
        case 'params':
          req.params = value;
          break;
        case 'body':
        default:
          req.body = value;
          break;
      }

      next();
    } catch (error) {
      const validationError = new ValidationError(
        'Validation error occurred',
        [{ field: 'general', message: error.message, code: ERROR_CODES.VALIDATION_ERROR }]
      );
      next(validationError);
    }
  };
}

/**
 * Map Joi error types to our error codes
 */
function getValidationErrorCode(joiErrorType) {
  const errorCodeMap = {
    'any.required': ERROR_CODES.REQUIRED_FIELD,
    'string.empty': ERROR_CODES.REQUIRED_FIELD,
    'string.min': ERROR_CODES.INVALID_LENGTH,
    'string.max': ERROR_CODES.INVALID_LENGTH,
    'string.email': ERROR_CODES.INVALID_FORMAT,
    'string.pattern.base': ERROR_CODES.INVALID_FORMAT,
    'string.uri': ERROR_CODES.INVALID_FORMAT,
    'number.base': ERROR_CODES.INVALID_TYPE,
    'number.min': ERROR_CODES.INVALID_LENGTH,
    'number.max': ERROR_CODES.INVALID_LENGTH,
    'number.positive': ERROR_CODES.INVALID_FORMAT,
    'number.integer': ERROR_CODES.INVALID_TYPE,
    'date.base': ERROR_CODES.INVALID_TYPE,
    'date.greater': ERROR_CODES.INVALID_FORMAT,
    'array.min': ERROR_CODES.INVALID_LENGTH,
    'array.max': ERROR_CODES.INVALID_LENGTH,
    'any.only': ERROR_CODES.INVALID_FORMAT,
    'object.unknown': ERROR_CODES.INVALID_FORMAT
  };

  return errorCodeMap[joiErrorType] || ERROR_CODES.VALIDATION_ERROR;
}

/**
 * Create endpoint-specific validation middleware
 * Automatically determines schema based on request method and path
 */
function createEndpointValidator(method, path) {
  const endpointKey = `${method.toUpperCase()} ${path}`;
  return validateRequest(endpointKey);
}

/**
 * Validate request body with specific schema
 */
function validateBody(schema) {
  return validateRequest(schema, { source: 'body' });
}

/**
 * Validate query parameters with specific schema
 */
function validateQuery(schema) {
  return validateRequest(schema, { source: 'query' });
}

/**
 * Validate URL parameters with specific schema
 */
function validateParams(schema) {
  return validateRequest(schema, { source: 'params' });
}

/**
 * Enhanced input sanitization middleware
 * Comprehensive XSS and injection prevention with configurable options
 */
function sanitizeInput(options = {}) {
  return (req, res, next) => {
    // Skip sanitization if feature flag is disabled
    if (!featureFlags.isEnabled('INPUT_VALIDATION')) {
      return next();
    }

    try {
      // Create sanitization context with request metadata
      const sanitizationContext = {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId || generateCorrelationId()
      };

      // Sanitize request body
      if (req.body && typeof req.body === 'object') {
        const { sanitized, threats } = sanitizeObjectWithThreatDetection(req.body, sanitizationContext, options);
        req.body = sanitized;
        
        // Log security threats if detected
        if (threats.length > 0) {
          logSecurityThreats(threats, sanitizationContext);
        }
      }

      // Sanitize query parameters
      if (req.query && typeof req.query === 'object') {
        const { sanitized, threats } = sanitizeObjectWithThreatDetection(req.query, sanitizationContext, options);
        req.query = sanitized;
        
        if (threats.length > 0) {
          logSecurityThreats(threats, sanitizationContext);
        }
      }

      // Sanitize URL parameters
      if (req.params && typeof req.params === 'object') {
        const { sanitized, threats } = sanitizeObjectWithThreatDetection(req.params, sanitizationContext, options);
        req.params = sanitized;
        
        if (threats.length > 0) {
          logSecurityThreats(threats, sanitizationContext);
        }
      }

      // Add sanitization metadata to request for logging
      req.sanitizationMeta = {
        processed: true,
        timestamp: sanitizationContext.timestamp,
        correlationId: sanitizationContext.correlationId
      };

      next();
    } catch (error) {
      const sanitizationError = new ValidationError(
        'Input sanitization failed',
        [{ field: 'general', message: 'Unable to process input safely', code: ERROR_CODES.VALIDATION_ERROR }]
      );
      next(sanitizationError);
    }
  };
}

/**
 * Sanitize object recursively with enhanced security and threat detection
 */
function sanitizeObjectWithThreatDetection(obj, context, options = {}) {
  const threats = [];
  
  if (!obj || typeof obj !== 'object') {
    const { sanitized, detected } = sanitizeStringWithThreatDetection(obj, context, options);
    return { sanitized, threats: detected };
  }

  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize the key itself and detect threats
    const { sanitized: sanitizedKey, detected: keyThreats } = sanitizeStringWithThreatDetection(key, context, options);
    threats.push(...keyThreats);
    
    if (Array.isArray(value)) {
      const arrayResult = value.map(item => {
        const result = sanitizeObjectWithThreatDetection(item, context, options);
        threats.push(...result.threats);
        return result.sanitized;
      });
      sanitized[sanitizedKey] = arrayResult;
    } else if (typeof value === 'object' && value !== null) {
      const result = sanitizeObjectWithThreatDetection(value, context, options);
      sanitized[sanitizedKey] = result.sanitized;
      threats.push(...result.threats);
    } else {
      const { sanitized: sanitizedValue, detected: valueThreats } = sanitizeStringWithThreatDetection(value, context, options);
      sanitized[sanitizedKey] = sanitizedValue;
      threats.push(...valueThreats);
    }
  }

  return { sanitized, threats };
}

/**
 * Enhanced string sanitization with comprehensive security measures and threat detection
 */
function sanitizeStringWithThreatDetection(input, context, options = {}) {
  const threats = [];
  
  if (typeof input !== 'string') {
    return { sanitized: input, detected: threats };
  }

  const originalInput = input;
  let sanitized = input;

  // Define threat patterns with severity levels
  const threatPatterns = [
    // XSS Patterns
    { pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, type: 'XSS_SCRIPT_TAG', severity: 'HIGH' },
    { pattern: /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, type: 'XSS_IFRAME', severity: 'HIGH' },
    { pattern: /<(object|embed|applet|form)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, type: 'XSS_DANGEROUS_TAG', severity: 'HIGH' },
    { pattern: /javascript:/gi, type: 'XSS_JAVASCRIPT_PROTOCOL', severity: 'HIGH' },
    { pattern: /on\w+\s*=/gi, type: 'XSS_EVENT_HANDLER', severity: 'MEDIUM' },
    { pattern: /data:\s*[^;]*;[^,]*,/gi, type: 'XSS_DATA_URL', severity: 'MEDIUM' },
    { pattern: /vbscript:/gi, type: 'XSS_VBSCRIPT_PROTOCOL', severity: 'HIGH' },
    { pattern: /expression\s*\(/gi, type: 'XSS_CSS_EXPRESSION', severity: 'MEDIUM' },
    { pattern: /@import/gi, type: 'XSS_CSS_IMPORT', severity: 'LOW' },
    { pattern: /style\s*=/gi, type: 'XSS_STYLE_ATTRIBUTE', severity: 'LOW' },
    
    // SQL Injection Patterns
    { pattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi, type: 'SQL_INJECTION_KEYWORD', severity: 'HIGH' },
    { pattern: /('|(\\')|(;)|(--)|(\|)|(\*)|(%)|(\+)|(=))/g, type: 'SQL_INJECTION_CHAR', severity: 'MEDIUM' },
    
    // NoSQL Injection Patterns
    { pattern: /\$where|\$ne|\$gt|\$lt|\$gte|\$lte|\$in|\$nin|\$regex|\$exists/gi, type: 'NOSQL_INJECTION', severity: 'HIGH' },
    
    // Command Injection Patterns
    { pattern: /(\||&|;|`|\$\(|\${)/g, type: 'COMMAND_INJECTION', severity: 'HIGH' },
    { pattern: /(\.\.\/|\.\.\\)/g, type: 'PATH_TRAVERSAL', severity: 'HIGH' },
    
    // LDAP Injection Patterns
    { pattern: /(\*|\(|\)|\\|\/|\+|=|<|>|;|,|")/g, type: 'LDAP_INJECTION', severity: 'MEDIUM' },
    
    // XML Injection Patterns
    { pattern: /<!(\[CDATA\[|DOCTYPE|ENTITY)/gi, type: 'XML_INJECTION', severity: 'MEDIUM' },
    
    // Additional Security Patterns
    { pattern: /<\s*\/?\s*(script|iframe|object|embed|applet|meta|link|style|base|form|input|textarea|select|option|button)/gi, type: 'DANGEROUS_HTML_TAG', severity: 'MEDIUM' },
    { pattern: /(eval|setTimeout|setInterval|Function|execScript)\s*\(/gi, type: 'DANGEROUS_JS_FUNCTION', severity: 'HIGH' },
    { pattern: /document\.(cookie|domain|referrer|URL|documentURI|baseURI)/gi, type: 'DOM_ACCESS', severity: 'MEDIUM' },
    { pattern: /window\.(location|open|close|focus|blur|moveBy|moveTo|resizeBy|resizeTo)/gi, type: 'WINDOW_MANIPULATION', severity: 'MEDIUM' }
  ];

  // Check for threats and sanitize
  for (const { pattern, type, severity } of threatPatterns) {
    const matches = sanitized.match(pattern);
    if (matches) {
      threats.push({
        type,
        severity,
        pattern: pattern.toString(),
        matches: matches.slice(0, 5), // Limit to first 5 matches to prevent log flooding
        field: context.currentField || 'unknown',
        timestamp: context.timestamp,
        correlationId: context.correlationId
      });

      // Remove the threatening content
      sanitized = sanitized.replace(pattern, '');
    }
  }

  // Additional sanitization steps
  sanitized = sanitized
    // HTML entity encoding for remaining < and > characters
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Encode quotes to prevent attribute injection
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove null bytes and control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Length-based DoS protection
  const maxLength = options.maxLength || 10000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
    threats.push({
      type: 'LENGTH_LIMIT_EXCEEDED',
      severity: 'LOW',
      originalLength: originalInput.length,
      truncatedLength: maxLength,
      field: context.currentField || 'unknown',
      timestamp: context.timestamp,
      correlationId: context.correlationId
    });
  }

  // Check for suspicious encoding attempts
  const encodingPatterns = [
    { pattern: /%[0-9a-fA-F]{2}/g, type: 'URL_ENCODING_DETECTED' },
    { pattern: /&#x?[0-9a-fA-F]+;/g, type: 'HTML_ENTITY_ENCODING_DETECTED' },
    { pattern: /\\u[0-9a-fA-F]{4}/g, type: 'UNICODE_ENCODING_DETECTED' }
  ];

  for (const { pattern, type } of encodingPatterns) {
    if (pattern.test(originalInput)) {
      threats.push({
        type,
        severity: 'LOW',
        field: context.currentField || 'unknown',
        timestamp: context.timestamp,
        correlationId: context.correlationId
      });
    }
  }

  return { sanitized, detected: threats };
}

/**
 * Legacy sanitizeObject function for backward compatibility
 */
function sanitizeObject(obj) {
  const context = {
    timestamp: new Date().toISOString(),
    correlationId: generateCorrelationId()
  };
  
  const { sanitized } = sanitizeObjectWithThreatDetection(obj, context);
  return sanitized;
}

/**
 * Legacy sanitizeString function for backward compatibility
 */
function sanitizeString(input) {
  const context = {
    timestamp: new Date().toISOString(),
    correlationId: generateCorrelationId()
  };
  
  const { sanitized } = sanitizeStringWithThreatDetection(input, context);
  return sanitized;
}

/**
 * Log security threats detected during sanitization
 */
function logSecurityThreats(threats, context) {
  if (!threats || threats.length === 0) return;

  // Group threats by severity for efficient logging
  const threatsBySeverity = threats.reduce((acc, threat) => {
    if (!acc[threat.severity]) acc[threat.severity] = [];
    acc[threat.severity].push(threat);
    return acc;
  }, {});

  // Log high and critical severity threats immediately
  const criticalThreats = [...(threatsBySeverity.HIGH || []), ...(threatsBySeverity.CRITICAL || [])];
  if (criticalThreats.length > 0) {
    console.warn('SECURITY ALERT: High-severity threats detected', {
      correlationId: context.correlationId,
      ip: context.ip,
      userAgent: context.userAgent,
      path: context.path,
      method: context.method,
      timestamp: context.timestamp,
      threats: criticalThreats.map(t => ({
        type: t.type,
        severity: t.severity,
        field: t.field,
        matchCount: t.matches ? t.matches.length : 0
      }))
    });
  }

  // Log medium and low severity threats for monitoring
  const mediumThreats = [...(threatsBySeverity.MEDIUM || []), ...(threatsBySeverity.LOW || [])];
  if (mediumThreats.length > 0) {
    console.info('Security threats detected and sanitized', {
      correlationId: context.correlationId,
      ip: context.ip,
      path: context.path,
      timestamp: context.timestamp,
      threatCount: mediumThreats.length,
      threatTypes: [...new Set(mediumThreats.map(t => t.type))]
    });
  }
}

/**
 * Generate correlation ID for request tracking
 */
function generateCorrelationId() {
  return 'san_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Advanced sanitization middleware with configurable security levels
 */
function createAdvancedSanitizer(options = {}) {
  const defaultOptions = {
    maxLength: 10000,
    strictMode: false, // If true, rejects requests with high-severity threats
    logThreats: true,
    allowHtml: false, // If true, allows safe HTML tags
    customPatterns: [], // Additional threat patterns
    whitelist: [], // Fields to skip sanitization
    encoding: 'html' // 'html', 'url', or 'none'
  };

  const config = { ...defaultOptions, ...options };

  return (req, res, next) => {
    if (!featureFlags.isEnabled('INPUT_VALIDATION')) {
      return next();
    }

    try {
      const context = {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId || generateCorrelationId()
      };

      let allThreats = [];

      // Process each data source
      ['body', 'query', 'params'].forEach(source => {
        if (req[source] && typeof req[source] === 'object') {
          const { sanitized, threats } = sanitizeObjectWithThreatDetection(
            req[source], 
            { ...context, currentSource: source }, 
            config
          );
          
          req[source] = sanitized;
          allThreats.push(...threats);
        }
      });

      // Handle strict mode - reject requests with high-severity threats
      if (config.strictMode) {
        const highSeverityThreats = allThreats.filter(t => 
          t.severity === 'HIGH' || t.severity === 'CRITICAL'
        );
        
        if (highSeverityThreats.length > 0) {
          const securityError = new ValidationError(
            'Request contains potentially malicious content',
            [{
              field: 'security',
              message: 'Request blocked due to security policy',
              code: ERROR_CODES.VALIDATION_ERROR
            }]
          );
          return next(securityError);
        }
      }

      // Log threats if enabled
      if (config.logThreats && allThreats.length > 0) {
        logSecurityThreats(allThreats, context);
      }

      // Add sanitization metadata
      req.sanitizationMeta = {
        processed: true,
        timestamp: context.timestamp,
        correlationId: context.correlationId,
        threatsDetected: allThreats.length,
        threatTypes: [...new Set(allThreats.map(t => t.type))],
        strictMode: config.strictMode
      };

      next();
    } catch (error) {
      const sanitizationError = new ValidationError(
        'Advanced sanitization failed',
        [{ field: 'general', message: error.message, code: ERROR_CODES.VALIDATION_ERROR }]
      );
      next(sanitizationError);
    }
  };
}
/**
 * Comprehensive file validation middleware with advanced security checks
 * Validates file size, type, content, and implements security measures
 */
function validateFileUpload(options = {}) {
  return async (req, res, next) => {
    if (!featureFlags.isEnabled('INPUT_VALIDATION')) {
      return next();
    }

    try {
      const file = req.file;
      const correlationId = req.correlationId || generateCorrelationId();
      
      if (!file) {
        if (options.required) {
          const validationError = new ValidationError(
            'File upload required',
            [{ 
              field: 'file', 
              message: 'File is required for this operation', 
              code: ERROR_CODES.REQUIRED_FIELD,
              requirements: 'Please select a file to upload'
            }]
          );
          return next(validationError);
        }
        return next();
      }

      const errors = [];
      const securityThreats = [];

      // 1. File Size Validation with detailed requirements
      const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
      const minSize = options.minSize || 1; // 1 byte minimum
      
      if (file.size > maxSize) {
        errors.push({
          field: 'file',
          message: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size`,
          code: ERROR_CODES.FILE_TOO_LARGE,
          requirements: `Maximum file size: ${formatFileSize(maxSize)}`,
          currentValue: formatFileSize(file.size),
          maxValue: formatFileSize(maxSize)
        });
      }

      if (file.size < minSize) {
        errors.push({
          field: 'file',
          message: `File is too small or empty`,
          code: ERROR_CODES.INVALID_LENGTH,
          requirements: `Minimum file size: ${formatFileSize(minSize)}`,
          currentValue: formatFileSize(file.size)
        });
      }

      // 2. MIME Type Validation with security checks
      if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
        errors.push({
          field: 'file',
          message: `File type '${file.mimetype}' is not supported`,
          code: ERROR_CODES.INVALID_FILE_TYPE,
          requirements: `Supported file types: ${options.allowedTypes.join(', ')}`,
          currentValue: file.mimetype,
          allowedValues: options.allowedTypes
        });
      }

      // 3. File Extension Validation
      const fileExtension = extractFileExtension(file.originalname);
      if (options.allowedExtensions && !options.allowedExtensions.includes(fileExtension)) {
        errors.push({
          field: 'file',
          message: `File extension '.${fileExtension}' is not allowed`,
          code: ERROR_CODES.INVALID_FILE_TYPE,
          requirements: `Allowed extensions: ${options.allowedExtensions.map(ext => '.' + ext).join(', ')}`,
          currentValue: '.' + fileExtension,
          allowedValues: options.allowedExtensions.map(ext => '.' + ext)
        });
      }

      // 4. Advanced Security Checks
      const securityChecks = await performSecurityChecks(file, options);
      securityThreats.push(...securityChecks.threats);
      errors.push(...securityChecks.errors);

      // 5. Content Validation (if buffer is available)
      if (file.buffer) {
        const contentValidation = await validateFileContent(file, options);
        errors.push(...contentValidation.errors);
        securityThreats.push(...contentValidation.threats);
      }

      // 6. File Name Security Validation
      const nameValidation = validateFileName(file.originalname, options);
      errors.push(...nameValidation.errors);
      securityThreats.push(...nameValidation.threats);

      // Log security threats if detected
      if (securityThreats.length > 0) {
        logFileSecurityThreats(securityThreats, {
          correlationId,
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          userId: req.user?.id,
          timestamp: new Date().toISOString()
        });

        // In strict mode, reject files with high-severity threats
        if (options.strictSecurity) {
          const highSeverityThreats = securityThreats.filter(t => 
            t.severity === 'HIGH' || t.severity === 'CRITICAL'
          );
          
          if (highSeverityThreats.length > 0) {
            errors.push({
              field: 'file',
              message: 'File rejected due to security policy violations',
              code: ERROR_CODES.SECURITY_POLICY_VIOLATION,
              requirements: 'File must not contain malicious content or suspicious patterns',
              securityThreats: highSeverityThreats.map(t => t.type)
            });
          }
        }
      }

      // Add file metadata for logging and tracking
      req.fileValidationMeta = {
        processed: true,
        correlationId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        extension: fileExtension,
        threatsDetected: securityThreats.length,
        threatTypes: [...new Set(securityThreats.map(t => t.type))],
        validationErrors: errors.length,
        timestamp: new Date().toISOString()
      };

      if (errors.length > 0) {
        const validationError = new ValidationError(
          'File validation failed',
          errors
        );
        return next(validationError);
      }

      next();
    } catch (error) {
      const validationError = new ValidationError(
        'File validation error occurred',
        [{ 
          field: 'file', 
          message: 'Unable to validate file due to system error', 
          code: ERROR_CODES.FILE_UPLOAD_ERROR,
          requirements: 'Please try uploading the file again',
          systemError: error.message
        }]
      );
      next(validationError);
    }
  };
}

/**
 * Perform comprehensive security checks on uploaded files
 */
async function performSecurityChecks(file, options = {}) {
  const threats = [];
  const errors = [];

  try {
    // 1. Magic number validation (file signature check)
    if (file.buffer && options.validateMagicNumbers !== false) {
      const magicNumberCheck = validateMagicNumbers(file.buffer, file.mimetype);
      if (!magicNumberCheck.isValid) {
        threats.push({
          type: 'MIME_TYPE_MISMATCH',
          severity: 'HIGH',
          description: 'File content does not match declared MIME type',
          expectedMimeType: file.mimetype,
          detectedSignature: magicNumberCheck.detectedType
        });

        errors.push({
          field: 'file',
          message: 'File content does not match the file type',
          code: ERROR_CODES.FILE_CORRUPTED,
          requirements: 'File content must match the declared file type',
          details: `Expected: ${file.mimetype}, Detected: ${magicNumberCheck.detectedType || 'unknown'}`
        });
      }
    }

    // 2. Embedded content scanning
    if (file.buffer) {
      const embeddedThreats = scanForEmbeddedThreats(file.buffer);
      threats.push(...embeddedThreats);

      if (embeddedThreats.some(t => t.severity === 'HIGH' || t.severity === 'CRITICAL')) {
        errors.push({
          field: 'file',
          message: 'File contains potentially malicious embedded content',
          code: ERROR_CODES.MALICIOUS_CONTENT_DETECTED,
          requirements: 'File must not contain executable code or malicious scripts',
          threatTypes: embeddedThreats.map(t => t.type)
        });
      }
    }

    // 3. File structure validation
    if (options.validateStructure && file.buffer) {
      const structureValidation = await validateFileStructure(file.buffer, file.mimetype);
      if (!structureValidation.isValid) {
        threats.push({
          type: 'INVALID_FILE_STRUCTURE',
          severity: 'MEDIUM',
          description: 'File structure is corrupted or invalid',
          details: structureValidation.errors
        });

        errors.push({
          field: 'file',
          message: 'File appears to be corrupted or has invalid structure',
          code: ERROR_CODES.FILE_CORRUPTED,
          requirements: 'File must have valid internal structure',
          details: structureValidation.errors
        });
      }
    }

    // 4. Metadata extraction and validation
    if (file.buffer && options.validateMetadata !== false) {
      const metadataThreats = await scanFileMetadata(file.buffer, file.mimetype);
      threats.push(...metadataThreats);
    }

  } catch (error) {
    threats.push({
      type: 'SECURITY_CHECK_ERROR',
      severity: 'LOW',
      description: 'Error occurred during security validation',
      error: error.message
    });
  }

  return { threats, errors };
}

/**
 * Validate file content based on MIME type and content analysis
 */
async function validateFileContent(file, options = {}) {
  const errors = [];
  const threats = [];

  try {
    const buffer = file.buffer;
    const mimeType = file.mimetype;

    // PDF-specific validation
    if (mimeType === 'application/pdf') {
      const pdfValidation = validatePDFContent(buffer);
      if (!pdfValidation.isValid) {
        errors.push({
          field: 'file',
          message: 'PDF file is corrupted or contains invalid content',
          code: ERROR_CODES.FILE_CORRUPTED,
          requirements: 'PDF must be a valid, non-corrupted document',
          details: pdfValidation.errors
        });
      }
      threats.push(...pdfValidation.threats);
    }

    // Image-specific validation
    if (mimeType.startsWith('image/')) {
      const imageValidation = validateImageContent(buffer, mimeType);
      if (!imageValidation.isValid) {
        errors.push({
          field: 'file',
          message: 'Image file is corrupted or contains invalid content',
          code: ERROR_CODES.FILE_CORRUPTED,
          requirements: 'Image must be a valid, non-corrupted file',
          details: imageValidation.errors
        });
      }
      threats.push(...imageValidation.threats);
    }

    // Check for embedded executables or scripts
    const executableCheck = scanForExecutableContent(buffer);
    if (executableCheck.detected) {
      threats.push({
        type: 'EMBEDDED_EXECUTABLE',
        severity: 'CRITICAL',
        description: 'File contains embedded executable content',
        patterns: executableCheck.patterns
      });

      errors.push({
        field: 'file',
        message: 'File contains executable content and cannot be uploaded',
        code: ERROR_CODES.MALICIOUS_CONTENT_DETECTED,
        requirements: 'File must not contain executable code or scripts'
      });
    }

  } catch (error) {
    threats.push({
      type: 'CONTENT_VALIDATION_ERROR',
      severity: 'LOW',
      description: 'Error occurred during content validation',
      error: error.message
    });
  }

  return { errors, threats };
}

/**
 * Validate file name for security issues
 */
function validateFileName(fileName, options = {}) {
  const errors = [];
  const threats = [];

  // Check for suspicious file names and patterns
  const suspiciousPatterns = [
    { pattern: /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|php|asp|jsp|msi|dll)$/i, type: 'EXECUTABLE_EXTENSION', severity: 'HIGH' },
    { pattern: /\.\./, type: 'PATH_TRAVERSAL_ATTEMPT', severity: 'HIGH' },
    { pattern: /[<>:"|?*\x00-\x1f]/, type: 'INVALID_FILENAME_CHARS', severity: 'MEDIUM' },
    { pattern: /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i, type: 'RESERVED_FILENAME', severity: 'MEDIUM' },
    { pattern: /\.(htaccess|htpasswd|config|ini|conf)$/i, type: 'CONFIG_FILE_EXTENSION', severity: 'MEDIUM' },
    { pattern: /script|javascript|vbscript/i, type: 'SCRIPT_IN_FILENAME', severity: 'MEDIUM' }
  ];

  for (const { pattern, type, severity } of suspiciousPatterns) {
    if (pattern.test(fileName)) {
      threats.push({
        type,
        severity,
        description: `Suspicious pattern detected in filename: ${fileName}`,
        pattern: pattern.toString()
      });

      if (severity === 'HIGH') {
        errors.push({
          field: 'file',
          message: 'File name contains suspicious or dangerous patterns',
          code: ERROR_CODES.SECURITY_POLICY_VIOLATION,
          requirements: 'File name must not contain executable extensions or path traversal patterns',
          fileName: fileName,
          violationType: type
        });
      }
    }
  }

  // Check file name length
  if (fileName.length > 255) {
    errors.push({
      field: 'file',
      message: 'File name is too long',
      code: ERROR_CODES.INVALID_LENGTH,
      requirements: 'File name must be 255 characters or less',
      currentLength: fileName.length,
      maxLength: 255
    });
  }

  // Check for null bytes
  if (fileName.includes('\x00')) {
    threats.push({
      type: 'NULL_BYTE_IN_FILENAME',
      severity: 'HIGH',
      description: 'Null byte detected in filename'
    });

    errors.push({
      field: 'file',
      message: 'File name contains invalid characters',
      code: ERROR_CODES.SECURITY_POLICY_VIOLATION,
      requirements: 'File name must not contain null bytes or control characters'
    });
  }

  return { errors, threats };
}

/**
 * Pre-configured file upload validators for common use cases with enhanced security
 */
const fileValidators = {
  resume: validateFileUpload({
    required: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    minSize: 1024, // 1KB minimum
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['pdf'],
    validateMagicNumbers: true,
    validateStructure: true,
    validateMetadata: true,
    strictSecurity: true
  }),

  profile: validateFileUpload({
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    minSize: 512, // 512 bytes minimum
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    validateMagicNumbers: true,
    validateStructure: true,
    validateMetadata: true,
    strictSecurity: true
  }),

  document: validateFileUpload({
    required: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    minSize: 1024, // 1KB minimum
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions: ['pdf', 'doc', 'docx'],
    validateMagicNumbers: true,
    validateStructure: false, // Less strict for office documents
    validateMetadata: true,
    strictSecurity: false
  })
};

/**
 * Helper Functions for File Validation
 */

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Extract file extension safely
 */
function extractFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return '';
  
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

/**
 * Validate file magic numbers (file signatures)
 */
function validateMagicNumbers(buffer, expectedMimeType) {
  if (!buffer || buffer.length < 4) {
    return { isValid: false, detectedType: null };
  }

  // Common file signatures
  const signatures = {
    'application/pdf': [
      [0x25, 0x50, 0x44, 0x46], // %PDF
    ],
    'image/jpeg': [
      [0xFF, 0xD8, 0xFF, 0xE0], // JFIF
      [0xFF, 0xD8, 0xFF, 0xE1], // EXIF
      [0xFF, 0xD8, 0xFF, 0xDB], // JPEG raw
    ],
    'image/png': [
      [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG signature
    ],
    'image/gif': [
      [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
      [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
    ],
    'image/webp': [
      [0x52, 0x49, 0x46, 0x46], // RIFF (check for WEBP at offset 8)
    ]
  };

  const expectedSignatures = signatures[expectedMimeType];
  if (!expectedSignatures) {
    return { isValid: true, detectedType: 'unknown' }; // No signature check available
  }

  // Check if any expected signature matches
  for (const signature of expectedSignatures) {
    let matches = true;
    for (let i = 0; i < signature.length && i < buffer.length; i++) {
      if (buffer[i] !== signature[i]) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      // Special case for WebP - check WEBP signature at offset 8
      if (expectedMimeType === 'image/webp') {
        const webpSignature = [0x57, 0x45, 0x42, 0x50]; // WEBP
        if (buffer.length >= 12) {
          let webpMatches = true;
          for (let i = 0; i < webpSignature.length; i++) {
            if (buffer[8 + i] !== webpSignature[i]) {
              webpMatches = false;
              break;
            }
          }
          return { isValid: webpMatches, detectedType: webpMatches ? expectedMimeType : 'unknown' };
        }
      }
      return { isValid: true, detectedType: expectedMimeType };
    }
  }

  // Try to detect what type it actually is
  let detectedType = 'unknown';
  for (const [mimeType, sigs] of Object.entries(signatures)) {
    for (const sig of sigs) {
      let matches = true;
      for (let i = 0; i < sig.length && i < buffer.length; i++) {
        if (buffer[i] !== sig[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        detectedType = mimeType;
        break;
      }
    }
    if (detectedType !== 'unknown') break;
  }

  return { isValid: false, detectedType };
}

/**
 * Scan for embedded threats in file content
 */
function scanForEmbeddedThreats(buffer) {
  const threats = [];
  
  if (!buffer || buffer.length === 0) return threats;

  // Convert buffer to string for pattern matching
  const content = buffer.toString('binary');
  
  // Dangerous patterns to look for
  const dangerousPatterns = [
    { pattern: /<script[\s\S]*?<\/script>/gi, type: 'EMBEDDED_JAVASCRIPT', severity: 'HIGH' },
    { pattern: /javascript:/gi, type: 'JAVASCRIPT_PROTOCOL', severity: 'HIGH' },
    { pattern: /vbscript:/gi, type: 'VBSCRIPT_PROTOCOL', severity: 'HIGH' },
    { pattern: /on\w+\s*=/gi, type: 'EVENT_HANDLER', severity: 'MEDIUM' },
    { pattern: /<iframe[\s\S]*?<\/iframe>/gi, type: 'EMBEDDED_IFRAME', severity: 'MEDIUM' },
    { pattern: /<object[\s\S]*?<\/object>/gi, type: 'EMBEDDED_OBJECT', severity: 'MEDIUM' },
    { pattern: /<embed[\s\S]*?>/gi, type: 'EMBEDDED_ELEMENT', severity: 'MEDIUM' },
    { pattern: /eval\s*\(/gi, type: 'EVAL_FUNCTION', severity: 'HIGH' },
    { pattern: /document\.write/gi, type: 'DOCUMENT_WRITE', severity: 'MEDIUM' },
    { pattern: /\.exe\x00/g, type: 'HIDDEN_EXECUTABLE', severity: 'CRITICAL' },
    { pattern: /MZ[\x00-\xFF]{2}/g, type: 'PE_EXECUTABLE_HEADER', severity: 'CRITICAL' },
    { pattern: /\x7fELF/g, type: 'ELF_EXECUTABLE_HEADER', severity: 'CRITICAL' }
  ];

  for (const { pattern, type, severity } of dangerousPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      threats.push({
        type,
        severity,
        description: `Detected ${type.toLowerCase().replace(/_/g, ' ')} in file content`,
        matchCount: matches.length,
        samples: matches.slice(0, 3) // First 3 matches as samples
      });
    }
  }

  return threats;
}

/**
 * Validate PDF file structure
 */
function validatePDFContent(buffer) {
  const threats = [];
  let isValid = true;
  const errors = [];

  try {
    if (!buffer || buffer.length < 8) {
      return { isValid: false, errors: ['PDF file is too small'], threats: [] };
    }

    // Check PDF header
    const header = buffer.slice(0, 8).toString('ascii');
    if (!header.startsWith('%PDF-')) {
      isValid = false;
      errors.push('Invalid PDF header');
    }

    // Check for PDF trailer
    const content = buffer.toString('binary');
    if (!content.includes('%%EOF')) {
      isValid = false;
      errors.push('PDF file appears to be truncated or corrupted');
    }

    // Check for suspicious JavaScript in PDF
    const jsPatterns = [
      /\/JavaScript/gi,
      /\/JS/gi,
      /\/Action/gi,
      /\/OpenAction/gi
    ];

    for (const pattern of jsPatterns) {
      if (pattern.test(content)) {
        threats.push({
          type: 'PDF_JAVASCRIPT',
          severity: 'HIGH',
          description: 'PDF contains JavaScript code'
        });
      }
    }

    // Check for form actions
    if (/\/URI/gi.test(content)) {
      threats.push({
        type: 'PDF_EXTERNAL_URI',
        severity: 'MEDIUM',
        description: 'PDF contains external URI references'
      });
    }

  } catch (error) {
    isValid = false;
    errors.push(`PDF validation error: ${error.message}`);
  }

  return { isValid, errors, threats };
}

/**
 * Validate image file content
 */
function validateImageContent(buffer, mimeType) {
  const threats = [];
  let isValid = true;
  const errors = [];

  try {
    if (!buffer || buffer.length < 10) {
      return { isValid: false, errors: ['Image file is too small'], threats: [] };
    }

    // Basic image validation based on type
    switch (mimeType) {
      case 'image/jpeg':
        // JPEG should start with FF D8 and end with FF D9
        if (buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
          isValid = false;
          errors.push('Invalid JPEG header');
        }
        if (buffer[buffer.length - 2] !== 0xFF || buffer[buffer.length - 1] !== 0xD9) {
          // Note: Some JPEG files may have trailing data, so this is a warning, not an error
          threats.push({
            type: 'JPEG_TRAILING_DATA',
            severity: 'LOW',
            description: 'JPEG file has unexpected trailing data'
          });
        }
        break;

      case 'image/png':
        // PNG signature validation
        const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        for (let i = 0; i < pngSignature.length; i++) {
          if (buffer[i] !== pngSignature[i]) {
            isValid = false;
            errors.push('Invalid PNG signature');
            break;
          }
        }
        break;

      case 'image/gif':
        // GIF signature validation
        const gifHeader = buffer.slice(0, 6).toString('ascii');
        if (gifHeader !== 'GIF87a' && gifHeader !== 'GIF89a') {
          isValid = false;
          errors.push('Invalid GIF header');
        }
        break;
    }

    // Check for embedded scripts in image metadata/comments
    const content = buffer.toString('binary');
    const scriptPatterns = [
      /<script/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi
    ];

    for (const pattern of scriptPatterns) {
      if (pattern.test(content)) {
        threats.push({
          type: 'IMAGE_EMBEDDED_SCRIPT',
          severity: 'HIGH',
          description: 'Image contains embedded script content'
        });
      }
    }

  } catch (error) {
    isValid = false;
    errors.push(`Image validation error: ${error.message}`);
  }

  return { isValid, errors, threats };
}

/**
 * Scan for executable content in files
 */
function scanForExecutableContent(buffer) {
  if (!buffer || buffer.length < 4) {
    return { detected: false, patterns: [] };
  }

  const patterns = [];
  
  // PE executable header (Windows)
  if (buffer[0] === 0x4D && buffer[1] === 0x5A) { // MZ
    patterns.push('PE_EXECUTABLE');
  }

  // ELF executable header (Linux)
  if (buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) { // \x7fELF
    patterns.push('ELF_EXECUTABLE');
  }

  // Mach-O executable header (macOS)
  if ((buffer[0] === 0xFE && buffer[1] === 0xED && buffer[2] === 0xFA && buffer[3] === 0xCE) ||
      (buffer[0] === 0xCE && buffer[1] === 0xFA && buffer[2] === 0xED && buffer[3] === 0xFE)) {
    patterns.push('MACHO_EXECUTABLE');
  }

  // Java class file
  if (buffer[0] === 0xCA && buffer[1] === 0xFE && buffer[2] === 0xBA && buffer[3] === 0xBE) {
    patterns.push('JAVA_CLASS');
  }

  return { detected: patterns.length > 0, patterns };
}

/**
 * Validate file structure based on MIME type
 */
async function validateFileStructure(buffer, mimeType) {
  // This is a simplified structure validation
  // In a production environment, you might want to use specialized libraries
  
  try {
    switch (mimeType) {
      case 'application/pdf':
        return validatePDFStructure(buffer);
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/webp':
        return validateImageStructure(buffer, mimeType);
      default:
        return { isValid: true, errors: [] }; // No specific validation for this type
    }
  } catch (error) {
    return { isValid: false, errors: [`Structure validation error: ${error.message}`] };
  }
}

/**
 * Simplified PDF structure validation
 */
function validatePDFStructure(buffer) {
  const errors = [];
  let isValid = true;

  try {
    const content = buffer.toString('binary');
    
    // Check for required PDF elements
    if (!content.includes('/Root')) {
      errors.push('PDF missing document catalog');
      isValid = false;
    }

    if (!content.includes('xref')) {
      errors.push('PDF missing cross-reference table');
      isValid = false;
    }

    if (!content.includes('trailer')) {
      errors.push('PDF missing trailer');
      isValid = false;
    }

  } catch (error) {
    errors.push(`PDF structure validation failed: ${error.message}`);
    isValid = false;
  }

  return { isValid, errors };
}

/**
 * Simplified image structure validation
 */
function validateImageStructure(buffer, mimeType) {
  const errors = [];
  let isValid = true;

  try {
    // Basic size check
    if (buffer.length < 100) {
      errors.push('Image file is suspiciously small');
      isValid = false;
    }

    // Check for minimum expected structure based on type
    switch (mimeType) {
      case 'image/jpeg':
        // Look for JPEG segments
        if (!buffer.includes(Buffer.from([0xFF, 0xC0])) && !buffer.includes(Buffer.from([0xFF, 0xC2]))) {
          errors.push('JPEG missing Start of Frame marker');
          isValid = false;
        }
        break;
      
      case 'image/png':
        // Look for PNG chunks
        if (!buffer.includes(Buffer.from('IHDR'))) {
          errors.push('PNG missing IHDR chunk');
          isValid = false;
        }
        if (!buffer.includes(Buffer.from('IEND'))) {
          errors.push('PNG missing IEND chunk');
          isValid = false;
        }
        break;
    }

  } catch (error) {
    errors.push(`Image structure validation failed: ${error.message}`);
    isValid = false;
  }

  return { isValid, errors };
}

/**
 * Scan file metadata for threats
 */
async function scanFileMetadata(buffer, mimeType) {
  const threats = [];

  try {
    // This is a simplified metadata scanner
    // In production, you might want to use libraries like exifr for images
    
    const content = buffer.toString('binary');
    
    // Look for suspicious metadata patterns
    const suspiciousPatterns = [
      { pattern: /Creator.*script/gi, type: 'SUSPICIOUS_CREATOR_METADATA' },
      { pattern: /Producer.*hack/gi, type: 'SUSPICIOUS_PRODUCER_METADATA' },
      { pattern: /Subject.*exploit/gi, type: 'SUSPICIOUS_SUBJECT_METADATA' },
      { pattern: /Keywords.*malware/gi, type: 'SUSPICIOUS_KEYWORDS_METADATA' }
    ];

    for (const { pattern, type } of suspiciousPatterns) {
      if (pattern.test(content)) {
        threats.push({
          type,
          severity: 'MEDIUM',
          description: `Suspicious metadata detected: ${type.toLowerCase().replace(/_/g, ' ')}`
        });
      }
    }

  } catch (error) {
    threats.push({
      type: 'METADATA_SCAN_ERROR',
      severity: 'LOW',
      description: `Error scanning metadata: ${error.message}`
    });
  }

  return threats;
}

/**
 * Log file security threats
 */
function logFileSecurityThreats(threats, context) {
  if (!threats || threats.length === 0) return;

  // Group threats by severity
  const threatsBySeverity = threats.reduce((acc, threat) => {
    if (!acc[threat.severity]) acc[threat.severity] = [];
    acc[threat.severity].push(threat);
    return acc;
  }, {});

  // Log critical and high severity threats immediately
  const criticalThreats = [...(threatsBySeverity.CRITICAL || []), ...(threatsBySeverity.HIGH || [])];
  if (criticalThreats.length > 0) {
    console.warn('FILE SECURITY ALERT: Critical file threats detected', {
      correlationId: context.correlationId,
      fileName: context.fileName,
      fileSize: context.fileSize,
      mimeType: context.mimeType,
      ip: context.ip,
      userAgent: context.userAgent,
      userId: context.userId,
      timestamp: context.timestamp,
      threats: criticalThreats.map(t => ({
        type: t.type,
        severity: t.severity,
        description: t.description
      }))
    });
  }

  // Log medium and low severity threats for monitoring
  const mediumThreats = [...(threatsBySeverity.MEDIUM || []), ...(threatsBySeverity.LOW || [])];
  if (mediumThreats.length > 0) {
    console.info('File security threats detected and handled', {
      correlationId: context.correlationId,
      fileName: context.fileName,
      timestamp: context.timestamp,
      threatCount: mediumThreats.length,
      threatTypes: [...new Set(mediumThreats.map(t => t.type))]
    });
  }
}

/**
 * Backward compatibility: Legacy validation schemas
 * These are maintained for existing code that might still reference them
 */
const legacySchemas = {
  userRegistration: authSchemas.signup,
  userLogin: authSchemas.login,
  jobCreation: jobSchemas.create
};

module.exports = {
  // Main validation functions
  validateRequest,
  validateBody,
  validateQuery,
  validateParams,
  createEndpointValidator,
  
  // Sanitization functions
  sanitizeInput,
  createAdvancedSanitizer,
  sanitizeObjectWithThreatDetection,
  sanitizeStringWithThreatDetection,
  
  // Legacy sanitization (backward compatibility)
  sanitizeObject,
  sanitizeString,
  
  // File validation
  validateFileUpload,
  fileValidators,
  
  // File validation helper functions
  formatFileSize,
  extractFileExtension,
  validateMagicNumbers,
  scanForEmbeddedThreats,
  validatePDFContent,
  validateImageContent,
  scanForExecutableContent,
  validateFileStructure,
  scanFileMetadata,
  logFileSecurityThreats,
  
  // Schemas
  validationSchemas,
  authSchemas,
  jobSchemas,
  applicationSchemas,
  userSchemas,
  ratingSchemas,
  fileSchemas,
  paramSchemas,
  
  // Utility functions
  logSecurityThreats,
  generateCorrelationId,
  
  // Backward compatibility
  BasicValidator: class BasicValidator {
    constructor() {
      console.warn('BasicValidator is deprecated. Use Joi schemas instead.');
    }
    validate() {
      return { isValid: true, errors: [] };
    }
  },
  legacySchemas, // For backward compatibility
};
