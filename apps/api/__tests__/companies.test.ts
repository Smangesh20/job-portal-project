import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

describe('Company Routes', () => {
  let authToken: string
  let employerToken: string
  let employerId: string
  let candidateId: string

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.companyReview.deleteMany({})
    await prisma.companyFollow.deleteMany({})
    await prisma.job.deleteMany({})
    await prisma.company.deleteMany({})
    await prisma.user.deleteMany({})

    // Create test users
    const candidate = await prisma.user.create({
      data: {
        email: 'candidate@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test Candidate',
        role: 'candidate',
        isVerified: true
      }
    })

    const employer = await prisma.user.create({
      data: {
        email: 'employer@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test Employer',
        role: 'employer',
        isVerified: true
      }
    })

    candidateId = candidate.id
    employerId = employer.id

    // Generate auth tokens
    authToken = jwt.sign(
      { userId: candidate.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    )

    employerToken = jwt.sign(
      { userId: employer.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    )
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/companies', () => {
    it('should create a new company successfully', async () => {
      const companyData = {
        name: 'Test Company',
        description: 'A test company for testing purposes',
        website: 'https://testcompany.com',
        industry: 'Technology',
        size: 'medium',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          remote: true
        },
        benefits: ['Health Insurance', '401k', 'Stock Options'],
        culture: ['Innovation', 'Collaboration', 'Work-Life Balance']
      }

      const response = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(companyData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.company.name).toBe(companyData.name)
      expect(response.body.data.company.description).toBe(companyData.description)
      expect(response.body.data.company.createdBy).toBe(employerId)
    })

    it('should not create company without authentication', async () => {
      const companyData = {
        name: 'Test Company',
        description: 'A test company',
        industry: 'Technology',
        size: 'medium',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          remote: false
        }
      }

      const response = await request(app)
        .post('/api/companies')
        .send(companyData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Unauthorized')
    })

    it('should not create company with invalid data', async () => {
      const invalidCompanyData = {
        name: '', // Invalid: empty name
        description: 'Too short', // Invalid: too short description
        industry: '', // Invalid: empty industry
        size: 'invalid-size', // Invalid: wrong enum value
        location: {
          city: '',
          state: '',
          country: '',
          remote: false
        }
      }

      const response = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(invalidCompanyData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should not create duplicate company name', async () => {
      const companyData = {
        name: 'Unique Company',
        description: 'A unique company for testing',
        industry: 'Technology',
        size: 'medium',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          remote: false
        }
      }

      // Create first company
      await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(companyData)
        .expect(201)

      // Try to create second company with same name
      const response = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(companyData)
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('already exists')
    })
  })

  describe('GET /api/companies', () => {
    beforeEach(async () => {
      // Create test companies
      await prisma.company.createMany({
        data: [
          {
            name: 'TechCorp',
            description: 'Leading technology company',
            industry: 'Technology',
            size: 'large',
            location: {
              city: 'San Francisco',
              state: 'CA',
              country: 'USA',
              remote: true
            },
            createdBy: employerId
          },
          {
            name: 'Finance Inc',
            description: 'Financial services company',
            industry: 'Finance',
            size: 'medium',
            location: {
              city: 'New York',
              state: 'NY',
              country: 'USA',
              remote: false
            },
            createdBy: employerId
          }
        ]
      })
    })

    it('should get companies with default pagination', async () => {
      const response = await request(app)
        .get('/api/companies')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.companies).toHaveLength(2)
      expect(response.body.data.pagination.page).toBe(1)
      expect(response.body.data.pagination.limit).toBe(20)
      expect(response.body.data.pagination.total).toBe(2)
    })

    it('should get companies with custom pagination', async () => {
      const response = await request(app)
        .get('/api/companies?page=1&limit=1')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.companies).toHaveLength(1)
      expect(response.body.data.pagination.page).toBe(1)
      expect(response.body.data.pagination.limit).toBe(1)
      expect(response.body.data.pagination.total).toBe(2)
    })

    it('should filter companies by search query', async () => {
      const response = await request(app)
        .get('/api/companies?search=TechCorp')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.companies).toHaveLength(1)
      expect(response.body.data.companies[0].name).toBe('TechCorp')
    })

    it('should filter companies by industry', async () => {
      const response = await request(app)
        .get('/api/companies?industry=Technology')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.companies).toHaveLength(1)
      expect(response.body.data.companies[0].industry).toBe('Technology')
    })

    it('should filter companies by size', async () => {
      const response = await request(app)
        .get('/api/companies?size=large')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.companies).toHaveLength(1)
      expect(response.body.data.companies[0].size).toBe('large')
    })

    it('should sort companies by name', async () => {
      const response = await request(app)
        .get('/api/companies?sortBy=name&sortOrder=asc')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.companies).toHaveLength(2)
      expect(response.body.data.companies[0].name).toBe('Finance Inc')
      expect(response.body.data.companies[1].name).toBe('TechCorp')
    })
  })

  describe('GET /api/companies/:id', () => {
    let companyId: string

    beforeEach(async () => {
      const company = await prisma.company.create({
        data: {
          name: 'Test Company',
          description: 'A test company for detailed view',
          industry: 'Technology',
          size: 'medium',
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            remote: true
          },
          benefits: ['Health Insurance', '401k'],
          culture: ['Innovation', 'Collaboration'],
          createdBy: employerId
        }
      })
      companyId = company.id

      // Create related jobs
      await prisma.job.createMany({
        data: [
          {
            title: 'Frontend Developer',
            description: 'Frontend development role',
            requirements: ['React', 'JavaScript'],
            responsibilities: ['Build UI'],
            benefits: ['Health insurance'],
            salaryMin: 80000,
            salaryMax: 100000,
            location: 'San Francisco, CA',
            jobType: 'full-time',
            experience: 'mid-level',
            companyId: companyId,
            createdBy: employerId,
            status: 'active'
          }
        ]
      })

      // Create company review
      await prisma.companyReview.create({
        data: {
          companyId: companyId,
          userId: candidateId,
          rating: 4,
          title: 'Great company to work for',
          review: 'Excellent work environment and great team',
          pros: ['Good benefits', 'Flexible hours'],
          cons: ['Long hours sometimes'],
          recommend: true
        }
      })
    })

    it('should get company by ID with related data', async () => {
      const response = await request(app)
        .get(`/api/companies/${companyId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.company.id).toBe(companyId)
      expect(response.body.data.company.name).toBe('Test Company')
      expect(response.body.data.jobs).toHaveLength(1)
      expect(response.body.data.reviews).toHaveLength(1)
      expect(response.body.data.reviewSummary).toBeDefined()
    })

    it('should return 404 for non-existent company', async () => {
      const response = await request(app)
        .get('/api/companies/non-existent-id')
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Company not found')
    })
  })

  describe('PUT /api/companies/:id', () => {
    let companyId: string

    beforeEach(async () => {
      const company = await prisma.company.create({
        data: {
          name: 'Original Company',
          description: 'Original description',
          industry: 'Technology',
          size: 'medium',
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            remote: false
          },
          createdBy: employerId
        }
      })
      companyId = company.id
    })

    it('should update company successfully', async () => {
      const updateData = {
        name: 'Updated Company',
        description: 'Updated description',
        size: 'large'
      }

      const response = await request(app)
        .put(`/api/companies/${companyId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.company.name).toBe(updateData.name)
      expect(response.body.data.company.description).toBe(updateData.description)
      expect(response.body.data.company.size).toBe(updateData.size)
    })

    it('should not update company without authentication', async () => {
      const updateData = {
        name: 'Updated Company'
      }

      const response = await request(app)
        .put(`/api/companies/${companyId}`)
        .send(updateData)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not update company by non-owner', async () => {
      const updateData = {
        name: 'Updated Company'
      }

      const response = await request(app)
        .put(`/api/companies/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`) // Candidate token
        .send(updateData)
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Forbidden')
    })

    it('should not update non-existent company', async () => {
      const updateData = {
        name: 'Updated Company'
      }

      const response = await request(app)
        .put('/api/companies/non-existent-id')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(updateData)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Company not found')
    })
  })

  describe('DELETE /api/companies/:id', () => {
    let companyId: string

    beforeEach(async () => {
      const company = await prisma.company.create({
        data: {
          name: 'Company to Delete',
          description: 'This company will be deleted',
          industry: 'Technology',
          size: 'medium',
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            remote: false
          },
          createdBy: employerId
        }
      })
      companyId = company.id
    })

    it('should delete company successfully', async () => {
      const response = await request(app)
        .delete(`/api/companies/${companyId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('deleted successfully')

      // Verify company is deleted
      const deletedCompany = await prisma.company.findUnique({
        where: { id: companyId }
      })
      expect(deletedCompany).toBeNull()
    })

    it('should not delete company without authentication', async () => {
      const response = await request(app)
        .delete(`/api/companies/${companyId}`)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not delete company by non-owner', async () => {
      const response = await request(app)
        .delete(`/api/companies/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`) // Candidate token
        .expect(403)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/companies/:id/reviews', () => {
    let companyId: string

    beforeEach(async () => {
      const company = await prisma.company.create({
        data: {
          name: 'Company with Reviews',
          description: 'This company has reviews',
          industry: 'Technology',
          size: 'medium',
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            remote: false
          },
          createdBy: employerId
        }
      })
      companyId = company.id

      // Create test reviews
      await prisma.companyReview.createMany({
        data: [
          {
            companyId: companyId,
            userId: candidateId,
            rating: 5,
            title: 'Excellent company',
            review: 'Great place to work',
            pros: ['Good benefits'],
            cons: [],
            recommend: true
          },
          {
            companyId: companyId,
            userId: employerId,
            rating: 4,
            title: 'Good company',
            review: 'Nice work environment',
            pros: ['Flexible hours'],
            cons: ['Can be busy'],
            recommend: true
          }
        ]
      })
    })

    it('should get company reviews with pagination', async () => {
      const response = await request(app)
        .get(`/api/companies/${companyId}/reviews`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.reviews).toHaveLength(2)
      expect(response.body.data.pagination.total).toBe(2)
      expect(response.body.data.summary).toBeDefined()
      expect(response.body.data.summary.averageRating).toBe(4.5)
      expect(response.body.data.summary.totalReviews).toBe(2)
    })

    it('should sort reviews by rating', async () => {
      const response = await request(app)
        .get(`/api/companies/${companyId}/reviews?sortBy=rating&sortOrder=desc`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.reviews).toHaveLength(2)
      expect(response.body.data.reviews[0].rating).toBe(5)
      expect(response.body.data.reviews[1].rating).toBe(4)
    })
  })

  describe('POST /api/companies/:id/reviews', () => {
    let companyId: string

    beforeEach(async () => {
      const company = await prisma.company.create({
        data: {
          name: 'Company for Reviews',
          description: 'This company accepts reviews',
          industry: 'Technology',
          size: 'medium',
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            remote: false
          },
          createdBy: employerId
        }
      })
      companyId = company.id
    })

    it('should add company review successfully', async () => {
      const reviewData = {
        rating: 5,
        title: 'Amazing company',
        review: 'Best place I have ever worked',
        pros: ['Great team', 'Excellent benefits'],
        cons: ['None'],
        recommend: true
      }

      const response = await request(app)
        .post(`/api/companies/${companyId}/reviews`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.review.rating).toBe(reviewData.rating)
      expect(response.body.data.review.title).toBe(reviewData.title)
      expect(response.body.data.review.userId).toBe(candidateId)
    })

    it('should not add review without authentication', async () => {
      const reviewData = {
        rating: 5,
        title: 'Great company',
        review: 'Nice place to work'
      }

      const response = await request(app)
        .post(`/api/companies/${companyId}/reviews`)
        .send(reviewData)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not add duplicate review', async () => {
      const reviewData = {
        rating: 5,
        title: 'First review',
        review: 'This is my first review'
      }

      // Add first review
      await request(app)
        .post(`/api/companies/${companyId}/reviews`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData)
        .expect(201)

      // Try to add second review from same user
      const response = await request(app)
        .post(`/api/companies/${companyId}/reviews`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          rating: 4,
          title: 'Second review',
          review: 'This is my second review'
        })
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('already reviewed')
    })
  })

  describe('POST /api/companies/:id/follow', () => {
    let companyId: string

    beforeEach(async () => {
      const company = await prisma.company.create({
        data: {
          name: 'Company to Follow',
          description: 'This company can be followed',
          industry: 'Technology',
          size: 'medium',
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            remote: false
          },
          createdBy: employerId
        }
      })
      companyId = company.id
    })

    it('should follow company successfully', async () => {
      const response = await request(app)
        .post(`/api/companies/${companyId}/follow`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isFollowing).toBe(true)
      expect(response.body.message).toContain('followed successfully')

      // Verify follow was created
      const follow = await prisma.companyFollow.findFirst({
        where: {
          companyId: companyId,
          userId: candidateId
        }
      })
      expect(follow).toBeDefined()
    })

    it('should unfollow company when already following', async () => {
      // First follow the company
      await request(app)
        .post(`/api/companies/${companyId}/follow`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      // Then unfollow by calling follow again
      const response = await request(app)
        .post(`/api/companies/${companyId}/follow`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isFollowing).toBe(false)
      expect(response.body.message).toContain('unfollowed successfully')

      // Verify follow was removed
      const follow = await prisma.companyFollow.findFirst({
        where: {
          companyId: companyId,
          userId: candidateId
        }
      })
      expect(follow).toBeNull()
    })

    it('should not follow company without authentication', async () => {
      const response = await request(app)
        .post(`/api/companies/${companyId}/follow`)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not follow non-existent company', async () => {
      const response = await request(app)
        .post('/api/companies/non-existent-id/follow')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Company not found')
    })
  })
})
