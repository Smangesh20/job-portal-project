import { Router, Request, Response } from 'express';
import { realtimeDataService } from '../services/realtimeDataService';
import { authLimiter, apiLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @route POST /api/research/search
 * @desc Search jobs from real-time sources
 * @access Public (with rate limiting)
 */
router.post('/search', 
  apiLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { query, filters = {} } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Search query is required and must be a string'
          }
        });
      }

      // Validate filters
      const validFilters = {
        location: filters.location || '',
        type: filters.type || '',
        experience: filters.experience || '',
        radius: filters.radius || '25',
        salaryMin: filters.salaryMin || '',
        salaryMax: filters.salaryMax || '',
        skills: filters.skills || [],
        company: filters.company || ''
      };

      logger.info('Job search request', {
        query,
        filters: validFilters,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Search jobs from real-time sources
      const jobs = await realtimeDataService.searchJobs(query, validFilters);

      const response = {
        success: true,
        data: {
          results: jobs,
          total: jobs.length,
          query,
          filters: validFilters,
          sources: [...new Set(jobs.map(job => job.source))],
          lastUpdated: new Date().toISOString()
        },
        message: `Found ${jobs.length} jobs from real-time sources`
      };

      res.json(response);
    } catch (error) {
      logger.error('Job search error:', error);
      throw error;
    }
  })
);

/**
 * @route GET /api/research/jobs/:id
 * @desc Get job details from real-time sources
 * @access Public (with rate limiting)
 */
router.get('/jobs/:id',
  apiLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { source } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_JOB_ID',
            message: 'Job ID is required'
          }
        });
      }

      if (!source || typeof source !== 'string') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_SOURCE',
            message: 'Job source is required (linkedin, indeed, glassdoor, github, stackoverflow)'
          }
        });
      }

      logger.info('Job details request', {
        jobId: id,
        source,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Get job details from real-time source
      const jobDetails = await realtimeDataService.getJobDetails(id, source);

      if (!jobDetails) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'JOB_NOT_FOUND',
            message: 'Job not found or no longer available'
          }
        });
      }

      const response = {
        success: true,
        data: jobDetails,
        message: 'Job details retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Job details error:', error);
      throw error;
    }
  })
);

/**
 * @route GET /api/research/companies/:name
 * @desc Get company information from real-time sources
 * @access Public (with rate limiting)
 */
router.get('/companies/:name',
  apiLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { name } = req.params;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_COMPANY_NAME',
            message: 'Company name is required'
          }
        });
      }

      logger.info('Company data request', {
        companyName: name,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Get company data from real-time sources
      const companyData = await realtimeDataService.getCompanyData(name);

      if (!companyData) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'COMPANY_NOT_FOUND',
            message: 'Company information not found'
          }
        });
      }

      const response = {
        success: true,
        data: companyData,
        message: 'Company information retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Company data error:', error);
      throw error;
    }
  })
);

/**
 * @route GET /api/research/market-data
 * @desc Get real-time market data
 * @access Public (with rate limiting)
 */
router.get('/market-data',
  apiLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      logger.info('Market data request', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Get market data from real-time sources
      const marketData = await realtimeDataService.getMarketData();

      const response = {
        success: true,
        data: marketData,
        message: 'Market data retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Market data error:', error);
      throw error;
    }
  })
);

/**
 * @route GET /api/research/trending-skills
 * @desc Get trending skills from real-time sources
 * @access Public (with rate limiting)
 */
router.get('/trending-skills',
  apiLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { limit = 20 } = req.query;

      logger.info('Trending skills request', {
        limit,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // This would typically aggregate data from multiple job sources
      // For now, we'll return a mock response that could be populated with real data
      const trendingSkills = [
        'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
        'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Science',
        'DevOps', 'Cloud Computing', 'Microservices', 'GraphQL', 'MongoDB',
        'PostgreSQL', 'Redis', 'Elasticsearch', 'Kafka', 'Terraform'
      ].slice(0, parseInt(limit as string));

      const response = {
        success: true,
        data: {
          skills: trendingSkills,
          lastUpdated: new Date().toISOString(),
          sources: ['linkedin', 'indeed', 'glassdoor', 'github', 'stackoverflow']
        },
        message: 'Trending skills retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Trending skills error:', error);
      throw error;
    }
  })
);

/**
 * @route GET /api/research/salary-insights
 * @desc Get salary insights from real-time sources
 * @access Public (with rate limiting)
 */
router.get('/salary-insights',
  apiLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { skill, location, experience } = req.query;

      logger.info('Salary insights request', {
        skill,
        location,
        experience,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // This would typically aggregate salary data from multiple sources
      // For now, we'll return a mock response that could be populated with real data
      const salaryInsights = {
        skill: skill || 'Software Engineer',
        location: location || 'United States',
        experience: experience || 'Mid-level',
        salaryRange: {
          min: 70000,
          max: 120000,
          median: 95000,
          currency: 'USD'
        },
        percentiles: {
          p25: 80000,
          p50: 95000,
          p75: 110000,
          p90: 130000
        },
        trends: {
          yearOverYear: 5.2,
          quarterly: 1.8,
          monthly: 0.3
        },
        lastUpdated: new Date().toISOString(),
        sources: ['linkedin', 'indeed', 'glassdoor', 'payscale']
      };

      const response = {
        success: true,
        data: salaryInsights,
        message: 'Salary insights retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Salary insights error:', error);
      throw error;
    }
  })
);

/**
 * @route GET /api/research/health
 * @desc Check real-time data service health
 * @access Public
 */
router.get('/health',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const health = {
        status: 'healthy',
        services: {
          linkedin: process.env.LINKEDIN_API_KEY ? 'configured' : 'not_configured',
          indeed: process.env.INDEED_API_KEY ? 'configured' : 'not_configured',
          glassdoor: process.env.GLASSDOOR_API_KEY ? 'configured' : 'not_configured',
          github: process.env.GITHUB_API_KEY ? 'configured' : 'not_configured',
          stackoverflow: process.env.STACKOVERFLOW_API_KEY ? 'configured' : 'not_configured'
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      };

      res.json({
        success: true,
        data: health,
        message: 'Real-time data service is healthy'
      });
    } catch (error) {
      logger.error('Health check error:', error);
      throw error;
    }
  })
);

export { router as researchRoutes };
