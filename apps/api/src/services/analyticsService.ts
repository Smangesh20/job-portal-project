import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export interface AnalyticsData {
  users: {
    total: number
    active: number
    new: number
    growth: number
  }
  jobs: {
    total: number
    active: number
    new: number
    applications: number
  }
  companies: {
    total: number
    active: number
    new: number
  }
  applications: {
    total: number
    pending: number
    accepted: number
    rejected: number
  }
  matches: {
    total: number
    averageScore: number
    successful: number
  }
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface UserAnalytics {
  profileViews: number
  jobViews: number
  applicationsSent: number
  matchesReceived: number
  messagesSent: number
  companiesFollowed: number
  jobsSaved: number
}

export interface JobAnalytics {
  views: number
  applications: number
  matches: number
  conversionRate: number
  averageMatchScore: number
  timeToFill: number
}

export interface CompanyAnalytics {
  profileViews: number
  jobsPosted: number
  applicationsReceived: number
  hires: number
  averageRating: number
  followers: number
}

export const analyticsService = {
  /**
   * Get overall platform analytics
   */
  async getPlatformAnalytics(): Promise<AnalyticsData> {
    const [
      userStats,
      jobStats,
      companyStats,
      applicationStats,
      matchStats
    ] = await Promise.all([
      this.getUserAnalytics(),
      this.getJobAnalytics(),
      this.getCompanyAnalytics(),
      this.getApplicationAnalytics(),
      this.getMatchAnalytics()
    ])

    return {
      users: userStats,
      jobs: jobStats,
      companies: companyStats,
      applications: applicationStats,
      matches: matchStats
    }
  },

  /**
   * Get user analytics
   */
  async getUserAnalytics() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [total, active, newUsers, previousTotal] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { lastLoginAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { lt: thirtyDaysAgo } } })
    ])

    const growth = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0

    return {
      total,
      active,
      new: newUsers,
      growth: Math.round(growth * 100) / 100
    }
  },

  /**
   * Get job analytics
   */
  async getJobAnalytics() {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [total, active, newJobs, totalApplications] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.job.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.application.count()
    ])

    return {
      total,
      active,
      new: newJobs,
      applications: totalApplications
    }
  },

  /**
   * Get company analytics
   */
  async getCompanyAnalytics() {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [total, active, newCompanies] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { jobs: { some: { status: 'ACTIVE' } } } }),
      prisma.company.count({ where: { createdAt: { gte: sevenDaysAgo } } })
    ])

    return {
      total,
      active,
      new: newCompanies
    }
  },

  /**
   * Get application analytics
   */
  async getApplicationAnalytics() {
    const [total, pending, accepted, rejected] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: 'APPLIED' } }),
      prisma.application.count({ where: { status: 'ACCEPTED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } })
    ])

    return {
      total,
      pending,
      accepted,
      rejected
    }
  },

  /**
   * Get match analytics
   */
  async getMatchAnalytics() {
    const [total, averageScore, successful] = await Promise.all([
      prisma.jobMatch.count(),
      prisma.jobMatch.aggregate({ _avg: { score: true } }),
      prisma.jobMatch.count({ where: { score: { gte: 80 } } })
    ])

    return {
      total,
      averageScore: Math.round((averageScore._avg.score || 0) * 100) / 100,
      successful
    }
  },

  /**
   * Get time series data for charts
   */
  async getTimeSeriesData(type: 'users' | 'jobs' | 'applications' | 'matches', days: number = 30): Promise<TimeSeriesData[]> {
    const now = new Date()
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    const data: TimeSeriesData[] = []
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)
      
      let count = 0
      
      switch (type) {
        case 'users':
          count = await prisma.user.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDate
              }
            }
          })
          break
        case 'jobs':
          count = await prisma.job.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDate
              }
            }
          })
          break
        case 'applications':
          count = await prisma.application.count({
            where: {
              appliedAt: {
                gte: date,
                lt: nextDate
              }
            }
          })
          break
        case 'matches':
          count = await prisma.jobMatch.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDate
              }
            }
          })
          break
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: count
      })
    }
    
    return data
  },

  /**
   * Get user-specific analytics
   */
  async getUserAnalyticsById(userId: string): Promise<UserAnalytics> {
    const [
      profileViews,
      jobViews,
      applicationsSent,
      matchesReceived,
      messagesSent,
      companiesFollowed,
      jobsSaved
    ] = await Promise.all([
      this.getUserProfileViews(userId),
      this.getUserJobViews(userId),
      prisma.application.count({ where: { userId } }),
      prisma.jobMatch.count({ where: { userId } }),
      prisma.message.count({ where: { senderId: userId } }),
      prisma.companyFollow.count({ where: { userId } }),
      prisma.savedJob.count({ where: { userId } })
    ])

    return {
      profileViews,
      jobViews,
      applicationsSent,
      matchesReceived,
      messagesSent,
      companiesFollowed,
      jobsSaved
    }
  },

  /**
   * Get job-specific analytics
   */
  async getJobAnalyticsById(jobId: string): Promise<JobAnalytics> {
    const [
      views,
      applications,
      matches,
      averageMatchScore,
      timeToFill
    ] = await Promise.all([
      this.getJobViews(jobId),
      prisma.application.count({ where: { jobId } }),
      prisma.jobMatch.count({ where: { jobId } }),
      prisma.jobMatch.aggregate({
        where: { jobId },
        _avg: { score: true }
      }),
      this.getJobTimeToFill(jobId)
    ])

    const conversionRate = views > 0 ? (applications / views) * 100 : 0

    return {
      views,
      applications,
      matches,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageMatchScore: Math.round((averageMatchScore._avg.score || 0) * 100) / 100,
      timeToFill
    }
  },

  /**
   * Get company-specific analytics
   */
  async getCompanyAnalyticsById(companyId: string): Promise<CompanyAnalytics> {
    const [
      profileViews,
      jobsPosted,
      applicationsReceived,
      hires,
      averageRating,
      followers
    ] = await Promise.all([
      this.getCompanyProfileViews(companyId),
      prisma.job.count({ where: { companyId } }),
      prisma.application.count({
        where: { job: { companyId } }
      }),
      prisma.application.count({
        where: {
          job: { companyId },
          status: 'ACCEPTED'
        }
      }),
      prisma.companyReview.aggregate({
        where: { companyId },
        _avg: { rating: true }
      }),
      prisma.companyFollow.count({ where: { companyId } })
    ])

    return {
      profileViews,
      jobsPosted,
      applicationsReceived,
      hires,
      averageRating: Math.round((averageRating._avg.rating || 0) * 100) / 100,
      followers
    }
  },

  /**
   * Track user activity
   */
  async trackUserActivity(userId: string, activity: string, metadata?: any) {
    const activityData = {
      userId,
      activity,
      metadata,
      timestamp: new Date().toISOString(),
      ip: metadata?.ip || null,
      userAgent: metadata?.userAgent || null
    }

    // Store in Redis for real-time analytics
    await redis.lpush(`user_activity:${userId}`, JSON.stringify(activityData))
    await redis.ltrim(`user_activity:${userId}`, 0, 999) // Keep last 1000 activities

    // Store in database for long-term analytics
    await prisma.auditLog.create({
      data: {
        userId,
        action: activity,
        resource: 'user_activity',
        details: metadata
      }
    })
  },

  /**
   * Track page views
   */
  async trackPageView(page: string, userId?: string, metadata?: any) {
    const viewData = {
      page,
      userId,
      timestamp: new Date().toISOString(),
      ...metadata
    }

    // Increment view count in Redis
    await redis.incr(`page_views:${page}`)
    await redis.incr(`page_views:${page}:${new Date().toISOString().split('T')[0]}`)

    if (userId) {
      await redis.incr(`user_views:${userId}`)
    }

    // Store detailed view data
    await redis.lpush('page_views', JSON.stringify(viewData))
    await redis.ltrim('page_views', 0, 9999) // Keep last 10000 views
  },

  /**
   * Get trending searches
   */
  async getTrendingSearches(limit: number = 10) {
    const searches = await redis.zrevrange('search_trends', 0, limit - 1, 'WITHSCORES')
    
    return searches.reduce((acc: any[], search: string, index: number) => {
      if (index % 2 === 0) {
        acc.push({
          query: search,
          count: parseInt(searches[index + 1] as string)
        })
      }
      return acc
    }, [])
  },

  /**
   * Track search query
   */
  async trackSearch(query: string, userId?: string, results?: number) {
    // Increment search count
    await redis.zincrby('search_trends', 1, query)
    
    // Store search data
    const searchData = {
      query,
      userId,
      results,
      timestamp: new Date().toISOString()
    }
    
    await redis.lpush('searches', JSON.stringify(searchData))
    await redis.ltrim('searches', 0, 9999) // Keep last 10000 searches
  },

  /**
   * Helper methods for specific analytics
   */
  async getUserProfileViews(userId: string): Promise<number> {
    const views = await redis.get(`profile_views:${userId}`)
    return views ? parseInt(views) : 0
  },

  async getUserJobViews(userId: string): Promise<number> {
    const views = await redis.get(`user_job_views:${userId}`)
    return views ? parseInt(views) : 0
  },

  async getJobViews(jobId: string): Promise<number> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { views: true }
    })
    return job?.views || 0
  },

  async getCompanyProfileViews(companyId: string): Promise<number> {
    const views = await redis.get(`company_views:${companyId}`)
    return views ? parseInt(views) : 0
  },

  async getJobTimeToFill(jobId: string): Promise<number> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { createdAt: true }
    })

    if (!job) return 0

    const firstApplication = await prisma.application.findFirst({
      where: { jobId },
      orderBy: { appliedAt: 'asc' },
      select: { appliedAt: true }
    })

    if (!firstApplication) return 0

    return Math.floor((firstApplication.appliedAt.getTime() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24)) // days
  },

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics() {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const [
      activeUsers,
      newJobs,
      newApplications,
      newMatches
    ] = await Promise.all([
      redis.scard('active_users'),
      prisma.job.count({ where: { createdAt: { gte: oneHourAgo } } }),
      prisma.application.count({ where: { appliedAt: { gte: oneHourAgo } } }),
      prisma.jobMatch.count({ where: { createdAt: { gte: oneHourAgo } } })
    ])

    return {
      activeUsers: parseInt(activeUsers as string) || 0,
      newJobs,
      newApplications,
      newMatches,
      timestamp: now.toISOString()
    }
  },

  /**
   * Export analytics data
   */
  async exportAnalyticsData(startDate: Date, endDate: Date) {
    const data = {
      users: await this.getTimeSeriesData('users', Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))),
      jobs: await this.getTimeSeriesData('jobs', Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))),
      applications: await this.getTimeSeriesData('applications', Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))),
      matches: await this.getTimeSeriesData('matches', Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    }

    return data
  }
}
