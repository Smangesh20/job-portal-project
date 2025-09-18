import { PrismaClient } from '@prisma/client'
import { emailService } from './emailService'
import { socketService } from './socketService'
import Redis from 'ioredis'

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export interface NotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any
  priority?: NotificationPriority
  channels?: NotificationChannel[]
  scheduledAt?: Date
  expiresAt?: Date
}

export enum NotificationType {
  JOB_MATCH = 'JOB_MATCH',
  APPLICATION_UPDATE = 'APPLICATION_UPDATE',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  COMPANY_FOLLOW = 'COMPANY_FOLLOW',
  JOB_POSTED = 'JOB_POSTED',
  APPLICATION_RECEIVED = 'APPLICATION_RECEIVED',
  SYSTEM = 'SYSTEM',
  PROFILE_VIEWED = 'PROFILE_VIEWED',
  JOB_SAVED = 'JOB_SAVED',
  COMPANY_REVIEW = 'COMPANY_REVIEW',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH'
}

export interface NotificationTemplate {
  subject?: string
  htmlTemplate: string
  textTemplate: string
  emailEnabled: boolean
  smsEnabled: boolean
  pushEnabled: boolean
}

export const notificationService = {
  /**
   * Send notification to user
   */
  async sendNotification(data: NotificationData): Promise<void> {
    try {
      const {
        userId,
        type,
        title,
        message,
        data: notificationData,
        priority = NotificationPriority.MEDIUM,
        channels = [NotificationChannel.IN_APP],
        scheduledAt,
        expiresAt
      } = data

      // Get user preferences
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          emailNotifications: true,
          smsNotifications: true,
          phone: true
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Create notification record
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: notificationData,
          read: false,
          expiresAt
        }
      })

      // Send through different channels
      const promises: Promise<any>[] = []

      // In-app notification
      if (channels.includes(NotificationChannel.IN_APP)) {
        promises.push(this.sendInAppNotification(notification))
      }

      // Email notification
      if (channels.includes(NotificationChannel.EMAIL) && user.emailNotifications) {
        promises.push(this.sendEmailNotification(user.email, type, title, message, notificationData))
      }

      // SMS notification
      if (channels.includes(NotificationChannel.SMS) && user.smsNotifications && user.phone) {
        promises.push(this.sendSMSNotification(user.phone, message))
      }

      // Push notification
      if (channels.includes(NotificationChannel.PUSH)) {
        promises.push(this.sendPushNotification(userId, title, message, notificationData))
      }

      await Promise.allSettled(promises)

      // Update user's last notification time
      await prisma.user.update({
        where: { id: userId },
        data: { updatedAt: new Date() }
      })

    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  },

  /**
   * Send in-app notification
   */
  async sendInAppNotification(notification: any): Promise<void> {
    try {
      // Send real-time notification via WebSocket
      await socketService.sendNotification(notification.userId, {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt,
        read: notification.read
      })

      // Store in Redis for quick access
      await redis.lpush(`notifications:${notification.userId}`, JSON.stringify(notification))
      await redis.ltrim(`notifications:${notification.userId}`, 0, 99) // Keep last 100 notifications

    } catch (error) {
      console.error('Error sending in-app notification:', error)
    }
  },

  /**
   * Send email notification
   */
  async sendEmailNotification(
    email: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    try {
      const template = this.getNotificationTemplate(type)
      
      if (!template.emailEnabled) {
        return
      }

      const subject = template.subject || title
      const htmlContent = this.renderTemplate(template.htmlTemplate, { title, message, data })
      const textContent = this.renderTemplate(template.textTemplate, { title, message, data })

      await emailService.sendEmail({
        to: email,
        subject,
        html: htmlContent,
        text: textContent
      })

    } catch (error) {
      console.error('Error sending email notification:', error)
    }
  },

  /**
   * Send SMS notification
   */
  async sendSMSNotification(phone: string, message: string): Promise<void> {
    try {
      // Implement SMS service integration (Twilio, AWS SNS, etc.)
      console.log(`SMS to ${phone}: ${message}`)
      
      // For now, just log the SMS
      // In production, integrate with SMS service
      
    } catch (error) {
      console.error('Error sending SMS notification:', error)
    }
  },

  /**
   * Send push notification
   */
  async sendPushNotification(
    userId: string,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    try {
      // Get user's push tokens
      const pushTokens = await redis.smembers(`push_tokens:${userId}`)
      
      if (pushTokens.length === 0) {
        return
      }

      // Send push notifications to all devices
      for (const token of pushTokens) {
        await this.sendToPushService(token, title, message, data)
      }

    } catch (error) {
      console.error('Error sending push notification:', error)
    }
  },

  /**
   * Send to push service (FCM, APNS, etc.)
   */
  async sendToPushService(token: string, title: string, message: string, data?: any): Promise<void> {
    try {
      // Implement push notification service integration
      console.log(`Push to ${token}: ${title} - ${message}`)
      
      // In production, integrate with FCM, APNS, or other push services
      
    } catch (error) {
      console.error('Error sending to push service:', error)
    }
  },

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit
      
      const where: any = { userId }
      if (unreadOnly) {
        where.read = false
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.notification.count({ where })
      ])

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }

    } catch (error) {
      console.error('Error getting user notifications:', error)
      throw error
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId
        },
        data: {
          read: true,
          readAt: new Date()
        }
      })

      // Update Redis cache
      const notifications = await redis.lrange(`notifications:${userId}`, 0, -1)
      const updatedNotifications = notifications.map(n => {
        const notification = JSON.parse(n)
        if (notification.id === notificationId) {
          notification.read = true
          notification.readAt = new Date().toISOString()
        }
        return JSON.stringify(notification)
      })
      
      if (updatedNotifications.length > 0) {
        await redis.del(`notifications:${userId}`)
        await redis.lpush(`notifications:${userId}`, ...updatedNotifications)
      }

    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: {
          userId,
          read: false
        },
        data: {
          read: true,
          readAt: new Date()
        }
      })

      // Clear Redis cache
      await redis.del(`notifications:${userId}`)

    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      await prisma.notification.deleteMany({
        where: {
          id: notificationId,
          userId
        }
      })

      // Update Redis cache
      const notifications = await redis.lrange(`notifications:${userId}`, 0, -1)
      const filteredNotifications = notifications.filter(n => {
        const notification = JSON.parse(n)
        return notification.id !== notificationId
      })
      
      if (filteredNotifications.length !== notifications.length) {
        await redis.del(`notifications:${userId}`)
        if (filteredNotifications.length > 0) {
          await redis.lpush(`notifications:${userId}`, ...filteredNotifications)
        }
      }

    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  },

  /**
   * Get notification template
   */
  getNotificationTemplate(type: NotificationType): NotificationTemplate {
    const templates: Record<NotificationType, NotificationTemplate> = {
      [NotificationType.JOB_MATCH]: {
        subject: 'New Job Match Found!',
        htmlTemplate: `
          <h2>🎯 New Job Match Found!</h2>
          <p>{{message}}</p>
          <p>Match Score: {{data.matchScore}}%</p>
          <a href="/jobs/{{data.jobId}}">View Job Details</a>
        `,
        textTemplate: `New Job Match: {{message}} (Score: {{data.matchScore}}%)`,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true
      },
      [NotificationType.APPLICATION_UPDATE]: {
        subject: 'Application Status Update',
        htmlTemplate: `
          <h2>📋 Application Update</h2>
          <p>{{message}}</p>
          <a href="/applications/{{data.applicationId}}">View Application</a>
        `,
        textTemplate: `Application Update: {{message}}`,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true
      },
      [NotificationType.INTERVIEW_SCHEDULED]: {
        subject: 'Interview Scheduled',
        htmlTemplate: `
          <h2>📅 Interview Scheduled</h2>
          <p>{{message}}</p>
          <p>Date: {{data.interviewDate}}</p>
          <p>Time: {{data.interviewTime}}</p>
        `,
        textTemplate: `Interview Scheduled: {{message}}`,
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true
      },
      [NotificationType.MESSAGE_RECEIVED]: {
        subject: 'New Message Received',
        htmlTemplate: `
          <h2>💬 New Message</h2>
          <p>{{message}}</p>
          <a href="/messages">View Message</a>
        `,
        textTemplate: `New Message: {{message}}`,
        emailEnabled: false,
        smsEnabled: false,
        pushEnabled: true
      },
      [NotificationType.COMPANY_FOLLOW]: {
        subject: 'Company Followed You',
        htmlTemplate: `
          <h2>👥 New Follower</h2>
          <p>{{message}}</p>
        `,
        textTemplate: `New Follower: {{message}}`,
        emailEnabled: false,
        smsEnabled: false,
        pushEnabled: false
      },
      [NotificationType.JOB_POSTED]: {
        subject: 'New Job Posted',
        htmlTemplate: `
          <h2>💼 New Job Posted</h2>
          <p>{{message}}</p>
          <a href="/jobs/{{data.jobId}}">View Job</a>
        `,
        textTemplate: `New Job: {{message}}`,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true
      },
      [NotificationType.APPLICATION_RECEIVED]: {
        subject: 'New Application Received',
        htmlTemplate: `
          <h2>📝 New Application</h2>
          <p>{{message}}</p>
          <a href="/applications/{{data.applicationId}}">View Application</a>
        `,
        textTemplate: `New Application: {{message}}`,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true
      },
      [NotificationType.SYSTEM]: {
        subject: 'System Notification',
        htmlTemplate: `
          <h2>🔔 System Update</h2>
          <p>{{message}}</p>
        `,
        textTemplate: `System: {{message}}`,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: false
      },
      [NotificationType.PROFILE_VIEWED]: {
        subject: 'Profile Viewed',
        htmlTemplate: `
          <h2>👀 Profile Viewed</h2>
          <p>{{message}}</p>
        `,
        textTemplate: `Profile Viewed: {{message}}`,
        emailEnabled: false,
        smsEnabled: false,
        pushEnabled: false
      },
      [NotificationType.JOB_SAVED]: {
        subject: 'Job Saved',
        htmlTemplate: `
          <h2>⭐ Job Saved</h2>
          <p>{{message}}</p>
        `,
        textTemplate: `Job Saved: {{message}}`,
        emailEnabled: false,
        smsEnabled: false,
        pushEnabled: false
      },
      [NotificationType.COMPANY_REVIEW]: {
        subject: 'New Company Review',
        htmlTemplate: `
          <h2>⭐ New Review</h2>
          <p>{{message}}</p>
        `,
        textTemplate: `New Review: {{message}}`,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true
      },
      [NotificationType.PASSWORD_CHANGED]: {
        subject: 'Password Changed',
        htmlTemplate: `
          <h2>🔒 Password Changed</h2>
          <p>{{message}}</p>
        `,
        textTemplate: `Password Changed: {{message}}`,
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true
      },
      [NotificationType.EMAIL_VERIFIED]: {
        subject: 'Email Verified',
        htmlTemplate: `
          <h2>✅ Email Verified</h2>
          <p>{{message}}</p>
        `,
        textTemplate: `Email Verified: {{message}}`,
        emailEnabled: false,
        smsEnabled: false,
        pushEnabled: false
      },
      [NotificationType.TWO_FACTOR_ENABLED]: {
        subject: 'Two-Factor Authentication Enabled',
        htmlTemplate: `
          <h2>🔐 2FA Enabled</h2>
          <p>{{message}}</p>
        `,
        textTemplate: `2FA Enabled: {{message}}`,
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true
      }
    }

    return templates[type] || templates[NotificationType.SYSTEM]
  },

  /**
   * Render template with data
   */
  renderTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  },

  /**
   * Register push token
   */
  async registerPushToken(userId: string, token: string): Promise<void> {
    try {
      await redis.sadd(`push_tokens:${userId}`, token)
    } catch (error) {
      console.error('Error registering push token:', error)
      throw error
    }
  },

  /**
   * Unregister push token
   */
  async unregisterPushToken(userId: string, token: string): Promise<void> {
    try {
      await redis.srem(`push_tokens:${userId}`, token)
    } catch (error) {
      console.error('Error unregistering push token:', error)
      throw error
    }
  },

  /**
   * Get notification statistics - Enterprise-level implementation
   */
  async getNotificationStats(userId: string): Promise<any> {
    try {
      const [total, unread, byType, byPriority, recentActivity] = await Promise.all([
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, read: false } }),
        prisma.notification.groupBy({
          by: ['type'],
          where: { userId },
          _count: { type: true }
        }),
        prisma.notification.groupBy({
          by: ['priority'],
          where: { userId },
          _count: { priority: true }
        }),
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            title: true,
            read: true,
            createdAt: true,
            priority: true
          }
        })
      ])

      // Calculate engagement metrics
      const engagementMetrics = await this.calculateEngagementMetrics(userId);

      return {
        total,
        unread,
        read: total - unread,
        byType: byType.reduce((acc, item) => {
          acc[item.type] = item._count.type
          return acc
        }, {} as Record<string, number>),
        byPriority: byPriority.reduce((acc, item) => {
          acc[item.priority] = item._count.priority
          return acc
        }, {} as Record<string, number>),
        recentActivity,
        engagement: engagementMetrics,
        summary: {
          unreadPercentage: total > 0 ? Math.round((unread / total) * 100) : 0,
          averageReadTime: engagementMetrics.averageReadTime,
          mostActiveType: this.getMostActiveType(byType),
          lastNotificationTime: recentActivity[0]?.createdAt || null
        }
      }
    } catch (error) {
      console.error('Error getting notification stats:', error)
      throw error
    }
  }

  /**
   * Calculate engagement metrics
   */
  private async calculateEngagementMetrics(userId: string): Promise<any> {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        select: {
          id: true,
          read: true,
          readAt: true,
          createdAt: true,
          type: true,
          priority: true
        }
      })

      const readNotifications = notifications.filter(n => n.read && n.readAt)
      const averageReadTime = readNotifications.length > 0 
        ? readNotifications.reduce((sum, n) => {
            const readTime = n.readAt!.getTime() - n.createdAt.getTime()
            return sum + readTime
          }, 0) / readNotifications.length
        : 0

      const readRate = notifications.length > 0 
        ? (readNotifications.length / notifications.length) * 100 
        : 0

      const highPriorityReadRate = notifications.filter(n => n.priority === 'HIGH' && n.read).length /
        Math.max(notifications.filter(n => n.priority === 'HIGH').length, 1) * 100

      return {
        averageReadTime: Math.round(averageReadTime / 1000 / 60), // in minutes
        readRate: Math.round(readRate),
        highPriorityReadRate: Math.round(highPriorityReadRate),
        totalNotifications: notifications.length,
        readNotifications: readNotifications.length
      }
    } catch (error) {
      console.error('Error calculating engagement metrics:', error)
      return {
        averageReadTime: 0,
        readRate: 0,
        highPriorityReadRate: 0,
        totalNotifications: 0,
        readNotifications: 0
      }
    }
  }

  /**
   * Get most active notification type
   */
  private getMostActiveType(byType: any[]): string | null {
    if (byType.length === 0) return null
    
    return byType.reduce((max, item) => 
      item._count.type > max._count.type ? item : max
    ).type
  },

  /**
   * Clean up old notifications
   */
  async cleanupOldNotifications(daysOld: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          read: true
        }
      })

      console.log(`Cleaned up notifications older than ${daysOld} days`)
    } catch (error) {
      console.error('Error cleaning up old notifications:', error)
    }
  }
}