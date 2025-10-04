import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { EmailService } from './emailService';
import { logger } from '@/utils/logger';

export interface GoogleAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  verified: boolean;
}

export interface OTPData {
  code: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
}

export class GoogleAuthService {
  private prisma: PrismaClient;
  private emailService: EmailService;
  private otpCache: Map<string, OTPData> = new Map();

  constructor() {
    this.prisma = new PrismaClient();
    this.emailService = new EmailService();
  }

  /**
   * Generate secure OTP code
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP via email - Google-like implementation
   */
  async sendOTP(email: string, type: 'login' | 'password_reset' | 'verification' = 'login'): Promise<AuthResult> {
    try {
      logger.info(`🔐 Sending OTP to ${email} for ${type}`);

      // Check if user exists for login/verification
      if (type === 'login' || type === 'verification') {
        const user = await this.prisma.user.findUnique({
          where: { email }
        });

        if (!user && type === 'login') {
          // Don't reveal if email exists for security
          return {
            success: true,
            message: 'If an account with this email exists, an OTP has been sent.'
          };
        }
      }

      // Generate OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in cache
      this.otpCache.set(email, {
        code: otp,
        expiresAt,
        attempts: 0,
        maxAttempts: 3
      });

      // Send OTP email
      await this.emailService.sendOTPEmail(email, otp, type);

      logger.info(`✅ OTP sent successfully to ${email}`);

      return {
        success: true,
        message: 'OTP sent successfully. Please check your email.'
      };

    } catch (error) {
      logger.error('❌ Error sending OTP:', error);
      return {
        success: false,
        error: 'Failed to send OTP. Please try again.'
      };
    }
  }

  /**
   * Verify OTP and authenticate user - Google-like implementation
   */
  async verifyOTP(email: string, otp: string, type: 'login' | 'password_reset' | 'verification' = 'login'): Promise<AuthResult> {
    try {
      logger.info(`🔍 Verifying OTP for ${email}`);

      const otpData = this.otpCache.get(email);

      if (!otpData) {
        return {
          success: false,
          error: 'OTP not found or expired. Please request a new one.'
        };
      }

      // Check if OTP is expired
      if (new Date() > otpData.expiresAt) {
        this.otpCache.delete(email);
        return {
          success: false,
          error: 'OTP has expired. Please request a new one.'
        };
      }

      // Check attempts
      if (otpData.attempts >= otpData.maxAttempts) {
        this.otpCache.delete(email);
        return {
          success: false,
          error: 'Too many failed attempts. Please request a new OTP.'
        };
      }

      // Verify OTP
      if (otp !== otpData.code) {
        otpData.attempts++;
        this.otpCache.set(email, otpData);
        
        return {
          success: false,
          error: `Invalid OTP. ${otpData.maxAttempts - otpData.attempts} attempts remaining.`
        };
      }

      // OTP is valid, remove from cache
      this.otpCache.delete(email);

      if (type === 'login') {
        // Find or create user
        let user = await this.prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          // Create new user for passwordless login
          user = await this.prisma.user.create({
            data: {
              email,
              firstName: email.split('@')[0],
              lastName: '',
              isActive: true,
              emailVerified: true,
              password: crypto.randomBytes(32).toString('hex'), // Random password for OTP users
              authMethod: 'OTP'
            }
          });
        }

        // Generate tokens
        const token = this.generateToken(user.id);
        const refreshToken = this.generateRefreshToken(user.id);

        logger.info(`✅ User ${email} authenticated successfully via OTP`);

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            emailVerified: user.emailVerified
          },
          token,
          refreshToken,
          message: 'Authentication successful'
        };
      }

      return {
        success: true,
        message: 'OTP verified successfully'
      };

    } catch (error) {
      logger.error('❌ Error verifying OTP:', error);
      return {
        success: false,
        error: 'Failed to verify OTP. Please try again.'
      };
    }
  }

  /**
   * Google Social Login - Google-like implementation
   */
  async googleLogin(googleUser: GoogleAuthUser): Promise<AuthResult> {
    try {
      logger.info(`🔐 Google login for ${googleUser.email}`);

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { email: googleUser.email }
      });

      if (!user) {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            isActive: true,
            emailVerified: googleUser.verified,
            password: crypto.randomBytes(32).toString('hex'),
            authMethod: 'GOOGLE',
            profilePicture: googleUser.picture
          }
        });
      } else {
        // Update existing user
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            emailVerified: googleUser.verified,
            authMethod: 'GOOGLE',
            profilePicture: googleUser.picture
          }
        });
      }

      // Generate tokens
      const token = this.generateToken(user.id);
      const refreshToken = this.generateRefreshToken(user.id);

      logger.info(`✅ User ${googleUser.email} authenticated successfully via Google`);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          profilePicture: user.profilePicture
        },
        token,
        refreshToken,
        message: 'Google authentication successful'
      };

    } catch (error) {
      logger.error('❌ Error in Google login:', error);
      return {
        success: false,
        error: 'Google authentication failed. Please try again.'
      };
    }
  }

  /**
   * Enhanced Password Reset - Google-like implementation
   */
  async enhancedPasswordReset(email: string): Promise<AuthResult> {
    try {
      logger.info(`🔐 Enhanced password reset for ${email}`);

      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message: 'If an account with this email exists, password reset instructions have been sent.'
        };
      }

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token
      await this.prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt
        }
      });

      // Send enhanced reset email
      await this.emailService.sendEnhancedPasswordResetEmail(
        user.email,
        user.firstName,
        resetToken
      );

      logger.info(`✅ Enhanced password reset email sent to ${email}`);

      return {
        success: true,
        message: 'Password reset instructions have been sent to your email.'
      };

    } catch (error) {
      logger.error('❌ Error in enhanced password reset:', error);
      return {
        success: false,
        error: 'Failed to send password reset instructions. Please try again.'
      };
    }
  }

  /**
   * Multi-Factor Authentication Setup
   */
  async setupMFA(userId: string): Promise<AuthResult> {
    try {
      logger.info(`🔐 Setting up MFA for user ${userId}`);

      // Generate secret key for TOTP
      const secret = crypto.randomBytes(20).toString('base32');
      
      // Store MFA secret
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaSecret: secret,
          mfaEnabled: false // Will be enabled after verification
        }
      });

      // Generate QR code URL for Google Authenticator
      const qrCodeUrl = `otpauth://totp/AskYaCham:${userId}?secret=${secret}&issuer=AskYaCham`;

      return {
        success: true,
        message: 'MFA setup initiated. Please scan the QR code with Google Authenticator.',
        user: { qrCodeUrl, secret }
      };

    } catch (error) {
      logger.error('❌ Error setting up MFA:', error);
      return {
        success: false,
        error: 'Failed to setup MFA. Please try again.'
      };
    }
  }

  /**
   * Verify MFA Code
   */
  async verifyMFACode(userId: string, code: string): Promise<AuthResult> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.mfaSecret) {
        return {
          success: false,
          error: 'MFA not configured for this user.'
        };
      }

      // Verify TOTP code (simplified - in production use proper TOTP library)
      const isValid = this.verifyTOTPCode(user.mfaSecret, code);

      if (!isValid) {
        return {
          success: false,
          error: 'Invalid MFA code. Please try again.'
        };
      }

      // Enable MFA if it was being set up
      if (!user.mfaEnabled) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { mfaEnabled: true }
        });
      }

      return {
        success: true,
        message: 'MFA verification successful'
      };

    } catch (error) {
      logger.error('❌ Error verifying MFA code:', error);
      return {
        success: false,
        error: 'MFA verification failed. Please try again.'
      };
    }
  }

  /**
   * Generate JWT Token
   */
  private generateToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
  }

  /**
   * Generate Refresh Token
   */
  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }

  /**
   * Verify TOTP Code (simplified implementation)
   */
  private verifyTOTPCode(secret: string, code: string): boolean {
    // This is a simplified implementation
    // In production, use a proper TOTP library like 'otplib'
    const timeStep = Math.floor(Date.now() / 1000 / 30);
    const expectedCode = this.generateTOTPCode(secret, timeStep);
    return code === expectedCode;
  }

  /**
   * Generate TOTP Code (simplified implementation)
   */
  private generateTOTPCode(secret: string, timeStep: number): string {
    // This is a simplified implementation
    // In production, use a proper TOTP library like 'otplib'
    const hash = crypto.createHmac('sha1', Buffer.from(secret, 'base32'))
      .update(Buffer.from(timeStep.toString(16), 'hex'))
      .digest();
    
    const offset = hash[hash.length - 1] & 0xf;
    const code = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);
    
    return (code % 1000000).toString().padStart(6, '0');
  }

  /**
   * Cleanup expired OTPs
   */
  cleanupExpiredOTPs(): void {
    const now = new Date();
    for (const [email, otpData] of this.otpCache.entries()) {
      if (now > otpData.expiresAt) {
        this.otpCache.delete(email);
      }
    }
  }
}

















