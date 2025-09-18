import { Request, Response } from 'express';
import { ApplicationService } from '@/services/applicationService';
import { NotificationService } from '@/services/notificationService';
import { logger } from '@/utils/logger';
import { 
  ApiResponse,
  CustomError,
  ValidationError,
  NotFoundError,
  ForbiddenError
} from '@ask-ya-cham/types';

export class ApplicationController {
  private applicationService: ApplicationService;
  private notificationService: NotificationService;

  constructor() {
    this.applicationService = new ApplicationService();
    this.notificationService = new NotificationService();
  }

  /**
   * Get user's applications with filtering and pagination
   */
  public getApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const filters = req.query;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const applications = await this.applicationService.getApplications(userId, filters);

      const response: ApiResponse<any> = {
        success: true,
        data: applications,
        message: 'Applications retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting applications:', error);
      throw error;
    }
  };

  /**
   * Create a new job application
   */
  public createApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const applicationData = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      // Check if user has permission to create applications
      if (req.user?.role !== 'CANDIDATE') {
        throw new ForbiddenError('Only candidates can create applications');
      }

      const application = await this.applicationService.createApplication(userId, applicationData);

      // Send notification to employer
      await this.notificationService.sendApplicationNotification(application);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application submitted successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error creating application:', error);
      throw error;
    }
  };

  /**
   * Get specific application details
   */
  public getApplicationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.getApplicationById(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application details retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting application by ID:', error);
      throw error;
    }
  };

  /**
   * Update application details
   */
  public updateApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updateData = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.updateApplication(id, userId, updateData);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application updated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating application:', error);
      throw error;
    }
  };

  /**
   * Withdraw application
   */
  public withdrawApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.withdrawApplication(id, userId);

      // Send notification to employer
      await this.notificationService.sendApplicationWithdrawalNotification(application);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application withdrawn successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error withdrawing application:', error);
      throw error;
    }
  };

  /**
   * Update application status (for job owners)
   */
  public updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { status, notes } = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.updateApplicationStatus(id, userId, status, notes);

      // Send notification to candidate
      await this.notificationService.sendApplicationStatusNotification(application);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application status updated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating application status:', error);
      throw error;
    }
  };

  /**
   * Add notes to application (for job owners)
   */
  public addApplicationNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { notes, isPrivate } = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.addApplicationNotes(id, userId, notes, isPrivate);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Notes added successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error adding application notes:', error);
      throw error;
    }
  };

  /**
   * Get application notes
   */
  public getApplicationNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const notes = await this.applicationService.getApplicationNotes(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: notes,
        message: 'Application notes retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting application notes:', error);
      throw error;
    }
  };

  /**
   * Schedule interview for application
   */
  public scheduleInterview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const interviewData = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const interview = await this.applicationService.scheduleInterview(id, userId, interviewData);

      // Send notification to candidate
      await this.notificationService.sendInterviewScheduledNotification(interview);

      const response: ApiResponse<any> = {
        success: true,
        data: interview,
        message: 'Interview scheduled successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error scheduling interview:', error);
      throw error;
    }
  };

  /**
   * Update interview details
   */
  public updateInterview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, interviewId } = req.params;
      const userId = req.user?.id;
      const updateData = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const interview = await this.applicationService.updateInterview(id, interviewId, userId, updateData);

      const response: ApiResponse<any> = {
        success: true,
        data: interview,
        message: 'Interview updated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating interview:', error);
      throw error;
    }
  };

  /**
   * Cancel interview
   */
  public cancelInterview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, interviewId } = req.params;
      const userId = req.user?.id;
      const { reason } = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const interview = await this.applicationService.cancelInterview(id, interviewId, userId, reason);

      // Send notification to candidate
      await this.notificationService.sendInterviewCancelledNotification(interview);

      const response: ApiResponse<any> = {
        success: true,
        data: interview,
        message: 'Interview cancelled successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error cancelling interview:', error);
      throw error;
    }
  };

  /**
   * Add feedback to application
   */
  public addApplicationFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const feedbackData = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const feedback = await this.applicationService.addApplicationFeedback(id, userId, feedbackData);

      const response: ApiResponse<any> = {
        success: true,
        data: feedback,
        message: 'Feedback added successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error adding application feedback:', error);
      throw error;
    }
  };

  /**
   * Get application feedback
   */
  public getApplicationFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const feedback = await this.applicationService.getApplicationFeedback(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: feedback,
        message: 'Application feedback retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting application feedback:', error);
      throw error;
    }
  };

  /**
   * Rate application (for job owners)
   */
  public rateApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { rating, comments } = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.rateApplication(id, userId, rating, comments);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application rated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error rating application:', error);
      throw error;
    }
  };

  /**
   * Get application analytics
   */
  public getApplicationAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const analytics = await this.applicationService.getApplicationAnalytics(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: analytics,
        message: 'Application analytics retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting application analytics:', error);
      throw error;
    }
  };

  /**
   * Share application with team members
   */
  public shareApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { teamMembers, message } = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const shareResult = await this.applicationService.shareApplication(id, userId, teamMembers, message);

      const response: ApiResponse<any> = {
        success: true,
        data: shareResult,
        message: 'Application shared successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error sharing application:', error);
      throw error;
    }
  };

  /**
   * Archive application
   */
  public archiveApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.archiveApplication(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application archived successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error archiving application:', error);
      throw error;
    }
  };

  /**
   * Unarchive application
   */
  public unarchiveApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.unarchiveApplication(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application unarchived successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error unarchiving application:', error);
      throw error;
    }
  };

  /**
   * Get all applications for a specific job
   */
  public getApplicationsByJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const userId = req.user?.id;
      const filters = req.query;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const applications = await this.applicationService.getApplicationsByJob(jobId, userId, filters);

      const response: ApiResponse<any> = {
        success: true,
        data: applications,
        message: 'Job applications retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting applications by job:', error);
      throw error;
    }
  };

  /**
   * Get all applications for a specific user (admin only)
   */
  public getApplicationsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId: targetUserId } = req.params;
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        throw new ForbiddenError('Authentication required');
      }

      // Only admin can view all applications for a user
      if (req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Admin access required');
      }

      const applications = await this.applicationService.getApplicationsByUser(targetUserId);

      const response: ApiResponse<any> = {
        success: true,
        data: applications,
        message: 'User applications retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting applications by user:', error);
      throw error;
    }
  };

  /**
   * Get application statistics
   */
  public getApplicationStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const stats = await this.applicationService.getApplicationStats(userId);

      const response: ApiResponse<any> = {
        success: true,
        data: stats,
        message: 'Application statistics retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting application stats:', error);
      throw error;
    }
  };

  /**
   * Duplicate application for another job
   */
  public duplicateApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { jobId, modifications } = req.body;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const application = await this.applicationService.duplicateApplication(id, userId, jobId, modifications);

      const response: ApiResponse<any> = {
        success: true,
        data: application,
        message: 'Application duplicated successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error duplicating application:', error);
      throw error;
    }
  };

  /**
   * Get application timeline/activity log
   */
  public getApplicationTimeline = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const timeline = await this.applicationService.getApplicationTimeline(id, userId);

      const response: ApiResponse<any> = {
        success: true,
        data: timeline,
        message: 'Application timeline retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting application timeline:', error);
      throw error;
    }
  };
}
