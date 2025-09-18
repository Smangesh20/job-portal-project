import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';
import { CacheService } from '@/utils/redis';
import { NotFoundError, ValidationError } from '@ask-ya-cham/types';

export class UserService {
  private prisma: PrismaClient;
  private cacheService: CacheService;

  constructor() {
    this.prisma = new PrismaClient();
    this.cacheService = new CacheService();
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<any> {
    try {
      // Check cache first
      const cacheKey = `user:${userId}`;
      const cachedUser = await this.cacheService.get(cacheKey);
      
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          preferences: true,
          _count: {
            select: {
              applications: true,
              jobs: true,
              notifications: true
            }
          }
        }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Cache user data for 1 hour
      await this.cacheService.set(cacheKey, JSON.stringify(user), 3600);

      return user;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Update user - Enterprise-level implementation
   */
  async updateUser(userId: string, updateData: any, currentUserId?: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          preferences: true
        }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Security check - users can only update their own profile unless admin
      if (currentUserId && currentUserId !== userId) {
        const currentUser = await this.prisma.user.findUnique({
          where: { id: currentUserId },
          select: { role: true }
        });
        
        if (!currentUser || currentUser.role !== 'ADMIN') {
          throw new ForbiddenError('Access denied');
        }
      }

      // Validate and sanitize update data
      const sanitizedData = this.sanitizeUserUpdateData(updateData);

      // Check for sensitive field changes that require additional verification
      const sensitiveFields = ['email', 'phone', 'password'];
      const hasSensitiveChanges = sensitiveFields.some(field => 
        sanitizedData[field] && sanitizedData[field] !== user[field]
      );

      if (hasSensitiveChanges) {
        // Log security event for sensitive changes
        await this.logSecurityEvent({
          userId: currentUserId || userId,
          type: 'SENSITIVE_DATA_CHANGED',
          severity: 'MEDIUM',
          description: 'User attempted to change sensitive information',
          ipAddress: '',
          userAgent: '',
          metadata: {
            changedFields: sensitiveFields.filter(field => 
              sanitizedData[field] && sanitizedData[field] !== user[field]
            ),
            targetUserId: userId
          }
        });
      }

      // Update user with transaction for data consistency
      const updatedUser = await this.prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            ...sanitizedData,
            updatedAt: new Date()
          },
          include: {
            profile: true,
            preferences: true,
            _count: {
              select: {
                applications: true,
                jobs: true,
                notifications: true
              }
            }
          }
        });

        // If email was changed, mark as unverified and send verification email
        if (sanitizedData.email && sanitizedData.email !== user.email) {
          const verificationToken = this.generateEmailVerificationToken(sanitizedData.email);
          
          await tx.user.update({
            where: { id: userId },
            data: {
              isVerified: false,
              emailVerificationToken: verificationToken
            }
          });

          // Send verification email
          await this.emailService.sendEmailVerificationEmail(
            sanitizedData.email,
            updatedUser.firstName,
            verificationToken
          );
        }

        return updatedUser;
      });

      // Invalidate cache
      await this.cacheService.del(`user:${userId}`);

      // Log profile update
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'PROFILE_UPDATED',
          description: 'User profile updated',
          metadata: { 
            updatedFields: Object.keys(sanitizedData),
            updatedBy: currentUserId || userId,
            timestamp: new Date().toISOString()
          }
        }
      });

      // Send notification about profile update
      if (currentUserId && currentUserId !== userId) {
        await this.sendNotification({
          userId: userId,
          type: 'PROFILE_UPDATED',
          title: 'Profile Updated',
          message: 'Your profile has been updated by an administrator.',
          priority: 'MEDIUM'
        });
      }

      return updatedUser;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Sanitize user update data
   */
  private sanitizeUserUpdateData(data: any): any {
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'profileImage', 'bio',
      'location', 'website', 'linkedinUrl', 'githubUrl', 'twitterUrl',
      'email', 'isActive', 'role'
    ];

    const sanitized: any = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        sanitized[field] = data[field];
      }
    }

    // Sanitize string fields
    if (sanitized.firstName) {
      sanitized.firstName = sanitized.firstName.trim();
    }
    if (sanitized.lastName) {
      sanitized.lastName = sanitized.lastName.trim();
    }
    if (sanitized.bio) {
      sanitized.bio = sanitized.bio.trim().substring(0, 1000); // Limit bio length
    }

    return sanitized;
  }

  /**
   * Generate email verification token
   */
  private generateEmailVerificationToken(email: string): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Log security event
   */
  private async logSecurityEvent(event: any): Promise<void> {
    try {
      await this.prisma.securityEvent.create({
        data: {
          userId: event.userId,
          type: event.type,
          severity: event.severity,
          description: event.description,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          metadata: event.metadata
        }
      });
    } catch (error) {
      logger.error('Error logging security event:', error);
    }
  }

  /**
   * Send notification
   */
  private async sendNotification(notification: any): Promise<void> {
    try {
      await this.prisma.notification.create({
        data: {
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          read: false
        }
      });
    } catch (error) {
      logger.error('Error sending notification:', error);
    }
  }

  /**
   * Get user applications
   */
  async getUserApplications(userId: string, options: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<any> {
    try {
      const { page, limit, status } = options;
      const skip = (page - 1) * limit;

      const where: any = { userId };

      if (status) {
        where.status = status;
      }

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
                salary: true
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
      logger.error('Error getting user applications:', error);
      throw error;
    }
  }

  /**
   * Get user jobs (for employers)
   */
  async getUserJobs(userId: string, options: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<any> {
    try {
      const { page, limit, status } = options;
      const skip = (page - 1) * limit;

      const where: any = { employerId: userId };

      if (status) {
        where.status = status;
      }

      const [jobs, total] = await Promise.all([
        this.prisma.job.findMany({
          where,
          include: {
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
      logger.error('Error getting user jobs:', error);
      throw error;
    }
  }

  /**
   * Get user matches
   */
  async getUserMatches(userId: string, options: {
    page: number;
    limit: number;
    minScore?: number;
  }): Promise<any> {
    try {
      const { page, limit, minScore } = options;
      const skip = (page - 1) * limit;

      const where: any = { userId };

      if (minScore) {
        where.matchScore = { gte: minScore };
      }

      const [matches, total] = await Promise.all([
        this.prisma.jobMatch.findMany({
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
                requiredSkills: true
              }
            }
          },
          orderBy: { matchScore: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.jobMatch.count({ where })
      ]);

      return {
        matches,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting user matches:', error);
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, options: {
    page: number;
    limit: number;
    type?: string;
    read?: boolean;
  }): Promise<any> {
    try {
      const { page, limit, type, read } = options;
      const skip = (page - 1) * limit;

      const where: any = { userId };

      if (type) {
        where.type = type;
      }

      if (read !== undefined) {
        where.read = read;
      }

      const [notifications, total] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.notification.count({ where })
      ]);

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(userId: string, preferences: any): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { preferences: true }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const updatedPreferences = await this.prisma.userPreferences.update({
        where: { userId },
        data: {
          ...preferences,
          updatedAt: new Date()
        }
      });

      // Invalidate cache
      await this.cacheService.del(`user:${userId}`);

      return updatedPreferences;
    } catch (error) {
      logger.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId: string): Promise<any> {
    try {
      const cacheKey = `user_analytics:${userId}`;
      const cachedAnalytics = await this.cacheService.get(cacheKey);
      
      if (cachedAnalytics) {
        return JSON.parse(cachedAnalytics);
      }

      const [
        totalApplications,
        applicationsByStatus,
        totalJobs,
        totalMatches,
        profileViews,
        recentActivity
      ] = await Promise.all([
        this.prisma.application.count({ where: { userId } }),
        this.prisma.application.groupBy({
          by: ['status'],
          where: { userId },
          _count: { status: true }
        }),
        this.prisma.job.count({ where: { employerId: userId } }),
        this.prisma.jobMatch.count({ where: { userId } }),
        this.prisma.profileView.count({ where: { viewedUserId: userId } }),
        this.prisma.activityLog.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10
        })
      ]);

      const analytics = {
        overview: {
          totalApplications,
          totalJobs,
          totalMatches,
          profileViews
        },
        applications: {
          byStatus: applicationsByStatus.reduce((acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
          }, {} as Record<string, number>)
        },
        recentActivity
      };

      // Cache analytics for 1 hour
      await this.cacheService.set(cacheKey, JSON.stringify(analytics), 3600);

      return analytics;
    } catch (error) {
      logger.error('Error getting user analytics:', error);
      throw error;
    }
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          deactivatedAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Invalidate all user sessions
      await this.cacheService.del(`user_sessions:${userId}`);

      // Log deactivation
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'ACCOUNT_DEACTIVATED',
          description: 'User account deactivated'
        }
      });
    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Soft delete - mark as deleted instead of actually deleting
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date(),
          email: `deleted_${Date.now()}_${user.email}`, // Make email unique for potential reuse
          isActive: false
        }
      });

      // Invalidate cache
      await this.cacheService.del(`user:${userId}`);

      // Log deletion
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'ACCOUNT_DELETED',
          description: 'User account deleted by admin'
        }
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Search users (admin only)
   */
  async searchUsers(query: string, options: {
    page: number;
    limit: number;
    role?: string;
    isActive?: boolean;
  }): Promise<any> {
    try {
      const { page, limit, role, isActive } = options;
      const skip = (page - 1) * limit;

      const where: any = {
        isDeleted: false,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      };

      if (role) {
        where.role = role;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
            lastLoginAt: true
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.user.count({ where })
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Get user statistics (admin only)
   */
  async getUserStatistics(): Promise<any> {
    try {
      const cacheKey = 'user_statistics';
      const cachedStats = await this.cacheService.get(cacheKey);
      
      if (cachedStats) {
        return JSON.parse(cachedStats);
      }

      const [
        totalUsers,
        activeUsers,
        usersByRole,
        usersByMonth,
        verifiedUsers
      ] = await Promise.all([
        this.prisma.user.count({ where: { isDeleted: false } }),
        this.prisma.user.count({ where: { isActive: true, isDeleted: false } }),
        this.prisma.user.groupBy({
          by: ['role'],
          where: { isDeleted: false },
          _count: { role: true }
        }),
        this.prisma.user.groupBy({
          by: ['createdAt'],
          where: { isDeleted: false },
          _count: { createdAt: true }
        }),
        this.prisma.user.count({ where: { isVerified: true, isDeleted: false } })
      ]);

      const statistics = {
        totalUsers,
        activeUsers,
        verifiedUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count.role;
          return acc;
        }, {} as Record<string, number>),
        usersByMonth: usersByMonth.map(item => ({
          month: item.createdAt.toISOString().slice(0, 7),
          count: item._count.createdAt
        }))
      };

      // Cache statistics for 1 hour
      await this.cacheService.set(cacheKey, JSON.stringify(statistics), 3600);

      return statistics;
    } catch (error) {
      logger.error('Error getting user statistics:', error);
      throw error;
    }
  }
}
