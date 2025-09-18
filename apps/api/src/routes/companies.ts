import { Router } from 'express'
import { z } from 'zod'
import { authenticateToken } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { companyController } from '@/controllers/companyController'

const router = Router()

// Validation schemas
const createCompanySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  website: z.string().url().optional(),
  industry: z.string().min(1).max(50),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  location: z.object({
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    remote: z.boolean().default(false)
  }),
  benefits: z.array(z.string()).optional(),
  culture: z.array(z.string()).optional(),
  logo: z.string().url().optional()
})

const updateCompanySchema = createCompanySchema.partial()

const getCompaniesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
  sortBy: z.enum(['name', 'size', 'rating', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

const companyReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(100),
  review: z.string().min(10).max(1000),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  recommend: z.boolean().default(false)
})

// Routes
/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get companies with filtering and pagination
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, size, rating, createdAt]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', authenticateToken, validateRequest(getCompaniesSchema), companyController.getCompanies)

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - industry
 *               - size
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *               website:
 *                 type: string
 *                 format: uri
 *               industry:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *               size:
 *                 type: string
 *                 enum: [startup, small, medium, large, enterprise]
 *               location:
 *                 type: object
 *                 required:
 *                   - city
 *                   - state
 *                   - country
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   remote:
 *                     type: boolean
 *                     default: false
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               culture:
 *                 type: array
 *                 items:
 *                   type: string
 *               logo:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, validateRequest(createCompanySchema), companyController.createCompany)

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CompanyReview'
 *       404:
 *         description: Company not found
 */
router.get('/:id', authenticateToken, companyController.getCompanyById)

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *               website:
 *                 type: string
 *                 format: uri
 *               industry:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *               size:
 *                 type: string
 *                 enum: [startup, small, medium, large, enterprise]
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   remote:
 *                     type: boolean
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               culture:
 *                 type: array
 *                 items:
 *                   type: string
 *               logo:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Company not found
 */
router.put('/:id', authenticateToken, validateRequest(updateCompanySchema), companyController.updateCompany)

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Company not found
 */
router.delete('/:id', authenticateToken, companyController.deleteCompany)

/**
 * @swagger
 * /api/companies/{id}/jobs:
 *   get:
 *     summary: Get jobs for a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, closed, draft]
 *           default: active
 *     responses:
 *       200:
 *         description: Company jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       404:
 *         description: Company not found
 */
router.get('/:id/jobs', authenticateToken, companyController.getCompanyJobs)

/**
 * @swagger
 * /api/companies/{id}/reviews:
 *   get:
 *     summary: Get company reviews
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rating, date]
 *           default: date
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Company reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CompanyReview'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     averageRating:
 *                       type: number
 *                     totalReviews:
 *                       type: integer
 *                     ratingDistribution:
 *                       type: object
 *                       properties:
 *                         "5":
 *                           type: integer
 *                         "4":
 *                           type: integer
 *                         "3":
 *                           type: integer
 *                         "2":
 *                           type: integer
 *                         "1":
 *                           type: integer
 *       404:
 *         description: Company not found
 */
router.get('/:id/reviews', authenticateToken, companyController.getCompanyReviews)

/**
 * @swagger
 * /api/companies/{id}/reviews:
 *   post:
 *     summary: Add a company review
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - title
 *               - review
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               review:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *               pros:
 *                 type: array
 *                 items:
 *                   type: string
 *               cons:
 *                 type: array
 *                 items:
 *                   type: string
 *               recommend:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review:
 *                   $ref: '#/components/schemas/CompanyReview'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router.post('/:id/reviews', authenticateToken, validateRequest(companyReviewSchema), companyController.addCompanyReview)

/**
 * @swagger
 * /api/companies/{id}/follow:
 *   post:
 *     summary: Follow a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 isFollowing:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router.post('/:id/follow', authenticateToken, companyController.followCompany)

/**
 * @swagger
 * /api/companies/{id}/follow:
 *   delete:
 *     summary: Unfollow a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company unfollowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 isFollowing:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router.delete('/:id/follow', authenticateToken, companyController.unfollowCompany)

export { router as companyRoutes }
