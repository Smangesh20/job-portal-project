import { PrismaClient } from '@prisma/client';
import { config } from '@/config';
import { logger } from '@/utils/logger';

class DatabaseConnection {
  private client: PrismaClient | null = null;
  private isConnected: boolean = false;

  public async connect(): Promise<PrismaClient> {
    try {
      if (this.client && this.isConnected) {
        return this.client;
      }

      this.client = new PrismaClient({
        datasources: {
          db: {
            url: config.database.url,
          },
        },
        log: config.nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        errorFormat: 'pretty',
      });

      // Test the connection
      await this.client.$connect();
      
      // Test with a simple query
      await this.client.$queryRaw`SELECT 1`;
      
      this.isConnected = true;
      logger.info('Database connected successfully');
      
      return this.client;
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.$disconnect();
      this.client = null;
      this.isConnected = false;
      logger.info('Database disconnected');
    }
  }

  public getClient(): PrismaClient | null {
    return this.client;
  }

  public isDbConnected(): boolean {
    return this.isConnected;
  }
}

export const dbConnection = new DatabaseConnection();

// Export the Prisma client for use in other modules
export const connectDatabase = async (): Promise<PrismaClient> => {
  return await dbConnection.connect();
};

export const closeDatabase = async (): Promise<void> => {
  await dbConnection.disconnect();
};

export const getDatabaseClient = (): PrismaClient | null => {
  return dbConnection.getClient();
};

// Database utilities
export class DatabaseService {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  // Transaction wrapper
  async transaction<T>(callback: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return await this.client.$transaction(callback);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  // Backup utilities
  async createBackup(): Promise<void> {
    // Implementation for database backup
    logger.info('Creating database backup...');
    // This would typically involve pg_dump or similar
  }

  // Migration utilities
  async runMigrations(): Promise<void> {
    // Implementation for running migrations
    logger.info('Running database migrations...');
    // This would typically involve Prisma migrate
  }

  // Seed utilities
  async seed(): Promise<void> {
    // Implementation for seeding database
    logger.info('Seeding database...');
    // This would involve inserting initial data
  }

  // Cleanup utilities
  async cleanup(): Promise<void> {
    // Implementation for database cleanup
    logger.info('Cleaning up database...');
    // This would involve removing old data, optimizing tables, etc.
  }
}

// Export database service
export const getDatabaseService = (): DatabaseService => {
  const client = getDatabaseClient();
  if (!client) {
    throw new Error('Database not connected');
  }
  return new DatabaseService(client);
};
