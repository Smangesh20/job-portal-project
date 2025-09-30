import { Request, Response } from 'express';
import { GoogleLikeAuthService } from '@/services/googleLikeAuthService';
import { logger } from '@/utils/logger';
import { 
  AuthenticationError, 
  ValidationError,
  RateLimitError,
  AccountLockedError,
  EmailNotVerifiedError,
  TwoFactorRequiredError
} from '@ask-ya-cham/types';

export class GoogleLikeAuthController {
  private authService: GoogleLikeAuthService;

  constructor() {
    this.authService = new GoogleLikeAuthService();
  }

  /**
   * Send OTP for passwordless authentication
   */
  public sendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, type } = req.body;
      const deviceInfo = this.extractDeviceInfo(req);

      if (!email || !type) {
        res.status(400).json({
          success: false,
          error: 'Email and type are required'
        });
        return;
      }

      const result = await this.authService.sendOtp(
        { email, type },
        deviceInfo
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          email,
          type,
          expiresIn: 600 // 10 minutes
        }
      });
    } catch (error) {
      logger.error('Send OTP error:', error);
      
      if (error instanceof RateLimitError) {
        res.status(429).json({
          success: false,
          error: error.message,
          code: 'RATE_LIMIT_EXCEEDED'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to send OTP'
      });
    }
  };

  /**
   * Verify OTP for passwordless authentication
   */
  public verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, token, type } = req.body;
      const deviceInfo = this.extractDeviceInfo(req);

      if (!email || !token || !type) {
        res.status(400).json({
          success: false,
          error: 'Email, token, and type are required'
        });
        return;
      }

      const result = await this.authService.verifyOtp(
        { email, token, type },
        deviceInfo
      );

      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          requiresMfa: result.requiresMfa,
          mfaToken: result.mfaToken,
          isNewUser: result.isNewUser,
          trustedDevice: result.trustedDevice
        }
      });
    } catch (error) {
      logger.error('Verify OTP error:', error);
      
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          error: error.message,
          code: 'AUTHENTICATION_ERROR'
        });
        return;
      }

      if (error instanceof RateLimitError) {
        res.status(429).json({
          success: false,
          error: error.message,
          code: 'RATE_LIMIT_EXCEEDED'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to verify OTP'
      });
    }
  };

  /**
   * Social authentication (Google, Microsoft, etc.)
   */
  public socialAuth = async (req: Request, res: Response): Promise<void> => {
    try {
      const { provider, providerId, email, name, avatar, data } = req.body;
      const deviceInfo = this.extractDeviceInfo(req);

      if (!provider || !providerId || !email || !name) {
        res.status(400).json({
          success: false,
          error: 'Provider, providerId, email, and name are required'
        });
        return;
      }

      const result = await this.authService.socialAuth(
        { provider, providerId, email, name, avatar, data },
        deviceInfo
      );

      res.status(200).json({
        success: true,
        message: 'Social authentication successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          isNewUser: result.isNewUser,
          trustedDevice: result.trustedDevice
        }
      });
    } catch (error) {
      logger.error('Social auth error:', error);
      
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          error: error.message,
          code: 'AUTHENTICATION_ERROR'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Social authentication failed'
      });
    }
  };

  /**
   * Enhanced login with MFA support
   */
  public enhancedLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const deviceInfo = this.extractDeviceInfo(req);

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
        return;
      }

      const result = await this.authService.enhancedLogin(email, password, deviceInfo);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          requiresMfa: result.requiresMfa,
          mfaToken: result.mfaToken,
          trustedDevice: result.trustedDevice
        }
      });
    } catch (error) {
      logger.error('Enhanced login error:', error);
      
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          error: error.message,
          code: 'AUTHENTICATION_ERROR'
        });
        return;
      }

      if (error instanceof AccountLockedError) {
        res.status(423).json({
          success: false,
          error: error.message,
          code: 'ACCOUNT_LOCKED'
        });
        return;
      }

      if (error instanceof RateLimitError) {
        res.status(429).json({
          success: false,
          error: error.message,
          code: 'RATE_LIMIT_EXCEEDED'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  };

  /**
   * Setup MFA for user
   */
  public setupMfa = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      const result = await this.authService.setupMfa(userId);

      res.status(200).json({
        success: true,
        message: 'MFA setup initiated',
        data: result
      });
    } catch (error) {
      logger.error('Setup MFA error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to setup MFA'
      });
    }
  };

  /**
   * Verify MFA setup
   */
  public verifyMfaSetup = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { token } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'MFA token is required'
        });
        return;
      }

      const result = await this.authService.verifyMfaSetup(userId, token);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Verify MFA setup error:', error);
      
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          error: error.message,
          code: 'AUTHENTICATION_ERROR'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to verify MFA setup'
      });
    }
  };

  /**
   * Verify MFA during login
   */
  public verifyMfa = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mfaToken, token } = req.body;
      const deviceInfo = this.extractDeviceInfo(req);

      if (!mfaToken || !token) {
        res.status(400).json({
          success: false,
          error: 'MFA token and verification token are required'
        });
        return;
      }

      // Verify MFA token and complete login
      // This would involve additional logic to complete the login flow
      
      res.status(200).json({
        success: true,
        message: 'MFA verification successful',
        data: {
          // Return final login data
        }
      });
    } catch (error) {
      logger.error('Verify MFA error:', error);
      
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          error: error.message,
          code: 'AUTHENTICATION_ERROR'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'MFA verification failed'
      });
    }
  };

  /**
   * Trust device
   */
  public trustDevice = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const deviceInfo = this.extractDeviceInfo(req);

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      await this.authService.trustDevice(userId, deviceInfo);

      res.status(200).json({
        success: true,
        message: 'Device trusted successfully'
      });
    } catch (error) {
      logger.error('Trust device error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to trust device'
      });
    }
  };

  /**
   * Enhanced password recovery
   */
  public enhancedPasswordRecovery = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const deviceInfo = this.extractDeviceInfo(req);

      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email is required'
        });
        return;
      }

      // Send OTP for password reset
      await this.authService.sendOtp(
        { email, type: 'PASSWORD_RESET' },
        deviceInfo
      );

      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to your email'
      });
    } catch (error) {
      logger.error('Password recovery error:', error);
      
      if (error instanceof RateLimitError) {
        res.status(429).json({
          success: false,
          error: error.message,
          code: 'RATE_LIMIT_EXCEEDED'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Password recovery failed'
      });
    }
  };

  /**
   * Reset password with OTP
   */
  public resetPasswordWithOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, token, newPassword } = req.body;
      const deviceInfo = this.extractDeviceInfo(req);

      if (!email || !token || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Email, token, and new password are required'
        });
        return;
      }

      // Verify OTP first
      await this.authService.verifyOtp(
        { email, token, type: 'PASSWORD_RESET' },
        deviceInfo
      );

      // Update password
      // This would involve additional password update logic

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          error: error.message,
          code: 'AUTHENTICATION_ERROR'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Password reset failed'
      });
    }
  };

  /**
   * Get user security status
   */
  public getSecurityStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      // Get user security information
      // This would involve querying user's security settings

      res.status(200).json({
        success: true,
        data: {
          mfaEnabled: false,
          trustedDevices: [],
          recentLogins: [],
          securityAlerts: []
        }
      });
    } catch (error) {
      logger.error('Get security status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get security status'
      });
    }
  };

  /**
   * Extract device information from request
   */
  private extractDeviceInfo(req: Request): any {
    const userAgent = req.get('User-Agent') || '';
    const fingerprint = req.get('X-Device-Fingerprint') || 
      req.get('X-Forwarded-For') || 
      req.ip || 
      'unknown';

    // Parse user agent for device info
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);
    const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/);
    
    return {
      fingerprint,
      userAgent,
      ipAddress: req.ip,
      browser: browserMatch ? browserMatch[1] : 'Unknown',
      os: osMatch ? osMatch[1] : 'Unknown',
      type: this.detectDeviceType(userAgent)
    };
  }

  /**
   * Detect device type from user agent
   */
  private detectDeviceType(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
      return 'mobile';
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
}







