import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger'
import { checkDatabaseHealth } from '@/utils/database'
import { performanceUtils } from '@/utils/performance'
import Redis from 'ioredis'

// Health check configuration
interface HealthCheckConfig {
  timeout: number
  includeDetails: boolean
  checkDatabase: boolean
  checkRedis: boolean
  checkMemory: boolean
  checkDisk: boolean
}

// Health check status interface
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  environment: string
  checks: {
    database?: HealthCheckResult
    redis?: HealthCheckResult
    memory?: HealthCheckResult
    disk?: HealthCheckResult
  }
  metrics: {
    memoryUsage: number
    cpuUsage?: number
    responseTime: number
  }
}

interface HealthCheckResult {
  status: 'pass' | 'fail' | 'warn'
  message: string
  duration?: number
  details?: any
}

// Default configuration
const defaultConfig: HealthCheckConfig = {
  timeout: 5000, // 5 seconds
  includeDetails: process.env.NODE_ENV === 'development',
  checkDatabase: true,
  checkRedis: true,
  checkMemory: true,
  checkDisk: false
}

// Redis client for health checks
let redisClient: Redis | null = null

// Initialize Redis client for health checks
const initRedisClient = (): Redis | null => {
  try {
    if (process.env.REDIS_URL) {
      redisClient = new Redis(process.env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryDelayOnFailover: 100,
        connectTimeout: 5000,
        commandTimeout: 5000
      })
      return redisClient
    }
  } catch (error) {
    logger.error('Failed to initialize Redis client for health checks:', error)
  }
  return null
}

// Check database health
const checkDatabase = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now()
  
  try {
    const result = await checkDatabaseHealth()
    const duration = Date.now() - startTime
    
    return {
      status: result.status === 'healthy' ? 'pass' : 'fail',
      message: result.status === 'healthy' ? 'Database connection healthy' : 'Database connection unhealthy',
      duration,
      details: {
        latency: result.latency,
        error: result.error
      }
    }
  } catch (error) {
    const duration = Date.now() - startTime
    
    return {
      status: 'fail',
      message: 'Database health check failed',
      duration,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Check Redis health
const checkRedis = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now()
  
  try {
    if (!redisClient) {
      redisClient = initRedisClient()
    }
    
    if (!redisClient) {
      return {
        status: 'warn',
        message: 'Redis not configured',
        duration: Date.now() - startTime
      }
    }
    
    await redisClient.ping()
    const duration = Date.now() - startTime
    
    return {
      status: 'pass',
      message: 'Redis connection healthy',
      duration
    }
  } catch (error) {
    const duration = Date.now() - startTime
    
    return {
      status: 'fail',
      message: 'Redis health check failed',
      duration,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Check memory health
const checkMemory = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now()
  
  try {
    const memoryUsage = performanceUtils.getMemoryUsage()
    const duration = Date.now() - startTime
    
    // Check if memory usage is too high
    const isHealthy = memoryUsage.heapUsed < 1000 // Less than 1GB
    const isWarning = memoryUsage.heapUsed < 2000 // Less than 2GB
    
    let status: 'pass' | 'fail' | 'warn' = 'pass'
    let message = 'Memory usage healthy'
    
    if (!isHealthy) {
      status = 'fail'
      message = 'Memory usage critically high'
    } else if (!isWarning) {
      status = 'warn'
      message = 'Memory usage elevated'
    }
    
    return {
      status,
      message,
      duration,
      details: memoryUsage
    }
  } catch (error) {
    const duration = Date.now() - startTime
    
    return {
      status: 'fail',
      message: 'Memory health check failed',
      duration,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Check disk health
const checkDisk = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now()
  
  try {
    // This would typically use a library like 'diskusage' or 'node-disk-info'
    // For now, we'll simulate a disk check
    const duration = Date.now() - startTime
    
    return {
      status: 'pass',
      message: 'Disk usage healthy',
      duration,
      details: {
        note: 'Disk health check not fully implemented'
      }
    }
  } catch (error) {
    const duration = Date.now() - startTime
    
    return {
      status: 'fail',
      message: 'Disk health check failed',
      duration,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Main health check function
export const performHealthCheck = async (config: HealthCheckConfig = defaultConfig): Promise<HealthStatus> => {
  const startTime = Date.now()
  const checks: HealthStatus['checks'] = {}
  
  // Run health checks in parallel with timeout
  const checkPromises: Promise<void>[] = []
  
  if (config.checkDatabase) {
    checkPromises.push(
      checkDatabase().then(result => { checks.database = result })
    )
  }
  
  if (config.checkRedis) {
    checkPromises.push(
      checkRedis().then(result => { checks.redis = result })
    )
  }
  
  if (config.checkMemory) {
    checkPromises.push(
      checkMemory().then(result => { checks.memory = result })
    )
  }
  
  if (config.checkDisk) {
    checkPromises.push(
      checkDisk().then(result => { checks.disk = result })
    )
  }
  
  // Wait for all checks to complete or timeout
  try {
    await Promise.race([
      Promise.allSettled(checkPromises),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health check timeout')), config.timeout)
      )
    ])
  } catch (error) {
    logger.error('Health check timeout or error:', error)
  }
  
  const responseTime = Date.now() - startTime
  
  // Determine overall status
  const checkResults = Object.values(checks)
  const hasFailures = checkResults.some(check => check?.status === 'fail')
  const hasWarnings = checkResults.some(check => check?.status === 'warn')
  
  let status: 'healthy' | 'degraded' | 'unhealthy'
  if (hasFailures) {
    status = 'unhealthy'
  } else if (hasWarnings) {
    status = 'degraded'
  } else {
    status = 'healthy'
  }
  
  // Get system metrics
  const memoryUsage = performanceUtils.getMemoryUsage()
  
  return {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: config.includeDetails ? checks : {},
    metrics: {
      memoryUsage: memoryUsage.heapUsed,
      responseTime
    }
  }
}

// Health check middleware
export const healthCheckMiddleware = (config: HealthCheckConfig = defaultConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const healthStatus = await performHealthCheck(config)
      
      // Set appropriate HTTP status code
      let httpStatus: number
      switch (healthStatus.status) {
        case 'healthy':
          httpStatus = 200
          break
        case 'degraded':
          httpStatus = 200 // Still return 200 but with warning status
          break
        case 'unhealthy':
          httpStatus = 503
          break
        default:
          httpStatus = 500
      }
      
      res.status(httpStatus).json(healthStatus)
    } catch (error) {
      logger.error('Health check middleware error:', error)
      
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

// Simple health check (lightweight)
export const simpleHealthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Service is running'
  })
}

// Detailed health check (comprehensive)
export const detailedHealthCheck = healthCheckMiddleware({
  ...defaultConfig,
  includeDetails: true,
  checkDatabase: true,
  checkRedis: true,
  checkMemory: true,
  checkDisk: false
})

// Readiness check (for Kubernetes)
export const readinessCheck = async (req: Request, res: Response) => {
  try {
    // Check critical dependencies
    const checks = await Promise.allSettled([
      checkDatabase(),
      checkRedis()
    ])
    
    const hasFailures = checks.some(result => 
      result.status === 'rejected' || 
      (result.status === 'fulfilled' && result.value.status === 'fail')
    )
    
    if (hasFailures) {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        message: 'Service not ready - dependencies unhealthy'
      })
    } else {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        message: 'Service is ready'
      })
    }
  } catch (error) {
    logger.error('Readiness check error:', error)
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      message: 'Readiness check failed'
    })
  }
}

// Liveness check (for Kubernetes)
export const livenessCheck = (req: Request, res: Response) => {
  // Simple liveness check - if the service can respond, it's alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Service is alive'
  })
}

// Health check routes
export const healthCheckRoutes = {
  // Basic health check
  '/health': simpleHealthCheck,
  
  // Detailed health check
  '/health/detailed': detailedHealthCheck,
  
  // Kubernetes readiness probe
  '/health/ready': readinessCheck,
  
  // Kubernetes liveness probe
  '/health/alive': livenessCheck
}

// Export health check utilities
export {
  performHealthCheck,
  healthCheckMiddleware,
  simpleHealthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck,
  healthCheckRoutes
}
