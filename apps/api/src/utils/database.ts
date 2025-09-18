import { PrismaClient, Prisma } from '@prisma/client'
import { logger } from './logger'

// Database connection configuration
interface DatabaseConfig {
  url: string
  maxConnections?: number
  connectionTimeout?: number
  queryTimeout?: number
  logLevel?: 'query' | 'info' | 'warn' | 'error'
}

// Get database configuration from environment
const getDatabaseConfig = (): DatabaseConfig => {
  const url = process.env.DATABASE_URL || 'postgresql://localhost:5432/askyacham'
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  return {
    url,
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '10000'),
    queryTimeout: parseInt(process.env.DATABASE_QUERY_TIMEOUT || '30000'),
    logLevel: (process.env.DATABASE_LOG_LEVEL as any) || 'warn'
  }
}

// Create Prisma client with configuration
const createPrismaClient = (): PrismaClient => {
  const config = getDatabaseConfig()
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.url
      }
    },
    log: [
      {
        emit: 'event',
        level: config.logLevel as any,
      },
    ],
    errorFormat: 'pretty',
  })

  // Log database queries in development
  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
      logger.debug('Database Query:', {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
        timestamp: e.timestamp
      })
    })
  }

  // Log database errors
  prisma.$on('error', (e) => {
    logger.error('Database Error:', {
      message: e.message,
      timestamp: e.timestamp
    })
  })

  return prisma
}

// Global Prisma client instance
let prisma: PrismaClient

// Initialize database connection
export const initializeDatabase = async (): Promise<PrismaClient> => {
  try {
    if (!prisma) {
      prisma = createPrismaClient()
      
      // Test database connection
      await prisma.$connect()
      
      logger.info('Database connected successfully', {
        url: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***@'), // Hide credentials
        maxConnections: getDatabaseConfig().maxConnections
      })
    }
    
    return prisma
  } catch (error) {
    logger.error('Failed to connect to database:', error)
    throw error
  }
}

// Get database instance
export const getDatabase = (): PrismaClient => {
  if (!prisma) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return prisma
}

// Database health check
export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy'
  latency: number
  error?: string
}> => {
  const startTime = Date.now()
  
  try {
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - startTime
    
    return {
      status: 'healthy',
      latency
    }
  } catch (error) {
    const latency = Date.now() - startTime
    
    return {
      status: 'unhealthy',
      latency,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Database transaction utilities
export const databaseUtils = {
  /**
   * Execute a transaction with automatic retry
   */
  async executeTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await prisma.$transaction(callback, {
          maxWait: 10000, // 10 seconds
          timeout: 30000, // 30 seconds
        })
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on certain errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002' || // Unique constraint violation
              error.code === 'P2003' || // Foreign key constraint violation
              error.code === 'P2025') { // Record not found
            throw error
          }
        }
        
        if (attempt === maxRetries) {
          throw lastError
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        logger.warn(`Transaction attempt ${attempt} failed, retrying...`, {
          error: lastError.message,
          attempt,
          maxRetries
        })
      }
    }
    
    throw lastError!
  },

  /**
   * Execute multiple operations in parallel with batching
   */
  async executeBatch<T>(
    operations: (() => Promise<T>)[],
    batchSize: number = 10
  ): Promise<T[]> {
    const results: T[] = []
    
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(batch.map(op => op()))
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          logger.error('Batch operation failed:', result.reason)
          throw result.reason
        }
      }
    }
    
    return results
  },

  /**
   * Soft delete utility
   */
  async softDelete<T>(
    model: any,
    where: any,
    deletedBy?: string
  ): Promise<T> {
    return model.update({
      where,
      data: {
        deletedAt: new Date(),
        deletedBy: deletedBy || null,
        updatedAt: new Date()
      }
    })
  },

  /**
   * Restore soft deleted record
   */
  async restore<T>(
    model: any,
    where: any,
    restoredBy?: string
  ): Promise<T> {
    return model.update({
      where: {
        ...where,
        deletedAt: { not: null }
      },
      data: {
        deletedAt: null,
        deletedBy: null,
        restoredBy: restoredBy || null,
        updatedAt: new Date()
      }
    })
  },

  /**
   * Pagination utility
   */
  async paginate<T>(
    model: any,
    options: {
      page: number
      limit: number
      where?: any
      orderBy?: any
      include?: any
      select?: any
    }
  ): Promise<{
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const { page, limit, where, orderBy, include, select } = options
    const skip = (page - 1) * limit
    
    const [data, total] = await Promise.all([
      model.findMany({
        where,
        orderBy,
        include,
        select,
        skip,
        take: limit
      }),
      model.count({ where })
    ])
    
    const totalPages = Math.ceil(total / limit)
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  },

  /**
   * Search utility with full-text search
   */
  async search<T>(
    model: any,
    searchTerm: string,
    searchFields: string[],
    options: {
      page?: number
      limit?: number
      where?: any
      orderBy?: any
      include?: any
    } = {}
  ): Promise<{
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const { page = 1, limit = 20, where = {}, orderBy, include } = options
    
    // Create search conditions
    const searchConditions = searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' as const
      }
    }))
    
    const searchWhere = {
      ...where,
      OR: searchConditions
    }
    
    return databaseUtils.paginate(model, {
      page,
      limit,
      where: searchWhere,
      orderBy,
      include
    })
  },

  /**
   * Bulk upsert utility
   */
  async bulkUpsert<T>(
    model: any,
    data: any[],
    uniqueFields: string[]
  ): Promise<T[]> {
    const results: T[] = []
    
    for (const item of data) {
      const whereClause = uniqueFields.reduce((acc, field) => {
        acc[field] = item[field]
        return acc
      }, {} as any)
      
      try {
        const result = await model.upsert({
          where: whereClause,
          update: item,
          create: item
        })
        results.push(result)
      } catch (error) {
        logger.error('Bulk upsert error:', error)
        throw error
      }
    }
    
    return results
  },

  /**
   * Database cleanup utility
   */
  async cleanup(
    daysToKeep: number = 30,
    dryRun: boolean = true
  ): Promise<{
    deletedRecords: number
    operations: string[]
  }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    
    const operations: string[] = []
    let deletedRecords = 0
    
    try {
      // Clean up expired sessions
      if (!dryRun) {
        const expiredSessions = await prisma.session.deleteMany({
          where: {
            expiresAt: {
              lt: cutoffDate
            }
          }
        })
        deletedRecords += expiredSessions.count
        operations.push(`Deleted ${expiredSessions.count} expired sessions`)
      }
      
      // Clean up old notifications
      if (!dryRun) {
        const oldNotifications = await prisma.notification.deleteMany({
          where: {
            createdAt: {
              lt: cutoffDate
            },
            read: true
          }
        })
        deletedRecords += oldNotifications.count
        operations.push(`Deleted ${oldNotifications.count} old notifications`)
      }
      
      // Clean up old audit logs
      if (!dryRun) {
        const oldAuditLogs = await prisma.auditLog.deleteMany({
          where: {
            createdAt: {
              lt: cutoffDate
            }
          }
        })
        deletedRecords += oldAuditLogs.count
        operations.push(`Deleted ${oldAuditLogs.count} old audit logs`)
      }
      
      logger.info('Database cleanup completed', {
        deletedRecords,
        operations,
        dryRun
      })
      
      return { deletedRecords, operations }
    } catch (error) {
      logger.error('Database cleanup failed:', error)
      throw error
    }
  }
}

// Database connection event handlers
export const setupDatabaseEventHandlers = () => {
  process.on('SIGINT', async () => {
    logger.info('Received SIGINT, closing database connection...')
    await prisma.$disconnect()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, closing database connection...')
    await prisma.$disconnect()
    process.exit(0)
  })

  process.on('uncaughtException', async (error) => {
    logger.error('Uncaught exception, closing database connection...', error)
    await prisma.$disconnect()
    process.exit(1)
  })

  process.on('unhandledRejection', async (reason) => {
    logger.error('Unhandled rejection, closing database connection...', reason)
    await prisma.$disconnect()
    process.exit(1)
  })
}

// Export database utilities
export {
  initializeDatabase,
  getDatabase,
  checkDatabaseHealth,
  databaseUtils,
  setupDatabaseEventHandlers
}

// Export Prisma client for direct use
export { prisma }
