import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { AuthUser, LoginRequest, RegisterRequest, SecurityEvent } from '@ask-ya-cham/types';
import { logger } from '@/utils/logger';
import { CacheService } from '@/utils/redis';
import { EmailService } from './emailService';
import { 
  AuthenticationError, 
  ValidationError, 
  EmailNotVerifiedError,
  AccountLockedError 
} from '@ask-ya-cham/types';

export class AuthService {
  private prisma: PrismaClient;
  private cacheService: CacheService;
  private emailService: EmailService;

  constructor() {
    this.prisma = new PrismaClient();
    this.cacheService = new CacheService();
    this.emailService = new EmailService();
  }

  /**
   * Create a new user
   */
  async createUser(userData: RegisterRequest): Promise<AuthUser> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Generate email verification token
      const emailVerificationToken = this.generateEmailVerificationToken(userData.email);

      // Create user in database
      const user = await this.prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'CANDIDATE',
          emailVerificationToken,
          preferences: {
            notifications: true,
            emailMarketing: false,
            smsNotifications: false
          }
        }
      });

      // Send verification email
      await this.emailService.sendEmailVerificationEmail(
        user.email,
        user.firstName,
        emailVerificationToken
      );

      // Log security event
      await this.logSecurityEvent({
        userId: user.id,
        type: 'USER_CREATED',
        severity: 'LOW',
        description: 'New user account created',
        ipAddress: '',
        userAgent: '',
        metadata: { email: user.email }
      });

      return this.mapUserToAuthUser(user);
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new ValidationError('Failed to create user account');
    }
  }

  /**
   * Authenticate user with email and password
   */
  async authenticateUser(email: string, password: string): Promise<AuthUser | null> {
    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return null;
      }

      // Check if account is locked
      const lockoutCheck = await this.checkAccountLockout(user.id);
      if (lockoutCheck.isLocked) {
        throw new AccountLockedError('Account is temporarily locked due to suspicious activity');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        // Log failed login attempt
        await this.logFailedLoginAttempt(user.id);
        return null;
      }

      // Clear failed login attempts on successful login
      await this.cacheService.del(`failed_logins:${user.id}`);

      return this.mapUserToAuthUser(user);
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }

  /**
   * Generate JWT tokens
   */
  generateTokens(user: AuthUser): { accessToken: string; refreshToken: string } {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      issuer: 'ask-ya-cham'
    });

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: 'ask-ya-cham'
      }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  /**
   * Create user session
   */
  async createSession(userId: string, deviceInfo: any): Promise<string> {
    const sessionId = crypto.randomUUID();
    const sessionData = {
      userId,
      deviceInfo,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    // Store session in Redis with 7 days expiration
    await this.cacheService.set(`session:${sessionId}`, sessionData, 604800);

    // Add session to user's active sessions
    await this.cacheService.sadd(`user_sessions:${userId}`, sessionId);

    return sessionId;
  }

  /**
   * Validate session
   */
  async validateSession(sessionId: string): Promise<any> {
    const sessionData = await this.cacheService.get(`session:${sessionId}`);
    if (!sessionData) {
      throw new AuthenticationError('Invalid or expired session');
    }

    // Update last activity
    sessionData.lastActivity = new Date().toISOString();
    await this.cacheService.set(`session:${sessionId}`, sessionData, 604800);

    return sessionData;
  }

  /**
   * Invalidate session
   */
  async invalidateSession(sessionId: string): Promise<void> {
    const sessionData = await this.cacheService.get(`session:${sessionId}`);
    if (sessionData) {
      await this.cacheService.del(`session:${sessionId}`);
      await this.cacheService.srem(`user_sessions:${sessionData.userId}`, sessionId);
    }
  }

  /**
   * Invalidate all user sessions
   */
  async invalidateAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
    const sessions = await this.cacheService.smembers(`user_sessions:${userId}`);
    
    for (const sessionId of sessions) {
      if (sessionId !== exceptSessionId) {
        await this.invalidateSession(sessionId);
      }
    }
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        passwordChangedAt: new Date()
      }
    });

    // Log security event
    await this.logSecurityEvent({
      userId,
      type: 'PASSWORD_CHANGED',
      severity: 'HIGH',
      description: 'User password changed',
      ipAddress: '',
      userAgent: '',
      metadata: {}
    });
  }

  /**
   * Verify user password
   */
  async verifyPassword(password: string, userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      return false;
    }

    return await bcrypt.compare(password, user.password);
  }

  /**
   * Generate password reset token
   */
  generatePasswordResetToken(userId: string): string {
    const payload = {
      userId,
      type: 'password_reset',
      timestamp: Date.now()
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    });
  }

  /**
   * Verify password reset token
   */
  verifyPasswordResetToken(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new AuthenticationError('Invalid or expired reset token');
    }
  }

  /**
   * Generate email verification token
   */
  generateEmailVerificationToken(email: string): string {
    const payload = {
      email,
      type: 'email_verification',
      timestamp: Date.now()
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h'
    });
  }

  /**
   * Verify email verification token
   */
  verifyEmailToken(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (decoded.type !== 'email_verification') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new AuthenticationError('Invalid or expired verification token');
    }
  }

  /**
   * Verify user email
   */
  async verifyUserEmail(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null
      }
    });

    // Log security event
    await this.logSecurityEvent({
      userId,
      type: 'EMAIL_VERIFIED',
      severity: 'LOW',
      description: 'User email verified',
      ipAddress: '',
      userAgent: '',
      metadata: {}
    });
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    });
  }

  /**
   * Find user by ID
   */
  async findUserById(userId: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    return user ? this.mapUserToAuthUser(user) : null;
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    return user ? this.mapUserToAuthUser(user) : null;
  }

  /**
   * Check account lockout status
   */
  async checkAccountLockout(userId: string): Promise<{ isLocked: boolean; lockoutUntil?: Date }> {
    const lockoutData = await this.cacheService.get(`account_lockout:${userId}`);
    
    if (!lockoutData) {
      return { isLocked: false };
    }

    const { lockoutUntil } = JSON.parse(lockoutData);
    const now = new Date();

    if (new Date(lockoutUntil) > now) {
      return { isLocked: true, lockoutUntil: new Date(lockoutUntil) };
    }

    // Lockout expired, remove it
    await this.cacheService.del(`account_lockout:${userId}`);
    return { isLocked: false };
  }

  /**
   * Log failed login attempt
   */
  async logFailedLoginAttempt(userId: string): Promise<void> {
    const key = `failed_logins:${userId}`;
    const attempts = await this.cacheService.incrementRateLimit(key, 900000); // 15 minutes

    // Progressive lockout: 5 attempts = 15 min, 10 attempts = 1 hour, 15 attempts = 24 hours
    if (attempts >= 15) {
      await this.lockAccount(userId, 24 * 60 * 60 * 1000); // 24 hours
    } else if (attempts >= 10) {
      await this.lockAccount(userId, 60 * 60 * 1000); // 1 hour
    } else if (attempts >= 5) {
      await this.lockAccount(userId, 15 * 60 * 1000); // 15 minutes
    }

    // Log security event
    await this.logSecurityEvent({
      userId,
      type: 'FAILED_LOGIN_ATTEMPT',
      severity: 'MEDIUM',
      description: `Failed login attempt (${attempts} total)`,
      ipAddress: '',
      userAgent: '',
      metadata: { attemptCount: attempts }
    });
  }

  /**
   * Lock user account
   */
  async lockAccount(userId: string, durationMs: number): Promise<void> {
    const lockoutUntil = new Date(Date.now() + durationMs);
    
    await this.cacheService.set(
      `account_lockout:${userId}`,
      JSON.stringify({ lockoutUntil: lockoutUntil.toISOString() }),
      Math.ceil(durationMs / 1000)
    );

    // Log security event
    await this.logSecurityEvent({
      userId,
      type: 'ACCOUNT_LOCKED',
      severity: 'HIGH',
      description: `Account locked until ${lockoutUntil.toISOString()}`,
      ipAddress: '',
      userAgent: '',
      metadata: { lockoutDuration: durationMs }
    });
  }

  /**
   * Setup two-factor authentication
   */
  async setupTwoFactor(userId: string): Promise<any> {
    // Implementation for 2FA setup
    // This would integrate with authenticator libraries
    const secret = crypto.randomBytes(20).toString('base32');
    const backupCodes = Array.from({ length: 8 }, () => crypto.randomBytes(4).toString('hex').toUpperCase());

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        twoFactorBackupCodes: backupCodes,
        twoFactorEnabled: false
      }
    });

    return {
      secret,
      qrCode: `otpauth://totp/AskYaCham?secret=${secret}`,
      backupCodes
    };
  }

  /**
   * Verify two-factor authentication code
   */
  async verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true }
    });

    if (!user || !user.twoFactorSecret) {
      return false;
    }

    // Implementation for TOTP verification
    // This would use authenticator libraries
    const isValid = true; // Placeholder - implement actual TOTP verification

    if (isValid) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true }
      });
    }

    return isValid;
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null
      }
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Store in database
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

      // Also store in cache for real-time monitoring
      const key = `security_event:${event.userId}:${Date.now()}`;
      await this.cacheService.set(key, JSON.stringify(event), 86400); // 24 hours
    } catch (error) {
      logger.error('Error logging security event:', error);
    }
  }

  /**
   * Create user from Google OAuth
   */
  async createUserFromGoogle(googleUser: any): Promise<AuthUser> {
    const userData: RegisterRequest = {
      email: googleUser.email,
      password: crypto.randomBytes(32).toString('hex'), // Random password
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      role: 'CANDIDATE'
    };

    const user = await this.createUser(userData);
    
    // Mark as verified since Google email is verified
    await this.verifyUserEmail(user.id);

    return user;
  }

  /**
   * Create user from LinkedIn OAuth
   */
  async createUserFromLinkedin(linkedinUser: any): Promise<AuthUser> {
    const userData: RegisterRequest = {
      email: linkedinUser.email,
      password: crypto.randomBytes(32).toString('hex'), // Random password
      firstName: linkedinUser.firstName,
      lastName: linkedinUser.lastName,
      role: 'CANDIDATE'
    };

    const user = await this.createUser(userData);
    
    // Mark as verified since LinkedIn email is verified
    await this.verifyUserEmail(user.id);

    return user;
  }

  /**
   * Verify Google OAuth token
   */
  async verifyGoogleToken(token: string): Promise<any> {
    // Implementation for Google token verification
    // This would use Google's API to verify the token
    return {
      email: 'user@gmail.com',
      given_name: 'John',
      family_name: 'Doe'
    };
  }

  /**
   * Verify LinkedIn OAuth token
   */
  async verifyLinkedinToken(token: string): Promise<any> {
    // Implementation for LinkedIn token verification
    // This would use LinkedIn's API to verify the token
    return {
      email: 'user@linkedin.com',
      firstName: 'John',
      lastName: 'Doe'
    };
  }

  /**
   * Map database user to AuthUser
   */
  private mapUserToAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      profile: user.profile,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
