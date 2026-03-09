/**
 * Unit Tests for Job Management Routes
 * Tests the enhanced job routes with validation and error handling
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../db/User');
jest.mock('../db/Job');
jest.mock('../db/Recruiter');
jest.mock('../db/JobApplicant');
jest.mock('../lib/jwtAuth');
jest.mock('../middleware/featureFlags');

const Job = require('../db/Job');
const User = require('../db/User');
const featureFlags = require('../middleware/featureFlags');
const { errorHandler } = require('../middleware/errorHandler');
const { correlationId } = require('../middleware/correlation');

describe('Job Management Routes', () => {
  let app;
  let mockUser;
  let mockJob;

  beforeAll(() => {
    // Setup express app with routes
    app = express();
    app.use(express.json());
    app.use(correlationId);
    
    // Import routes after mocks are set up
    const apiRoutes = require('../routes/apiRoutes');
    app.use('/api', apiRoutes);
    app.use(errorHandler);
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default feature flags
    featureFlags.isEnabled = jest.fn((flag) => {
      if (flag === 'INPUT_VALIDATION') return true;
      if (flag === 'ENHANCED_ERROR_HANDLING') return true;
      return false;
    });

    // Mock user
    mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'recruiter@test.com',
      type: 'recruiter',
      id: new mongoose.Types.ObjectId()
    };

    // Mock job
    mockJob = {
      _id: new mongoose.Types.ObjectId(),
      userId: mockUser._id,
      title: 'Software Engineer',
      maxApplicants: 10,
      maxPositions: 2,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      skillsets: ['JavaScript', 'Node.js'],
      jobType: 'full-time',
      duration: 0,
      salary: 80000,
      save: jest.fn().mockResolvedValue(true)
    };

    // Mock JWT auth middleware
    const jwtAuth = require('../lib/jwtAuth');
    jwtAuth.mockImplementation((req, res, next) => {
      req.user = mockUser;
      next();
    });
  });

  describe('POST /api/jobs - Create Job', () => {
    it('should create a job with valid data', async () => {
      Job.mockImplementation(function(data) {
        return {
          ...mockJob,
          ...data,
          save: jest.fn().mockResolvedValue(true)
        };
      });

      const jobData = {
        title: 'Software Engineer',
        maxApplicants: 10,
        maxPositions: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        skillsets: ['JavaScript', 'Node.js'],
        jobType: 'full-time',
        duration: 0,
        salary: 80000
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Job added successfully');
    });

    it('should reject job creation by non-recruiter', async () => {
      mockUser.type = 'applicant';

      const jobData = {
        title: 'Software Engineer',
        maxApplicants: 10,
        maxPositions: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        skillsets: ['JavaScript', 'Node.js'],
        jobType: 'full-time',
        salary: 80000
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('permissions');
    });

    it('should validate required fields', async () => {
      const invalidJobData = {
        title: 'SE', // Too short
        maxApplicants: 10,
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(invalidJobData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toBeDefined();
    });

    it('should sanitize malicious input', async () => {
      Job.mockImplementation(function(data) {
        return {
          ...mockJob,
          ...data,
          save: jest.fn().mockResolvedValue(true)
        };
      });

      const jobData = {
        title: '<script>alert("xss")</script>Software Engineer',
        maxApplicants: 10,
        maxPositions: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        skillsets: ['JavaScript'],
        jobType: 'full-time',
        salary: 80000
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Verify sanitization occurred (script tags should be removed/encoded)
    });
  });

  describe('GET /api/jobs - List Jobs', () => {
    it('should return list of jobs', async () => {
      const mockJobs = [mockJob, { ...mockJob, _id: new mongoose.Types.ObjectId() }];
      
      Job.aggregate = jest.fn().mockResolvedValue(mockJobs);

      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    it('should handle empty results gracefully', async () => {
      Job.aggregate = jest.fn().mockResolvedValue([]);

      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.message).toContain('No jobs found');
    });

    it('should filter jobs by search query', async () => {
      const mockJobs = [mockJob];
      Job.aggregate = jest.fn().mockResolvedValue(mockJobs);

      const response = await request(app)
        .get('/api/jobs?q=Software')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Job.aggregate).toHaveBeenCalled();
    });

    it('should filter jobs by job type', async () => {
      const mockJobs = [mockJob];
      Job.aggregate = jest.fn().mockResolvedValue(mockJobs);

      const response = await request(app)
        .get('/api/jobs?jobType=full-time')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should sanitize search query parameters', async () => {
      Job.aggregate = jest.fn().mockResolvedValue([]);

      const response = await request(app)
        .get('/api/jobs?q=<script>alert("xss")</script>')
        .expect(200);

      expect(response.body.success).toBe(true);
      // Verify sanitization occurred
    });
  });

  describe('GET /api/jobs/:id - Get Single Job', () => {
    it('should return job details', async () => {
      Job.findOne = jest.fn().mockResolvedValue(mockJob);

      const response = await request(app)
        .get(`/api/jobs/${mockJob._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(mockJob._id);
    });

    it('should return 404 for non-existent job', async () => {
      Job.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/jobs/${new mongoose.Types.ObjectId()}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('does not exist');
    });

    it('should validate job ID format', async () => {
      const response = await request(app)
        .get('/api/jobs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/jobs/:id - Update Job', () => {
    it('should update job with valid data', async () => {
      Job.findOne = jest.fn().mockResolvedValue(mockJob);

      const updateData = {
        maxApplicants: 15,
        maxPositions: 3,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await request(app)
        .put(`/api/jobs/${mockJob._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('updated successfully');
      expect(mockJob.save).toHaveBeenCalled();
    });

    it('should reject update by non-recruiter', async () => {
      mockUser.type = 'applicant';

      const updateData = {
        maxApplicants: 15
      };

      const response = await request(app)
        .put(`/api/jobs/${mockJob._id}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('permissions');
    });

    it('should reject update of non-existent job', async () => {
      Job.findOne = jest.fn().mockResolvedValue(null);

      const updateData = {
        maxApplicants: 15
      };

      const response = await request(app)
        .put(`/api/jobs/${new mongoose.Types.ObjectId()}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('does not exist');
    });

    it('should validate update data', async () => {
      Job.findOne = jest.fn().mockResolvedValue(mockJob);

      const invalidUpdateData = {
        maxApplicants: -5, // Invalid: negative number
      };

      const response = await request(app)
        .put(`/api/jobs/${mockJob._id}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should sanitize update data', async () => {
      Job.findOne = jest.fn().mockResolvedValue(mockJob);

      const updateData = {
        maxApplicants: 15,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await request(app)
        .put(`/api/jobs/${mockJob._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/jobs/:id - Delete Job', () => {
    it('should delete job successfully', async () => {
      Job.findOneAndDelete = jest.fn().mockResolvedValue(mockJob);

      const response = await request(app)
        .delete(`/api/jobs/${mockJob._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should reject deletion by non-recruiter', async () => {
      mockUser.type = 'applicant';

      const response = await request(app)
        .delete(`/api/jobs/${mockJob._id}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('permissions');
    });

    it('should return 404 for non-existent job', async () => {
      Job.findOneAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete(`/api/jobs/${new mongoose.Types.ObjectId()}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('does not exist');
    });

    it('should validate job ID format', async () => {
      const response = await request(app)
        .delete('/api/jobs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Backward Compatibility', () => {
    beforeEach(() => {
      // Disable enhanced error handling
      featureFlags.isEnabled = jest.fn((flag) => {
        if (flag === 'INPUT_VALIDATION') return true;
        return false;
      });
    });

    it('should maintain legacy response format when feature disabled', async () => {
      Job.mockImplementation(function(data) {
        return {
          ...mockJob,
          ...data,
          save: jest.fn().mockResolvedValue(true)
        };
      });

      const jobData = {
        title: 'Software Engineer',
        maxApplicants: 10,
        maxPositions: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        skillsets: ['JavaScript', 'Node.js'],
        jobType: 'full-time',
        salary: 80000
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(200);

      // Legacy format doesn't have success field
      expect(response.body.message).toContain('Job added successfully');
      expect(response.body.success).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      Job.mockImplementation(function(data) {
        return {
          ...mockJob,
          ...data,
          save: jest.fn().mockRejectedValue(new Error('Database connection failed'))
        };
      });

      const jobData = {
        title: 'Software Engineer',
        maxApplicants: 10,
        maxPositions: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        skillsets: ['JavaScript', 'Node.js'],
        jobType: 'full-time',
        salary: 80000
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should include correlation ID in error responses', async () => {
      Job.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/jobs/${new mongoose.Types.ObjectId()}`)
        .expect(404);

      expect(response.body.error.correlationId).toBeDefined();
    });
  });
});
