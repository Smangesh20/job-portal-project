/**
 * Enhanced Server with Database Connection Resilience
 * 
 * This example demonstrates how to integrate the connection manager
 * with the Express server for robust database connectivity.
 */

const express = require("express");
const bodyParser = require("body-parser");
const passportConfig = require("../lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const connectionManager = require("../db/connectionManager");
const config = require("../config");
const logger = require("../middleware/logging");

// Initialize Express app
const app = express();
const port = config.PORT || 4444;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Initialize directories
function initializeDirectories() {
  const directories = [
    "./public",
    "./public/resume",
    "./public/profile"
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });
}

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health/database', async (req, res) => {
  try {
    const health = await connectionManager.healthCheck();
    
    if (health.connected) {
      res.status(200).json({
        status: 'healthy',
        ...health
      });
    } else {
      res.status(503).json({
        status: 'unhealthy',
        ...health
      });
    }
  } catch (error) {
    logger.error('Health check endpoint error', { error: error.message });
    res.status(503).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
app.use("/auth", require("../routes/authRoutes"));
app.use("/api", require("../routes/apiRoutes"));
app.use("/upload", require("../routes/uploadRoutes"));
app.use("/host", require("../routes/downloadRoutes"));

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR'
    }
  });
});

/**
 * Start the server with database connection
 */
async function startServer() {
  try {
    logger.info('Starting server initialization...');

    // Initialize directories
    initializeDirectories();

    // Connect to database with retry logic
    logger.info('Connecting to database...');
    await connectionManager.connect(config.MONGODB_URI);
    logger.info('Database connection established');

    // Start Express server
    const server = app.listen(port, () => {
      logger.info(`Server started successfully on port ${port}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`Health check available at: http://localhost:${port}/health`);
      logger.info(`Database health check at: http://localhost:${port}/health/database`);
    });

    // Graceful shutdown handlers
    setupGracefulShutdown(server);

  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

/**
 * Set up graceful shutdown handlers
 */
function setupGracefulShutdown(server) {
  // Handle SIGTERM (e.g., from Docker, Kubernetes)
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    await gracefulShutdown(server);
  });

  // Handle SIGINT (e.g., Ctrl+C)
  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: closing HTTP server');
    await gracefulShutdown(server);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', {
      error: error.message,
      stack: error.stack
    });
    gracefulShutdown(server, 1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled promise rejection', {
      reason: reason,
      promise: promise
    });
    gracefulShutdown(server, 1);
  });
}

/**
 * Perform graceful shutdown
 */
async function gracefulShutdown(server, exitCode = 0) {
  logger.info('Starting graceful shutdown...');

  try {
    // Stop accepting new connections
    server.close(() => {
      logger.info('HTTP server closed');
    });

    // Close database connection
    logger.info('Closing database connection...');
    await connectionManager.disconnect();
    logger.info('Database connection closed');

    logger.info('Graceful shutdown completed');
    process.exit(exitCode);
  } catch (error) {
    logger.error('Error during graceful shutdown', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
