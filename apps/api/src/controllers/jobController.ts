import { Request, Response } from 'express';
import { JobService } from '@/services/jobService';
import { MatchingService } from '@/services/matchingService';
import { logger } from '@/utils/logger';
import { 
  ApiResponse,
  CustomError,
  ValidationError,
  NotFoundError,
  ForbiddenError
} from '@ask-ya-cham/types';

export class JobController {
  private jobService: JobService;
  private matchingService: MatchingService;

  constructor() {
    this.jobService = new JobService();
    this.matchingService = new MatchingService();
  }

  /**
   * Get list of jobs with filtering and pagination
   */
  public getJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query;
      const userId = req.user?.id;

      const jobs = await this.jobService.getJobs(filters, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: jobs,
        message: 'Jobs retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting jobs:', error);
      throw error;
    }
  };

  /**
   * Advanced job search with AI matching
   */
  public searchJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchQuery = req.body;
      const userId = req.user?.id;

      const results = await this.jobService.searchJobs(searchQuery, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: results,
        message: 'Job search completed successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error searching jobs:', error);
      throw error;
    }
  };

  /**
   * Get recommended jobs for authenticated user
   */
  public getRecommendedJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { limit = 10 } = req.query;

      if (!userId) {
        throw new ForbiddenError('Authentication required for job recommendations');
      }

      const jobs = await this.matchingService.getRecommendedJobs(userId, parseInt(limit as string));

      const response: ApiResponse<any> = {
        success: true,
        data: jobs,
        message: 'Recommended jobs retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting recommended jobs:', error);
      throw error;
    }
  };

  /**
   * Get user's saved jobs
   */
  public getSavedJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 20 } = req.query;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const savedJobs = await this.jobService.getSavedJobs(userId, {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      const response: ApiResponse<any> = {
        success: true,
        data: savedJobs,
        message: 'Saved jobs retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting saved jobs:', error);
      throw error;
    }
  };

  /**
   * Get specific job details
   */
  public getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const job = await this.jobService.getJobById(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: job,
        message: 'Job details retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting job by ID:', error);
      throw error;
    }
  };

  /**
   * Create a new job posting
   */
  public createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const jobData = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      // Check if user has permission to create jobs
      if (!['EMPLOYER', 'RECRUITER', 'ADMIN'].includes(req.user?.role || '')) {
        throw new ForbiddenError('Insufficient permissions to create job postings');
      }

      const job = await this.jobService.createJob(jobData, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: job,
        message: 'Job created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error creating job:', error);
      throw error;
    }
  };

  /**
   * Update job posting
   */
  public updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updateData = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const job = await this.jobService.updateJob(id, updateData, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: job,
        message: 'Job updated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating job:', error);
      throw error;
    }
  };

  /**
   * Delete job posting
   */
  public deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      await this.jobService.deleteJob(id, userId);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Job deleted successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error deleting job:', error);
      throw error;
    }
  };

  /**
   * Save job for later
   */
  public saveJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      await this.jobService.saveJob(id, userId);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Job saved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error saving job:', error);
      throw error;
    }
  };

  /**
   * Remove saved job
   */
  public unsaveJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      await this.jobService.unsaveJob(id, userId);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Job removed from saved jobs'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error unsaving job:', error);
      throw error;
    }
  };

  /**
   * Apply to job (creates application)
   */
  public applyToJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const applicationData = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      // Check if user has permission to apply to jobs
      if (req.user?.role !== 'CANDIDATE') {
        throw new ForbiddenError('Only candidates can apply to jobs');
      }

      const application = await this.jobService.applyToJob(id, userId, applicationData);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application submitted successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error applying to job:', error);
      throw error;
    }
  };

  /**
   * Get job applications (for job owner)
   */
  public getJobApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { page = 1, limit = 20, status } = req.query;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const applications = await this.jobService.getJobApplications(id, userId, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as string
      });

      const response: ApiResponse<any> = {
        success: true,
        data: applications,
        message: 'Job applications retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting job applications:', error);
      throw error;
    }
  };

  /**
   * Get job analytics (for job owner)
   */
  public getJobAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const analytics = await this.jobService.getJobAnalytics(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: analytics,
        message: 'Job analytics retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting job analytics:', error);
      throw error;
    }
  };

  /**
   * Share job posting
   */
  public shareJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { platform, recipients } = req.body;

      const shareResult = await this.jobService.shareJob(id, platform, recipients);

      const response: ApiResponse<any> = {
        success: true,
        data: shareResult,
        message: 'Job shared successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error sharing job:', error);
      throw error;
    }
  };

  /**
   * Flag inappropriate job posting
   */
  public flagJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { reason, description } = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      await this.jobService.flagJob(id, userId, reason, description);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Job flagged successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error flagging job:', error);
      throw error;
    }
  };

  /**
   * Get jobs by company
   */
  public getJobsByCompany = async (req: Request, res: Response): Promise<void> => {
    try {
      const { companyId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const jobs = await this.jobService.getJobsByCompany(companyId, {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      const response: ApiResponse<any> = {
        success: true,
        data: jobs,
        message: 'Company jobs retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting jobs by company:', error);
      throw error;
    }
  };

  /**
   * Get jobs by category
   */
  public getJobsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const jobs = await this.jobService.getJobsByCategory(category, {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      const response: ApiResponse<any> = {
        success: true,
        data: jobs,
        message: 'Category jobs retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting jobs by category:', error);
      throw error;
    }
  };

  /**
   * Get trending jobs
   */
  public getTrendingJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit = 20 } = req.query;

      const jobs = await this.jobService.getTrendingJobs(parseInt(limit as string));

      const response: ApiResponse<any> = {
        success: true,
        data: jobs,
        message: 'Trending jobs retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting trending jobs:', error);
      throw error;
    }
  };

  /**
   * Get recently posted jobs
   */
  public getRecentJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit = 20 } = req.query;

      const jobs = await this.jobService.getRecentJobs(parseInt(limit as string));

      const response: ApiResponse<any> = {
        success: true,
        data: jobs,
        message: 'Recent jobs retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting recent jobs:', error);
      throw error;
    }
  };
}
