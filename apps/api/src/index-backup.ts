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

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

// Import database and services
import { initializeDatabase, getDatabase, setupDatabaseEventHandlers } from './utils/database';
import { initializeRedis, getRedisClient } from './utils/redis';
import { logger } from './utils/logger';
import { config } from './config';

// Import routes
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { jobRoutes } from './routes/jobs';
import { applicationRoutes } from './routes/applications';
import { matchingRoutes } from './routes/matching';
import { analyticsRoutes } from './routes/analytics';
import { chatRoutes } from './routes/chat';
import { notificationRoutes } from './routes/notifications';
import { adminRoutes } from './routes/admin';
import { webhookRoutes } from './routes/webhooks';
import { companyRoutes } from './routes/companies';
import { researchRoutes } from './routes/research';
import healthRoutes from './routes/health';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import { securityHeaders } from './middleware/securityHeaders';
import { setCacheHeaders, handleConditionalRequest } from './middleware/cacheControl';
import { validateRequest, cleanupRequest, validateResponse } from './middleware/errorPrevention';
import { checkSuspiciousActivity, checkBruteForce } from './middleware/security';

// Global variables for database and Redis connections
let db: any = null;
let redis: any = null;

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
  }

  private initializeMiddleware(): void {
    // Error prevention middleware (must be first)
    this.app.use(validateRequest);
    this.app.use(cleanupRequest);
    this.app.use(validateResponse);

    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "ws:", "wss:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Security checks
    this.app.use(checkSuspiciousActivity);
    this.app.use(checkBruteForce);

    // Rate limiting
    this.app.use(rateLimiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);

    // Security headers
    this.app.use(securityHeaders);

    // Cache control
    this.app.use(setCacheHeaders);
    this.app.use(handleConditionalRequest);
  }

  private initializeRoutes(): void {
    // Health check
    this.app.use('/health', healthRoutes);

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/jobs', jobRoutes);
    this.app.use('/api/applications', applicationRoutes);
    this.app.use('/api/matching', matchingRoutes);
    this.app.use('/api/analytics', analyticsRoutes);
    this.app.use('/api/chat', chatRoutes);
    this.app.use('/api/notifications', notificationRoutes);
    this.app.use('/api/admin', adminRoutes);
    this.app.use('/api/webhooks', webhookRoutes);
    this.app.use('/api/companies', companyRoutes);
    this.app.use('/api/research', researchRoutes);

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
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize error prevention
      logger.info('Initializing error prevention system...');
      const { errorPreventionService } = await import('./middleware/errorPrevention');
      errorPreventionService.handleUncaughtException();
      errorPreventionService.handleUnhandledRejection();
      logger.info('Error prevention system initialized');

      // Initialize database
      logger.info('Initializing database connection...');
      db = await initializeDatabase();
      logger.info('Database connected successfully');

      // Initialize Redis
      logger.info('Initializing Redis connection...');
      redis = await initializeRedis();
      logger.info('Redis connected successfully');

      // Setup database event handlers
      setupDatabaseEventHandlers();

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
      if (db) {
        await db.$disconnect();
        logger.info('Database connection closed');
      }

      // Close Redis connection
      if (redis) {
        await redis.quit();
        logger.info('Redis connection closed');
      }

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