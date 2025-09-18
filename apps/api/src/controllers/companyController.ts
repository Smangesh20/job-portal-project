import { Request, Response } from 'express'
import { companyService } from '@/services/companyService'
import { AuthenticatedRequest } from '@/types/auth'

export const companyController = {
  /**
   * Get companies with filtering and pagination
   */
  async getCompanies(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        industry,
        size,
        location,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      const filters = {
        search: search as string,
        industry: industry as string,
        size: size as string,
        location: location as string
      }

      const result = await companyService.getCompanies({
        page: Number(page),
        limit: Number(limit),
        filters,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      })

      res.json({
        success: true,
        data: {
          companies: result.companies,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
            hasNext: result.hasNext,
            hasPrev: result.hasPrev
          }
        }
      })
    } catch (error) {
      console.error('Error getting companies:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Create a new company
   */
  async createCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const companyData = req.body
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const company = await companyService.createCompany({
        ...companyData,
        createdBy: userId
      })

      res.status(201).json({
        success: true,
        data: { company },
        message: 'Company created successfully'
      })
    } catch (error) {
      console.error('Error creating company:', error)
      
      if (error instanceof Error && error.message.includes('duplicate')) {
        return res.status(409).json({
          success: false,
          message: 'Company with this name already exists'
        })
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get company by ID
   */
  async getCompanyById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const company = await companyService.getCompanyById(id)

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        })
      }

      // Get related data
      const [jobs, reviews, summary] = await Promise.all([
        companyService.getCompanyJobs(id, { page: 1, limit: 10, status: 'active' }),
        companyService.getCompanyReviews(id, { page: 1, limit: 5, sortBy: 'date', sortOrder: 'desc' }),
        companyService.getCompanyReviewSummary(id)
      ])

      res.json({
        success: true,
        data: {
          company,
          jobs: jobs.jobs,
          reviews: reviews.reviews,
          reviewSummary: summary
        }
      })
    } catch (error) {
      console.error('Error getting company:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Update company
   */
  async updateCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      const updateData = req.body
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user has permission to update this company
      const existingCompany = await companyService.getCompanyById(id)
      if (!existingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        })
      }

      if (existingCompany.createdBy !== userId && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only update companies you created'
        })
      }

      const company = await companyService.updateCompany(id, updateData)

      res.json({
        success: true,
        data: { company },
        message: 'Company updated successfully'
      })
    } catch (error) {
      console.error('Error updating company:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Delete company
   */
  async deleteCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user has permission to delete this company
      const existingCompany = await companyService.getCompanyById(id)
      if (!existingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        })
      }

      if (existingCompany.createdBy !== userId && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only delete companies you created'
        })
      }

      await companyService.deleteCompany(id)

      res.json({
        success: true,
        message: 'Company deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting company:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get jobs for a company
   */
  async getCompanyJobs(req: Request, res: Response) {
    try {
      const { id } = req.params
      const {
        page = 1,
        limit = 20,
        status = 'active'
      } = req.query

      // Check if company exists
      const company = await companyService.getCompanyById(id)
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        })
      }

      const result = await companyService.getCompanyJobs(id, {
        page: Number(page),
        limit: Number(limit),
        status: status as string
      })

      res.json({
        success: true,
        data: {
          jobs: result.jobs,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
            hasNext: result.hasNext,
            hasPrev: result.hasPrev
          }
        }
      })
    } catch (error) {
      console.error('Error getting company jobs:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get company reviews
   */
  async getCompanyReviews(req: Request, res: Response) {
    try {
      const { id } = req.params
      const {
        page = 1,
        limit = 20,
        sortBy = 'date',
        sortOrder = 'desc'
      } = req.query

      // Check if company exists
      const company = await companyService.getCompanyById(id)
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        })
      }

      const [result, summary] = await Promise.all([
        companyService.getCompanyReviews(id, {
          page: Number(page),
          limit: Number(limit),
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc'
        }),
        companyService.getCompanyReviewSummary(id)
      ])

      res.json({
        success: true,
        data: {
          reviews: result.reviews,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
            hasNext: result.hasNext,
            hasPrev: result.hasPrev
          },
          summary
        }
      })
    } catch (error) {
      console.error('Error getting company reviews:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Add a company review
   */
  async addCompanyReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      const reviewData = req.body
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if company exists
      const company = await companyService.getCompanyById(id)
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        })
      }

      // Check if user has already reviewed this company
      const existingReview = await companyService.getUserReviewForCompany(id, userId)
      if (existingReview) {
        return res.status(409).json({
          success: false,
          message: 'You have already reviewed this company'
        })
      }

      const review = await companyService.addCompanyReview({
        ...reviewData,
        companyId: id,
        userId
      })

      res.status(201).json({
        success: true,
        data: { review },
        message: 'Review added successfully'
      })
    } catch (error) {
      console.error('Error adding company review:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Follow a company
   */
  async followCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if company exists
      const company = await companyService.getCompanyById(id)
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        })
      }

      const isFollowing = await companyService.followCompany(id, userId)

      res.json({
        success: true,
        data: { isFollowing },
        message: isFollowing ? 'Company followed successfully' : 'Company unfollowed successfully'
      })
    } catch (error) {
      console.error('Error following company:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Unfollow a company
   */
  async unfollowCompany(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      await companyService.unfollowCompany(id, userId)

      res.json({
        success: true,
        data: { isFollowing: false },
        message: 'Company unfollowed successfully'
      })
    } catch (error) {
      console.error('Error unfollowing company:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  }
}
