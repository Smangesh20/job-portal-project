import { Request, Response } from 'express';
import { GoogleAuthService } from '@/services/googleAuthService';
import { logger } from '@/utils/logger';

export class GoogleAuthController {
  private googleAuthService: GoogleAuthService;

  constructor() {
    this.googleAuthService = new GoogleAuthService();
  }

  /**
   * Send OTP for passwordless login - Google-like implementation
   */
  public sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, type = 'login' } = req.body;
      const clientIP = req.ip || '';
      const userAgent = req.get('User-Agent') || '';

      logger.info(`🔐 OTP request for ${email} from ${clientIP}`);

      // Validate input
      if (!email) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_EMAIL',
            message: 'Email address is required.'
          }
        });
        return;
      }

      // Rate limiting check
      const rateLimitKey = `otp_attempts:${clientIP}`;
      // Implementation would check rate limits here

      // Send OTP
      const result = await this.googleAuthService.sendOTP(email, type as 'login' | 'password_reset' | 'verification');

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            email: email,
            type: type,
            expiresIn: 600, // 10 minutes
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'OTP_SEND_FAILED',
            message: result.error
          }
        });
      }

    } catch (error) {
      logger.error('❌ Error in sendOTP:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      });
    }
  };

  /**
   * Verify OTP and authenticate - Google-like implementation
   */
  public verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp, type = 'login' } = req.body;
      const clientIP = req.ip || '';
      const userAgent = req.get('User-Agent') || '';

      logger.info(`🔍 OTP verification for ${email} from ${clientIP}`);

      // Validate input
      if (!email || !otp) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email and OTP are required.'
          }
        });
        return;
      }

      // Verify OTP
      const result = await this.googleAuthService.verifyOTP(email, otp, type as 'login' | 'password_reset' | 'verification');

      if (result.success) {
        if (type === 'login' && result.user && result.token) {
          // Set secure HTTP-only cookies
          res.cookie('accessToken', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
          });

          res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });

          res.status(200).json({
            success: true,
            message: 'Authentication successful',
            data: {
              user: result.user,
              token: result.token,
              refreshToken: result.refreshToken,
              timestamp: new Date().toISOString()
            }
          });
        } else {
          res.status(200).json({
            success: true,
            message: result.message,
            data: {
              email: email,
              type: type,
              timestamp: new Date().toISOString()
            }
          });
        }
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'OTP_VERIFICATION_FAILED',
            message: result.error
          }
        });
      }

    } catch (error) {
      logger.error('❌ Error in verifyOTP:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      });
    }
  };

  /**
   * Google Social Login - Google-like implementation
   */
  public googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { googleUser } = req.body;
      const clientIP = req.ip || '';
      const userAgent = req.get('User-Agent') || '';

      logger.info(`🔐 Google login for ${googleUser?.email} from ${clientIP}`);

      // Validate input
      if (!googleUser || !googleUser.email) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_GOOGLE_DATA',
            message: 'Google user data is required.'
          }
        });
        return;
      }

      // Authenticate with Google
      const result = await this.googleAuthService.googleLogin(googleUser);

      if (result.success && result.user && result.token) {
        // Set secure HTTP-only cookies
        res.cookie('accessToken', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
          success: true,
          message: 'Google authentication successful',
          data: {
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'GOOGLE_AUTH_FAILED',
            message: result.error
          }
        });
      }

    } catch (error) {
      logger.error('❌ Error in googleLogin:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      });
    }
  };

  /**
   * Enhanced Password Reset - Google-like implementation
   */
  public enhancedPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const clientIP = req.ip || '';
      const userAgent = req.get('User-Agent') || '';

      logger.info(`🔐 Enhanced password reset for ${email} from ${clientIP}`);

      // Validate input
      if (!email) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_EMAIL',
            message: 'Email address is required.'
          }
        });
        return;
      }

      // Rate limiting check
      const rateLimitKey = `password_reset_attempts:${clientIP}`;
      // Implementation would check rate limits here

      // Send enhanced password reset
      const result = await this.googleAuthService.enhancedPasswordReset(email);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            email: email,
            instructions: 'Please check your email and follow the instructions to reset your password.',
            securityNote: 'For security reasons, we do not reveal whether an email address is registered with our system.',
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'PASSWORD_RESET_FAILED',
            message: result.error
          }
        });
      }

    } catch (error) {
      logger.error('❌ Error in enhancedPasswordReset:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      });
    }
  };

  /**
   * Setup Multi-Factor Authentication
   */
  public setupMFA = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const clientIP = req.ip || '';

      logger.info(`🔐 MFA setup for user ${userId} from ${clientIP}`);

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required.'
          }
        });
        return;
      }

      // Setup MFA
      const result = await this.googleAuthService.setupMFA(userId);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            qrCodeUrl: result.user?.qrCodeUrl,
            secret: result.user?.secret,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'MFA_SETUP_FAILED',
            message: result.error
          }
        });
      }

    } catch (error) {
      logger.error('❌ Error in setupMFA:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      });
    }
  };

  /**
   * Verify MFA Code
   */
  public verifyMFA = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.body;
      const userId = (req as any).user?.id;
      const clientIP = req.ip || '';

      logger.info(`🔍 MFA verification for user ${userId} from ${clientIP}`);

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required.'
          }
        });
        return;
      }

      if (!code) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_MFA_CODE',
            message: 'MFA code is required.'
          }
        });
        return;
      }

      // Verify MFA code
      const result = await this.googleAuthService.verifyMFACode(userId, code);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'MFA_VERIFICATION_FAILED',
            message: result.error
          }
        });
      }

    } catch (error) {
      logger.error('❌ Error in verifyMFA:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      });
    }
  };

  /**
   * Logout - Google-like implementation
   */
  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientIP = req.ip || '';
      const userAgent = req.get('User-Agent') || '';

      logger.info(`🚪 Logout request from ${clientIP}`);

      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        data: {
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('❌ Error in logout:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      });
    }
  };
}

















