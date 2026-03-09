/**
 * Sanitization Middleware Integration Examples
 * Demonstrates how to use the enhanced input sanitization middleware
 */

const express = require('express');
const { 
  sanitizeInput, 
  createAdvancedSanitizer,
  validateRequest,
  authSchemas 
} = require('../middleware/validation');

const app = express();

// Basic sanitization middleware (default configuration)
app.use(sanitizeInput());

// Advanced sanitization with custom configuration
const advancedSanitizer = createAdvancedSanitizer({
  maxLength: 5000,
  strictMode: true, // Reject requests with high-severity threats
  logThreats: true,
  allowHtml: false,
  encoding: 'html'
});

// Example 1: Basic route with default sanitization
app.post('/api/basic-example', (req, res) => {
  // Input is automatically sanitized by the global middleware
  res.json({
    message: 'Input sanitized successfully',
    sanitizedData: req.body,
    sanitizationMeta: req.sanitizationMeta
  });
});

// Example 2: Route with advanced sanitization and validation
app.post('/api/advanced-example', 
  advancedSanitizer,
  validateRequest(authSchemas.signup),
  (req, res) => {
    res.json({
      message: 'Advanced sanitization and validation completed',
      data: req.body,
      meta: req.sanitizationMeta
    });
  }
);

// Example 3: Custom sanitization for specific endpoints
const customSanitizer = createAdvancedSanitizer({
  maxLength: 1000,
  strictMode: false,
  logThreats: true,
  allowHtml: true, // Allow safe HTML for rich text content
  customPatterns: [
    // Add custom threat patterns
    { 
      pattern: /\b(admin|root|superuser)\b/gi, 
      type: 'PRIVILEGED_KEYWORD', 
      severity: 'MEDIUM' 
    }
  ],
  whitelist: ['description'], // Skip sanitization for description field
  encoding: 'html'
});

app.post('/api/rich-content', 
  customSanitizer,
  (req, res) => {
    res.json({
      message: 'Rich content processed with custom sanitization',
      data: req.body,
      threats: req.sanitizationMeta.threatTypes
    });
  }
);

// Example 4: File upload with sanitization
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload-with-sanitization',
  upload.single('file'),
  sanitizeInput(), // Sanitize form data
  (req, res) => {
    res.json({
      message: 'File uploaded and form data sanitized',
      file: req.file,
      formData: req.body,
      sanitizationMeta: req.sanitizationMeta
    });
  }
);

// Example 5: Query parameter sanitization
app.get('/api/search',
  sanitizeInput(), // Also sanitizes query parameters
  (req, res) => {
    res.json({
      message: 'Search performed with sanitized parameters',
      query: req.query,
      sanitizationMeta: req.sanitizationMeta
    });
  }
);

// Example 6: Conditional sanitization based on user role
app.post('/api/conditional-sanitization',
  (req, res, next) => {
    // Apply strict sanitization for regular users
    const isAdmin = req.user && req.user.role === 'admin';
    
    const sanitizer = createAdvancedSanitizer({
      strictMode: !isAdmin, // Less strict for admins
      maxLength: isAdmin ? 50000 : 5000,
      allowHtml: isAdmin
    });
    
    sanitizer(req, res, next);
  },
  (req, res) => {
    res.json({
      message: 'Conditional sanitization applied',
      data: req.body,
      sanitizationMeta: req.sanitizationMeta
    });
  }
);

// Example 7: Error handling for sanitization failures
app.post('/api/with-error-handling',
  sanitizeInput(),
  (req, res, next) => {
    // Custom logic here
    res.json({
      message: 'Request processed successfully',
      data: req.body
    });
  },
  (error, req, res, next) => {
    if (error.errorCode === 'VALIDATION_ERROR') {
      return res.status(400).json({
        success: false,
        error: {
          code: error.errorCode,
          message: 'Input sanitization failed',
          details: error.details,
          correlationId: req.sanitizationMeta?.correlationId
        }
      });
    }
    next(error);
  }
);

// Example 8: Monitoring sanitization metrics
app.get('/api/sanitization-stats', (req, res) => {
  // This would typically come from a monitoring service
  res.json({
    message: 'Sanitization statistics',
    stats: {
      totalRequests: 1000,
      threatsDetected: 25,
      threatsBlocked: 5,
      commonThreatTypes: [
        'XSS_SCRIPT_TAG',
        'SQL_INJECTION_KEYWORD',
        'XSS_EVENT_HANDLER'
      ]
    }
  });
});

// Example usage in existing routes
const jobRoutes = express.Router();

// Apply sanitization to all job routes
jobRoutes.use(sanitizeInput());

jobRoutes.post('/', 
  validateRequest('POST /api/jobs'),
  (req, res) => {
    // Job creation logic with sanitized input
    res.json({ message: 'Job created with sanitized data' });
  }
);

jobRoutes.get('/', (req, res) => {
  // Job search with sanitized query parameters
  res.json({ 
    message: 'Job search with sanitized parameters',
    query: req.query 
  });
});

app.use('/api/jobs', jobRoutes);

module.exports = app;

/**
 * Integration Notes:
 * 
 * 1. Global Sanitization:
 *    - Apply sanitizeInput() globally to sanitize all requests
 *    - Use app.use(sanitizeInput()) before route definitions
 * 
 * 2. Route-Specific Sanitization:
 *    - Use createAdvancedSanitizer() for custom configurations
 *    - Apply different sanitization rules per route or route group
 * 
 * 3. Feature Flag Control:
 *    - Set INPUT_VALIDATION=true to enable sanitization
 *    - Set ENHANCED_SANITIZATION=true for advanced features
 *    - Set THREAT_DETECTION=true for security monitoring
 * 
 * 4. Error Handling:
 *    - Sanitization errors are ValidationError instances
 *    - Use standard error handling middleware
 *    - Check req.sanitizationMeta for processing details
 * 
 * 5. Performance Considerations:
 *    - Sanitization adds minimal overhead
 *    - Use whitelist for fields that don't need sanitization
 *    - Monitor threat detection logs for security insights
 * 
 * 6. Security Best Practices:
 *    - Enable strictMode for high-security endpoints
 *    - Monitor threat detection logs regularly
 *    - Use custom patterns for application-specific threats
 *    - Combine with validation middleware for comprehensive protection
 */