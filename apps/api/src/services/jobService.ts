import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';
import { CacheService } from '@/utils/redis';
import { NotFoundError, ValidationError, ForbiddenError } from '@ask-ya-cham/types';
import { MatchingService } from './matchingService';

export class JobService {
  private prisma: PrismaClient;
  private cacheService: CacheService;
  private matchingService: MatchingService;

  constructor() {
    this.prisma = new PrismaClient();
    this.cacheService = new CacheService();
    this.matchingService = new MatchingService();
  }

  /**
   * Get jobs with filtering and pagination
   */
  async getJobs(filters: any, userId?: string): Promise<any> {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        location,
        jobType,
        experienceLevel,
        salaryMin,
        salaryMax,
        category,
        company,
        remote,
        featured,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Build where clause
      const where: any = {
        status: 'ACTIVE',
        isDeleted: false
      };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { requiredSkills: { has: search } }
        ];
      }

      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }

      if (jobType) {
        where.jobType = jobType;
      }

      if (experienceLevel) {
        where.experienceLevel = experienceLevel;
      }

      if (salaryMin || salaryMax) {
        where.salary = {};
        if (salaryMin) where.salary.gte = parseInt(salaryMin as string);
        if (salaryMax) where.salary.lte = parseInt(salaryMax as string);
      }

      if (category) {
        where.category = category;
      }

      if (company) {
        where.company = { contains: company, mode: 'insensitive' };
      }

      if (remote !== undefined) {
        where.isRemote = remote === 'true';
      }

      if (featured === 'true') {
        where.isFeatured = true;
      }

      // Build orderBy clause
      const orderBy: any = {};
      orderBy[sortBy as string] = sortOrder;

      const [jobs, total] = await Promise.all([
        this.prisma.job.findMany({
          where,
          include: {
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                company: true
              }
            },
            _count: {
              select: {
                applications: true,
                savedJobs: true
              }
            },
            ...(userId && {
              savedJobs: {
                where: { userId },
                select: { id: true }
              }
            })
          },
          orderBy,
          skip,
          take: parseInt(limit as string)
        }),
        this.prisma.job.count({ where })
      ]);

      // Add saved status for each job
      const jobsWithSavedStatus = jobs.map(job => ({
        ...job,
        isSaved: job.savedJobs && job.savedJobs.length > 0,
        savedJobs: undefined // Remove from response
      }));

      return {
        jobs: jobsWithSavedStatus,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      };
    } catch (error) {
      logger.error('Error getting jobs:', error);
      throw error;
    }
  }

  /**
   * Advanced job search with AI matching
   */
  async searchJobs(searchQuery: any, userId?: string): Promise<any> {
    try {
      const {
        query,
        filters = {},
        aiMatching = false,
        limit = 20
      } = searchQuery;

      let jobs: any[] = [];

      if (aiMatching && userId) {
        // Use AI matching service for personalized results
        jobs = await this.matchingService.searchJobsWithAI(userId, query, filters, limit);
      } else {
        // Use traditional search
        const searchResults = await this.getJobs({
          search: query,
          ...filters,
          limit
        }, userId);
        jobs = searchResults.jobs;
      }

      return {
        jobs,
        total: jobs.length,
        aiMatching,
        query
      };
    } catch (error) {
      logger.error('Error searching jobs:', error);
      throw error;
    }
  }

  /**
   * Get saved jobs for user
   */
  async getSavedJobs(userId: string, options: { page: number; limit: number }): Promise<any> {
    try {
      const { page, limit } = options;
      const skip = (page - 1) * limit;

      const [savedJobs, total] = await Promise.all([
        this.prisma.savedJob.findMany({
          where: { userId },
          include: {
            job: {
              include: {
                employer: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                    company: true
                  }
                },
                _count: {
                  select: {
                    applications: true,
                    savedJobs: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.savedJob.count({ where: { userId } })
      ]);

      const jobs = savedJobs.map(savedJob => ({
        ...savedJob.job,
        savedAt: savedJob.createdAt
      }));

      return {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting saved jobs:', error);
      throw error;
    }
  }

  /**
   * Get job by ID
   */
  async getJobById(jobId: string, userId?: string): Promise<any> {
    try {
      const cacheKey = `job:${jobId}:${userId || 'anonymous'}`;
      const cachedJob = await this.cacheService.get(cacheKey);

      if (cachedJob) {
        return JSON.parse(cachedJob);
      }

      const job = await this.prisma.job.findUnique({
        where: { id: jobId },
        include: {
          employer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              company: true,
              email: true,
              phone: true
            }
          },
          _count: {
            select: {
              applications: true,
              savedJobs: true,
              views: true
            }
          },
          ...(userId && {
            savedJobs: {
              where: { userId },
              select: { id: true }
            },
            applications: {
              where: { userId },
              select: { id: true, status: true }
            }
          })
        }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      // Increment view count
      await this.prisma.jobView.create({
        data: {
          jobId,
          userId,
          ipAddress: '0.0.0.0', // Will be set by middleware
          userAgent: 'Unknown' // Will be set by middleware
        }
      });

      const jobWithStatus = {
        ...job,
        isSaved: job.savedJobs && job.savedJobs.length > 0,
        userApplication: job.applications && job.applications.length > 0 ? job.applications[0] : null,
        savedJobs: undefined, // Remove from response
        applications: undefined // Remove from response
      };

      // Cache job data for 1 hour
      await this.cacheService.set(cacheKey, JSON.stringify(jobWithStatus), 3600);

      return jobWithStatus;
    } catch (error) {
      logger.error('Error getting job by ID:', error);
      throw error;
    }
  }

  /**
   * Create new job
   */
  async createJob(jobData: any, employerId: string): Promise<any> {
    try {
      const job = await this.prisma.job.create({
        data: {
          ...jobData,
          employerId,
          status: 'ACTIVE',
          isFeatured: false
        },
        include: {
          employer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              company: true
            }
          }
        }
      });

      // Log job creation
      await this.prisma.activityLog.create({
        data: {
          userId: employerId,
          action: 'JOB_CREATED',
          description: 'Job posting created',
          metadata: { jobId: job.id, jobTitle: job.title }
        }
      });

      return job;
    } catch (error) {
      logger.error('Error creating job:', error);
      throw error;
    }
  }

  /**
   * Update job
   */
  async updateJob(jobId: string, updateData: any, userId: string): Promise<any> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      // Check permissions
      if (job.employerId !== userId && !['ADMIN'].includes(await this.getUserRole(userId))) {
        throw new ForbiddenError('Insufficient permissions to update this job');
      }

      const updatedJob = await this.prisma.job.update({
        where: { id: jobId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          employer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              company: true
            }
          }
        }
      });

      // Invalidate cache
      await this.cacheService.del(`job:${jobId}`);

      // Log job update
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'JOB_UPDATED',
          description: 'Job posting updated',
          metadata: { jobId, updatedFields: Object.keys(updateData) }
        }
      });

      return updatedJob;
    } catch (error) {
      logger.error('Error updating job:', error);
      throw error;
    }
  }

  /**
   * Delete job
   */
  async deleteJob(jobId: string, userId: string): Promise<void> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      // Check permissions
      if (job.employerId !== userId && !['ADMIN'].includes(await this.getUserRole(userId))) {
        throw new ForbiddenError('Insufficient permissions to delete this job');
      }

      // Soft delete
      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Invalidate cache
      await this.cacheService.del(`job:${jobId}`);

      // Log job deletion
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'JOB_DELETED',
          description: 'Job posting deleted',
          metadata: { jobId, jobTitle: job.title }
        }
      });
    } catch (error) {
      logger.error('Error deleting job:', error);
      throw error;
    }
  }

  /**
   * Save job for user
   */
  async saveJob(jobId: string, userId: string): Promise<void> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      // Check if already saved
      const existingSavedJob = await this.prisma.savedJob.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId
          }
        }
      });

      if (existingSavedJob) {
        throw new ValidationError('Job already saved');
      }

      await this.prisma.savedJob.create({
        data: {
          userId,
          jobId
        }
      });

      // Log job save
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'JOB_SAVED',
          description: 'Job saved for later',
          metadata: { jobId, jobTitle: job.title }
        }
      });
    } catch (error) {
      logger.error('Error saving job:', error);
      throw error;
    }
  }

  /**
   * Unsave job for user
   */
  async unsaveJob(jobId: string, userId: string): Promise<void> {
    try {
      const savedJob = await this.prisma.savedJob.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId
          }
        },
        include: {
          job: {
            select: {
              title: true
            }
          }
        }
      });

      if (!savedJob) {
        throw new NotFoundError('Saved job not found');
      }

      await this.prisma.savedJob.delete({
        where: {
          userId_jobId: {
            userId,
            jobId
          }
        }
      });

      // Log job unsave
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'JOB_UNSAVED',
          description: 'Job removed from saved jobs',
          metadata: { jobId, jobTitle: savedJob.job.title }
        }
      });
    } catch (error) {
      logger.error('Error unsaving job:', error);
      throw error;
    }
  }

  /**
   * Apply to job
   */
  async applyToJob(jobId: string, userId: string, applicationData: any): Promise<any> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      if (job.status !== 'ACTIVE') {
        throw new ValidationError('Job is not accepting applications');
      }

      // Check if already applied
      const existingApplication = await this.prisma.application.findFirst({
        where: {
          userId,
          jobId
        }
      });

      if (existingApplication) {
        throw new ValidationError('You have already applied to this job');
      }

      const application = await this.prisma.application.create({
        data: {
          ...applicationData,
          userId,
          jobId,
          status: 'APPLIED',
          appliedAt: new Date()
        },
        include: {
          job: {
            select: {
              title: true,
              company: true
            }
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      // Log application
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_CREATED',
          description: 'Application submitted',
          metadata: { 
            applicationId: application.id,
            jobId,
            jobTitle: job.title,
            company: job.company
          }
        }
      });

      return application;
    } catch (error) {
      logger.error('Error applying to job:', error);
      throw error;
    }
  }

  /**
   * Get job applications
   */
  async getJobApplications(jobId: string, userId: string, options: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<any> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      // Check permissions
      if (job.employerId !== userId && !['ADMIN'].includes(await this.getUserRole(userId))) {
        throw new ForbiddenError('Insufficient permissions to view applications');
      }

      const { page, limit, status } = options;
      const skip = (page - 1) * limit;

      const where: any = { jobId };
      if (status) {
        where.status = status;
      }

      const [applications, total] = await Promise.all([
        this.prisma.application.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
                profile: {
                  select: {
                    title: true,
                    experience: true,
                    skills: true,
                    resumeUrl: true
                  }
                }
              }
            }
          },
          orderBy: { appliedAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.application.count({ where })
      ]);

      return {
        applications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting job applications:', error);
      throw error;
    }
  }

  /**
   * Get job analytics
   */
  async getJobAnalytics(jobId: string, userId: string): Promise<any> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      // Check permissions
      if (job.employerId !== userId && !['ADMIN'].includes(await this.getUserRole(userId))) {
        throw new ForbiddenError('Insufficient permissions to view analytics');
      }

      const [
        totalApplications,
        applicationsByStatus,
        totalViews,
        totalSaves,
        applicationsByDay,
        topApplicantSources
      ] = await Promise.all([
        this.prisma.application.count({ where: { jobId } }),
        this.prisma.application.groupBy({
          by: ['status'],
          where: { jobId },
          _count: { status: true }
        }),
        this.prisma.jobView.count({ where: { jobId } }),
        this.prisma.savedJob.count({ where: { jobId } }),
        this.prisma.application.groupBy({
          by: ['appliedAt'],
          where: { jobId },
          _count: { appliedAt: true }
        }),
        // This would require additional tracking
        Promise.resolve([])
      ]);

      return {
        overview: {
          totalApplications,
          totalViews,
          totalSaves,
          conversionRate: totalViews > 0 ? (totalApplications / totalViews * 100).toFixed(2) : 0
        },
        applications: {
          byStatus: applicationsByStatus.reduce((acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
          }, {} as Record<string, number>)
        },
        trends: {
          applicationsByDay: applicationsByDay.map(item => ({
            date: item.appliedAt.toISOString().split('T')[0],
            count: item._count.appliedAt
          }))
        }
      };
    } catch (error) {
      logger.error('Error getting job analytics:', error);
      throw error;
    }
  }

  /**
   * Share job
   */
  async shareJob(jobId: string, platform: string, recipients?: string[]): Promise<any> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      // This would integrate with actual sharing services
      const shareData = {
        jobId,
        platform,
        recipients,
        shareUrl: `${process.env.FRONTEND_URL}/jobs/${jobId}`,
        sharedAt: new Date()
      };

      // Log sharing activity
      await this.prisma.activityLog.create({
        data: {
          userId: null,
          action: 'JOB_SHARED',
          description: `Job shared on ${platform}`,
          metadata: shareData
        }
      });

      return shareData;
    } catch (error) {
      logger.error('Error sharing job:', error);
      throw error;
    }
  }

  /**
   * Flag job
   */
  async flagJob(jobId: string, userId: string, reason: string, description?: string): Promise<void> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      await this.prisma.jobFlag.create({
        data: {
          jobId,
          userId,
          reason,
          description,
          status: 'PENDING'
        }
      });

      // Log flagging
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'JOB_FLAGGED',
          description: 'Job flagged for review',
          metadata: { jobId, reason, description }
        }
      });
    } catch (error) {
      logger.error('Error flagging job:', error);
      throw error;
    }
  }

  /**
   * Get jobs by company
   */
  async getJobsByCompany(companyId: string, options: { page: number; limit: number }): Promise<any> {
    try {
      const { page, limit } = options;
      const skip = (page - 1) * limit;

      const where = {
        company: { contains: companyId, mode: 'insensitive' },
        status: 'ACTIVE',
        isDeleted: false
      };

      const [jobs, total] = await Promise.all([
        this.prisma.job.findMany({
          where,
          include: {
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                company: true
              }
            },
            _count: {
              select: {
                applications: true,
                savedJobs: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.job.count({ where })
      ]);

      return {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting jobs by company:', error);
      throw error;
    }
  }

  /**
   * Get jobs by category
   */
  async getJobsByCategory(category: string, options: { page: number; limit: number }): Promise<any> {
    try {
      const { page, limit } = options;
      const skip = (page - 1) * limit;

      const where = {
        category,
        status: 'ACTIVE',
        isDeleted: false
      };

      const [jobs, total] = await Promise.all([
        this.prisma.job.findMany({
          where,
          include: {
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                company: true
              }
            },
            _count: {
              select: {
                applications: true,
                savedJobs: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.job.count({ where })
      ]);

      return {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting jobs by category:', error);
      throw error;
    }
  }

  /**
   * Get trending jobs
   */
  async getTrendingJobs(limit: number): Promise<any> {
    try {
      const jobs = await this.prisma.job.findMany({
        where: {
          status: 'ACTIVE',
          isDeleted: false,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        include: {
          employer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              company: true
            }
          },
          _count: {
            select: {
              applications: true,
              savedJobs: true,
              views: true
            }
          }
        },
        orderBy: {
          views: {
            _count: 'desc'
          }
        },
        take: limit
      });

      return jobs;
    } catch (error) {
      logger.error('Error getting trending jobs:', error);
      throw error;
    }
  }

  /**
   * Get recent jobs
   */
  async getRecentJobs(limit: number): Promise<any> {
    try {
      const jobs = await this.prisma.job.findMany({
        where: {
          status: 'ACTIVE',
          isDeleted: false
        },
        include: {
          employer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              company: true
            }
          },
          _count: {
            select: {
              applications: true,
              savedJobs: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return jobs;
    } catch (error) {
      logger.error('Error getting recent jobs:', error);
      throw error;
    }
  }

  /**
   * Get user role
   */
  private async getUserRole(userId: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      return user?.role || 'CANDIDATE';
    } catch (error) {
      logger.error('Error getting user role:', error);
      return 'CANDIDATE';
    }
  }
}
