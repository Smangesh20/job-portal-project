import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

describe('Job Routes', () => {
  let authToken: string
  let employerToken: string
  let employerId: string
  let companyId: string

  beforeEach(async () => {
    // Clean up database before each test
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

    employerId = employer.id

    // Create test company
    const company = await prisma.company.create({
      data: {
        name: 'Test Company',
        description: 'A test company for testing purposes',
        industry: 'Technology',
        size: 'medium',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          remote: true
        },
        createdBy: employerId
      }
    })

    companyId = company.id

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

  describe('POST /api/jobs', () => {
    it('should create a new job successfully', async () => {
      const jobData = {
        title: 'Senior Frontend Developer',
        description: 'Join our team to build amazing web applications',
        requirements: ['5+ years experience', 'React expertise', 'TypeScript knowledge'],
        responsibilities: ['Develop web applications', 'Code reviews', 'Mentor junior developers'],
        benefits: ['Health insurance', '401k', 'Stock options'],
        salaryMin: 120000,
        salaryMax: 150000,
        location: 'San Francisco, CA',
        remote: true,
        jobType: 'full-time',
        experience: 'senior-level',
        companyId: companyId
      }

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(jobData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.job.title).toBe(jobData.title)
      expect(response.body.data.job.description).toBe(jobData.description)
      expect(response.body.data.job.createdBy).toBe(employerId)
    })

    it('should not create job without authentication', async () => {
      const jobData = {
        title: 'Test Job',
        description: 'Test description',
        requirements: ['Test requirement'],
        responsibilities: ['Test responsibility'],
        benefits: ['Test benefit'],
        salaryMin: 50000,
        salaryMax: 70000,
        location: 'Test Location',
        jobType: 'full-time',
        experience: 'mid-level',
        companyId: companyId
      }

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Access token required')
    })

    it('should not create job with invalid data', async () => {
      const invalidJobData = {
        title: '', // Invalid: empty title
        description: 'Test description',
        requirements: [],
        responsibilities: [],
        benefits: [],
        salaryMin: -1000, // Invalid: negative salary
        salaryMax: 50000,
        location: '',
        jobType: 'invalid-type', // Invalid: wrong enum value
        experience: 'invalid-experience', // Invalid: wrong enum value
        companyId: 'invalid-company-id'
      }

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(invalidJobData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/jobs', () => {
    beforeEach(async () => {
      // Create test jobs
      await prisma.job.createMany({
        data: [
          {
            title: 'Frontend Developer',
            description: 'Frontend development role',
            requirements: ['React', 'JavaScript'],
            responsibilities: ['Build UI', 'Write tests'],
            benefits: ['Health insurance'],
            salaryMin: 80000,
            salaryMax: 100000,
            location: 'San Francisco, CA',
            jobType: 'full-time',
            experience: 'mid-level',
            companyId: companyId,
            createdBy: employerId,
            status: 'active'
          },
          {
            title: 'Backend Developer',
            description: 'Backend development role',
            requirements: ['Node.js', 'Python'],
            responsibilities: ['Build APIs', 'Database design'],
            benefits: ['401k'],
            salaryMin: 90000,
            salaryMax: 110000,
            location: 'New York, NY',
            jobType: 'full-time',
            experience: 'senior-level',
            companyId: companyId,
            createdBy: employerId,
            status: 'active'
          }
        ]
      })
    })

    it('should get jobs with default pagination', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.jobs).toHaveLength(2)
      expect(response.body.data.pagination.page).toBe(1)
      expect(response.body.data.pagination.limit).toBe(20)
      expect(response.body.data.pagination.total).toBe(2)
    })

    it('should get jobs with custom pagination', async () => {
      const response = await request(app)
        .get('/api/jobs?page=1&limit=1')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.jobs).toHaveLength(1)
      expect(response.body.data.pagination.page).toBe(1)
      expect(response.body.data.pagination.limit).toBe(1)
      expect(response.body.data.pagination.total).toBe(2)
    })

    it('should filter jobs by search query', async () => {
      const response = await request(app)
        .get('/api/jobs?search=Frontend')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.jobs).toHaveLength(1)
      expect(response.body.data.jobs[0].title).toBe('Frontend Developer')
    })

    it('should filter jobs by location', async () => {
      const response = await request(app)
        .get('/api/jobs?location=San Francisco')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.jobs).toHaveLength(1)
      expect(response.body.data.jobs[0].location).toBe('San Francisco, CA')
    })

    it('should filter jobs by job type', async () => {
      const response = await request(app)
        .get('/api/jobs?jobType=full-time')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.jobs).toHaveLength(2)
    })

    it('should filter jobs by experience level', async () => {
      const response = await request(app)
        .get('/api/jobs?experience=mid-level')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.jobs).toHaveLength(1)
      expect(response.body.data.jobs[0].experience).toBe('mid-level')
    })

    it('should sort jobs by salary', async () => {
      const response = await request(app)
        .get('/api/jobs?sortBy=salary&sortOrder=desc')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.jobs).toHaveLength(2)
      expect(response.body.data.jobs[0].salaryMin).toBe(90000) // Backend Developer
      expect(response.body.data.jobs[1].salaryMin).toBe(80000) // Frontend Developer
    })
  })

  describe('GET /api/jobs/:id', () => {
    let jobId: string

    beforeEach(async () => {
      const job = await prisma.job.create({
        data: {
          title: 'Test Job',
          description: 'Test job description',
          requirements: ['Test requirement'],
          responsibilities: ['Test responsibility'],
          benefits: ['Test benefit'],
          salaryMin: 80000,
          salaryMax: 100000,
          location: 'Test Location',
          jobType: 'full-time',
          experience: 'mid-level',
          companyId: companyId,
          createdBy: employerId,
          status: 'active'
        }
      })
      jobId = job.id
    })

    it('should get job by ID', async () => {
      const response = await request(app)
        .get(`/api/jobs/${jobId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.job.id).toBe(jobId)
      expect(response.body.data.job.title).toBe('Test Job')
      expect(response.body.data.company).toBeDefined()
    })

    it('should return 404 for non-existent job', async () => {
      const response = await request(app)
        .get('/api/jobs/non-existent-id')
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Job not found')
    })

    it('should increment view count when job is viewed', async () => {
      const response = await request(app)
        .get(`/api/jobs/${jobId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.job.views).toBe(1)

      // View again to check if count increments
      await request(app)
        .get(`/api/jobs/${jobId}`)
        .expect(200)

      const updatedJob = await prisma.job.findUnique({
        where: { id: jobId }
      })
      expect(updatedJob?.views).toBe(2)
    })
  })

  describe('PUT /api/jobs/:id', () => {
    let jobId: string

    beforeEach(async () => {
      const job = await prisma.job.create({
        data: {
          title: 'Original Job Title',
          description: 'Original description',
          requirements: ['Original requirement'],
          responsibilities: ['Original responsibility'],
          benefits: ['Original benefit'],
          salaryMin: 80000,
          salaryMax: 100000,
          location: 'Original Location',
          jobType: 'full-time',
          experience: 'mid-level',
          companyId: companyId,
          createdBy: employerId,
          status: 'active'
        }
      })
      jobId = job.id
    })

    it('should update job successfully', async () => {
      const updateData = {
        title: 'Updated Job Title',
        description: 'Updated description',
        salaryMin: 90000,
        salaryMax: 110000
      }

      const response = await request(app)
        .put(`/api/jobs/${jobId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.job.title).toBe(updateData.title)
      expect(response.body.data.job.description).toBe(updateData.description)
      expect(response.body.data.job.salaryMin).toBe(updateData.salaryMin)
    })

    it('should not update job without authentication', async () => {
      const updateData = {
        title: 'Updated Title'
      }

      const response = await request(app)
        .put(`/api/jobs/${jobId}`)
        .send(updateData)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not update job by non-owner', async () => {
      const updateData = {
        title: 'Updated Title'
      }

      const response = await request(app)
        .put(`/api/jobs/${jobId}`)
        .set('Authorization', `Bearer ${authToken}`) // Candidate token
        .send(updateData)
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Forbidden')
    })

    it('should not update non-existent job', async () => {
      const updateData = {
        title: 'Updated Title'
      }

      const response = await request(app)
        .put('/api/jobs/non-existent-id')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(updateData)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Job not found')
    })
  })

  describe('DELETE /api/jobs/:id', () => {
    let jobId: string

    beforeEach(async () => {
      const job = await prisma.job.create({
        data: {
          title: 'Job to Delete',
          description: 'This job will be deleted',
          requirements: ['Requirement'],
          responsibilities: ['Responsibility'],
          benefits: ['Benefit'],
          salaryMin: 80000,
          salaryMax: 100000,
          location: 'Test Location',
          jobType: 'full-time',
          experience: 'mid-level',
          companyId: companyId,
          createdBy: employerId,
          status: 'active'
        }
      })
      jobId = job.id
    })

    it('should delete job successfully', async () => {
      const response = await request(app)
        .delete(`/api/jobs/${jobId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('deleted successfully')

      // Verify job is deleted
      const deletedJob = await prisma.job.findUnique({
        where: { id: jobId }
      })
      expect(deletedJob).toBeNull()
    })

    it('should not delete job without authentication', async () => {
      const response = await request(app)
        .delete(`/api/jobs/${jobId}`)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not delete job by non-owner', async () => {
      const response = await request(app)
        .delete(`/api/jobs/${jobId}`)
        .set('Authorization', `Bearer ${authToken}`) // Candidate token
        .expect(403)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/jobs/:id/applications', () => {
    let jobId: string

    beforeEach(async () => {
      const job = await prisma.job.create({
        data: {
          title: 'Job with Applications',
          description: 'This job has applications',
          requirements: ['Requirement'],
          responsibilities: ['Responsibility'],
          benefits: ['Benefit'],
          salaryMin: 80000,
          salaryMax: 100000,
          location: 'Test Location',
          jobType: 'full-time',
          experience: 'mid-level',
          companyId: companyId,
          createdBy: employerId,
          status: 'active'
        }
      })
      jobId = job.id

      // Create test applications
      const candidate = await prisma.user.findFirst({
        where: { email: 'candidate@example.com' }
      })

      if (candidate) {
        await prisma.application.create({
          data: {
            jobId: jobId,
            userId: candidate.id,
            status: 'applied',
            coverLetter: 'I am interested in this position'
          }
        })
      }
    })

    it('should get job applications for job owner', async () => {
      const response = await request(app)
        .get(`/api/jobs/${jobId}/applications`)
        .set('Authorization', `Bearer ${employerToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.applications).toHaveLength(1)
      expect(response.body.data.pagination.total).toBe(1)
    })

    it('should not get job applications without authentication', async () => {
      const response = await request(app)
        .get(`/api/jobs/${jobId}/applications`)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should not get job applications by non-owner', async () => {
      const response = await request(app)
        .get(`/api/jobs/${jobId}/applications`)
        .set('Authorization', `Bearer ${authToken}`) // Candidate token
        .expect(403)

      expect(response.body.success).toBe(false)
    })
  })
})
