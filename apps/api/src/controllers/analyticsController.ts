import { Request, Response } from 'express'
import { analyticsService } from '@/services/analyticsService'
import { AuthenticatedRequest } from '@/types/auth'

export const analyticsController = {
  /**
   * Get platform-wide analytics
   */
  async getPlatformAnalytics(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user

      // Check if user has admin access for platform analytics
      if (user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required for platform analytics'
        })
      }

      const analytics = await analyticsService.getPlatformAnalytics()

      res.json({
        success: true,
        data: analytics
      })
    } catch (error) {
      console.error('Error getting platform analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get user analytics time series
   */
  async getUserAnalytics(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user

      // Check if user has admin access
      if (user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required for user analytics'
        })
      }

      const { period = 'month', limit = 30 } = req.query
      const data = await analyticsService.getTimeSeriesData('users', Number(limit))

      res.json({
        success: true,
        data
      })
    } catch (error) {
      console.error('Error getting user analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get job analytics time series
   */
  async getJobAnalytics(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user

      // Check if user has admin access
      if (user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required for job analytics'
        })
      }

      const { period = 'month', limit = 30 } = req.query
      const data = await analyticsService.getTimeSeriesData('jobs', Number(limit))

      res.json({
        success: true,
        data
      })
    } catch (error) {
      console.error('Error getting job analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get application analytics time series
   */
  async getApplicationAnalytics(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user

      // Check if user has admin access
      if (user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required for application analytics'
        })
      }

      const { period = 'month', limit = 30 } = req.query
      const data = await analyticsService.getTimeSeriesData('applications', Number(limit))

      res.json({
        success: true,
        data
      })
    } catch (error) {
      console.error('Error getting application analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get match analytics time series
   */
  async getMatchAnalytics(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user

      // Check if user has admin access
      if (user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required for match analytics'
        })
      }

      const { period = 'month', limit = 30 } = req.query
      const data = await analyticsService.getTimeSeriesData('matches', Number(limit))

      res.json({
        success: true,
        data
      })
    } catch (error) {
      console.error('Error getting match analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get user-specific analytics
   */
  async getUserAnalyticsById(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user
      const { userId } = req.params

      // Users can only view their own analytics
      if (user?.id !== userId && user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own analytics'
        })
      }

      const analytics = await analyticsService.getUserAnalyticsById(userId)

      res.json({
        success: true,
        data: analytics
      })
    } catch (error) {
      console.error('Error getting user analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get job-specific analytics
   */
  async getJobAnalyticsById(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user
      const { jobId } = req.params

      // Check if user owns the job or is admin
      const { jobService } = await import('@/services/jobService')
      const job = await jobService.getJobById(jobId)

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        })
      }

      if (job.createdBy !== user?.id && user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You can only view analytics for your own jobs'
        })
      }

      const analytics = await analyticsService.getJobAnalyticsById(jobId)

      res.json({
        success: true,
        data: analytics
      })
    } catch (error) {
      console.error('Error getting job analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get company-specific analytics
   */
  async getCompanyAnalyticsById(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user
      const { companyId } = req.params

      // Check if user owns the company or is admin
      const { companyService } = await import('@/services/companyService')
      const company = await companyService.getCompanyById(companyId)

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        })
      }

      if (company.createdBy !== user?.id && user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You can only view analytics for your own companies'
        })
      }

      const analytics = await analyticsService.getCompanyAnalyticsById(companyId)

      res.json({
        success: true,
        data: analytics
      })
    } catch (error) {
      console.error('Error getting company analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user

      // Check if user has admin access
      if (user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required for real-time metrics'
        })
      }

      const metrics = await analyticsService.getRealTimeMetrics()

      res.json({
        success: true,
        data: metrics
      })
    } catch (error) {
      console.error('Error getting real-time metrics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get trending searches
   */
  async getTrendingSearches(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user

      // Check if user has admin access
      if (user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required for trending searches'
        })
      }

      const { limit = 10 } = req.query
      const trending = await analyticsService.getTrendingSearches(Number(limit))

      res.json({
        success: true,
        data: { trending }
      })
    } catch (error) {
      console.error('Error getting trending searches:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Track user activity
   */
  async trackActivity(req: AuthenticatedRequest, res: Response) {
    try {
      const { activity, metadata } = req.body
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      await analyticsService.trackUserActivity(userId, activity, {
        ...metadata,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })

      res.json({
        success: true,
        message: 'Activity tracked successfully'
      })
    } catch (error) {
      console.error('Error tracking activity:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Export analytics data
   */
  async exportAnalytics(req: Request, res: Response) {
    try {
      const user = (req as AuthenticatedRequest).user

      // Check if user has admin access
      if (user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required for analytics export'
        })
      }

      const { startDate, endDate } = req.query

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        })
      }

      const start = new Date(startDate as string)
      const end = new Date(endDate as string)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        })
      }

      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'Start date must be before end date'
        })
      }

      const data = await analyticsService.exportAnalyticsData(start, end)

      res.json({
        success: true,
        data
      })
    } catch (error) {
      console.error('Error exporting analytics:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  }
}
