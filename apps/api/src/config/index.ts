import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

export const config = {
  // Server configuration
  port: parseInt(process.env.API_PORT || '3001', 10),
  host: process.env.API_HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://askyacham_user:secure_password_2024@localhost:5432/askyacham',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000', 10),
  },

  // Redis configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  },

  // MongoDB configuration
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://askyacham_admin:secure_mongo_password_2024@localhost:27017/askyacham_docs?authSource=admin',
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
  },

  // Elasticsearch configuration
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    maxRetries: 3,
    requestTimeout: 60000,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secure-refresh-secret-key-2024',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Encryption configuration
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key',
    algorithm: 'aes-256-gcm',
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'https://www.askyacham.com',
      'https://askyacham.com'
    ],
    credentials: true,
  },

  // Email configuration
  email: {
    provider: process.env.EMAIL_PROVIDER || 'smtp', // 'smtp' or 'sendgrid'
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'askyacham@gmail.com',
      pass: process.env.SMTP_PASS || '',
    },
    from: process.env.FROM_EMAIL || 'info@askyacham.com',
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || '',
    },
  },

  // SMS configuration
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },

  // AWS configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || 'ask-ya-cham-storage',
  },

  // AI Services configuration
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
    serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  },

  // Social authentication
  social: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    },
  },

  // Payment configuration
  payment: {
    stripe: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
  },

  // Monitoring and analytics
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN || '',
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
    mixpanelToken: process.env.MIXPANEL_TOKEN || '',
  },

  // Security configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-key',
    cookieSecret: process.env.COOKIE_SECRET || 'your-cookie-secret-key',
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900000', 10), // 15 minutes
  },

  // Feature flags
  features: {
    aiMatching: process.env.ENABLE_AI_MATCHING === 'true',
    realTimeChat: process.env.ENABLE_REAL_TIME_CHAT === 'true',
    videoInterviews: process.env.ENABLE_VIDEO_INTERVIEWS === 'true',
    analytics: process.env.ENABLE_ANALYTICS === 'true',
    socialAuth: process.env.ENABLE_SOCIAL_AUTH === 'true',
    payments: process.env.ENABLE_PAYMENTS === 'true',
  },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    uploadPath: process.env.UPLOAD_PATH || 'uploads',
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    enableConsole: process.env.LOG_ENABLE_CONSOLE !== 'false',
    enableFile: process.env.LOG_ENABLE_FILE === 'true',
    filePath: process.env.LOG_FILE_PATH || 'logs/app.log',
  },

  // Cache configuration
  cache: {
    defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || '3600', 10), // 1 hour
    maxKeys: parseInt(process.env.CACHE_MAX_KEYS || '10000', 10),
  },

  // Job queue configuration
  jobs: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    concurrency: parseInt(process.env.JOB_CONCURRENCY || '5', 10),
    retryAttempts: parseInt(process.env.JOB_RETRY_ATTEMPTS || '3', 10),
  },

  // WebSocket configuration
  websocket: {
    cors: {
      origin: process.env.WS_CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true,
    },
    pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '60000', 10),
    pingInterval: parseInt(process.env.WS_PING_INTERVAL || '25000', 10),
  },
};

// Validation
export const validateConfig = (): void => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'DATABASE_URL',
    'REDIS_URL',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate JWT secret strength
  if (config.jwt.secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  // Validate encryption key
  if (config.encryption.key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters long');
  }
};

// Validate configuration on startup
validateConfig();
