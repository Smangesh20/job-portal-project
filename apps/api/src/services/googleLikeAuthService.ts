import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { logger } from '@/utils/logger';
import { CacheService } from '@/utils/cache';
import { 
  AuthenticationError, 
  ValidationError, 
  AccountLockedError,
  EmailNotVerifiedError,
  TwoFactorRequiredError,
  RateLimitError,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  SecurityEvent,
  SecurityEventType,
  SecurityEventSeverity
} from '@ask-ya-cham/types';

export interface GoogleLikeAuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  requiresMfa?: boolean;
  mfaToken?: string;
  isNewUser?: boolean;
  trustedDevice?: boolean;
}

export interface OtpRequest {
  email: string;
  type: 'LOGIN' | 'REGISTER' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
}

export interface OtpVerification {
  email: string;
  token: string;
  type: 'LOGIN' | 'REGISTER' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
}

export interface SocialAuthRequest {
  provider: 'google' | 'microsoft' | 'apple' | 'github' | 'linkedin';
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
  data?: any;
}

export interface MfaSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface DeviceInfo {
  fingerprint: string;
  name?: string;
  type?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class GoogleLikeAuthService {
  private prisma: PrismaClient;
  private cacheService: CacheService;

  constructor() {
    this.prisma = new PrismaClient();
    this.cacheService = new CacheService();
  }

  /**
   * Send OTP for passwordless authentication
   */
  async sendOtp(request: OtpRequest, deviceInfo?: DeviceInfo): Promise<{ success: boolean; message: string }> {
    try {
      const { email, type } = request;

      // Rate limiting for OTP requests
      const rateLimitKey = `otp_requests:${email}:${type}`;
      const attempts = await this.cacheService.incrementRateLimit(rateLimitKey, 300000); // 5 minutes

      if (attempts > 3) {
        throw new RateLimitError('Too many OTP requests. Please wait before trying again.');
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      await this.prisma.otpToken.create({
        data: {
          token: await this.hashToken(otpCode),
          email: email.toLowerCase(),
          type: type as any,
          expiresAt,
          attempts: 0
        }
      });

      // Send OTP via email (implement your email service)
      await this.sendOtpEmail(email, otpCode, type);

      // Log security event
      await this.logSecurityEvent({
        eventType: SecurityEventType.OTP_REQUESTED,
        severity: SecurityEventSeverity.LOW,
        description: `OTP requested for ${type}`,
        ipAddress: deviceInfo?.ipAddress,
        userAgent: deviceInfo?.userAgent,
        deviceFingerprint: deviceInfo?.fingerprint,
        metadata: { email, type }
      });

      return {
        success: true,
        message: 'OTP sent to your email address'
      };
    } catch (error) {
      logger.error('Error sending OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP for passwordless authentication
   */
  async verifyOtp(verification: OtpVerification, deviceInfo?: DeviceInfo): Promise<GoogleLikeAuthResponse> {
    try {
      const { email, token, type } = verification;

      // Rate limiting for OTP verification
      const rateLimitKey = `otp_verify:${email}`;
      const attempts = await this.cacheService.incrementRateLimit(rateLimitKey, 300000); // 5 minutes

      if (attempts > 5) {
        throw new RateLimitError('Too many OTP verification attempts. Please request a new OTP.');
      }

      // Find OTP token
      const otpToken = await this.prisma.otpToken.findFirst({
        where: {
          email: email.toLowerCase(),
          type: type as any,
          used: false,
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!otpToken) {
        throw new AuthenticationError('Invalid or expired OTP');
      }

      // Verify OTP
      const isValidOtp = await this.verifyToken(token, otpToken.token);
      if (!isValidOtp) {
        await this.prisma.otpToken.update({
          where: { id: otpToken.id },
          data: { attempts: { increment: 1 } }
        });

        if (otpToken.attempts + 1 >= 3) {
          await this.prisma.otpToken.update({
            where: { id: otpToken.id },
            data: { used: true }
          });
          throw new AuthenticationError('OTP expired due to too many attempts');
        }

        throw new AuthenticationError('Invalid OTP');
      }

      // Mark OTP as used
      await this.prisma.otpToken.update({
        where: { id: otpToken.id },
        data: { used: true }
      });

      // Handle different OTP types
      switch (type) {
        case 'LOGIN':
          return await this.handleOtpLogin(email, deviceInfo);
        case 'REGISTER':
          return await this.handleOtpRegister(email, deviceInfo);
        case 'PASSWORD_RESET':
          return await this.handlePasswordReset(email, deviceInfo);
        case 'EMAIL_VERIFICATION':
          return await this.handleEmailVerification(email, deviceInfo);
        default:
          throw new ValidationError('Invalid OTP type');
      }
    } catch (error) {
      logger.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Social authentication (Google, Microsoft, etc.)
   */
  async socialAuth(request: SocialAuthRequest, deviceInfo?: DeviceInfo): Promise<GoogleLikeAuthResponse> {
    try {
      const { provider, providerId, email, name, avatar, data } = request;

      // Check if user exists with this social account
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { [`${provider}Id`]: providerId }
          ]
        },
        include: {
          socialAuths: true,
          trustedDevices: true
        }
      });

      const isNewUser = !user;

      if (user) {
        // Update existing user's social auth if needed
        const existingSocialAuth = user.socialAuths.find(sa => sa.provider === provider);
        if (!existingSocialAuth) {
          await this.prisma.socialAuth.create({
            data: {
              userId: user.id,
              provider,
              providerId,
              email,
              name,
              avatar,
              data
            }
          });
        }

        // Update user's social ID
        await this.prisma.user.update({
          where: { id: user.id },
          data: { [`${provider}Id`]: providerId }
        });
      } else {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: email.toLowerCase(),
            name,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' '),
            profilePicture: avatar,
            authMethod: provider.toUpperCase(),
            emailVerified: true,
            isVerified: true,
            [`${provider}Id`]: providerId,
            socialAuths: {
              create: {
                provider,
                providerId,
                email,
                name,
                avatar,
                data
              }
            }
          },
          include: {
            socialAuths: true,
            trustedDevices: true
          }
        });
      }

      // Check if device is trusted
      const trustedDevice = deviceInfo ? this.isDeviceTrusted(user, deviceInfo.fingerprint) : false;

      // Generate tokens
      const tokens = this.generateTokens(this.mapUserToAuthUser(user));

      // Create session
      await this.createSession(user.id, deviceInfo);

      // Log security event
      await this.logSecurityEvent({
        userId: user.id,
        eventType: SecurityEventType.LOGIN_SUCCESS,
        severity: SecurityEventSeverity.LOW,
        description: `Social login with ${provider}`,
        ipAddress: deviceInfo?.ipAddress,
        userAgent: deviceInfo?.userAgent,
        deviceFingerprint: deviceInfo?.fingerprint,
        metadata: { provider, isNewUser, trustedDevice }
      });

      return {
        user: this.mapUserToAuthUser(user),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isNewUser,
        trustedDevice
      };
    } catch (error) {
      logger.error('Error in social authentication:', error);
      throw error;
    }
  }

  /**
   * Setup MFA for user
   */
  async setupMfa(userId: string): Promise<MfaSetup> {
    try {
      // Generate MFA secret
      const secret = speakeasy.generateSecret({
        name: 'AskYaCham',
        issuer: 'AskYaCham',
        length: 32
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        crypto.randomBytes(4).toString('hex').toUpperCase()
      );

      // Store MFA secret and backup codes
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaSecret: secret.base32,
          mfaEnabled: false // Will be enabled after verification
        }
      });

      // Store backup codes (you might want to hash them)
      await this.cacheService.set(`mfa_backup_codes:${userId}`, backupCodes, 86400 * 30); // 30 days

      return {
        secret: secret.base32,
        qrCodeUrl,
        backupCodes
      };
    } catch (error) {
      logger.error('Error setting up MFA:', error);
      throw error;
    }
  }

  /**
   * Verify MFA setup
   */
  async verifyMfaSetup(userId: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.mfaSecret) {
        throw new AuthenticationError('MFA not set up');
      }

      // Verify MFA token
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
        window: 2
      });

      if (!verified) {
        throw new AuthenticationError('Invalid MFA token');
      }

      // Enable MFA
      await this.prisma.user.update({
        where: { id: userId },
        data: { mfaEnabled: true }
      });

      // Log security event
      await this.logSecurityEvent({
        userId,
        eventType: SecurityEventType.MFA_ENABLED,
        severity: SecurityEventSeverity.MEDIUM,
        description: 'MFA enabled for account'
      });

      return {
        success: true,
        message: 'MFA enabled successfully'
      };
    } catch (error) {
      logger.error('Error verifying MFA setup:', error);
      throw error;
    }
  }

  /**
   * Verify MFA token during login
   */
  async verifyMfa(userId: string, token: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.mfaEnabled || !user.mfaSecret) {
        return false;
      }

      // Verify MFA token
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
        window: 2
      });

      if (verified) {
        // Log successful MFA verification
        await this.logSecurityEvent({
          userId,
          eventType: SecurityEventType.MFA_SUCCESS,
          severity: SecurityEventSeverity.LOW,
          description: 'MFA verification successful'
        });
      } else {
        // Log failed MFA verification
        await this.logSecurityEvent({
          userId,
          eventType: SecurityEventType.MFA_FAILED,
          severity: SecurityEventSeverity.MEDIUM,
          description: 'MFA verification failed'
        });
      }

      return verified;
    } catch (error) {
      logger.error('Error verifying MFA:', error);
      return false;
    }
  }

  /**
   * Trust device for user
   */
  async trustDevice(userId: string, deviceInfo: DeviceInfo): Promise<void> {
    try {
      await this.prisma.trustedDevice.upsert({
        where: {
          userId_fingerprint: {
            userId,
            fingerprint: deviceInfo.fingerprint
          }
        },
        update: {
          lastUsedAt: new Date(),
          name: deviceInfo.name,
          type: deviceInfo.type,
          browser: deviceInfo.browser,
          os: deviceInfo.os
        },
        create: {
          userId,
          fingerprint: deviceInfo.fingerprint,
          name: deviceInfo.name,
          type: deviceInfo.type,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          lastUsedAt: new Date()
        }
      });

      // Log security event
      await this.logSecurityEvent({
        userId,
        eventType: SecurityEventType.DEVICE_TRUSTED,
        severity: SecurityEventSeverity.LOW,
        description: 'Device marked as trusted',
        metadata: { deviceInfo }
      });
    } catch (error) {
      logger.error('Error trusting device:', error);
      throw error;
    }
  }

  /**
   * Enhanced login with all Google-like features
   */
  async enhancedLogin(email: string, password: string, deviceInfo?: DeviceInfo): Promise<GoogleLikeAuthResponse> {
    try {
      // Rate limiting
      const rateLimitKey = `login_attempts:${email}`;
      const attempts = await this.cacheService.incrementRateLimit(rateLimitKey, 900000); // 15 minutes

      if (attempts > 5) {
        throw new RateLimitError('Too many login attempts. Please try again later.');
      }

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          trustedDevices: true
        }
      });

      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check account lockout
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new AccountLockedError('Account is temporarily locked due to suspicious activity');
      }

      // Verify password
      if (!user.password) {
        throw new AuthenticationError('Please use social login or reset your password');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        await this.handleFailedLogin(user.id);
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if device is trusted
      const trustedDevice = deviceInfo ? this.isDeviceTrusted(user, deviceInfo.fingerprint) : false;

      // Check if MFA is required
      if (user.mfaEnabled && !trustedDevice) {
        const mfaToken = jwt.sign(
          { userId: user.id, type: 'mfa_challenge' },
          process.env.JWT_SECRET!,
          { expiresIn: '5m' }
        );

        return {
          user: this.mapUserToAuthUser(user),
          accessToken: '',
          refreshToken: '',
          requiresMfa: true,
          mfaToken
        };
      }

      // Generate tokens
      const tokens = this.generateTokens(this.mapUserToAuthUser(user));

      // Create session
      await this.createSession(user.id, deviceInfo);

      // Clear failed login attempts
      await this.cacheService.del(rateLimitKey);

      // Log security event
      await this.logSecurityEvent({
        userId: user.id,
        eventType: SecurityEventType.LOGIN_SUCCESS,
        severity: SecurityEventSeverity.LOW,
        description: 'User logged in successfully',
        ipAddress: deviceInfo?.ipAddress,
        userAgent: deviceInfo?.userAgent,
        deviceFingerprint: deviceInfo?.fingerprint,
        metadata: { trustedDevice }
      });

      return {
        user: this.mapUserToAuthUser(user),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        trustedDevice
      };
    } catch (error) {
      logger.error('Error in enhanced login:', error);
      throw error;
    }
  }

  // Private helper methods

  private async handleOtpLogin(email: string, deviceInfo?: DeviceInfo): Promise<GoogleLikeAuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { trustedDevices: true }
    });

    if (!user) {
      throw new AuthenticationError('No account found with this email');
    }

    const trustedDevice = deviceInfo ? this.isDeviceTrusted(user, deviceInfo.fingerprint) : false;
    const tokens = this.generateTokens(this.mapUserToAuthUser(user));
    await this.createSession(user.id, deviceInfo);

    return {
      user: this.mapUserToAuthUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      trustedDevice
    };
  }

  private async handleOtpRegister(email: string, deviceInfo?: DeviceInfo): Promise<GoogleLikeAuthResponse> {
    // Create new user with OTP authentication
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: email.split('@')[0],
        authMethod: 'OTP',
        emailVerified: true,
        isVerified: true,
        otpEnabled: true
      },
      include: { trustedDevices: true }
    });

    const tokens = this.generateTokens(this.mapUserToAuthUser(user));
    await this.createSession(user.id, deviceInfo);

    return {
      user: this.mapUserToAuthUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isNewUser: true
    };
  }

  private async handlePasswordReset(email: string, deviceInfo?: DeviceInfo): Promise<GoogleLikeAuthResponse> {
    // This would typically redirect to password reset form
    // For now, return a success response
    return {
      user: {} as AuthUser,
      accessToken: '',
      refreshToken: '',
      isNewUser: false
    };
  }

  private async handleEmailVerification(email: string, deviceInfo?: DeviceInfo): Promise<GoogleLikeAuthResponse> {
    await this.prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: true, isVerified: true }
    });

    return {
      user: {} as AuthUser,
      accessToken: '',
      refreshToken: '',
      isNewUser: false
    };
  }

  private isDeviceTrusted(user: any, fingerprint: string): boolean {
    return user.trustedDevices?.some((device: any) => device.fingerprint === fingerprint) || false;
  }

  private async handleFailedLogin(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return;

    const newAttempts = user.loginAttempts + 1;
    const updateData: any = { loginAttempts: newAttempts };

    if (newAttempts >= 5) {
      updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Log security event
    await this.logSecurityEvent({
      userId,
      eventType: SecurityEventType.LOGIN_FAILED,
      severity: SecurityEventSeverity.MEDIUM,
      description: `Failed login attempt (${newAttempts}/5)`,
      metadata: { attempts: newAttempts, locked: newAttempts >= 5 }
    });
  }

  private async createSession(userId: string, deviceInfo?: DeviceInfo): Promise<void> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await this.prisma.userSession.create({
      data: {
        userId,
        token: sessionToken,
        ipAddress: deviceInfo?.ipAddress || '',
        userAgent: deviceInfo?.userAgent || '',
        expiresAt
      }
    });

    // Update last login
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        lastLoginAt: new Date(),
        loginAttempts: 0,
        lockedUntil: null
      }
    });
  }

  private generateTokens(user: AuthUser): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        permissions: user.permissions 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  private mapUserToAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || user.name.split(' ')[0],
      lastName: user.lastName || user.name.split(' ').slice(1).join(' '),
      role: user.role,
      permissions: user.permissions || [],
      profileImage: user.profilePicture || user.avatar,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt
    };
  }

  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  private async verifyToken(token: string, hashedToken: string): Promise<boolean> {
    return bcrypt.compare(token, hashedToken);
  }

  private async sendOtpEmail(email: string, otp: string, type: string): Promise<void> {
    // Implement your email service here
    logger.info(`Sending OTP ${otp} to ${email} for ${type}`);
  }

  private async logSecurityEvent(event: Partial<SecurityEvent>): Promise<void> {
    try {
      await this.prisma.securityEvent.create({
        data: {
          userId: event.userId || null,
          eventType: event.eventType || 'UNKNOWN',
          severity: event.severity || SecurityEventSeverity.LOW,
          description: event.description || '',
          ipAddress: event.ipAddress || null,
          userAgent: event.userAgent || null,
          deviceFingerprint: event.deviceFingerprint || null,
          metadata: event.metadata || null
        }
      });
    } catch (error) {
      logger.error('Error logging security event:', error);
    }
  }
}







