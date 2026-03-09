/**
 * Winston Logger Integration Example
 * Demonstrates how to use the enhanced Winston logger in Express applications
 */

const express = require('express');
const { 
  logger, 
  requestLogger, 
  errorLogger,
  logPerformance,
  logSecurityEvent 
} = require('../middleware/logging');
const { correlationId } = require('../middleware/correlation');
const featureFlags = require('../middleware/featureFlags');

// Enable structured logging for this example
featureFlags.enable('STRUCTURED_LOGGING');
featureFlags.enable('CORRELATION_TRACKING');

const app = express();

// Apply correlation ID middleware first
app.use(correlationId);

// Apply request logging middleware
app.use(requestLogger);

// Example route with logging
app.get('/api/users/:id', async (req, res) => {
  const startTime = Date.now();
  const requestLogger = logger.withRequest(req);
  
  try {
    requestLogger.info('Fetching user data', {
      userId: req.params.id,
      operation: 'user.fetch'
    });

    // Simulate some processing
    await new Promise(resolve => setTimeout(resolve, 100));

    // Log performance
    const duration = Date.now() - startTime;
    logPerformance('user.fetch', duration, {
      userId: req.params.id,
      cacheHit: false
    });

    // Simulate user data (with sensitive information)
    const userData = {
      id: req.params.id,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret123', // This will be sanitized in logs
      token: 'jwt-token-here' // This will be sanitized in logs
    };

    requestLogger.info('User data retrieved successfully', {
      userId: req.params.id,
      userData: userData // Sensitive fields will be automatically sanitized
    });

    res.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
        // Don't send sensitive data to client
      }
    });

  } catch (error) {
    requestLogger.error('Failed to fetch user data', {
      userId: req.params.id,
      error: {
        message: error.message,
        stack: error.stack
      }
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Example route that triggers security logging
app.post('/api/auth/login', (req, res) => {
  const requestLogger = logger.withRequest(req);
  
  // Simulate failed login attempt
  const { email, password } = req.body;
  
  if (!email || !password) {
    logSecurityEvent('invalid_login_attempt', 'medium', {
      email: email || 'missing',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    requestLogger.warn('Login attempt with missing credentials', {
      email: email || 'missing',
      hasPassword: !!password
    });

    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  // Simulate successful login
  requestLogger.info('User login successful', {
    email: email,
    loginMethod: 'password'
  });

  res.json({
    success: true,
    message: 'Login successful'
  });
});

// Example route that demonstrates error handling
app.get('/api/error-demo', (req, res) => {
  const requestLogger = logger.withRequest(req);
  
  // Simulate different types of errors
  const errorType = req.query.type || 'generic';
  
  let error;
  switch (errorType) {
    case 'database':
      error = new Error('Connection timeout');
      error.name = 'MongoTimeoutError';
      error.statusCode = 500;
      break;
    case 'validation':
      error = new Error('Invalid input data');
      error.statusCode = 400;
      break;
    case 'auth':
      error = new Error('Unauthorized access');
      error.statusCode = 401;
      break;
    default:
      error = new Error('Something went wrong');
      error.statusCode = 500;
  }

  requestLogger.error('Demonstrating error logging', {
    errorType: errorType,
    error: {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode
    }
  });

  throw error; // This will be caught by error middleware
});

// Apply error logging middleware
app.use(errorLogger);

// Final error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    correlationId: req.correlationId
  });
});

// Example of using child loggers
const authLogger = logger.createChildLogger({ component: 'auth', version: '1.0' });
const dbLogger = logger.createChildLogger({ component: 'database', version: '2.1' });

// Demonstrate child logger usage
authLogger.info('Authentication module initialized');
dbLogger.info('Database connection pool created', { poolSize: 10 });

console.log('Winston Logger Integration Example');
console.log('================================');
console.log('');
console.log('This example demonstrates:');
console.log('1. Structured logging with Winston');
console.log('2. Correlation ID tracking across requests');
console.log('3. Automatic sanitization of sensitive data');
console.log('4. Performance and security event logging');
console.log('5. Error severity classification');
console.log('6. Child loggers with context');
console.log('');
console.log('Test endpoints:');
console.log('- GET /api/users/123 - Normal request with logging');
console.log('- POST /api/auth/login - Security event logging');
console.log('- GET /api/error-demo?type=database - Error logging demo');
console.log('');

module.exports = app;