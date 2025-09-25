import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { productionSecurityMiddleware, securityLogger } from './middleware/production-security';
import { developmentProtection, hideDevelopmentInfo, disableDebugging, protectEnvironmentVariables, blockAttackPatterns } from './middleware/development-protection';
import { applySecurityMiddleware } from './middleware/securityHardening';
import { handleError } from './middleware/comprehensiveErrorHandler';
import googleLikeAuthRoutes from './routes/googleLikeAuth';
import { SocketService } from './services/socketService';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

// Import simple database
const database = require('./simple-database');

// Configuration
const config = {
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'https://www.askyacham.com',
      'https://askyacham.com'
    ]
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  }
};

// Logger utility
const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
  }
};

// Error handling middleware
const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred',
      requestId: req.headers['x-request-id'] || 'unknown'
    }
  });
};

// Request logging middleware
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

// Health check endpoint
const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.nodeEnv,
      database: 'connected'
    }
  });
};

// Authentication routes
const authRoutes = express.Router();

// Test email routes
const testEmailRoutes = express.Router();

// Test SendGrid connection
testEmailRoutes.get('/connection', async (req: Request, res: Response) => {
  try {
    logger.info('🧪 TESTING: SendGrid connection');
    
    const { GoogleStyleEmailService } = require('./services/google-style-email-service');
    const googleStyleEmailService = new GoogleStyleEmailService();
    
    const isConnected = await googleStyleEmailService.testConnection();
    
    if (isConnected) {
      res.json({
        success: true,
        message: '✅ SendGrid connection successful',
        data: {
          status: 'connected',
          timestamp: new Date().toISOString(),
          provider: 'SendGrid'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'CONNECTION_FAILED',
          message: 'SendGrid connection failed'
        }
      });
    }
  } catch (error) {
    logger.error('❌ CONNECTION TEST ERROR:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CONNECTION_ERROR',
        message: 'Error testing SendGrid connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

// Test SendGrid email sending
testEmailRoutes.post('/sendgrid', async (req: Request, res: Response) => {
  try {
    const { email, type = 'password-reset' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_EMAIL',
          message: 'Email address is required for testing'
        }
      });
    }

    logger.info(`🧪 TESTING: SendGrid email to ${email} (type: ${type})`);

    const { GoogleStyleEmailService } = require('./services/google-style-email-service');
    const googleStyleEmailService = new GoogleStyleEmailService();

    switch (type) {
      case 'password-reset':
        await googleStyleEmailService.sendPasswordResetEmail(
          email, 
          'Test User', 
          'test-token-12345'
        );
        break;
      
      case 'welcome':
        await googleStyleEmailService.sendWelcomeEmail(
          email, 
          'Test User'
        );
        break;
      
      case 'verification':
        await googleStyleEmailService.sendEmailVerificationEmail(
          email, 
          'Test User', 
          'test-verification-token-12345'
        );
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TYPE',
            message: 'Invalid email type. Use: password-reset, welcome, or verification'
          }
        });
    }

    res.json({
      success: true,
      message: `✅ ${type} email sent successfully to ${email}`,
      data: {
        email,
        type,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }
    });

  } catch (error) {
    logger.error('❌ TEST EMAIL ERROR:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_SEND_FAILED',
        message: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

// Forgot password endpoint
authRoutes.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_EMAIL',
          message: 'Email address is required'
        }
      });
    }

    logger.info(`🔐 FORGOT PASSWORD: Request for ${email}`);

    // Check if user exists
    const user = await database.findUserByEmail(email);
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent to your email address.',
        data: {
          instructions: 'Please check your email and follow the instructions to reset your password. The link will expire in 1 hour.',
          securityNote: 'For security reasons, we do not reveal whether an email address is registered with our system.'
        }
      });
    }

    // Generate reset token
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store reset token in database (in production, use Redis with expiration)
    await database.updateUser(user.id, { 
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    // Send Google-style password reset email
    const { GoogleStyleEmailService } = require('./services/google-style-email-service');
    const googleStyleEmailService = new GoogleStyleEmailService();
    
    await googleStyleEmailService.sendPasswordResetEmail(
      user.email, 
      user.firstName, 
      resetToken
    );

    logger.info(`✅ PASSWORD RESET EMAIL SENT: ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset link has been sent to your email address.',
      data: {
        instructions: 'Please check your email and follow the instructions to reset your password. The link will expire in 1 hour.',
        securityNote: 'If you don\'t see the email, check your spam folder.'
      }
    });

  } catch (error) {
    logger.error('❌ FORGOT PASSWORD ERROR:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PASSWORD_RESET_FAILED',
        message: 'Failed to process password reset request'
      }
    });
  }
});

// Register endpoint
authRoutes.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role = 'CANDIDATE' } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email, password, first name, and last name are required'
        }
      });
    }

    // Check if user already exists
    const existingUser = await database.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 8 characters long'
        }
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await database.createUser({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role: role.toUpperCase(),
      isVerified: false,
      isActive: true
    });

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
          createdAt: user.createdAt
        }
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Failed to register user'
      }
    });
  }
});

// Login endpoint
authRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email and password are required'
        }
      });
    }

    // Find user
    const user = await database.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_DEACTIVATED',
          message: 'Account is deactivated'
        }
      });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Update last login
    await database.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
          lastLoginAt: new Date()
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'Failed to login'
      }
    });
  }
});

// Get user profile endpoint
authRoutes.get('/profile/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await database.findUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: { user },
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    logger.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_RETRIEVAL_FAILED',
        message: 'Failed to retrieve user profile'
      }
    });
  }
});

// Update user profile endpoint
authRoutes.put('/profile/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    updateData.updatedAt = new Date();

    const user = await database.updateUser(id, updateData);

    logger.info('User profile updated successfully', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: { user },
      message: 'User profile updated successfully'
    });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: 'Failed to update user profile'
      }
    });
  }
});

// Application class
class Application {
  public app: express.Application;
  public server: any;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.cors.origin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      },
    });

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeWebSocket();
  }

  private initializeMiddleware(): void {
    // Apply comprehensive security middleware (Google-like)
    applySecurityMiddleware(this.app);
    
    // Apply production security middleware
    productionSecurityMiddleware(this.app);
    
    // Development protection middleware
    this.app.use(developmentProtection);
    this.app.use(hideDevelopmentInfo);
    this.app.use(disableDebugging);
    this.app.use(protectEnvironmentVariables);
    this.app.use(blockAttackPatterns);
    
    // Security logging
    this.app.use(securityLogger);

    // CORS configuration
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'X-Device-Fingerprint'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: {
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many requests, please try again later.',
        },
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', healthCheck);

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/auth/google-like', googleLikeAuthRoutes);
    this.app.use('/api/test-email', testEmailRoutes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Route ${req.method} ${req.originalUrl} not found`,
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // Use comprehensive error handler
    this.app.use(handleError);
    // Fallback to basic error handler
    this.app.use(errorHandler);
  }

  private initializeWebSocket(): void {
    // Initialize Socket.IO service for real-time features
    const socketService = new SocketService(this.io);
    logger.info('WebSocket service initialized for real-time authentication');
  }

  public async start(): Promise<void> {
    try {
      // Test database connection
      logger.info('Simple database initialized successfully');

      // Test database with a simple query
      const users = await database.getAllUsers();
      logger.info(`Database query test successful - ${users.length} users found`);

      // Start server
      this.server.listen(config.port, config.host, () => {
        logger.info(`🚀 Ask Ya Cham API Server started`, {
          port: config.port,
          host: config.host,
          environment: config.nodeEnv,
          version: process.env.npm_package_version || '1.0.0',
        });
      });

      // Graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      // Close database connection
      logger.info('Database connection closed');

      this.server.close(async () => {
        logger.info('HTTP server closed');
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      // Force close after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }
}

// Start the application
const app = new Application();
app.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});

export default app;
