import { Router } from 'express'
import { authenticateToken } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { analyticsController } from '@/controllers/analyticsController'
import { z } from 'zod'

const router = Router()

// Validation schemas
const analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  period: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
  limit: z.coerce.number().min(1).max(100).optional().default(30)
})

const userAnalyticsSchema = z.object({
  userId: z.string().uuid()
})

const jobAnalyticsSchema = z.object({
  jobId: z.string().uuid()
})

const companyAnalyticsSchema = z.object({
  companyId: z.string().uuid()
})

// Routes
/**
 * @swagger
 * /api/analytics/platform:
 *   get:
 *     summary: Get platform-wide analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *     responses:
 *       200:
 *         description: Platform analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     active:
 *                       type: integer
 *                     new:
 *                       type: integer
 *                     growth:
 *                       type: number
 *                 jobs:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     active:
 *                       type: integer
 *                     new:
 *                       type: integer
 *                     applications:
 *                       type: integer
 *                 companies:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     active:
 *                       type: integer
 *                     new:
 *                       type: integer
 *                 applications:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     accepted:
 *                       type: integer
 *                     rejected:
 *                       type: integer
 *                 matches:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     averageScore:
 *                       type: number
 *                     successful:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/platform', authenticateToken, validateRequest(analyticsQuerySchema), analyticsController.getPlatformAnalytics)

/**
 * @swagger
 * /api/analytics/users:
 *   get:
 *     summary: Get user analytics time series
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *     responses:
 *       200:
 *         description: User analytics time series data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       value:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/users', authenticateToken, validateRequest(analyticsQuerySchema), analyticsController.getUserAnalytics)

/**
 * @swagger
 * /api/analytics/jobs:
 *   get:
 *     summary: Get job analytics time series
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *     responses:
 *       200:
 *         description: Job analytics time series data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       value:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/jobs', authenticateToken, validateRequest(analyticsQuerySchema), analyticsController.getJobAnalytics)

/**
 * @swagger
 * /api/analytics/applications:
 *   get:
 *     summary: Get application analytics time series
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *     responses:
 *       200:
 *         description: Application analytics time series data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       value:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/applications', authenticateToken, validateRequest(analyticsQuerySchema), analyticsController.getApplicationAnalytics)

/**
 * @swagger
 * /api/analytics/matches:
 *   get:
 *     summary: Get match analytics time series
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *     responses:
 *       200:
 *         description: Match analytics time series data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       value:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/matches', authenticateToken, validateRequest(analyticsQuerySchema), analyticsController.getMatchAnalytics)

/**
 * @swagger
 * /api/analytics/users/{userId}:
 *   get:
 *     summary: Get user-specific analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileViews:
 *                   type: integer
 *                 jobViews:
 *                   type: integer
 *                 applicationsSent:
 *                   type: integer
 *                 matchesReceived:
 *                   type: integer
 *                 messagesSent:
 *                   type: integer
 *                 companiesFollowed:
 *                   type: integer
 *                 jobsSaved:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only view own analytics
 *       404:
 *         description: User not found
 */
router.get('/users/:userId', authenticateToken, validateRequest(userAnalyticsSchema), analyticsController.getUserAnalyticsById)

/**
 * @swagger
 * /api/analytics/jobs/{jobId}:
 *   get:
 *     summary: Get job-specific analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 views:
 *                   type: integer
 *                 applications:
 *                   type: integer
 *                 matches:
 *                   type: integer
 *                 conversionRate:
 *                   type: number
 *                 averageMatchScore:
 *                   type: number
 *                 timeToFill:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only view own job analytics
 *       404:
 *         description: Job not found
 */
router.get('/jobs/:jobId', authenticateToken, validateRequest(jobAnalyticsSchema), analyticsController.getJobAnalyticsById)

/**
 * @swagger
 * /api/analytics/companies/{companyId}:
 *   get:
 *     summary: Get company-specific analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Company analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileViews:
 *                   type: integer
 *                 jobsPosted:
 *                   type: integer
 *                 applicationsReceived:
 *                   type: integer
 *                 hires:
 *                   type: integer
 *                 averageRating:
 *                   type: number
 *                 followers:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only view own company analytics
 *       404:
 *         description: Company not found
 */
router.get('/companies/:companyId', authenticateToken, validateRequest(companyAnalyticsSchema), analyticsController.getCompanyAnalyticsById)

/**
 * @swagger
 * /api/analytics/realtime:
 *   get:
 *     summary: Get real-time platform metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Real-time metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeUsers:
 *                   type: integer
 *                 newJobs:
 *                   type: integer
 *                 newApplications:
 *                   type: integer
 *                 newMatches:
 *                   type: integer
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/realtime', authenticateToken, analyticsController.getRealTimeMetrics)

/**
 * @swagger
 * /api/analytics/trending:
 *   get:
 *     summary: Get trending searches
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Trending search queries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trending:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       query:
 *                         type: string
 *                       count:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/trending', authenticateToken, analyticsController.getTrendingSearches)

/**
 * @swagger
 * /api/analytics/track:
 *   post:
 *     summary: Track user activity
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activity
 *             properties:
 *               activity:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Activity tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.post('/track', authenticateToken, analyticsController.trackActivity)

/**
 * @swagger
 * /api/analytics/export:
 *   get:
 *     summary: Export analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Analytics data export
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       value:
 *                         type: integer
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       value:
 *                         type: integer
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       value:
 *                         type: integer
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       value:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/export', authenticateToken, analyticsController.exportAnalytics)

export { router as analyticsRoutes }
