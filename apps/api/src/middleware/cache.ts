import { Request, Response, NextFunction } from 'express'
import Redis from 'ioredis'
import crypto from 'crypto'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

interface CacheOptions {
  ttl?: number // Time to live in seconds
  keyGenerator?: (req: Request) => string
  skipCache?: (req: Request) => boolean
  tags?: string[]
}

export const createCacheMiddleware = (options: CacheOptions = {}) => {
  const {
    ttl = 300, // Default 5 minutes
    keyGenerator = defaultKeyGenerator,
    skipCache = () => false,
    tags = []
  } = options

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for non-GET requests or if skipCache returns true
    if (req.method !== 'GET' || skipCache(req)) {
      return next()
    }

    try {
      const cacheKey = `cache:${keyGenerator(req)}`
      
      // Try to get cached response
      const cachedResponse = await redis.get(cacheKey)
      
      if (cachedResponse) {
        const { data, headers, statusCode } = JSON.parse(cachedResponse)
        
        // Set cached headers
        Object.entries(headers).forEach(([key, value]) => {
          res.set(key, value as string)
        })
        
        // Add cache hit header
        res.set('X-Cache', 'HIT')
        res.set('X-Cache-Key', cacheKey)
        
        return res.status(statusCode).json(data)
      }

      // Cache miss - intercept response
      const originalSend = res.send
      const originalJson = res.json
      const originalEnd = res.end

      let responseBody: any
      let responseHeaders: Record<string, string> = {}
      let responseStatusCode: number

      // Capture response data
      res.json = function(body: any) {
        responseBody = body
        responseStatusCode = res.statusCode
        
        // Capture headers
        responseHeaders = { ...res.getHeaders() } as Record<string, string>
        
        // Remove sensitive headers
        delete responseHeaders['set-cookie']
        delete responseHeaders['authorization']
        
        return originalJson.call(this, body)
      }

      res.send = function(body: any) {
        responseBody = body
        responseStatusCode = res.statusCode
        
        // Capture headers
        responseHeaders = { ...res.getHeaders() } as Record<string, string>
        
        // Remove sensitive headers
        delete responseHeaders['set-cookie']
        delete responseHeaders['authorization']
        
        return originalSend.call(this, body)
      }

      res.end = function(chunk?: any) {
        // Cache successful responses
        if (responseStatusCode >= 200 && responseStatusCode < 300 && responseBody) {
          const cacheData = {
            data: responseBody,
            headers: responseHeaders,
            statusCode: responseStatusCode,
            timestamp: new Date().toISOString()
          }

          // Store in cache with TTL
          redis.setex(cacheKey, ttl, JSON.stringify(cacheData))
          
          // Add cache tags for invalidation
          if (tags.length > 0) {
            tags.forEach(tag => {
              redis.sadd(`cache_tag:${tag}`, cacheKey)
            })
          }

          // Add cache miss header
          res.set('X-Cache', 'MISS')
          res.set('X-Cache-Key', cacheKey)
        }

        return originalEnd.call(this, chunk)
      }

      next()
    } catch (error) {
      console.error('Cache middleware error:', error)
      // If Redis is down, continue without caching
      next()
    }
  }
}

// Default key generator
const defaultKeyGenerator = (req: Request): string => {
  const key = `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`
  return crypto.createHash('md5').update(key).digest('hex')
}

// Predefined cache middleware for different use cases
export const userCache = createCacheMiddleware({
  ttl: 600, // 10 minutes
  keyGenerator: (req) => `user:${req.params.id}`,
  tags: ['users']
})

export const jobCache = createCacheMiddleware({
  ttl: 300, // 5 minutes
  keyGenerator: (req) => `job:${req.params.id}`,
  tags: ['jobs']
})

export const companyCache = createCacheMiddleware({
  ttl: 600, // 10 minutes
  keyGenerator: (req) => `company:${req.params.id}`,
  tags: ['companies']
})

export const jobListCache = createCacheMiddleware({
  ttl: 180, // 3 minutes
  keyGenerator: (req) => {
    const { page, limit, search, location, jobType, experience } = req.query
    return `job_list:${page || 1}:${limit || 20}:${search || ''}:${location || ''}:${jobType || ''}:${experience || ''}`
  },
  tags: ['jobs']
})

export const companyListCache = createCacheMiddleware({
  ttl: 600, // 10 minutes
  keyGenerator: (req) => {
    const { page, limit, search, industry, size } = req.query
    return `company_list:${page || 1}:${limit || 20}:${search || ''}:${industry || ''}:${size || ''}`
  },
  tags: ['companies']
})

export const analyticsCache = createCacheMiddleware({
  ttl: 300, // 5 minutes
  keyGenerator: (req) => {
    const { period, limit } = req.query
    return `analytics:${req.params.type || 'platform'}:${period || 'month'}:${limit || 30}`
  },
  tags: ['analytics']
})

// Cache invalidation utilities
export const cacheUtils = {
  /**
   * Invalidate cache by key
   */
  async invalidateKey(key: string): Promise<void> {
    try {
      await redis.del(`cache:${key}`)
    } catch (error) {
      console.error('Error invalidating cache key:', error)
    }
  },

  /**
   * Invalidate cache by tags
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        const keys = await redis.smembers(`cache_tag:${tag}`)
        if (keys.length > 0) {
          const cacheKeys = keys.map(key => `cache:${key}`)
          await redis.del(...cacheKeys)
          await redis.del(`cache_tag:${tag}`)
        }
      }
    } catch (error) {
      console.error('Error invalidating cache by tags:', error)
    }
  },

  /**
   * Invalidate user-related caches
   */
  async invalidateUserCache(userId: string): Promise<void> {
    await this.invalidateByTags(['users'])
    await this.invalidateKey(`user:${userId}`)
  },

  /**
   * Invalidate job-related caches
   */
  async invalidateJobCache(jobId?: string): Promise<void> {
    await this.invalidateByTags(['jobs'])
    if (jobId) {
      await this.invalidateKey(`job:${jobId}`)
    }
  },

  /**
   * Invalidate company-related caches
   */
  async invalidateCompanyCache(companyId?: string): Promise<void> {
    await this.invalidateByTags(['companies'])
    if (companyId) {
      await this.invalidateKey(`company:${companyId}`)
    }
  },

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    try {
      const keys = await redis.keys('cache:*')
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      
      const tagKeys = await redis.keys('cache_tag:*')
      if (tagKeys.length > 0) {
        await redis.del(...tagKeys)
      }
    } catch (error) {
      console.error('Error clearing all cache:', error)
    }
  },

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<any> {
    try {
      const cacheKeys = await redis.keys('cache:*')
      const tagKeys = await redis.keys('cache_tag:*')
      
      const stats = {
        totalCacheEntries: cacheKeys.length,
        totalTagEntries: tagKeys.length,
        memoryUsage: await redis.memory('usage'),
        hitRate: await this.calculateHitRate()
      }

      return stats
    } catch (error) {
      console.error('Error getting cache stats:', error)
      return null
    }
  },

  /**
   * Calculate cache hit rate
   */
  async calculateHitRate(): Promise<number> {
    try {
      const hits = await redis.get('cache_hits') || '0'
      const misses = await redis.get('cache_misses') || '0'
      
      const total = parseInt(hits) + parseInt(misses)
      return total > 0 ? (parseInt(hits) / total) * 100 : 0
    } catch (error) {
      console.error('Error calculating hit rate:', error)
      return 0
    }
  }
}

// Cache warming utilities
export const cacheWarming = {
  /**
   * Warm up frequently accessed data
   */
  async warmUpCache(): Promise<void> {
    try {
      // Warm up job listings
      await this.warmUpJobListings()
      
      // Warm up company listings
      await this.warmUpCompanyListings()
      
      // Warm up analytics data
      await this.warmUpAnalytics()
      
      console.log('Cache warming completed')
    } catch (error) {
      console.error('Error warming up cache:', error)
    }
  },

  /**
   * Warm up job listings
   */
  async warmUpJobListings(): Promise<void> {
    const commonFilters = [
      { page: 1, limit: 20 },
      { page: 1, limit: 20, jobType: 'full-time' },
      { page: 1, limit: 20, experience: 'mid-level' },
      { page: 1, limit: 20, location: 'remote' }
    ]

    for (const filters of commonFilters) {
      const key = `job_list:${filters.page}:${filters.limit}:${filters.jobType || ''}:${filters.experience || ''}:${filters.location || ''}`
      // Trigger cache by making a request (this would be done by the application)
      console.log(`Warming up job list cache: ${key}`)
    }
  },

  /**
   * Warm up company listings
   */
  async warmUpCompanyListings(): Promise<void> {
    const commonFilters = [
      { page: 1, limit: 20 },
      { page: 1, limit: 20, industry: 'technology' },
      { page: 1, limit: 20, size: 'large' }
    ]

    for (const filters of commonFilters) {
      const key = `company_list:${filters.page}:${filters.limit}:${filters.industry || ''}:${filters.size || ''}`
      console.log(`Warming up company list cache: ${key}`)
    }
  },

  /**
   * Warm up analytics data
   */
  async warmUpAnalytics(): Promise<void> {
    const analyticsTypes = ['platform', 'users', 'jobs', 'applications', 'matches']
    const periods = ['day', 'week', 'month']

    for (const type of analyticsTypes) {
      for (const period of periods) {
        const key = `analytics:${type}:${period}:30`
        console.log(`Warming up analytics cache: ${key}`)
      }
    }
  }
}

// Cache health check
export const cacheHealthCheck = async (): Promise<boolean> => {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Cache health check failed:', error)
    return false
  }
}

// Export cache utilities
export { cacheUtils, cacheWarming, cacheHealthCheck }
