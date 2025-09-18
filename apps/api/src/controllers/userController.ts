import { Request, Response } from 'express';
import { UserService } from '@/services/userService';
import { FileService } from '@/services/fileService';
import { logger } from '@/utils/logger';
import { 
  ApiResponse,
  CustomError,
  ValidationError,
  NotFoundError,
  ForbiddenError
} from '@ask-ya-cham/types';

export class UserController {
  private userService: UserService;
  private fileService: FileService;

  constructor() {
    this.userService = new UserService();
    this.fileService = new FileService();
  }

  /**
   * Get current user profile
   */
  public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('User not authenticated');
      }

      const user = await this.userService.getUserById(userId);

      const response: ApiResponse<any> = {
        success: true,
        data: user,
        message: 'User profile retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting current user:', error);
      throw error;
    }
  };

  /**
   * Get user by ID
   */
  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.id;

      // Users can only view their own profile unless they're admin
      if (id !== currentUserId && req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const user = await this.userService.getUserById(id);

      const response: ApiResponse<any> = {
        success: true,
        data: user,
        message: 'User profile retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  };

  /**
   * Update current user profile
   */
  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const updateData = req.body;

      if (!userId) {
        throw new ForbiddenError('User not authenticated');
      }

      const updatedUser = await this.userService.updateUser(userId, updateData);

      const response: ApiResponse<any> = {
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw error;
    }
  };

  /**
   * Update user by ID (admin only)
   */
  public updateUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Admin access required');
      }

      const updatedUser = await this.userService.updateUser(id, updateData);

      const response: ApiResponse<any> = {
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating user by ID:', error);
      throw error;
    }
  };

  /**
   * Upload user avatar
   */
  public uploadAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const file = req.file;

      if (!userId) {
        throw new ForbiddenError('User not authenticated');
      }

      if (!file) {
        throw new ValidationError('Avatar file is required');
      }

      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new ValidationError('Invalid file type. Only JPEG, PNG, and WebP are allowed');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new ValidationError('File size must be less than 5MB');
      }

      const avatarUrl = await this.fileService.uploadAvatar(userId, file);

      const response: ApiResponse<{ avatarUrl: string }> = {
        success: true,
        data: { avatarUrl },
        message: 'Avatar uploaded successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error uploading avatar:', error);
      throw error;
    }
  };

  /**
   * Delete user avatar
   */
  public deleteAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('User not authenticated');
      }

      await this.fileService.deleteAvatar(userId);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Avatar deleted successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error deleting avatar:', error);
      throw error;
    }
  };

  /**
   * Upload user resume
   */
  public uploadResume = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const file = req.file;

      if (!userId) {
        throw new ForbiddenError('User not authenticated');
      }

      if (!file) {
        throw new ValidationError('Resume file is required');
      }

      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new ValidationError('Invalid file type. Only PDF and DOC/DOCX are allowed');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new ValidationError('File size must be less than 10MB');
      }

      const resumeUrl = await this.fileService.uploadResume(userId, file);

      const response: ApiResponse<{ resumeUrl: string }> = {
        success: true,
        data: { resumeUrl },
        message: 'Resume uploaded successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error uploading resume:', error);
      throw error;
    }
  };

  /**
   * Get user resume
   */
  public getResume = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('User not authenticated');
      }

      const resumeUrl = await this.fileService.getResume(userId);

      const response: ApiResponse<{ resumeUrl: string }> = {
        success: true,
        data: { resumeUrl },
        message: 'Resume retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting resume:', error);
      throw error;
    }
  };

  /**
   * Delete user resume
   */
  public deleteResume = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ForbiddenError('User not authenticated');
      }

      await this.fileService.deleteResume(userId);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Resume deleted successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error deleting resume:', error);
      throw error;
    }
  };

  /**
   * Get user's applications
   */
  public getUserApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.id;

      // Users can only view their own applications unless they're admin
      if (id !== currentUserId && req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const { page = 1, limit = 20, status } = req.query;

      const applications = await this.userService.getUserApplications(id, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as string
      });

      const response: ApiResponse<any> = {
        success: true,
        data: applications,
        message: 'User applications retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting user applications:', error);
      throw error;
    }
  };

  /**
   * Get user's job postings (for employers)
   */
  public getUserJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.id;

      // Users can only view their own jobs unless they're admin
      if (id !== currentUserId && req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const { page = 1, limit = 20, status } = req.query;

      const jobs = await this.userService.getUserJobs(id, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as string
      });

      const response: ApiResponse<any> = {
        success: true,
        data: jobs,
        message: 'User jobs retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting user jobs:', error);
      throw error;
    }
  };

  /**
   * Get user's job matches
   */
  public getUserMatches = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.id;

      // Users can only view their own matches unless they're admin
      if (id !== currentUserId && req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const { page = 1, limit = 20, minScore } = req.query;

      const matches = await this.userService.getUserMatches(id, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        minScore: minScore ? parseFloat(minScore as string) : undefined
      });

      const response: ApiResponse<any> = {
        success: true,
        data: matches,
        message: 'User matches retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting user matches:', error);
      throw error;
    }
  };

  /**
   * Get user's notifications
   */
  public getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.id;

      // Users can only view their own notifications unless they're admin
      if (id !== currentUserId && req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const { page = 1, limit = 20, type, read } = req.query;

      const notifications = await this.userService.getUserNotifications(id, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        type: type as string,
        read: read ? read === 'true' : undefined
      });

      const response: ApiResponse<any> = {
        success: true,
        data: notifications,
        message: 'User notifications retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting user notifications:', error);
      throw error;
    }
  };

  /**
   * Update user's notification preferences
   */
  public updateNotificationPreferences = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.id;
      const preferences = req.body;

      // Users can only update their own preferences unless they're admin
      if (id !== currentUserId && req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const updatedPreferences = await this.userService.updateNotificationPreferences(id, preferences);

      const response: ApiResponse<any> = {
        success: true,
        data: updatedPreferences,
        message: 'Notification preferences updated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating notification preferences:', error);
      throw error;
    }
  };

  /**
   * Get user analytics
   */
  public getUserAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.id;

      // Users can only view their own analytics unless they're admin
      if (id !== currentUserId && req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const analytics = await this.userService.getUserAnalytics(id);

      const response: ApiResponse<any> = {
        success: true,
        data: analytics,
        message: 'User analytics retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting user analytics:', error);
      throw error;
    }
  };

  /**
   * Deactivate user account
   */
  public deactivateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.id;

      // Users can only deactivate their own account unless they're admin
      if (id !== currentUserId && req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      await this.userService.deactivateUser(id);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Account deactivated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error deactivating account:', error);
      throw error;
    }
  };

  /**
   * Delete user account (admin only)
   */
  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Admin access required');
      }

      await this.userService.deleteUser(id);

      const response: ApiResponse<null> = {
        success: true,
        message: 'User deleted successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  };
}
