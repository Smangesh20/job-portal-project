import { Router } from 'express';
import { GoogleStyleEmailService } from '@/services/google-style-email-service';
import { logger } from '@/utils/logger';

const router = Router();
const googleStyleEmailService = new GoogleStyleEmailService();

/**
 * @route POST /api/test-email/sendgrid
 * @desc Test SendGrid email functionality
 * @access Public (for testing)
 */
router.post('/sendgrid', async (req, res) => {
  try {
    const { email, type = 'password-reset' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_EMAIL',
          message: 'Email address is required for testing'
        }
      });
    }

    logger.info(`🧪 TESTING: SendGrid email to ${email} (type: ${type})`);

    switch (type) {
      case 'password-reset':
        await googleStyleEmailService.sendPasswordResetEmail(
          email, 
          'Test User', 
          'test-token-12345'
        );
        break;
      
      case 'welcome':
        await googleStyleEmailService.sendWelcomeEmail(
          email, 
          'Test User'
        );
        break;
      
      case 'verification':
        await googleStyleEmailService.sendEmailVerificationEmail(
          email, 
          'Test User', 
          'test-verification-token-12345'
        );
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TYPE',
            message: 'Invalid email type. Use: password-reset, welcome, or verification'
          }
        });
    }

    res.json({
      success: true,
      message: `✅ ${type} email sent successfully to ${email}`,
      data: {
        email,
        type,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }
    });

  } catch (error) {
    logger.error('❌ TEST EMAIL ERROR:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_SEND_FAILED',
        message: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

/**
 * @route GET /api/test-email/connection
 * @desc Test SendGrid connection
 * @access Public (for testing)
 */
router.get('/connection', async (req, res) => {
  try {
    logger.info('🧪 TESTING: SendGrid connection');
    
    const isConnected = await googleStyleEmailService.testConnection();
    
    if (isConnected) {
      res.json({
        success: true,
        message: '✅ SendGrid connection successful',
        data: {
          status: 'connected',
          timestamp: new Date().toISOString(),
          provider: 'SendGrid'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'CONNECTION_FAILED',
          message: 'SendGrid connection failed'
        }
      });
    }
  } catch (error) {
    logger.error('❌ CONNECTION TEST ERROR:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CONNECTION_ERROR',
        message: 'Error testing SendGrid connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

export default router;



















