import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';
import { CacheService } from '@/utils/redis';
import { NotFoundError, ValidationError, ForbiddenError } from '@ask-ya-cham/types';

export class ApplicationService {
  private prisma: PrismaClient;
  private cacheService: CacheService;

  constructor() {
    this.prisma = new PrismaClient();
    this.cacheService = new CacheService();
  }

  /**
   * Get user's applications
   */
  async getApplications(userId: string, filters: any): Promise<any> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        jobTitle,
        company,
        dateFrom,
        dateTo,
        sortBy = 'appliedAt',
        sortOrder = 'desc'
      } = filters;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Build where clause
      const where: any = { userId };

      if (status) {
        where.status = status;
      }

      if (jobTitle || company) {
        where.job = {};
        if (jobTitle) {
          where.job.title = { contains: jobTitle, mode: 'insensitive' };
        }
        if (company) {
          where.job.company = { contains: company, mode: 'insensitive' };
        }
      }

      if (dateFrom || dateTo) {
        where.appliedAt = {};
        if (dateFrom) {
          where.appliedAt.gte = new Date(dateFrom as string);
        }
        if (dateTo) {
          where.appliedAt.lte = new Date(dateTo as string);
        }
      }

      // Build orderBy clause
      const orderBy: any = {};
      orderBy[sortBy as string] = sortOrder;

      const [applications, total] = await Promise.all([
        this.prisma.application.findMany({
          where,
          include: {
            job: {
              select: {
                id: true,
                title: true,
                company: true,
                location: true,
                jobType: true,
                salary: true,
                status: true,
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
            },
            interviews: {
              orderBy: { scheduledAt: 'desc' },
              take: 1
            },
            _count: {
              select: {
                notes: true,
                feedback: true,
                interviews: true
              }
            }
          },
          orderBy,
          skip,
          take: parseInt(limit as string)
        }),
        this.prisma.application.count({ where })
      ]);

      return {
        applications,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      };
    } catch (error) {
      logger.error('Error getting applications:', error);
      throw error;
    }
  }

  /**
   * Create new application
   */
  async createApplication(userId: string, applicationData: any): Promise<any> {
    try {
      const { jobId, coverLetter, resumeUrl, portfolioUrl, additionalInfo } = applicationData;

      // Check if job exists and is active
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      if (job.status !== 'ACTIVE') {
        throw new ValidationError('Job is not accepting applications');
      }

      // Check if user already applied
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
          userId,
          jobId,
          coverLetter,
          resumeUrl,
          portfolioUrl,
          additionalInfo,
          status: 'APPLIED',
          appliedAt: new Date()
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              employer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      // Log application creation
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_CREATED',
          description: 'Job application submitted',
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
      logger.error('Error creating application:', error);
      throw error;
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(applicationId: string, userId: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: {
            include: {
              employer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatarUrl: true,
                  company: true
                }
              }
            }
          },
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
          },
          interviews: {
            orderBy: { scheduledAt: 'desc' }
          },
          notes: {
            orderBy: { createdAt: 'desc' }
          },
          feedback: {
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              interviews: true,
              notes: true,
              feedback: true
            }
          }
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - user can view their own applications or job owner/admin
      const hasPermission = 
        application.userId === userId || 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to view this application');
      }

      return application;
    } catch (error) {
      logger.error('Error getting application by ID:', error);
      throw error;
    }
  }

  /**
   * Update application
   */
  async updateApplication(applicationId: string, userId: string, updateData: any): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Only the applicant can update their application (and only if not yet reviewed)
      if (application.userId !== userId) {
        throw new ForbiddenError('Insufficient permissions to update this application');
      }

      if (application.status !== 'APPLIED') {
        throw new ValidationError('Cannot update application after it has been reviewed');
      }

      const updatedApplication = await this.prisma.application.update({
        where: { id: applicationId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true
            }
          }
        }
      });

      // Log application update
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_UPDATED',
          description: 'Application updated',
          metadata: {
            applicationId,
            updatedFields: Object.keys(updateData)
          }
        }
      });

      return updatedApplication;
    } catch (error) {
      logger.error('Error updating application:', error);
      throw error;
    }
  }

  /**
   * Withdraw application
   */
  async withdrawApplication(applicationId: string, userId: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      if (application.userId !== userId) {
        throw new ForbiddenError('Insufficient permissions to withdraw this application');
      }

      if (application.status === 'WITHDRAWN') {
        throw new ValidationError('Application has already been withdrawn');
      }

      const updatedApplication = await this.prisma.application.update({
        where: { id: applicationId },
        data: {
          status: 'WITHDRAWN',
          withdrawnAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true
            }
          }
        }
      });

      // Log withdrawal
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_WITHDRAWN',
          description: 'Application withdrawn',
          metadata: {
            applicationId,
            jobId: application.jobId,
            jobTitle: updatedApplication.job.title
          }
        }
      });

      return updatedApplication;
    } catch (error) {
      logger.error('Error withdrawing application:', error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId: string, userId: string, status: string, notes?: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - only job owner or admin can update status
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to update application status');
      }

      const updatedApplication = await this.prisma.application.update({
        where: { id: applicationId },
        data: {
          status,
          updatedAt: new Date(),
          ...(status === 'REJECTED' && { rejectedAt: new Date() }),
          ...(status === 'ACCEPTED' && { acceptedAt: new Date() })
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      // Add note if provided
      if (notes) {
        await this.addApplicationNotes(applicationId, userId, notes, true);
      }

      // Log status update
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_STATUS_UPDATED',
          description: `Application status updated to ${status}`,
          metadata: {
            applicationId,
            previousStatus: application.status,
            newStatus: status,
            jobId: application.jobId,
            candidateId: application.userId
          }
        }
      });

      return updatedApplication;
    } catch (error) {
      logger.error('Error updating application status:', error);
      throw error;
    }
  }

  /**
   * Add notes to application
   */
  async addApplicationNotes(applicationId: string, userId: string, notes: string, isPrivate: boolean = false): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - job owner or admin can add notes
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to add notes');
      }

      const note = await this.prisma.applicationNote.create({
        data: {
          applicationId,
          userId,
          notes,
          isPrivate
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        }
      });

      return note;
    } catch (error) {
      logger.error('Error adding application notes:', error);
      throw error;
    }
  }

  /**
   * Get application notes
   */
  async getApplicationNotes(applicationId: string, userId: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to view notes');
      }

      const notes = await this.prisma.applicationNote.findMany({
        where: { applicationId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return notes;
    } catch (error) {
      logger.error('Error getting application notes:', error);
      throw error;
    }
  }

  /**
   * Schedule interview
   */
  async scheduleInterview(applicationId: string, userId: string, interviewData: any): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - job owner or admin can schedule interviews
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to schedule interview');
      }

      const interview = await this.prisma.interview.create({
        data: {
          applicationId,
          scheduledBy: userId,
          ...interviewData,
          status: 'SCHEDULED'
        },
        include: {
          application: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      // Log interview scheduling
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'INTERVIEW_SCHEDULED',
          description: 'Interview scheduled',
          metadata: {
            interviewId: interview.id,
            applicationId,
            scheduledAt: interviewData.scheduledAt,
            candidateId: application.userId
          }
        }
      });

      return interview;
    } catch (error) {
      logger.error('Error scheduling interview:', error);
      throw error;
    }
  }

  /**
   * Update interview
   */
  async updateInterview(applicationId: string, interviewId: string, userId: string, updateData: any): Promise<any> {
    try {
      const interview = await this.prisma.interview.findUnique({
        where: { id: interviewId },
        include: {
          application: {
            include: {
              job: true
            }
          }
        }
      });

      if (!interview) {
        throw new NotFoundError('Interview not found');
      }

      // Check permissions
      const hasPermission = 
        interview.application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to update interview');
      }

      const updatedInterview = await this.prisma.interview.update({
        where: { id: interviewId },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });

      return updatedInterview;
    } catch (error) {
      logger.error('Error updating interview:', error);
      throw error;
    }
  }

  /**
   * Cancel interview
   */
  async cancelInterview(applicationId: string, interviewId: string, userId: string, reason: string): Promise<any> {
    try {
      const interview = await this.prisma.interview.findUnique({
        where: { id: interviewId },
        include: {
          application: {
            include: {
              job: true
            }
          }
        }
      });

      if (!interview) {
        throw new NotFoundError('Interview not found');
      }

      // Check permissions
      const hasPermission = 
        interview.application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to cancel interview');
      }

      const updatedInterview = await this.prisma.interview.update({
        where: { id: interviewId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: reason,
          updatedAt: new Date()
        }
      });

      // Log interview cancellation
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'INTERVIEW_CANCELLED',
          description: 'Interview cancelled',
          metadata: {
            interviewId,
            applicationId,
            reason,
            candidateId: interview.application.userId
          }
        }
      });

      return updatedInterview;
    } catch (error) {
      logger.error('Error cancelling interview:', error);
      throw error;
    }
  }

  /**
   * Add application feedback
   */
  async addApplicationFeedback(applicationId: string, userId: string, feedbackData: any): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - job owner or admin can add feedback
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to add feedback');
      }

      const feedback = await this.prisma.applicationFeedback.create({
        data: {
          applicationId,
          userId,
          ...feedbackData
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        }
      });

      return feedback;
    } catch (error) {
      logger.error('Error adding application feedback:', error);
      throw error;
    }
  }

  /**
   * Get application feedback
   */
  async getApplicationFeedback(applicationId: string, userId: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - job owner, admin, or applicant can view feedback
      const hasPermission = 
        application.job.employerId === userId ||
        application.userId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to view feedback');
      }

      const feedback = await this.prisma.applicationFeedback.findMany({
        where: { applicationId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return feedback;
    } catch (error) {
      logger.error('Error getting application feedback:', error);
      throw error;
    }
  }

  /**
   * Rate application
   */
  async rateApplication(applicationId: string, userId: string, rating: number, comments?: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - job owner or admin can rate applications
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to rate application');
      }

      if (rating < 1 || rating > 5) {
        throw new ValidationError('Rating must be between 1 and 5');
      }

      const updatedApplication = await this.prisma.application.update({
        where: { id: applicationId },
        data: {
          rating,
          ratingComments: comments,
          ratedAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Log rating
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_RATED',
          description: 'Application rated',
          metadata: {
            applicationId,
            rating,
            comments,
            candidateId: application.userId
          }
        }
      });

      return updatedApplication;
    } catch (error) {
      logger.error('Error rating application:', error);
      throw error;
    }
  }

  /**
   * Get application analytics
   */
  async getApplicationAnalytics(applicationId: string, userId: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions
      const hasPermission = 
        application.job.employerId === userId ||
        application.userId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to view analytics');
      }

      const [
        interviewCount,
        notesCount,
        feedbackCount,
        timeline
      ] = await Promise.all([
        this.prisma.interview.count({ where: { applicationId } }),
        this.prisma.applicationNote.count({ where: { applicationId } }),
        this.prisma.applicationFeedback.count({ where: { applicationId } }),
        this.prisma.activityLog.findMany({
          where: {
            OR: [
              { metadata: { path: ['applicationId'], equals: applicationId } },
              { metadata: { path: ['interviewId'], equals: applicationId } }
            ]
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        })
      ]);

      return {
        overview: {
          status: application.status,
          appliedAt: application.appliedAt,
          rating: application.rating,
          interviewCount,
          notesCount,
          feedbackCount
        },
        timeline
      };
    } catch (error) {
      logger.error('Error getting application analytics:', error);
      throw error;
    }
  }

  /**
   * Share application with team members
   */
  async shareApplication(applicationId: string, userId: string, teamMembers: string[], message?: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - job owner or admin can share applications
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to share application');
      }

      // This would integrate with actual sharing/notification system
      const shareData = {
        applicationId,
        sharedBy: userId,
        teamMembers,
        message,
        sharedAt: new Date()
      };

      // Log sharing
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_SHARED',
          description: 'Application shared with team members',
          metadata: shareData
        }
      });

      return shareData;
    } catch (error) {
      logger.error('Error sharing application:', error);
      throw error;
    }
  }

  /**
   * Archive application
   */
  async archiveApplication(applicationId: string, userId: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - job owner or admin can archive applications
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to archive application');
      }

      const updatedApplication = await this.prisma.application.update({
        where: { id: applicationId },
        data: {
          isArchived: true,
          archivedAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Log archiving
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_ARCHIVED',
          description: 'Application archived',
          metadata: {
            applicationId,
            candidateId: application.userId
          }
        }
      });

      return updatedApplication;
    } catch (error) {
      logger.error('Error archiving application:', error);
      throw error;
    }
  }

  /**
   * Unarchive application
   */
  async unarchiveApplication(applicationId: string, userId: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions - job owner or admin can unarchive applications
      const hasPermission = 
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to unarchive application');
      }

      const updatedApplication = await this.prisma.application.update({
        where: { id: applicationId },
        data: {
          isArchived: false,
          archivedAt: null,
          updatedAt: new Date()
        }
      });

      // Log unarchiving
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_UNARCHIVED',
          description: 'Application unarchived',
          metadata: {
            applicationId,
            candidateId: application.userId
          }
        }
      });

      return updatedApplication;
    } catch (error) {
      logger.error('Error unarchiving application:', error);
      throw error;
    }
  }

  /**
   * Get applications by job
   */
  async getApplicationsByJob(jobId: string, userId: string, filters: any): Promise<any> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      // Check permissions - job owner or admin can view applications
      const hasPermission = 
        job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to view job applications');
      }

      const {
        page = 1,
        limit = 20,
        status,
        experienceLevel,
        sortBy = 'appliedAt',
        sortOrder = 'desc'
      } = filters;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

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
            },
            _count: {
              select: {
                interviews: true,
                notes: true,
                feedback: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: parseInt(limit as string)
        }),
        this.prisma.application.count({ where })
      ]);

      return {
        applications,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      };
    } catch (error) {
      logger.error('Error getting applications by job:', error);
      throw error;
    }
  }

  /**
   * Get applications by user (admin only)
   */
  async getApplicationsByUser(targetUserId: string): Promise<any> {
    try {
      const applications = await this.prisma.application.findMany({
        where: { userId: targetUserId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              jobType: true,
              salary: true,
              status: true
            }
          }
        },
        orderBy: { appliedAt: 'desc' }
      });

      return applications;
    } catch (error) {
      logger.error('Error getting applications by user:', error);
      throw error;
    }
  }

  /**
   * Get application statistics
   */
  async getApplicationStats(userId: string): Promise<any> {
    try {
      const [
        totalApplications,
        applicationsByStatus,
        applicationsByMonth,
        averageResponseTime
      ] = await Promise.all([
        this.prisma.application.count({ where: { userId } }),
        this.prisma.application.groupBy({
          by: ['status'],
          where: { userId },
          _count: { status: true }
        }),
        this.prisma.application.groupBy({
          by: ['appliedAt'],
          where: { userId },
          _count: { appliedAt: true }
        }),
        this.calculateAverageResponseTime(userId)
      ]);

      return {
        overview: {
          totalApplications,
          averageResponseTime
        },
        byStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {} as Record<string, number>),
        byMonth: applicationsByMonth.map(item => ({
          month: item.appliedAt.toISOString().slice(0, 7),
          count: item._count.appliedAt
        }))
      };
    } catch (error) {
      logger.error('Error getting application stats:', error);
      throw error;
    }
  }

  /**
   * Duplicate application for another job
   */
  async duplicateApplication(applicationId: string, userId: string, jobId: string, modifications?: any): Promise<any> {
    try {
      const originalApplication = await this.prisma.application.findUnique({
        where: { id: applicationId }
      });

      if (!originalApplication) {
        throw new NotFoundError('Original application not found');
      }

      if (originalApplication.userId !== userId) {
        throw new ForbiddenError('Insufficient permissions to duplicate this application');
      }

      // Check if job exists
      const job = await this.prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        throw new NotFoundError('Target job not found');
      }

      // Check if already applied to target job
      const existingApplication = await this.prisma.application.findFirst({
        where: {
          userId,
          jobId
        }
      });

      if (existingApplication) {
        throw new ValidationError('You have already applied to this job');
      }

      const duplicatedApplication = await this.prisma.application.create({
        data: {
          userId,
          jobId,
          coverLetter: modifications?.coverLetter || originalApplication.coverLetter,
          resumeUrl: originalApplication.resumeUrl,
          portfolioUrl: originalApplication.portfolioUrl,
          additionalInfo: modifications?.additionalInfo || originalApplication.additionalInfo,
          status: 'APPLIED',
          appliedAt: new Date()
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true
            }
          }
        }
      });

      // Log duplication
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'APPLICATION_DUPLICATED',
          description: 'Application duplicated for another job',
          metadata: {
            originalApplicationId: applicationId,
            newApplicationId: duplicatedApplication.id,
            targetJobId: jobId,
            targetJobTitle: job.title
          }
        }
      });

      return duplicatedApplication;
    } catch (error) {
      logger.error('Error duplicating application:', error);
      throw error;
    }
  }

  /**
   * Get application timeline
   */
  async getApplicationTimeline(applicationId: string, userId: string): Promise<any> {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true
        }
      });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      // Check permissions
      const hasPermission = 
        application.userId === userId ||
        application.job.employerId === userId ||
        await this.isAdmin(userId);

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions to view timeline');
      }

      const timeline = await this.prisma.activityLog.findMany({
        where: {
          OR: [
            { metadata: { path: ['applicationId'], equals: applicationId } },
            { metadata: { path: ['interviewId'], equals: applicationId } }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return timeline;
    } catch (error) {
      logger.error('Error getting application timeline:', error);
      throw error;
    }
  }

  /**
   * Check if user is admin
   */
  private async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      return user?.role === 'ADMIN';
    } catch (error) {
      logger.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Calculate average response time
   */
  private async calculateAverageResponseTime(userId: string): Promise<number> {
    try {
      const applications = await this.prisma.application.findMany({
        where: {
          userId,
          status: { in: ['REJECTED', 'ACCEPTED'] },
          OR: [
            { rejectedAt: { not: null } },
            { acceptedAt: { not: null } }
          ]
        },
        select: {
          appliedAt: true,
          rejectedAt: true,
          acceptedAt: true
        }
      });

      if (applications.length === 0) return 0;

      const totalDays = applications.reduce((sum, app) => {
        const responseDate = app.rejectedAt || app.acceptedAt;
        if (!responseDate) return sum;
        
        const days = Math.floor((responseDate.getTime() - app.appliedAt.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);

      return Math.round(totalDays / applications.length);
    } catch (error) {
      logger.error('Error calculating average response time:', error);
      return 0;
    }
  }
}
