import { performance } from 'perf_hooks'
import { logger } from './logger'

// Performance monitoring utilities
interface PerformanceMetrics {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, any>
}

interface PerformanceConfig {
  enableMetrics: boolean
  slowThreshold: number
  logSlowOperations: boolean
  enableProfiling: boolean
}

// Performance configuration
const config: PerformanceConfig = {
  enableMetrics: process.env.ENABLE_PERFORMANCE_METRICS === 'true',
  slowThreshold: parseInt(process.env.SLOW_OPERATION_THRESHOLD || '1000'),
  logSlowOperations: process.env.LOG_SLOW_OPERATIONS === 'true',
  enableProfiling: process.env.ENABLE_PROFILING === 'true'
}

// Performance metrics storage
const metrics: Map<string, PerformanceMetrics> = new Map()

// Performance monitoring class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, PerformanceMetrics> = new Map()

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Start performance monitoring for an operation
   */
  start(name: string, metadata?: Record<string, any>): void {
    if (!config.enableMetrics) return

    const startTime = performance.now()
    this.metrics.set(name, {
      name,
      startTime,
      metadata
    })
  }

  /**
   * End performance monitoring for an operation
   */
  end(name: string): number | undefined {
    if (!config.enableMetrics) return

    const metric = this.metrics.get(name)
    if (!metric) {
      logger.warn(`Performance metric not found: ${name}`)
      return
    }

    const endTime = performance.now()
    const duration = endTime - metric.startTime

    metric.endTime = endTime
    metric.duration = duration

    // Log slow operations
    if (config.logSlowOperations && duration > config.slowThreshold) {
      logger.warn('Slow operation detected', {
        operation: name,
        duration: `${duration.toFixed(2)}ms`,
        threshold: `${config.slowThreshold}ms`,
        metadata: metric.metadata
      })
    }

    // Log performance metrics
    logger.debug('Performance metric', {
      operation: name,
      duration: `${duration.toFixed(2)}ms`,
      metadata: metric.metadata
    })

    return duration
  }

  /**
   * Get performance metrics for an operation
   */
  getMetrics(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name)
  }

  /**
   * Get all performance metrics
   */
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Clear all performance metrics
   */
  clear(): void {
    this.metrics.clear()
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    totalOperations: number
    averageDuration: number
    slowOperations: number
    fastestOperation: PerformanceMetrics | null
    slowestOperation: PerformanceMetrics | null
  } {
    const allMetrics = this.getAllMetrics().filter(m => m.duration !== undefined)
    
    if (allMetrics.length === 0) {
      return {
        totalOperations: 0,
        averageDuration: 0,
        slowOperations: 0,
        fastestOperation: null,
        slowestOperation: null
      }
    }

    const totalDuration = allMetrics.reduce((sum, m) => sum + (m.duration || 0), 0)
    const averageDuration = totalDuration / allMetrics.length
    const slowOperations = allMetrics.filter(m => (m.duration || 0) > config.slowThreshold).length

    const fastestOperation = allMetrics.reduce((fastest, current) => 
      (current.duration || 0) < (fastest.duration || Infinity) ? current : fastest
    )

    const slowestOperation = allMetrics.reduce((slowest, current) => 
      (current.duration || 0) > (slowest.duration || 0) ? current : slowest
    )

    return {
      totalOperations: allMetrics.length,
      averageDuration,
      slowOperations,
      fastestOperation,
      slowestOperation
    }
  }
}

// Performance decorator for functions
export function measurePerformance(name?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    const operationName = name || `${target.constructor.name}.${propertyName}`

    descriptor.value = async function (...args: any[]) {
      const monitor = PerformanceMonitor.getInstance()
      monitor.start(operationName, { args: args.length })

      try {
        const result = await method.apply(this, args)
        monitor.end(operationName)
        return result
      } catch (error) {
        monitor.end(operationName)
        throw error
      }
    }

    return descriptor
  }
}

// Performance utility functions
export const performanceUtils = {
  /**
   * Measure execution time of a function
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const monitor = PerformanceMonitor.getInstance()
    monitor.start(name)

    try {
      const result = await fn()
      monitor.end(name)
      return result
    } catch (error) {
      monitor.end(name)
      throw error
    }
  },

  /**
   * Measure execution time of a synchronous function
   */
  measureSync<T>(name: string, fn: () => T): T {
    const monitor = PerformanceMonitor.getInstance()
    monitor.start(name)

    try {
      const result = fn()
      monitor.end(name)
      return result
    } catch (error) {
      monitor.end(name)
      throw error
    }
  },

  /**
   * Create a performance timer
   */
  createTimer(name: string, metadata?: Record<string, any>): {
    start: () => void
    end: () => number | undefined
    getDuration: () => number | undefined
  } {
    const monitor = PerformanceMonitor.getInstance()
    let startTime: number | undefined

    return {
      start: () => {
        startTime = performance.now()
        monitor.start(name, metadata)
      },
      end: () => {
        if (startTime === undefined) {
          logger.warn(`Timer ${name} was not started`)
          return
        }
        return monitor.end(name)
      },
      getDuration: () => {
        if (startTime === undefined) return
        return performance.now() - startTime
      }
    }
  },

  /**
   * Benchmark multiple functions
   */
  async benchmark<T>(
    functions: Array<{ name: string; fn: () => Promise<T> }>,
    iterations: number = 1
  ): Promise<Array<{ name: string; averageDuration: number; results: T[] }>> {
    const results = []

    for (const { name, fn } of functions) {
      const durations: number[] = []
      const functionResults: T[] = []

      for (let i = 0; i < iterations; i++) {
        const monitor = PerformanceMonitor.getInstance()
        monitor.start(name, { iteration: i + 1 })

        try {
          const result = await fn()
          const duration = monitor.end(name)
          if (duration !== undefined) {
            durations.push(duration)
          }
          functionResults.push(result)
        } catch (error) {
          monitor.end(name)
          throw error
        }
      }

      const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
      results.push({ name, averageDuration, results: functionResults })
    }

    return results
  },

  /**
   * Memory usage monitoring
   */
  getMemoryUsage(): {
    rss: number
    heapTotal: number
    heapUsed: number
    external: number
    arrayBuffers: number
  } {
    const usage = process.memoryUsage()
    return {
      rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100, // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100, // MB
      external: Math.round(usage.external / 1024 / 1024 * 100) / 100, // MB
      arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024 * 100) / 100 // MB
    }
  },

  /**
   * CPU usage monitoring
   */
  getCPUUsage(): Promise<{
    user: number
    system: number
  }> {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage()
      
      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage)
        const totalTime = endUsage.user + endUsage.system
        const totalTimeSeconds = totalTime / 1000000 // Convert to seconds
        
        resolve({
          user: Math.round(endUsage.user / 1000000 * 100) / 100, // seconds
          system: Math.round(endUsage.system / 1000000 * 100) / 100 // seconds
        })
      }, 1000)
    })
  },

  /**
   * System resource monitoring
   */
  getSystemResources(): {
    memory: ReturnType<typeof performanceUtils.getMemoryUsage>
    uptime: number
    nodeVersion: string
    platform: string
  } {
    return {
      memory: performanceUtils.getMemoryUsage(),
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform
    }
  },

  /**
   * Performance health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical'
    metrics: {
      memoryUsage: number
      averageResponseTime: number
      slowOperations: number
      errorRate: number
    }
    recommendations: string[]
  }> {
    const monitor = PerformanceMonitor.getInstance()
    const summary = monitor.getSummary()
    const memoryUsage = performanceUtils.getMemoryUsage()
    
    const recommendations: string[] = []
    let status: 'healthy' | 'warning' | 'critical' = 'healthy'

    // Check memory usage
    if (memoryUsage.heapUsed > 500) { // 500MB
      recommendations.push('High memory usage detected. Consider optimizing memory usage.')
      status = 'warning'
    }

    if (memoryUsage.heapUsed > 1000) { // 1GB
      recommendations.push('Critical memory usage detected. Immediate attention required.')
      status = 'critical'
    }

    // Check response times
    if (summary.averageDuration > 2000) { // 2 seconds
      recommendations.push('Slow average response time detected. Consider performance optimization.')
      status = status === 'healthy' ? 'warning' : status
    }

    // Check slow operations
    if (summary.slowOperations > 10) {
      recommendations.push('High number of slow operations detected. Review performance bottlenecks.')
      status = status === 'healthy' ? 'warning' : status
    }

    return {
      status,
      metrics: {
        memoryUsage: memoryUsage.heapUsed,
        averageResponseTime: summary.averageDuration,
        slowOperations: summary.slowOperations,
        errorRate: 0 // This would be calculated from actual error logs
      },
      recommendations
    }
  }
}

// Performance middleware
export const performanceMiddleware = (req: any, res: any, next: any) => {
  if (!config.enableMetrics) {
    return next()
  }

  const startTime = performance.now()
  const monitor = PerformanceMonitor.getInstance()
  const operationName = `${req.method} ${req.path}`

  monitor.start(operationName, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  const originalEnd = res.end
  res.end = function(chunk?: any, encoding?: any) {
    const duration = monitor.end(operationName)
    
    if (duration && config.logSlowOperations && duration > config.slowThreshold) {
      logger.warn('Slow HTTP request', {
        operation: operationName,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
        threshold: `${config.slowThreshold}ms`
      })
    }

    return originalEnd.call(this, chunk, encoding)
  }

  next()
}

// Export performance utilities
export {
  PerformanceMonitor,
  performanceUtils,
  performanceMiddleware,
  measurePerformance
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()
