import cron from 'node-cron'
import { logger } from './logger'
import { performanceMonitor } from './performance'
import { databaseUtils } from './database'

// Scheduler configuration
interface SchedulerConfig {
  timezone: string
  maxConcurrentJobs: number
  jobTimeout: number
  retryAttempts: number
  retryDelay: number
}

// Job interface
interface ScheduledJob {
  id: string
  name: string
  cronExpression: string
  task: () => Promise<void>
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
  runCount: number
  errorCount: number
  timeout?: NodeJS.Timeout
}

// Scheduler class
export class Scheduler {
  private static instance: Scheduler
  private jobs: Map<string, ScheduledJob> = new Map()
  private runningJobs: Set<string> = new Set()
  private config: SchedulerConfig

  private constructor() {
    this.config = {
      timezone: process.env.TZ || 'UTC',
      maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '5'),
      jobTimeout: parseInt(process.env.JOB_TIMEOUT || '300000'), // 5 minutes
      retryAttempts: parseInt(process.env.JOB_RETRY_ATTEMPTS || '3'),
      retryDelay: parseInt(process.env.JOB_RETRY_DELAY || '60000') // 1 minute
    }
  }

  static getInstance(): Scheduler {
    if (!Scheduler.instance) {
      Scheduler.instance = new Scheduler()
    }
    return Scheduler.instance
  }

  /**
   * Add a scheduled job
   */
  addJob(id: string, name: string, cronExpression: string, task: () => Promise<void>): void {
    if (this.jobs.has(id)) {
      throw new Error(`Job with id '${id}' already exists`)
    }

    const job: ScheduledJob = {
      id,
      name,
      cronExpression,
      task,
      enabled: true,
      runCount: 0,
      errorCount: 0
    }

    this.jobs.set(id, job)
    this.scheduleJob(job)
    
    logger.info('Scheduled job added', {
      jobId: id,
      jobName: name,
      cronExpression,
      timezone: this.config.timezone
    })
  }

  /**
   * Remove a scheduled job
   */
  removeJob(id: string): void {
    const job = this.jobs.get(id)
    if (!job) {
      throw new Error(`Job with id '${id}' not found`)
    }

    if (job.timeout) {
      clearTimeout(job.timeout)
    }

    this.jobs.delete(id)
    this.runningJobs.delete(id)
    
    logger.info('Scheduled job removed', { jobId: id })
  }

  /**
   * Enable a scheduled job
   */
  enableJob(id: string): void {
    const job = this.jobs.get(id)
    if (!job) {
      throw new Error(`Job with id '${id}' not found`)
    }

    job.enabled = true
    this.scheduleJob(job)
    
    logger.info('Scheduled job enabled', { jobId: id })
  }

  /**
   * Disable a scheduled job
   */
  disableJob(id: string): void {
    const job = this.jobs.get(id)
    if (!job) {
      throw new Error(`Job with id '${id}' not found`)
    }

    job.enabled = false
    if (job.timeout) {
      clearTimeout(job.timeout)
      job.timeout = undefined
    }
    
    logger.info('Scheduled job disabled', { jobId: id })
  }

  /**
   * Run a job immediately
   */
  async runJob(id: string): Promise<void> {
    const job = this.jobs.get(id)
    if (!job) {
      throw new Error(`Job with id '${id}' not found`)
    }

    await this.executeJob(job)
  }

  /**
   * Get job status
   */
  getJobStatus(id: string): ScheduledJob | undefined {
    return this.jobs.get(id)
  }

  /**
   * Get all jobs
   */
  getAllJobs(): ScheduledJob[] {
    return Array.from(this.jobs.values())
  }

  /**
   * Get running jobs
   */
  getRunningJobs(): string[] {
    return Array.from(this.runningJobs)
  }

  /**
   * Schedule a job
   */
  private scheduleJob(job: ScheduledJob): void {
    if (!job.enabled) return

    try {
      const task = cron.schedule(job.cronExpression, async () => {
        await this.executeJob(job)
      }, {
        scheduled: false,
        timezone: this.config.timezone
      })

      task.start()
      
      // Calculate next run time
      const nextRun = this.calculateNextRun(job.cronExpression)
      job.nextRun = nextRun
      
      logger.info('Job scheduled', {
        jobId: job.id,
        jobName: job.name,
        nextRun: nextRun?.toISOString()
      })
    } catch (error) {
      logger.error('Failed to schedule job', {
        jobId: job.id,
        jobName: job.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Execute a job
   */
  private async executeJob(job: ScheduledJob): Promise<void> {
    if (this.runningJobs.has(job.id)) {
      logger.warn('Job already running', { jobId: job.id })
      return
    }

    if (this.runningJobs.size >= this.config.maxConcurrentJobs) {
      logger.warn('Maximum concurrent jobs reached', {
        jobId: job.id,
        maxConcurrent: this.config.maxConcurrentJobs
      })
      return
    }

    this.runningJobs.add(job.id)
    job.lastRun = new Date()
    job.runCount++

    const monitor = performanceMonitor
    monitor.start(`job_${job.id}`, {
      jobName: job.name,
      runCount: job.runCount
    })

    try {
      // Set job timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Job ${job.id} timed out after ${this.config.jobTimeout}ms`))
        }, this.config.jobTimeout)
      })

      // Execute job with timeout
      await Promise.race([
        job.task(),
        timeoutPromise
      ])

      monitor.end(`job_${job.id}`)
      
      logger.info('Job completed successfully', {
        jobId: job.id,
        jobName: job.name,
        runCount: job.runCount,
        duration: monitor.getMetrics(`job_${job.id}`)?.duration
      })

    } catch (error) {
      job.errorCount++
      monitor.end(`job_${job.id}`)
      
      logger.error('Job execution failed', {
        jobId: job.id,
        jobName: job.name,
        runCount: job.runCount,
        errorCount: job.errorCount,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: monitor.getMetrics(`job_${job.id}`)?.duration
      })

      // Retry job if retry attempts remaining
      if (job.errorCount <= this.config.retryAttempts) {
        logger.info('Retrying job', {
          jobId: job.id,
          retryAttempt: job.errorCount,
          maxRetries: this.config.retryAttempts
        })

        setTimeout(() => {
          this.executeJob(job)
        }, this.config.retryDelay)
      } else {
        logger.error('Job failed after maximum retries', {
          jobId: job.id,
          maxRetries: this.config.retryAttempts
        })
      }
    } finally {
      this.runningJobs.delete(job.id)
    }
  }

  /**
   * Calculate next run time for a cron expression
   */
  private calculateNextRun(cronExpression: string): Date | undefined {
    try {
      const now = new Date()
      const nextRun = cron.getNextRun(cronExpression, now)
      return nextRun
    } catch (error) {
      logger.error('Failed to calculate next run time', {
        cronExpression,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return undefined
    }
  }

  /**
   * Stop all jobs
   */
  stopAllJobs(): void {
    for (const [id, job] of this.jobs) {
      if (job.timeout) {
        clearTimeout(job.timeout)
      }
    }
    
    this.runningJobs.clear()
    logger.info('All scheduled jobs stopped')
  }

  /**
   * Get scheduler statistics
   */
  getStatistics(): {
    totalJobs: number
    enabledJobs: number
    runningJobs: number
    totalRuns: number
    totalErrors: number
    averageRunTime: number
  } {
    const jobs = Array.from(this.jobs.values())
    const enabledJobs = jobs.filter(job => job.enabled).length
    const totalRuns = jobs.reduce((sum, job) => sum + job.runCount, 0)
    const totalErrors = jobs.reduce((sum, job) => sum + job.errorCount, 0)

    return {
      totalJobs: jobs.length,
      enabledJobs,
      runningJobs: this.runningJobs.size,
      totalRuns,
      totalErrors,
      averageRunTime: 0 // This would be calculated from performance metrics
    }
  }
}

// Predefined scheduled jobs
export const predefinedJobs = {
  /**
   * Database cleanup job
   */
  async databaseCleanup(): Promise<void> {
    const monitor = performanceMonitor
    monitor.start('database_cleanup')

    try {
      const result = await databaseUtils.cleanup(30, false)
      
      logger.info('Database cleanup completed', {
        deletedRecords: result.deletedRecords,
        operations: result.operations
      })
    } catch (error) {
      logger.error('Database cleanup failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    } finally {
      monitor.end('database_cleanup')
    }
  },

  /**
   * Performance metrics cleanup job
   */
  async performanceMetricsCleanup(): Promise<void> {
    const monitor = performanceMonitor
    monitor.start('performance_cleanup')

    try {
      // Clear old performance metrics
      monitor.clear()
      
      logger.info('Performance metrics cleanup completed')
    } catch (error) {
      logger.error('Performance metrics cleanup failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    } finally {
      monitor.end('performance_cleanup')
    }
  },

  /**
   * Health check job
   */
  async healthCheck(): Promise<void> {
    const monitor = performanceMonitor
    monitor.start('health_check')

    try {
      // Perform system health checks
      const memoryUsage = process.memoryUsage()
      const uptime = process.uptime()
      
      logger.info('System health check', {
        memoryUsage: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024)
        },
        uptime: Math.round(uptime)
      })
    } catch (error) {
      logger.error('Health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    } finally {
      monitor.end('health_check')
    }
  },

  /**
   * Cache warming job
   */
  async cacheWarming(): Promise<void> {
    const monitor = performanceMonitor
    monitor.start('cache_warming')

    try {
      // Warm up frequently accessed data
      logger.info('Cache warming started')
      
      // This would integrate with cache warming utilities
      // await cacheWarming.warmUpCache()
      
      logger.info('Cache warming completed')
    } catch (error) {
      logger.error('Cache warming failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    } finally {
      monitor.end('cache_warming')
    }
  }
}

// Initialize scheduler with predefined jobs
export const initializeScheduler = (): Scheduler => {
  const scheduler = Scheduler.getInstance()

  // Add predefined jobs
  scheduler.addJob(
    'database_cleanup',
    'Database Cleanup',
    '0 2 * * *', // Daily at 2 AM
    predefinedJobs.databaseCleanup
  )

  scheduler.addJob(
    'performance_cleanup',
    'Performance Metrics Cleanup',
    '0 */6 * * *', // Every 6 hours
    predefinedJobs.performanceMetricsCleanup
  )

  scheduler.addJob(
    'health_check',
    'System Health Check',
    '*/5 * * * *', // Every 5 minutes
    predefinedJobs.healthCheck
  )

  scheduler.addJob(
    'cache_warming',
    'Cache Warming',
    '0 */2 * * *', // Every 2 hours
    predefinedJobs.cacheWarming
  )

  logger.info('Scheduler initialized with predefined jobs')
  return scheduler
}

// Export scheduler utilities
export {
  Scheduler,
  initializeScheduler,
  predefinedJobs
}

// Export singleton instance
export const scheduler = Scheduler.getInstance()
