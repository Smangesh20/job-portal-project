import { performance } from 'perf_hooks'
import { logger } from './logger'
import Redis from 'ioredis'

// Metrics configuration
interface MetricsConfig {
  enabled: boolean
  redisUrl?: string
  flushInterval: number
  maxMetricsInMemory: number
  enableHistograms: boolean
  enableCounters: boolean
  enableGauges: boolean
}

// Metric types
type MetricType = 'counter' | 'gauge' | 'histogram' | 'timer'

// Metric interface
interface Metric {
  name: string
  type: MetricType
  value: number
  labels: Record<string, string>
  timestamp: number
}

// Counter metric
interface CounterMetric extends Metric {
  type: 'counter'
}

// Gauge metric
interface GaugeMetric extends Metric {
  type: 'gauge'
}

// Histogram metric
interface HistogramMetric extends Metric {
  type: 'histogram'
  buckets: number[]
  count: number
  sum: number
}

// Timer metric
interface TimerMetric extends Metric {
  type: 'timer'
  duration: number
}

// Metrics collector class
export class MetricsCollector {
  private static instance: MetricsCollector
  private config: MetricsConfig
  private metrics: Map<string, Metric> = new Map()
  private redisClient: Redis | null = null
  private flushInterval: NodeJS.Timeout | null = null

  private constructor(config: MetricsConfig) {
    this.config = config
    
    if (config.enabled) {
      this.initializeRedis()
      this.startFlushInterval()
    }
  }

  static getInstance(config?: MetricsConfig): MetricsCollector {
    if (!MetricsCollector.instance) {
      const defaultConfig: MetricsConfig = {
        enabled: process.env.ENABLE_METRICS === 'true',
        redisUrl: process.env.REDIS_URL,
        flushInterval: parseInt(process.env.METRICS_FLUSH_INTERVAL || '60000'), // 1 minute
        maxMetricsInMemory: parseInt(process.env.MAX_METRICS_IN_MEMORY || '10000'),
        enableHistograms: process.env.ENABLE_HISTOGRAMS === 'true',
        enableCounters: process.env.ENABLE_COUNTERS !== 'false',
        enableGauges: process.env.ENABLE_GAUGES !== 'false'
      }
      
      MetricsCollector.instance = new MetricsCollector(config || defaultConfig)
    }
    return MetricsCollector.instance
  }

  private initializeRedis(): void {
    if (this.config.redisUrl) {
      try {
        this.redisClient = new Redis(this.config.redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          retryDelayOnFailover: 100
        })
      } catch (error) {
        logger.error('Failed to initialize Redis for metrics:', error)
      }
    }
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  /**
   * Increment a counter metric
   */
  increment(name: string, value: number = 1, labels: Record<string, string> = {}): void {
    if (!this.config.enabled || !this.config.enableCounters) return

    const key = this.generateKey(name, labels)
    const existing = this.metrics.get(key) as CounterMetric | undefined

    if (existing && existing.type === 'counter') {
      existing.value += value
    } else {
      this.metrics.set(key, {
        name,
        type: 'counter',
        value,
        labels,
        timestamp: Date.now()
      })
    }

    this.checkMemoryLimit()
  }

  /**
   * Set a gauge metric
   */
  gauge(name: string, value: number, labels: Record<string, string> = {}): void {
    if (!this.config.enabled || !this.config.enableGauges) return

    const key = this.generateKey(name, labels)
    this.metrics.set(key, {
      name,
      type: 'gauge',
      value,
      labels,
      timestamp: Date.now()
    })

    this.checkMemoryLimit()
  }

  /**
   * Record a histogram metric
   */
  histogram(name: string, value: number, labels: Record<string, string> = {}, buckets: number[] = [0.1, 0.5, 1, 2, 5, 10]): void {
    if (!this.config.enabled || !this.config.enableHistograms) return

    const key = this.generateKey(name, labels)
    const existing = this.metrics.get(key) as HistogramMetric | undefined

    if (existing && existing.type === 'histogram') {
      existing.count++
      existing.sum += value
      
      // Update buckets
      for (let i = 0; i < buckets.length; i++) {
        if (value <= buckets[i]) {
          existing.buckets[i] = (existing.buckets[i] || 0) + 1
          break
        }
      }
    } else {
      const newBuckets = new Array(buckets.length).fill(0)
      for (let i = 0; i < buckets.length; i++) {
        if (value <= buckets[i]) {
          newBuckets[i] = 1
          break
        }
      }

      this.metrics.set(key, {
        name,
        type: 'histogram',
        value,
        labels,
        timestamp: Date.now(),
        buckets: newBuckets,
        count: 1,
        sum: value
      })
    }

    this.checkMemoryLimit()
  }

  /**
   * Record a timer metric
   */
  timer(name: string, startTime: number, labels: Record<string, string> = {}): void {
    if (!this.config.enabled) return

    const duration = performance.now() - startTime
    const key = this.generateKey(name, labels)
    
    this.metrics.set(key, {
      name,
      type: 'timer',
      value: duration,
      labels,
      timestamp: Date.now(),
      duration
    })

    this.checkMemoryLimit()
  }

  /**
   * Get all metrics
   */
  getMetrics(): Metric[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): Metric[] {
    return Array.from(this.metrics.values()).filter(metric => metric.name === name)
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear()
  }

  /**
   * Flush metrics to Redis
   */
  private async flush(): Promise<void> {
    if (!this.redisClient || this.metrics.size === 0) return

    try {
      const metrics = this.getMetrics()
      const timestamp = Date.now()
      
      // Store metrics in Redis with timestamp
      const pipeline = this.redisClient.pipeline()
      
      for (const metric of metrics) {
        const key = `metrics:${metric.name}:${timestamp}`
        pipeline.hset(key, {
          type: metric.type,
          value: metric.value.toString(),
          labels: JSON.stringify(metric.labels),
          timestamp: metric.timestamp.toString(),
          ...(metric.type === 'histogram' && {
            buckets: JSON.stringify((metric as HistogramMetric).buckets),
            count: (metric as HistogramMetric).count.toString(),
            sum: (metric as HistogramMetric).sum.toString()
          }),
          ...(metric.type === 'timer' && {
            duration: (metric as TimerMetric).duration.toString()
          })
        })
        pipeline.expire(key, 86400) // Expire after 24 hours
      }
      
      await pipeline.exec()
      
      // Clear in-memory metrics after successful flush
      this.clear()
      
      logger.debug(`Flushed ${metrics.length} metrics to Redis`)
    } catch (error) {
      logger.error('Failed to flush metrics to Redis:', error)
    }
  }

  /**
   * Generate unique key for metric
   */
  private generateKey(name: string, labels: Record<string, string>): string {
    const labelString = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join(',')
    
    return labelString ? `${name}{${labelString}}` : name
  }

  /**
   * Check memory limit and clear old metrics if necessary
   */
  private checkMemoryLimit(): void {
    if (this.metrics.size > this.config.maxMetricsInMemory) {
      // Remove oldest metrics (simple FIFO)
      const sortedMetrics = Array.from(this.metrics.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      
      const toRemove = sortedMetrics.slice(0, this.config.maxMetricsInMemory / 2)
      toRemove.forEach(([key]) => this.metrics.delete(key))
      
      logger.warn(`Cleared ${toRemove.length} old metrics due to memory limit`)
    }
  }

  /**
   * Get metrics summary
   */
  getSummary(): {
    totalMetrics: number
    metricsByType: Record<string, number>
    memoryUsage: number
    lastFlush: string
  } {
    const metrics = this.getMetrics()
    const metricsByType = metrics.reduce((acc, metric) => {
      acc[metric.type] = (acc[metric.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalMetrics: metrics.length,
      metricsByType,
      memoryUsage: this.metrics.size,
      lastFlush: new Date().toISOString()
    }
  }

  /**
   * Stop the metrics collector
   */
  stop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    
    if (this.redisClient) {
      this.redisClient.disconnect()
      this.redisClient = null
    }
  }
}

// Predefined metrics
export const metrics = {
  // HTTP metrics
  http: {
    requests: (method: string, path: string, statusCode: number, duration: number) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('http_requests_total', 1, {
        method,
        path,
        status: statusCode.toString()
      })
      collector.histogram('http_request_duration_ms', duration, {
        method,
        path,
        status: statusCode.toString()
      })
    },
    
    errors: (method: string, path: string, errorType: string) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('http_errors_total', 1, {
        method,
        path,
        error_type: errorType
      })
    }
  },

  // Database metrics
  database: {
    queries: (operation: string, duration: number, success: boolean) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('database_queries_total', 1, {
        operation,
        success: success.toString()
      })
      collector.histogram('database_query_duration_ms', duration, {
        operation
      })
    },
    
    connections: (status: 'active' | 'idle' | 'total', count: number) => {
      const collector = MetricsCollector.getInstance()
      collector.gauge('database_connections', count, {
        status
      })
    }
  },

  // Cache metrics
  cache: {
    hits: (cacheType: string) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('cache_hits_total', 1, {
        cache_type: cacheType
      })
    },
    
    misses: (cacheType: string) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('cache_misses_total', 1, {
        cache_type: cacheType
      })
    },
    
    operations: (operation: string, duration: number) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('cache_operations_total', 1, {
        operation
      })
      collector.histogram('cache_operation_duration_ms', duration, {
        operation
      })
    }
  },

  // Business metrics
  business: {
    userRegistrations: (source: string) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('user_registrations_total', 1, {
        source
      })
    },
    
    jobApplications: (jobId: string, success: boolean) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('job_applications_total', 1, {
        job_id: jobId,
        success: success.toString()
      })
    },
    
    jobMatches: (matchScore: number) => {
      const collector = MetricsCollector.getInstance()
      collector.increment('job_matches_total', 1)
      collector.histogram('job_match_score', matchScore)
    }
  },

  // System metrics
  system: {
    memoryUsage: (usage: number) => {
      const collector = MetricsCollector.getInstance()
      collector.gauge('system_memory_usage_mb', usage)
    },
    
    cpuUsage: (usage: number) => {
      const collector = MetricsCollector.getInstance()
      collector.gauge('system_cpu_usage_percent', usage)
    },
    
    activeConnections: (count: number) => {
      const collector = MetricsCollector.getInstance()
      collector.gauge('system_active_connections', count)
    }
  }
}

// Metrics middleware
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = performance.now()
  const method = req.method
  const path = req.path

  // Override res.end to capture metrics
  const originalEnd = res.end
  res.end = function(chunk?: any, encoding?: any) {
    const duration = performance.now() - startTime
    const statusCode = res.statusCode

    // Record HTTP metrics
    metrics.http.requests(method, path, statusCode, duration)

    // Record error metrics if applicable
    if (statusCode >= 400) {
      const errorType = statusCode >= 500 ? 'server_error' : 'client_error'
      metrics.http.errors(method, path, errorType)
    }

    return originalEnd.call(this, chunk, encoding)
  }

  next()
}

// Export metrics utilities
export {
  MetricsCollector,
  metrics,
  metricsMiddleware
}

// Export singleton instance
export const metricsCollector = MetricsCollector.getInstance()
