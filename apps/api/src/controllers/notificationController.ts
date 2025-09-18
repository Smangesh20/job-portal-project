import { Request, Response } from 'express'
import { notificationService, NotificationType, NotificationChannel } from '@/services/notificationService'
import { AuthenticatedRequest } from '@/types/auth'

export const notificationController = {
  /**
   * Get user notifications
   */
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id
      const { page = 1, limit = 20, unreadOnly = false } = req.query

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const result = await notificationService.getUserNotifications(
        userId,
        Number(page),
        Number(limit),
        Boolean(unreadOnly)
      )

      res.json({
        success: true,
        data: result
      })
    } catch (error) {
      console.error('Error getting notifications:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get notification statistics
   */
  async getNotificationStats(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const stats = await notificationService.getNotificationStats(userId)

      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      console.error('Error getting notification stats:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id
      const { notificationId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      await notificationService.markAsRead(notificationId, userId)

      res.json({
        success: true,
        message: 'Notification marked as read'
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      await notificationService.markAllAsRead(userId)

      res.json({
        success: true,
        message: 'All notifications marked as read'
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id
      const { notificationId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      await notificationService.deleteNotification(notificationId, userId)

      res.json({
        success: true,
        message: 'Notification deleted'
      })
    } catch (error) {
      console.error('Error deleting notification:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Register push notification token
   */
  async registerPushToken(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id
      const { token, platform } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      await notificationService.registerPushToken(userId, token)

      res.json({
        success: true,
        message: 'Push token registered successfully'
      })
    } catch (error) {
      console.error('Error registering push token:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Unregister push notification token
   */
  async unregisterPushToken(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id
      const { token } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      await notificationService.unregisterPushToken(userId, token)

      res.json({
        success: true,
        message: 'Push token unregistered successfully'
      })
    } catch (error) {
      console.error('Error unregistering push token:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Get notification preferences
   */
  async getPreferences(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      // Get user preferences from database
      const { prisma } = await import('@prisma/client')
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          emailNotifications: true,
          smsNotifications: true
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Check if user has push tokens registered
      const Redis = (await import('ioredis')).default
      const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
      const pushTokens = await redis.smembers(`push_tokens:${userId}`)
      const pushNotifications = pushTokens.length > 0

      res.json({
        success: true,
        data: {
          emailNotifications: user.emailNotifications,
          smsNotifications: user.smsNotifications,
          pushNotifications
        }
      })
    } catch (error) {
      console.error('Error getting notification preferences:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id
      const { emailNotifications, smsNotifications, pushNotifications } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      // Update user preferences in database
      const { prisma } = await import('@prisma/client')
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          emailNotifications: emailNotifications !== undefined ? emailNotifications : undefined,
          smsNotifications: smsNotifications !== undefined ? smsNotifications : undefined
        },
        select: {
          emailNotifications: true,
          smsNotifications: true
        }
      })

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: {
          emailNotifications: updatedUser.emailNotifications,
          smsNotifications: updatedUser.smsNotifications,
          pushNotifications
        }
      })
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  },

  /**
   * Send test notification
   */
  async sendTestNotification(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id
      const { type, title, message, channels, data } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      // Validate notification type
      if (!Object.values(NotificationType).includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification type'
        })
      }

      // Validate channels
      if (channels && !Array.isArray(channels)) {
        return res.status(400).json({
          success: false,
          message: 'Channels must be an array'
        })
      }

      const validChannels = channels?.filter((channel: string) => 
        Object.values(NotificationChannel).includes(channel as NotificationChannel)
      ) || [NotificationChannel.IN_APP]

      await notificationService.sendNotification({
        userId,
        type: type as NotificationType,
        title,
        message,
        data,
        channels: validChannels as NotificationChannel[]
      })

      res.json({
        success: true,
        message: 'Test notification sent successfully'
      })
    } catch (error) {
      console.error('Error sending test notification:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      })
    }
  }
}
