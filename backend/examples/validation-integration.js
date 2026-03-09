/**
 * Validation Integration Examples
 * Demonstrates how to integrate Joi validation middleware with existing routes
 */

const express = require('express');
const {
  validateRequest,
  validateBody,
  validateQuery,
  validateParams,
  sanitizeInput,
  fileValidators,
  validationSchemas,
  authSchemas,
  jobSchemas,
  createEndpointValidator
} = require('../middleware/validation');

const router = express.Router();

/**
 * Example 1: Authentication Routes with Validation
 * Shows how to add validation to existing auth routes
 */

// Enhanced signup route with comprehensive validation
router.post('/auth/signup', 
  sanitizeInput,                           // First sanitize input
  validateBody(authSchemas.signup),        // Then validate with Joi schema
  async (req, res, next) => {
    try {
      // At this point, req.body is validated and sanitized
      const { email, password, type, name, contactNumber } = req.body;
      
      // Your existing signup logic here
      console.log('Creating user with validated data:', { email, type, name });
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: { email, type, name }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Enhanced login route
router.post('/auth/login',
  sanitizeInput,
  validateBody(authSchemas.login),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Your existing login logic here
      console.log('Authenticating user:', email);
      
      res.json({
        success: true,
        message: 'Login successful',
        token: 'jwt-token-here'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Example 2: Job Management Routes with Validation
 */

// Create job with comprehensive validation
router.post('/api/jobs',
  sanitizeInput,
  validateBody(jobSchemas.create),
  async (req, res, next) => {
    try {
      const jobData = req.body;
      
      // Validation ensures:
      // - title is 3-100 characters
      // - maxApplicants is positive integer ≤ 1000
      // - deadline is in the future
      // - skillsets is array of 1-20 skills
      // - jobType is valid enum value
      // - salary is non-negative integer ≤ 10M
      
      console.log('Creating job with validated data:', jobData);
      
      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        job: jobData
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get jobs with query validation
router.get('/api/jobs',
  sanitizeInput,
  validateQuery(jobSchemas.query),
  async (req, res, next) => {
    try {
      const { q, jobType, salary, location, skills, page, limit, sort } = req.query;
      
      // Query parameters are validated and converted:
      // - page/limit converted to numbers with defaults
      // - salary range validated
      // - sort options validated
      
      console.log('Searching jobs with validated query:', req.query);
      
      res.json({
        success: true,
        jobs: [],
        pagination: { page, limit, total: 0 }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update job with parameter and body validation
router.put('/api/jobs/:id',
  sanitizeInput,
  validateParams(validationSchemas['DELETE /api/jobs/:id']), // Reuse ObjectId validation
  validateBody(jobSchemas.update),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Both URL parameter and body are validated
      console.log(`Updating job ${id} with:`, updateData);
      
      res.json({
        success: true,
        message: 'Job updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Example 3: File Upload Routes with Validation
 */

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Resume upload with file validation
router.post('/upload/resume',
  upload.single('file'),                   // Multer handles file upload
  sanitizeInput,                           // Sanitize any additional form data
  fileValidators.resume,                   // Validate file (PDF, max 5MB)
  async (req, res, next) => {
    try {
      const file = req.file;
      
      // File is validated for:
      // - Type: PDF only
      // - Size: Max 5MB
      // - Name: No suspicious extensions
      
      console.log('Resume uploaded:', file.originalname);
      
      res.json({
        success: true,
        message: 'Resume uploaded successfully',
        filename: file.filename
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Example 4: Using Endpoint-Based Validation
 * Automatically selects schema based on method and path
 */

// This automatically uses the schema for 'POST /auth/signup'
router.post('/auth/signup-auto',
  sanitizeInput,
  createEndpointValidator('POST', '/auth/signup'),
  (req, res) => {
    res.json({ message: 'Auto-validation worked!' });
  }
);

/**
 * Example 5: Error Handling Integration
 * Shows how validation errors are handled
 */

router.use((err, req, res, next) => {
  // Validation errors are automatically formatted by the error handler middleware
  // This is just an example of how you might handle them at the route level
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.details || []
      }
    });
  }
  
  next(err);
});

/**
 * Example 6: Conditional Validation Based on User Type
 */

router.post('/api/applications/:id',
  sanitizeInput,
  validateParams(validationSchemas['DELETE /api/jobs/:id']), // ObjectId validation
  // Conditional validation based on user context
  (req, res, next) => {
    // You could add custom validation logic here
    // For example, different validation for recruiters vs applicants
    next();
  },
  validateBody(validationSchemas['POST /api/jobs/:id/applications']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { sop } = req.body;
      
      console.log(`Application for job ${id} with SOP:`, sop);
      
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Example 7: Validation with Feature Flags
 * Shows how validation respects feature flags
 */

router.post('/api/test-validation',
  // If INPUT_VALIDATION feature flag is disabled, validation is skipped
  sanitizeInput,
  validateBody(authSchemas.login),
  (req, res) => {
    res.json({
      message: 'Validation completed (or skipped based on feature flag)',
      data: req.body
    });
  }
);

module.exports = router;

/**
 * Integration Notes:
 * 
 * 1. **Order Matters**: Always sanitize before validation
 *    sanitizeInput → validateBody/Query/Params → route handler
 * 
 * 2. **Error Handling**: Validation errors are automatically caught by
 *    the centralized error handler middleware
 * 
 * 3. **Feature Flags**: All validation respects the INPUT_VALIDATION flag
 * 
 * 4. **Backward Compatibility**: Existing routes continue to work without
 *    validation until explicitly added
 * 
 * 5. **Performance**: Joi schemas are compiled once and reused
 * 
 * 6. **Security**: Input sanitization removes XSS and injection attempts
 * 
 * 7. **Type Conversion**: Joi automatically converts strings to numbers,
 *    dates, etc. based on schema definitions
 * 
 * 8. **Field-Level Errors**: Validation provides specific error messages
 *    for each field that fails validation
 */