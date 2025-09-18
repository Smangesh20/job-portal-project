import { PrismaClient } from '@prisma/client'
import { Company, CompanyReview, Job } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateCompanyData {
  name: string
  description: string
  website?: string
  industry: string
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  location: {
    city: string
    state: string
    country: string
    remote: boolean
  }
  benefits?: string[]
  culture?: string[]
  logo?: string
  createdBy: string
}

export interface UpdateCompanyData {
  name?: string
  description?: string
  website?: string
  industry?: string
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  location?: {
    city: string
    state: string
    country: string
    remote: boolean
  }
  benefits?: string[]
  culture?: string[]
  logo?: string
}

export interface CompanyFilters {
  search?: string
  industry?: string
  size?: string
  location?: string
}

export interface GetCompaniesOptions {
  page: number
  limit: number
  filters: CompanyFilters
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface PaginationResult<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface CompanyWithStats extends Company {
  _count: {
    jobs: number
    reviews: number
    followers: number
  }
  averageRating: number
}

export const companyService = {
  /**
   * Get companies with filtering and pagination
   */
  async getCompanies(options: GetCompaniesOptions): Promise<PaginationResult<CompanyWithStats>> {
    const { page, limit, filters, sortBy, sortOrder } = options
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { industry: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters.industry) {
      where.industry = { contains: filters.industry, mode: 'insensitive' }
    }

    if (filters.size) {
      where.size = filters.size
    }

    if (filters.location) {
      where.OR = [
        { 'location.city': { contains: filters.location, mode: 'insensitive' } },
        { 'location.state': { contains: filters.location, mode: 'insensitive' } },
        { 'location.country': { contains: filters.location, mode: 'insensitive' } }
      ]
    }

    // Build order by clause
    const orderBy: any = {}
    if (sortBy === 'rating') {
      orderBy.reviews = {
        _count: 'desc'
      }
    } else {
      orderBy[sortBy] = sortOrder
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          _count: {
            select: {
              jobs: true,
              reviews: true,
              followers: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.company.count({ where })
    ])

    // Calculate average ratings
    const companiesWithStats = companies.map(company => ({
      ...company,
      averageRating: company.reviews.length > 0
        ? company.reviews.reduce((sum, review) => sum + review.rating, 0) / company.reviews.length
        : 0
    }))

    const totalPages = Math.ceil(total / limit)

    return {
      companies: companiesWithStats,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  },

  /**
   * Create a new company
   */
  async createCompany(data: CreateCompanyData): Promise<Company> {
    // Check if company with same name already exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        name: { equals: data.name, mode: 'insensitive' }
      }
    })

    if (existingCompany) {
      throw new Error('Company with this name already exists')
    }

    const company = await prisma.company.create({
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        industry: data.industry,
        size: data.size,
        location: data.location,
        benefits: data.benefits || [],
        culture: data.culture || [],
        logo: data.logo,
        createdBy: data.createdBy
      }
    })

    return company
  },

  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<CompanyWithStats | null> {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            jobs: true,
            reviews: true,
            followers: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    if (!company) return null

    return {
      ...company,
      averageRating: company.reviews.length > 0
        ? company.reviews.reduce((sum, review) => sum + review.rating, 0) / company.reviews.length
        : 0
    }
  },

  /**
   * Update company
   */
  async updateCompany(id: string, data: UpdateCompanyData): Promise<Company> {
    const company = await prisma.company.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    return company
  },

  /**
   * Delete company
   */
  async deleteCompany(id: string): Promise<void> {
    // Delete related data first
    await prisma.$transaction([
      prisma.companyReview.deleteMany({ where: { companyId: id } }),
      prisma.companyFollow.deleteMany({ where: { companyId: id } }),
      prisma.job.updateMany({ where: { companyId: id }, data: { companyId: null } }),
      prisma.company.delete({ where: { id } })
    ])
  },

  /**
   * Get jobs for a company
   */
  async getCompanyJobs(
    companyId: string,
    options: { page: number; limit: number; status?: string }
  ): Promise<PaginationResult<Job>> {
    const { page, limit, status } = options
    const offset = (page - 1) * limit

    const where: any = { companyId }
    if (status) {
      where.status = status
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              name: true,
              logo: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.job.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      jobs,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  },

  /**
   * Get company reviews
   */
  async getCompanyReviews(
    companyId: string,
    options: { page: number; limit: number; sortBy: string; sortOrder: 'asc' | 'desc' }
  ): Promise<PaginationResult<CompanyReview & { user: { name: string; avatar?: string } }>> {
    const { page, limit, sortBy, sortOrder } = options
    const offset = (page - 1) * limit

    const orderBy: any = {}
    if (sortBy === 'rating') {
      orderBy.rating = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    const [reviews, total] = await Promise.all([
      prisma.companyReview.findMany({
        where: { companyId },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.companyReview.count({ where: { companyId } })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      reviews,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  },

  /**
   * Get company review summary
   */
  async getCompanyReviewSummary(companyId: string) {
    const reviews = await prisma.companyReview.findMany({
      where: { companyId },
      select: { rating: true }
    })

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }
      }
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating.toString() as keyof typeof dist]++
      return dist
    }, { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 })

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution
    }
  },

  /**
   * Add a company review
   */
  async addCompanyReview(data: {
    companyId: string
    userId: string
    rating: number
    title: string
    review: string
    pros?: string[]
    cons?: string[]
    recommend?: boolean
  }): Promise<CompanyReview> {
    const review = await prisma.companyReview.create({
      data: {
        companyId: data.companyId,
        userId: data.userId,
        rating: data.rating,
        title: data.title,
        review: data.review,
        pros: data.pros || [],
        cons: data.cons || [],
        recommend: data.recommend || false
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    })

    return review
  },

  /**
   * Get user's review for a company
   */
  async getUserReviewForCompany(companyId: string, userId: string): Promise<CompanyReview | null> {
    return prisma.companyReview.findFirst({
      where: {
        companyId,
        userId
      }
    })
  },

  /**
   * Follow or unfollow a company
   */
  async followCompany(companyId: string, userId: string): Promise<boolean> {
    const existingFollow = await prisma.companyFollow.findFirst({
      where: {
        companyId,
        userId
      }
    })

    if (existingFollow) {
      // Unfollow
      await prisma.companyFollow.delete({
        where: {
          id: existingFollow.id
        }
      })
      return false
    } else {
      // Follow
      await prisma.companyFollow.create({
        data: {
          companyId,
          userId
        }
      })
      return true
    }
  },

  /**
   * Unfollow a company
   */
  async unfollowCompany(companyId: string, userId: string): Promise<void> {
    await prisma.companyFollow.deleteMany({
      where: {
        companyId,
        userId
      }
    })
  },

  /**
   * Get user's followed companies
   */
  async getUserFollowedCompanies(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit

    const [follows, total] = await Promise.all([
      prisma.companyFollow.findMany({
        where: { userId },
        include: {
          company: {
            include: {
              _count: {
                select: {
                  jobs: true,
                  reviews: true
                }
              },
              reviews: {
                select: {
                  rating: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.companyFollow.count({ where: { userId } })
    ])

    const companies = follows.map(follow => ({
      ...follow.company,
      averageRating: follow.company.reviews.length > 0
        ? follow.company.reviews.reduce((sum, review) => sum + review.rating, 0) / follow.company.reviews.length
        : 0
    }))

    const totalPages = Math.ceil(total / limit)

    return {
      companies,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  },

  /**
   * Search companies by name
   */
  async searchCompanies(query: string, limit: number = 10) {
    const companies = await prisma.company.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        logo: true,
        industry: true,
        size: true,
        location: true
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    })

    return companies
  }
}
