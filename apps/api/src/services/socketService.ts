import { Server as SocketIOServer } from 'socket.io';
import { logger } from '@/utils/logger';
import { RedisClient } from '@/utils/redis';

export class SocketService {
  private io: SocketIOServer;
  private redisClient: RedisClient;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(io: SocketIOServer) {
    this.io = io;
    this.redisClient = new RedisClient();
    this.setupSocketHandlers();
  }

  /**
   * Setup socket event handlers
   */
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', async (data) => {
        try {
          const { userId, token } = data;
          
          // Verify token and get user info
          const user = await this.authenticateUser(token);
          if (user) {
            socket.userId = userId;
            this.connectedUsers.set(userId, socket.id);
            
            // Join user to their personal room
            socket.join(`user:${userId}`);
            
            // Join user to role-based rooms
            socket.join(`role:${user.role}`);
            
            // Send authentication success
            socket.emit('authenticated', { userId, user });
            
            // Notify other connections of user online status
            socket.broadcast.to(`user:${userId}`).emit('user_online', { userId });
            
            logger.info(`User ${userId} authenticated and connected`);
          } else {
            socket.emit('authentication_error', { message: 'Invalid token' });
            socket.disconnect();
          }
        } catch (error) {
          logger.error('Authentication error:', error);
          socket.emit('authentication_error', { message: 'Authentication failed' });
          socket.disconnect();
        }
      });

      // Handle joining conversation rooms
      socket.on('join_conversation', (data) => {
        try {
          const { conversationId } = data;
          socket.join(`conversation:${conversationId}`);
          logger.info(`User ${socket.userId} joined conversation ${conversationId}`);
        } catch (error) {
          logger.error('Error joining conversation:', error);
        }
      });

      // Handle leaving conversation rooms
      socket.on('leave_conversation', (data) => {
        try {
          const { conversationId } = data;
          socket.leave(`conversation:${conversationId}`);
          logger.info(`User ${socket.userId} left conversation ${conversationId}`);
        } catch (error) {
          logger.error('Error leaving conversation:', error);
        }
      });

      // Handle real-time messaging
      socket.on('send_message', async (data) => {
        try {
          const { conversationId, message, messageType = 'text' } = data;
          
          // Save message to database
          const savedMessage = await this.saveMessage({
            conversationId,
            senderId: socket.userId,
            content: message,
            messageType,
            timestamp: new Date()
          });

          // Broadcast message to conversation participants
          socket.to(`conversation:${conversationId}`).emit('new_message', {
            conversationId,
            message: savedMessage
          });

          // Send delivery confirmation
          socket.emit('message_sent', {
            messageId: savedMessage.id,
            conversationId
          });

          logger.info(`Message sent in conversation ${conversationId} by user ${socket.userId}`);
        } catch (error) {
          logger.error('Error sending message:', error);
          socket.emit('message_error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        try {
          const { conversationId } = data;
          socket.to(`conversation:${conversationId}`).emit('user_typing', {
            userId: socket.userId,
            conversationId,
            isTyping: true
          });
        } catch (error) {
          logger.error('Error handling typing start:', error);
        }
      });

      socket.on('typing_stop', (data) => {
        try {
          const { conversationId } = data;
          socket.to(`conversation:${conversationId}`).emit('user_typing', {
            userId: socket.userId,
            conversationId,
            isTyping: false
          });
        } catch (error) {
          logger.error('Error handling typing stop:', error);
        }
      });

      // Handle online status updates
      socket.on('update_status', (data) => {
        try {
          const { status } = data;
          socket.broadcast.to(`user:${socket.userId}`).emit('status_update', {
            userId: socket.userId,
            status
          });
        } catch (error) {
          logger.error('Error updating status:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        try {
          if (socket.userId) {
            this.connectedUsers.delete(socket.userId);
            
            // Notify other connections of user offline status
            socket.broadcast.to(`user:${socket.userId}`).emit('user_offline', {
              userId: socket.userId
            });
            
            logger.info(`User ${socket.userId} disconnected`);
          }
        } catch (error) {
          logger.error('Error handling disconnect:', error);
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`Socket error for user ${socket.userId}:`, error);
      });
    });
  }

  /**
   * Send notification to specific user
   */
  async sendNotification(userId: string, notification: any): Promise<void> {
    try {
      const socketId = this.connectedUsers.get(userId);
      
      if (socketId) {
        this.io.to(socketId).emit('notification', notification);
        logger.info(`Notification sent to user ${userId}`);
      } else {
        // User is offline, store notification for later delivery
        await this.storeOfflineNotification(userId, notification);
        logger.info(`Notification stored for offline user ${userId}`);
      }
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send message to conversation
   */
  async sendMessageToConversation(conversationId: string, message: any): Promise<void> {
    try {
      this.io.to(`conversation:${conversationId}`).emit('new_message', {
        conversationId,
        message
      });
      
      logger.info(`Message broadcasted to conversation ${conversationId}`);
    } catch (error) {
      logger.error('Error sending message to conversation:', error);
      throw error;
    }
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    try {
      this.io.to(`conversation:${conversationId}`).emit('user_typing', {
        userId,
        conversationId,
        isTyping
      });
    } catch (error) {
      logger.error('Error sending typing indicator:', error);
      throw error;
    }
  }

  /**
   * Send application status update
   */
  async sendApplicationStatusUpdate(userId: string, applicationData: any): Promise<void> {
    try {
      const socketId = this.connectedUsers.get(userId);
      
      if (socketId) {
        this.io.to(socketId).emit('application_status_update', applicationData);
        logger.info(`Application status update sent to user ${userId}`);
      }
    } catch (error) {
      logger.error('Error sending application status update:', error);
      throw error;
    }
  }

  /**
   * Send interview notification
   */
  async sendInterviewNotification(userId: string, interviewData: any): Promise<void> {
    try {
      const socketId = this.connectedUsers.get(userId);
      
      if (socketId) {
        this.io.to(socketId).emit('interview_notification', interviewData);
        logger.info(`Interview notification sent to user ${userId}`);
      }
    } catch (error) {
      logger.error('Error sending interview notification:', error);
      throw error;
    }
  }

  /**
   * Send job recommendation
   */
  async sendJobRecommendation(userId: string, recommendations: any[]): Promise<void> {
    try {
      const socketId = this.connectedUsers.get(userId);
      
      if (socketId) {
        this.io.to(socketId).emit('job_recommendations', {
          recommendations,
          timestamp: new Date()
        });
        logger.info(`Job recommendations sent to user ${userId}`);
      }
    } catch (error) {
      logger.error('Error sending job recommendations:', error);
      throw error;
    }
  }

  /**
   * Send system announcement
   */
  async sendSystemAnnouncement(announcement: any): Promise<void> {
    try {
      this.io.emit('system_announcement', {
        ...announcement,
        timestamp: new Date()
      });
      
      logger.info('System announcement broadcasted to all connected users');
    } catch (error) {
      logger.error('Error sending system announcement:', error);
      throw error;
    }
  }

  /**
   * Send announcement to specific role
   */
  async sendRoleAnnouncement(role: string, announcement: any): Promise<void> {
    try {
      this.io.to(`role:${role}`).emit('role_announcement', {
        role,
        ...announcement,
        timestamp: new Date()
      });
      
      logger.info(`Role announcement sent to ${role} users`);
    } catch (error) {
      logger.error('Error sending role announcement:', error);
      throw error;
    }
  }

  /**
   * Get online users count
   */
  getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get online users by role
   */
  getOnlineUsersByRole(role: string): string[] {
    // This would require additional tracking of user roles
    // For now, return empty array
    return [];
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get user's socket ID
   */
  getUserSocketId(userId: string): string | undefined {
    return this.connectedUsers.get(userId);
  }

  /**
   * Force disconnect user
   */
  async disconnectUser(userId: string, reason?: string): Promise<void> {
    try {
      const socketId = this.connectedUsers.get(userId);
      
      if (socketId) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.disconnect(true);
          this.connectedUsers.delete(userId);
          logger.info(`User ${userId} forcefully disconnected: ${reason || 'No reason provided'}`);
        }
      }
    } catch (error) {
      logger.error('Error disconnecting user:', error);
      throw error;
    }
  }

  /**
   * Broadcast to all connected users
   */
  async broadcastToAll(event: string, data: any): Promise<void> {
    try {
      this.io.emit(event, {
        ...data,
        timestamp: new Date()
      });
      
      logger.info(`Broadcast sent to all users: ${event}`);
    } catch (error) {
      logger.error('Error broadcasting to all users:', error);
      throw error;
    }
  }

  /**
   * Broadcast to specific room
   */
  async broadcastToRoom(room: string, event: string, data: any): Promise<void> {
    try {
      this.io.to(room).emit(event, {
        ...data,
        timestamp: new Date()
      });
      
      logger.info(`Broadcast sent to room ${room}: ${event}`);
    } catch (error) {
      logger.error('Error broadcasting to room:', error);
      throw error;
    }
  }

  /**
   * Authenticate user from token
   */
  private async authenticateUser(token: string): Promise<any> {
    try {
      // This would verify JWT token and return user data
      // For now, return mock data
      return {
        id: 'user123',
        role: 'CANDIDATE'
      };
    } catch (error) {
      logger.error('Error authenticating user:', error);
      return null;
    }
  }

  /**
   * Save message to database
   */
  private async saveMessage(messageData: any): Promise<any> {
    try {
      // This would save the message to the database
      // For now, return mock data
      return {
        id: `msg_${Date.now()}`,
        ...messageData,
        createdAt: new Date()
      };
    } catch (error) {
      logger.error('Error saving message:', error);
      throw error;
    }
  }

  /**
   * Store notification for offline user
   */
  private async storeOfflineNotification(userId: string, notification: any): Promise<void> {
    try {
      // Store in Redis for offline users
      const key = `offline_notifications:${userId}`;
      await this.redisClient.lpush(key, JSON.stringify(notification));
      await this.redisClient.expire(key, 86400); // Expire after 24 hours
    } catch (error) {
      logger.error('Error storing offline notification:', error);
    }
  }

  /**
   * Get offline notifications for user
   */
  async getOfflineNotifications(userId: string): Promise<any[]> {
    try {
      const key = `offline_notifications:${userId}`;
      const notifications = await this.redisClient.lrange(key, 0, -1);
      
      // Clear notifications after retrieving
      await this.redisClient.del(key);
      
      return notifications.map(notification => JSON.parse(notification));
    } catch (error) {
      logger.error('Error getting offline notifications:', error);
      return [];
    }
  }

  /**
   * Cleanup disconnected users
   */
  cleanupDisconnectedUsers(): void {
    try {
      const activeSockets = Array.from(this.io.sockets.sockets.keys());
      const connectedSocketIds = Array.from(this.connectedUsers.values());
      
      // Remove users whose sockets are no longer active
      for (const [userId, socketId] of this.connectedUsers.entries()) {
        if (!activeSockets.includes(socketId)) {
          this.connectedUsers.delete(userId);
          logger.info(`Cleaned up disconnected user: ${userId}`);
        }
      }
    } catch (error) {
      logger.error('Error cleaning up disconnected users:', error);
    }
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): any {
    try {
      return {
        totalConnections: this.io.engine.clientsCount,
        authenticatedUsers: this.connectedUsers.size,
        connectedUsers: Array.from(this.connectedUsers.keys()),
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Error getting connection stats:', error);
      return {
        totalConnections: 0,
        authenticatedUsers: 0,
        connectedUsers: [],
        timestamp: new Date()
      };
    }
  }
}
