import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';
import { config } from '../config';

class RedisConnection {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;

  public async connect(): Promise<RedisClientType> {
    try {
      if (this.client && this.isConnected) {
        return this.client;
      }

      this.client = createClient({
        url: config.redis.url,
        socket: {
          connectTimeout: 10000,
          lazyConnect: true,
        },
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            logger.error('Redis server connection refused');
            return new Error('Redis server connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            logger.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            logger.error('Redis max retry attempts reached');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        },
      });

      // Event handlers
      this.client.on('error', (err) => {
        logger.error('Redis client error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        logger.info('Redis client disconnected');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        logger.info('Redis client reconnecting');
      });

      // Connect to Redis
      await this.client.connect();

      // Test the connection
      await this.client.ping();

      logger.info('Redis connected successfully');
      return this.client;
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
      logger.info('Redis disconnected');
    }
  }

  public getClient(): RedisClientType | null {
    return this.client;
  }

  public isRedisConnected(): boolean {
    return this.isConnected;
  }
}

export const redisConnection = new RedisConnection();

// Export the Redis client for use in other modules
export const initializeRedis = async (): Promise<RedisClientType> => {
  return await redisConnection.connect();
};

export const closeRedis = async (): Promise<void> => {
  await redisConnection.disconnect();
};

export const getRedisClient = (): RedisClientType | null => {
  return redisConnection.getClient();
};

// Redis utilities
export class RedisService {
  private client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  // Set key-value pair with optional expiration
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      logger.error('Redis set error:', error);
      throw error;
    }
  }

  // Get value by key
  async get(key: string): Promise<any> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      throw error;
    }
  }

  // Delete key
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis delete error:', error);
      throw error;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis exists error:', error);
      throw error;
    }
  }

  // Set expiration for key
  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl);
    } catch (error) {
      logger.error('Redis expire error:', error);
      throw error;
    }
  }

  // Get TTL for key
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error('Redis TTL error:', error);
      throw error;
    }
  }

  // Increment counter
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      logger.error('Redis incr error:', error);
      throw error;
    }
  }

  // Decrement counter
  async decr(key: string): Promise<number> {
    try {
      return await this.client.decr(key);
    } catch (error) {
      logger.error('Redis decr error:', error);
      throw error;
    }
  }

  // Set hash field
  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.hSet(key, field, serializedValue);
    } catch (error) {
      logger.error('Redis hset error:', error);
      throw error;
    }
  }

  // Get hash field
  async hget(key: string, field: string): Promise<any> {
    try {
      const value = await this.client.hGet(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis hget error:', error);
      throw error;
    }
  }

  // Get all hash fields
  async hgetall(key: string): Promise<Record<string, any>> {
    try {
      const hash = await this.client.hGetAll(key);
      const result: Record<string, any> = {};
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value);
      }
      return result;
    } catch (error) {
      logger.error('Redis hgetall error:', error);
      throw error;
    }
  }

  // Delete hash field
  async hdel(key: string, field: string): Promise<void> {
    try {
      await this.client.hDel(key, field);
    } catch (error) {
      logger.error('Redis hdel error:', error);
      throw error;
    }
  }

  // Add to set
  async sadd(key: string, member: string): Promise<void> {
    try {
      await this.client.sAdd(key, member);
    } catch (error) {
      logger.error('Redis sadd error:', error);
      throw error;
    }
  }

  // Remove from set
  async srem(key: string, member: string): Promise<void> {
    try {
      await this.client.sRem(key, member);
    } catch (error) {
      logger.error('Redis srem error:', error);
      throw error;
    }
  }

  // Get set members
  async smembers(key: string): Promise<string[]> {
    try {
      return await this.client.sMembers(key);
    } catch (error) {
      logger.error('Redis smembers error:', error);
      throw error;
    }
  }

  // Check if member exists in set
  async sismember(key: string, member: string): Promise<boolean> {
    try {
      const result = await this.client.sIsMember(key, member);
      return result === 1;
    } catch (error) {
      logger.error('Redis sismember error:', error);
      throw error;
    }
  }

  // Push to list
  async lpush(key: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.lPush(key, serializedValue);
    } catch (error) {
      logger.error('Redis lpush error:', error);
      throw error;
    }
  }

  // Pop from list
  async rpop(key: string): Promise<any> {
    try {
      const value = await this.client.rPop(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis rpop error:', error);
      throw error;
    }
  }

  // Get list length
  async llen(key: string): Promise<number> {
    try {
      return await this.client.lLen(key);
    } catch (error) {
      logger.error('Redis llen error:', error);
      throw error;
    }
  }

  // Get list range
  async lrange(key: string, start: number, stop: number): Promise<any[]> {
    try {
      const values = await this.client.lRange(key, start, stop);
      return values.map(value => JSON.parse(value));
    } catch (error) {
      logger.error('Redis lrange error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }
}

// Export Redis service
export const getRedisService = (): RedisService => {
  const client = getRedisClient();
  if (!client) {
    throw new Error('Redis not connected');
  }
  return new RedisService(client);
};