/**
 * Database Connection Manager
 * Implements connection resilience with retry logic, pooling, and health checks
 * 
 * Requirements 5.1, 5.4:
 * - Connection retry with exponential backoff
 * - Connection pooling configuration
 * - Health check monitoring
 * - Timeout handling
 */

const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../middleware/logging');

class ConnectionManager {
  constructor() {
    this.isConnected = false;
    this.isConnecting = false;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.baseRetryDelay = 1000; // 1 second
    this.maxRetryDelay = 30000; // 30 seconds
    this.healthCheckInterval = null;
    this.connectionPromise = null;
  }

  /**
   * Connect to MongoDB with retry logic and exponential backoff
   * @param {string} uri - MongoDB connection URI
   * @param {object} options - Mongoose connection options
   * @returns {Promise<mongoose.Connection>}
   */
  async connect(uri = config.MONGODB_URI, options = {}) {
    // Return existing connection if already connected
    if (this.isConnected && mongoose.connection.readyState === 1) {
      logger.info('Using existing database connection');
      return mongoose.connection;
    }

    // Return existing connection promise if already connecting
    if (this.isConnecting && this.connectionPromise) {
      logger.info('Connection attempt already in progress, waiting...');
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = this._connectWithRetry(uri, options);

    try {
      const connection = await this.connectionPromise;
      return connection;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  /**
   * Internal method to connect with retry logic
   * @private
   */
  async _connectWithRetry(uri, options) {
    const connectionOptions = this._getConnectionOptions(options);

    while (this.retryCount < this.maxRetries) {
      try {
        logger.info(`Attempting database connection (attempt ${this.retryCount + 1}/${this.maxRetries})`);
        
        const connection = await mongoose.connect(uri, connectionOptions);
        
        this.isConnected = true;
        this.retryCount = 0; // Reset retry count on successful connection
        
        logger.info('Successfully connected to database');
        
        // Set up connection event handlers
        this._setupConnectionHandlers();
        
        // Start health check monitoring
        this._startHealthCheck();
        
        return connection;
      } catch (error) {
        this.retryCount++;
        
        logger.error('Database connection failed', {
          attempt: this.retryCount,
          maxRetries: this.maxRetries,
          error: error.message,
          code: error.code,
          name: error.name
        });

        if (this.retryCount >= this.maxRetries) {
          logger.error('Max retry attempts reached. Database connection failed.');
          throw new Error(`Failed to connect to database after ${this.maxRetries} attempts: ${error.message}`);
        }

        // Calculate exponential backoff delay
        const delay = this._calculateBackoffDelay(this.retryCount);
        
        logger.info(`Retrying connection in ${delay}ms...`);
        await this._sleep(delay);
      }
    }
  }

  /**
   * Get connection options with pooling and timeout configuration
   * @private
   */
  _getConnectionOptions(customOptions = {}) {
    return {
      // Connection pool settings
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2,  // Minimum number of connections to maintain
      
      // Timeout settings
      serverSelectionTimeoutMS: 5000, // Timeout for selecting a server
      socketTimeoutMS: 45000,         // Timeout for socket operations
      connectTimeoutMS: 10000,        // Timeout for initial connection
      
      // Topology settings
      heartbeatFrequencyMS: 10000,    // How often to check server health
      
      // Retry settings
      retryWrites: true,              // Retry write operations on failure
      retryReads: true,               // Retry read operations on failure
      
      // Parser settings (for Mongoose 5.x compatibility)
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      
      // Override with custom options
      ...customOptions
    };
  }

  /**
   * Calculate exponential backoff delay
   * @private
   */
  _calculateBackoffDelay(retryCount) {
    // Exponential backoff: baseDelay * 2^(retryCount - 1)
    const exponentialDelay = this.baseRetryDelay * Math.pow(2, retryCount - 1);
    
    // Add jitter (random factor) to prevent thundering herd
    const jitter = Math.random() * 1000;
    
    // Cap at maximum delay
    return Math.min(exponentialDelay + jitter, this.maxRetryDelay);
  }

  /**
   * Sleep utility for retry delays
   * @private
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Set up connection event handlers
   * @private
   */
  _setupConnectionHandlers() {
    const connection = mongoose.connection;

    // Connection opened
    connection.on('connected', () => {
      this.isConnected = true;
      logger.info('Database connection established');
    });

    // Connection disconnected
    connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('Database connection lost');
      
      // Attempt to reconnect
      this._handleDisconnection();
    });

    // Connection error
    connection.on('error', (error) => {
      logger.error('Database connection error', {
        error: error.message,
        code: error.code,
        name: error.name
      });
    });

    // Connection reconnected
    connection.on('reconnected', () => {
      this.isConnected = true;
      this.retryCount = 0;
      logger.info('Database connection re-established');
    });

    // Connection close
    connection.on('close', () => {
      this.isConnected = false;
      logger.info('Database connection closed');
    });
  }

  /**
   * Handle disconnection with automatic reconnection
   * @private
   */
  async _handleDisconnection() {
    if (this.isConnecting) {
      logger.info('Reconnection already in progress');
      return;
    }

    logger.info('Attempting to reconnect to database...');
    
    try {
      await this.connect();
    } catch (error) {
      logger.error('Failed to reconnect to database', {
        error: error.message
      });
    }
  }

  /**
   * Start periodic health check
   * @private
   */
  _startHealthCheck() {
    // Clear existing interval if any
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Run health check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      await this.healthCheck();
    }, 30000);
  }

  /**
   * Perform database health check
   * @returns {Promise<object>} Health check result
   */
  async healthCheck() {
    const health = {
      connected: false,
      readyState: mongoose.connection.readyState,
      readyStateText: this._getReadyStateText(mongoose.connection.readyState),
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      timestamp: new Date().toISOString()
    };

    try {
      // Check if connection is ready
      if (mongoose.connection.readyState !== 1) {
        health.connected = false;
        health.error = 'Database not connected';
        logger.warn('Health check failed: Database not connected', health);
        return health;
      }

      // Perform a simple ping operation
      await mongoose.connection.db.admin().ping();
      
      health.connected = true;
      this.isConnected = true;
      
      // Get connection pool stats if available
      if (mongoose.connection.client && mongoose.connection.client.topology) {
        const poolStats = this._getPoolStats();
        health.pool = poolStats;
      }

      logger.debug('Health check passed', health);
      return health;
    } catch (error) {
      health.connected = false;
      health.error = error.message;
      this.isConnected = false;
      
      logger.error('Health check failed', {
        error: error.message,
        health
      });
      
      return health;
    }
  }

  /**
   * Get connection pool statistics
   * @private
   */
  _getPoolStats() {
    try {
      const topology = mongoose.connection.client?.topology;
      if (!topology) {
        return null;
      }

      // For Mongoose 5.x, pool stats are not directly accessible
      // Return basic connection info
      return {
        available: mongoose.connection.readyState === 1,
        readyState: mongoose.connection.readyState
      };
    } catch (error) {
      logger.debug('Could not retrieve pool stats', { error: error.message });
      return null;
    }
  }

  /**
   * Get human-readable ready state text
   * @private
   */
  _getReadyStateText(readyState) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[readyState] || 'unknown';
  }

  /**
   * Disconnect from database
   * @returns {Promise<void>}
   */
  async disconnect() {
    // Clear health check interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (mongoose.connection.readyState !== 0) {
      logger.info('Disconnecting from database...');
      await mongoose.connection.close();
      logger.info('Database disconnected');
    }
    
    // Reset connection state
    this.isConnected = false;
    this.retryCount = 0;
  }

  /**
   * Get current connection status
   * @returns {object} Connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      readyState: mongoose.connection.readyState,
      readyStateText: this._getReadyStateText(mongoose.connection.readyState),
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }
}

// Export singleton instance
const connectionManager = new ConnectionManager();

module.exports = connectionManager;
