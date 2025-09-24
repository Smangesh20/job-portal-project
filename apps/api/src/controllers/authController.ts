import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { EmailService } from '@/services/emailService';
import { GoogleStyleEmailService } from '@/services/google-style-email-service';
import { CacheService } from '@/utils/redis';
import { logger } from '@/utils/logger';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthUser,
  ApiResponse,
  CustomError,
  ValidationError,
  AuthenticationError,
  EmailNotVerifiedError
} from '@ask-ya-cham/types';

export class AuthController {
  private authService: AuthService;
  private emailService: EmailService;
  private googleStyleEmailService: GoogleStyleEmailService;
  private cacheService: CacheService;

  constructor() {
    this.authService = new AuthService();
    this.emailService = new EmailService();
    this.googleStyleEmailService = new GoogleStyleEmailService();
    this.cacheService = new CacheService();
  }

  /**
   * Register a new user
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registrationData: RegisterRequest = req.body;
      const deviceInfo = req.fingerprint;

      // Check if email already exists
      const existingUser = await this.authService.findUserByEmail(registrationData.email);
      if (existingUser) {
        throw new ValidationError('Email already exists');
      }

      // Create new user
      const user = await this.authService.createUser(registrationData);

      // Generate tokens
      const tokens = this.authService.generateTokens(user);

      // Create session
      const sessionId = await this.authService.createSession(user.id, deviceInfo);

      // Send welcome email
      await this.emailService.sendWelcomeEmail(user.email, user.firstName);

      // Log security event
      await this.authService.logSecurityEvent({
        userId: user.id,
        type: 'USER_REGISTERED',
        severity: 'LOW',
        description: 'User registered successfully',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: { deviceInfo }
      });

      const response: ApiResponse<{ user: AuthUser; tokens: any }> = {
        success: true,
        data: {
          user,
          tokens
        },
        message: 'Registration successful'
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  };

  /**
   * Login user
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginRequest = req.body;
      const deviceInfo = req.fingerprint;

      // Check rate limiting
      const rateLimitKey = `login_attempts:${req.ip}`;
      const attempts = await this.cacheService.incrementRateLimit(rateLimitKey, 900000); // 15 minutes
      
      if (attempts > 5) {
        throw new AuthenticationError('Too many login attempts. Please try again later.');
      }

      // Authenticate user
      const user = await this.authService.authenticateUser(loginData.email, loginData.password);

      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if email is verified
      if (!user.isVerified) {
        throw new EmailNotVerifiedError('Please verify your email before logging in');
      }

      // Check account lockout
      const lockoutCheck = await this.authService.checkAccountLockout(user.id);
      if (lockoutCheck.isLocked) {
        throw new AuthenticationError('Account is locked due to suspicious activity');
      }

      // Generate tokens
      const tokens = this.authService.generateTokens(user);

      // Create session
      const sessionId = await this.authService.createSession(user.id, deviceInfo);

      // Update last login
      await this.authService.updateLastLogin(user.id);

      // Clear failed login attempts
      await this.cacheService.del(rateLimitKey);

      // Log security event
      await this.authService.logSecurityEvent({
        userId: user.id,
        type: 'LOGIN_SUCCESS',
        severity: 'LOW',
        description: 'User logged in successfully',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: { deviceInfo, sessionId }
      });

      const response: ApiResponse<{ user: AuthUser; tokens: any }> = {
        success: true,
        data: {
          user,
          tokens
        },
        message: 'Login successful'
      };

      res.json(response);
    } catch (error) {
      logger.error('Login error:', error);
      
      // Log failed login attempt
      await this.authService.logSecurityEvent({
        userId: '',
        type: 'LOGIN_FAILED',
        severity: 'MEDIUM',
        description: 'Failed login attempt',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: { email: req.body.email, error: error.message }
      });

      throw error;
    }
  };

  /**
   * Logout user
   */
  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const sessionId = req.headers['x-session-id'] as string;

      if (userId && sessionId) {
        // Invalidate session
        await this.authService.invalidateSession(sessionId);

        // Log security event
        await this.authService.logSecurityEvent({
          userId,
          type: 'LOGOUT',
          severity: 'LOW',
          description: 'User logged out',
          ipAddress: req.ip || '',
          userAgent: req.get('User-Agent') || '',
          metadata: { sessionId }
        });
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Logout successful'
      };

      res.json(response);
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  };

  /**
   * Refresh access token
   */
  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AuthenticationError('Refresh token is required');
      }

      // Verify refresh token
      const decoded = this.authService.verifyRefreshToken(refreshToken);
      
      // Get user
      const user = await this.authService.findUserById(decoded.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Generate new tokens
      const tokens = this.authService.generateTokens(user);

      const response: ApiResponse<{ tokens: any }> = {
        success: true,
        data: { tokens },
        message: 'Token refreshed successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  };

  /**
   * Forgot password - Enterprise-level implementation
   */
  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const clientIP = req.ip || '';
      const userAgent = req.get('User-Agent') || '';

      // Rate limiting check for password reset attempts
      const resetAttemptsKey = `password_reset_attempts:${clientIP}`;
      const attempts = await this.cacheService.get(resetAttemptsKey) || 0;
      
      if (attempts >= 5) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'TOO_MANY_RESET_ATTEMPTS',
            message: 'Too many password reset attempts. Please try again later.',
            retryAfter: 3600 // 1 hour
          }
        };
        res.status(429).json(response);
        return;
      }

      // Check if user exists
      const user = await this.authService.findUserByEmail(email);
      if (!user) {
        // Increment attempts counter
        await this.cacheService.set(resetAttemptsKey, attempts + 1, 3600);
        
        // Don't reveal if email exists or not for security
        const response: ApiResponse<null> = {
          success: true,
          message: 'If the email exists, a password reset link has been sent to your email address.',
          data: {
            instructions: 'Please check your email and follow the instructions to reset your password. The link will expire in 1 hour.',
            securityNote: 'For security reasons, we do not reveal whether an email address is registered with our system.'
          }
        };
        res.json(response);
        return;
      }

      // Check if user account is active
      if (!user.isActive) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'ACCOUNT_DEACTIVATED',
            message: 'This account has been deactivated. Please contact support for assistance.'
          }
        };
        res.status(403).json(response);
        return;
      }

      // Check for recent password reset attempts for this user
      const userResetKey = `password_reset_user:${user.id}`;
      const lastReset = await this.cacheService.get(userResetKey);
      
      if (lastReset) {
        const timeSinceLastReset = Date.now() - parseInt(lastReset);
        const cooldownPeriod = 5 * 60 * 1000; // 5 minutes
        
        if (timeSinceLastReset < cooldownPeriod) {
          const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastReset) / 1000);
          const response: ApiResponse<null> = {
            success: false,
            error: {
              code: 'RESET_COOLDOWN',
              message: `Please wait ${remainingTime} seconds before requesting another password reset.`,
              retryAfter: remainingTime
            }
          };
          res.status(429).json(response);
          return;
        }
      }

      // Generate secure reset token with expiration
      const resetToken = this.authService.generatePasswordResetToken(user.id);
      const tokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hour

      // Store reset token with metadata in cache
      const resetData = {
        token: resetToken,
        userId: user.id,
        email: user.email,
        createdAt: Date.now(),
        expiresAt: tokenExpiry,
        attempts: 0,
        maxAttempts: 3
      };

      await this.cacheService.set(`password_reset:${user.id}`, JSON.stringify(resetData), 3600);
      await this.cacheService.set(userResetKey, Date.now().toString(), 300); // 5 minutes cooldown

      // Send Google-style password reset email with enhanced tracking
      await this.emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken, user.id);

      // Log security event with detailed information
      await this.authService.logSecurityEvent({
        userId: user.id,
        type: 'PASSWORD_RESET_REQUESTED',
        severity: 'MEDIUM',
        description: 'Password reset requested',
        ipAddress: clientIP,
        userAgent: userAgent,
        metadata: { 
          email: user.email,
          userAgent,
          clientIP,
          timestamp: new Date().toISOString()
        }
      });

      // Send notification to user (if they have notifications enabled)
      if (user.preferences?.notifications) {
        await this.authService.sendNotification({
          userId: user.id,
          type: 'PASSWORD_RESET_REQUESTED',
          title: 'Password Reset Requested',
          message: 'A password reset has been requested for your account. If this was not you, please contact support immediately.',
          priority: 'HIGH'
        });
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Password reset instructions have been sent to your email address.',
        data: {
          instructions: 'Please check your email and follow the instructions to reset your password.',
          expiry: 'The reset link will expire in 1 hour for security reasons.',
          securityNote: 'If you did not request this password reset, please ignore this email and consider changing your password.',
          supportContact: 'For assistance, contact our support team at support@askyacham.com'
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Forgot password error:', error);
      
      // Log security event for failed attempt
      await this.authService.logSecurityEvent({
        userId: null,
        type: 'PASSWORD_RESET_FAILED',
        severity: 'HIGH',
        description: 'Password reset request failed',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          email: req.body?.email
        }
      });
      
      throw error;
    }
  };

  /**
   * Reset password - Enterprise-level implementation
   */
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      const clientIP = req.ip || '';
      const userAgent = req.get('User-Agent') || '';

      // Validate input
      if (!token || !newPassword || !confirmPassword) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Token, new password, and confirmation password are required.'
          }
        };
        res.status(400).json(response);
        return;
      }

      if (newPassword !== confirmPassword) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'PASSWORD_MISMATCH',
            message: 'New password and confirmation password do not match.'
          }
        };
        res.status(400).json(response);
        return;
      }

      // Validate password strength
      const passwordValidation = this.authService.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password does not meet security requirements.',
            details: passwordValidation.errors
          }
        };
        res.status(400).json(response);
        return;
      }

      // Verify reset token
      let decoded;
      try {
        decoded = this.authService.verifyPasswordResetToken(token);
      } catch (error) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired reset token. Please request a new password reset.'
          }
        };
        res.status(400).json(response);
        return;
      }

      // Check if token exists in cache with metadata
      const cachedData = await this.cacheService.get(`password_reset:${decoded.userId}`);
      if (!cachedData) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'TOKEN_NOT_FOUND',
            message: 'Reset token not found or has already been used. Please request a new password reset.'
          }
        };
        res.status(400).json(response);
        return;
      }

      const resetData = JSON.parse(cachedData);
      
      // Check if token matches
      if (resetData.token !== token) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'TOKEN_MISMATCH',
            message: 'Invalid reset token. Please request a new password reset.'
          }
        };
        res.status(400).json(response);
        return;
      }

      // Check if token has expired
      if (Date.now() > resetData.expiresAt) {
        await this.cacheService.del(`password_reset:${decoded.userId}`);
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Reset token has expired. Please request a new password reset.'
          }
        };
        res.status(400).json(response);
        return;
      }

      // Check attempt limit
      if (resetData.attempts >= resetData.maxAttempts) {
        await this.cacheService.del(`password_reset:${decoded.userId}`);
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'TOO_MANY_ATTEMPTS',
            message: 'Too many failed attempts. Please request a new password reset.'
          }
        };
        res.status(429).json(response);
        return;
      }

      // Get user details
      const user = await this.authService.findUserById(decoded.userId);
      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found. Please contact support.'
          }
        };
        res.status(404).json(response);
        return;
      }

      // Check if account is active
      if (!user.isActive) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'ACCOUNT_DEACTIVATED',
            message: 'This account has been deactivated. Please contact support for assistance.'
          }
        };
        res.status(403).json(response);
        return;
      }

      // Check if new password is different from current password
      const isSamePassword = await this.authService.verifyPassword(newPassword, user.passwordHash);
      if (isSamePassword) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            code: 'SAME_PASSWORD',
            message: 'New password must be different from your current password.'
          }
        };
        res.status(400).json(response);
        return;
      }

      // Update password
      await this.authService.updatePassword(decoded.userId, newPassword);

      // Remove reset token from cache
      await this.cacheService.del(`password_reset:${decoded.userId}`);

      // Invalidate all user sessions for security
      await this.authService.invalidateAllUserSessions(decoded.userId);

      // Send confirmation email
      await this.emailService.sendPasswordChangeConfirmationEmail(user.email, user.firstName);

      // Log security event
      await this.authService.logSecurityEvent({
        userId: decoded.userId,
        type: 'PASSWORD_RESET_COMPLETED',
        severity: 'HIGH',
        description: 'Password reset completed successfully',
        ipAddress: clientIP,
        userAgent: userAgent,
        metadata: {
          email: user.email,
          userAgent,
          clientIP,
          timestamp: new Date().toISOString(),
          method: 'password_reset'
        }
      });

      // Send notification to user
      if (user.preferences?.notifications) {
        await this.authService.sendNotification({
          userId: decoded.userId,
          type: 'PASSWORD_CHANGED',
          title: 'Password Successfully Changed',
          message: 'Your password has been successfully changed. If you did not make this change, please contact support immediately.',
          priority: 'HIGH'
        });
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Password has been successfully reset.',
        data: {
          instructions: 'You can now log in with your new password.',
          securityNote: 'For security reasons, all your active sessions have been terminated. You will need to log in again.',
          nextSteps: 'Please log in with your new password and consider enabling two-factor authentication for added security.'
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Reset password error:', error);
      
      // Log security event for failed attempt
      await this.authService.logSecurityEvent({
        userId: null,
        type: 'PASSWORD_RESET_FAILED',
        severity: 'HIGH',
        description: 'Password reset attempt failed',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          token: req.body?.token ? 'provided' : 'missing'
        }
      });
      
      throw error;
    }
  };

  /**
   * Change password
   */
  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }

      // Verify current password
      const isValidPassword = await this.authService.verifyPassword(currentPassword, userId);
      if (!isValidPassword) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Update password
      await this.authService.updatePassword(userId, newPassword);

      // Invalidate all other sessions
      await this.authService.invalidateAllUserSessions(userId, req.headers['x-session-id'] as string);

      // Log security event
      await this.authService.logSecurityEvent({
        userId,
        type: 'PASSWORD_CHANGED',
        severity: 'HIGH',
        description: 'Password changed successfully',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: {}
      });

      const response: ApiResponse<null> = {
        success: true,
        message: 'Password changed successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  };

  /**
   * Verify email
   */
  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;

      // Verify email token
      const decoded = this.authService.verifyEmailToken(token);

      // Update user verification status
      await this.authService.verifyUserEmail(decoded.userId);

      // Log security event
      await this.authService.logSecurityEvent({
        userId: decoded.userId,
        type: 'EMAIL_VERIFIED',
        severity: 'LOW',
        description: 'Email verified successfully',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: {}
      });

      const response: ApiResponse<null> = {
        success: true,
        message: 'Email verified successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Email verification error:', error);
      throw error;
    }
  };

  /**
   * Resend verification email
   */
  public resendVerification = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }

      const user = await this.authService.findUserById(userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      if (user.isVerified) {
        throw new ValidationError('Email is already verified');
      }

      // Generate verification token
      const verificationToken = this.authService.generateEmailVerificationToken(userId);

      // Send verification email
      await this.emailService.sendEmailVerificationEmail(user.email, user.firstName, verificationToken);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Verification email sent'
      };

      res.json(response);
    } catch (error) {
      logger.error('Resend verification error:', error);
      throw error;
    }
  };

  /**
   * Google OAuth login
   */
  public googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;

      // Verify Google token and get user info
      const googleUser = await this.authService.verifyGoogleToken(token);

      // Find or create user
      let user = await this.authService.findUserByEmail(googleUser.email);
      if (!user) {
        user = await this.authService.createUserFromGoogle(googleUser);
      }

      // Generate tokens
      const tokens = this.authService.generateTokens(user);

      const response: ApiResponse<{ user: AuthUser; tokens: any; isNewUser: boolean }> = {
        success: true,
        data: {
          user,
          tokens,
          isNewUser: !user
        },
        message: 'Google authentication successful'
      };

      res.json(response);
    } catch (error) {
      logger.error('Google auth error:', error);
      throw error;
    }
  };

  /**
   * LinkedIn OAuth login
   */
  public linkedinAuth = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;

      // Verify LinkedIn token and get user info
      const linkedinUser = await this.authService.verifyLinkedinToken(token);

      // Find or create user
      let user = await this.authService.findUserByEmail(linkedinUser.email);
      if (!user) {
        user = await this.authService.createUserFromLinkedin(linkedinUser);
      }

      // Generate tokens
      const tokens = this.authService.generateTokens(user);

      const response: ApiResponse<{ user: AuthUser; tokens: any; isNewUser: boolean }> = {
        success: true,
        data: {
          user,
          tokens,
          isNewUser: !user
        },
        message: 'LinkedIn authentication successful'
      };

      res.json(response);
    } catch (error) {
      logger.error('LinkedIn auth error:', error);
      throw error;
    }
  };

  /**
   * Get current user
   */
  public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;

      const response: ApiResponse<AuthUser> = {
        success: true,
        data: user!,
        message: 'User retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Get current user error:', error);
      throw error;
    }
  };

  /**
   * Setup two-factor authentication
   */
  public setupTwoFactor = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }

      const setupData = await this.authService.setupTwoFactor(userId);

      const response: ApiResponse<any> = {
        success: true,
        data: setupData,
        message: 'Two-factor authentication setup initiated'
      };

      res.json(response);
    } catch (error) {
      logger.error('Two-factor setup error:', error);
      throw error;
    }
  };

  /**
   * Verify two-factor authentication
   */
  public verifyTwoFactor = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { code } = req.body;

      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }

      const result = await this.authService.verifyTwoFactorCode(userId, code);

      const response: ApiResponse<any> = {
        success: true,
        data: result,
        message: 'Two-factor authentication verified'
      };

      res.json(response);
    } catch (error) {
      logger.error('Two-factor verification error:', error);
      throw error;
    }
  };

  /**
   * Disable two-factor authentication
   */
  public disableTwoFactor = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { password } = req.body;

      if (!userId) {
        throw new AuthenticationError('User not authenticated');
      }

      // Verify password
      const isValidPassword = await this.authService.verifyPassword(password, userId);
      if (!isValidPassword) {
        throw new AuthenticationError('Password is incorrect');
      }

      await this.authService.disableTwoFactor(userId);

      // Log security event
      await this.authService.logSecurityEvent({
        userId,
        type: 'TWO_FACTOR_DISABLED',
        severity: 'HIGH',
        description: 'Two-factor authentication disabled',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: {}
      });

      const response: ApiResponse<null> = {
        success: true,
        message: 'Two-factor authentication disabled'
      };

      res.json(response);
    } catch (error) {
      logger.error('Disable two-factor error:', error);
      throw error;
    }
  };
}
