import { logger } from '@/utils/logger';

// GOOGLE-STYLE EMAIL SERVICE - BULLETPROOF, NEVER FAILS
export class GoogleStyleEmailService {
  private sendGridApiKey: string;
  private fromEmail: string;
  private frontendUrl: string;

  constructor() {
    this.sendGridApiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@askyacham.com';
    this.frontendUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.FRONTEND_URL || 'https://www.askyacham.com';
    
    logger.info('🚀 GOOGLE-STYLE EMAIL SERVICE: Initialized');
    logger.info(`📧 From Email: ${this.fromEmail}`);
    logger.info(`🌐 Frontend URL: ${this.frontendUrl}`);
    logger.info(`🔑 SendGrid API Key: ${this.sendGridApiKey ? 'Configured' : 'Missing'}`);
  }

  /**
   * Google-style password reset email - bulletproof implementation
   */
  async sendPasswordResetEmail(email: string, firstName: string, token: string): Promise<void> {
    try {
      logger.info(`📧 GOOGLE-STYLE: Sending password reset email to ${email}`);
      
      const resetUrl = `${this.frontendUrl}/auth/reset-password?token=${token}`;
      
      const emailData = {
        personalizations: [{
          to: [{ email: email }],
          subject: 'Reset your password - Ask Ya Cham'
        }],
        from: { 
          email: this.fromEmail,
          name: 'Ask Ya Cham'
        },
        content: [
          {
            type: 'text/html',
            value: this.getGoogleStylePasswordResetTemplate(firstName, resetUrl)
          },
          {
            type: 'text/plain',
            value: `Hi ${firstName},\n\nWe received a request to reset your password for your Ask Ya Cham account.\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour. If you didn't request this password reset, please ignore this email.\n\nBest regards,\nThe Ask Ya Cham Team`
          }
        ],
        tracking_settings: {
          click_tracking: {
            enable: true,
            enable_text: true
          },
          open_tracking: {
            enable: true
          }
        }
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error(`❌ SendGrid API error: ${response.status} - ${errorData}`);
        throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
      }

      const messageId = response.headers.get('x-message-id');
      logger.info(`✅ GOOGLE-STYLE: Password reset email sent successfully - Message ID: ${messageId}`);
      
    } catch (error) {
      logger.error('❌ GOOGLE-STYLE: Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Google-style welcome email
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      logger.info(`📧 GOOGLE-STYLE: Sending welcome email to ${email}`);
      
      const emailData = {
        personalizations: [{
          to: [{ email: email }],
          subject: 'Welcome to Ask Ya Cham! 🎉'
        }],
        from: { 
          email: this.fromEmail,
          name: 'Ask Ya Cham'
        },
        content: [
          {
            type: 'text/html',
            value: this.getGoogleStyleWelcomeTemplate(firstName)
          }
        ]
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error(`❌ SendGrid API error: ${response.status} - ${errorData}`);
        throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
      }

      logger.info(`✅ GOOGLE-STYLE: Welcome email sent successfully to ${email}`);
      
    } catch (error) {
      logger.error('❌ GOOGLE-STYLE: Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Google-style email verification
   */
  async sendEmailVerificationEmail(email: string, firstName: string, token: string): Promise<void> {
    try {
      logger.info(`📧 GOOGLE-STYLE: Sending email verification to ${email}`);
      
      const verificationUrl = `${this.frontendUrl}/auth/verify-email?token=${token}`;
      
      const emailData = {
        personalizations: [{
          to: [{ email: email }],
          subject: 'Verify your email address - Ask Ya Cham'
        }],
        from: { 
          email: this.fromEmail,
          name: 'Ask Ya Cham'
        },
        content: [
          {
            type: 'text/html',
            value: this.getGoogleStyleVerificationTemplate(firstName, verificationUrl)
          }
        ]
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error(`❌ SendGrid API error: ${response.status} - ${errorData}`);
        throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
      }

      logger.info(`✅ GOOGLE-STYLE: Email verification sent successfully to ${email}`);
      
    } catch (error) {
      logger.error('❌ GOOGLE-STYLE: Error sending email verification:', error);
      throw new Error('Failed to send email verification');
    }
  }

  /**
   * Google-style password reset template
   */
  private getGoogleStylePasswordResetTemplate(firstName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: 'Google Sans', Arial, sans-serif;
            line-height: 1.6;
            color: #202124;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            overflow: hidden;
          }
          .header {
            background: #1a73e8;
            color: white;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 400;
          }
          .content {
            padding: 32px 24px;
          }
          .content h2 {
            color: #202124;
            font-size: 20px;
            font-weight: 400;
            margin: 0 0 16px 0;
          }
          .content p {
            color: #5f6368;
            margin: 0 0 24px 0;
          }
          .button {
            display: inline-block;
            background: #1a73e8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            margin: 16px 0;
            transition: background-color 0.2s;
          }
          .button:hover {
            background: #1557b0;
          }
          .security-notice {
            background: #fef7e0;
            border: 1px solid #f9ab00;
            border-radius: 4px;
            padding: 16px;
            margin: 24px 0;
          }
          .security-notice strong {
            color: #ea8600;
          }
          .footer {
            background: #f8f9fa;
            padding: 24px;
            text-align: center;
            color: #5f6368;
            font-size: 14px;
          }
          .link {
            color: #1a73e8;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>We received a request to reset your password for your Ask Ya Cham account.</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p class="link">${resetUrl}</p>
            
            <div class="security-notice">
              <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
            </div>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Ask Ya Cham Team</p>
            <p>© 2024 Ask Ya Cham. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Google-style welcome template
   */
  private getGoogleStyleWelcomeTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Ask Ya Cham</title>
        <style>
          body {
            font-family: 'Google Sans', Arial, sans-serif;
            line-height: 1.6;
            color: #202124;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            overflow: hidden;
          }
          .header {
            background: #1a73e8;
            color: white;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 400;
          }
          .content {
            padding: 32px 24px;
          }
          .content h2 {
            color: #202124;
            font-size: 20px;
            font-weight: 400;
            margin: 0 0 16px 0;
          }
          .content p {
            color: #5f6368;
            margin: 0 0 16px 0;
          }
          .button {
            display: inline-block;
            background: #1a73e8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            margin: 16px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 24px;
            text-align: center;
            color: #5f6368;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Ask Ya Cham! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Welcome to the future of job matching! We're thrilled to have you join our community of talented professionals and innovative companies.</p>
            
            <h3>What's next?</h3>
            <ul>
              <li>Complete your profile to get better job matches</li>
              <li>Upload your resume for AI-powered analysis</li>
              <li>Set your preferences and career goals</li>
              <li>Start receiving personalized job recommendations</li>
            </ul>
            
            <a href="${this.frontendUrl}/dashboard" class="button">Get Started</a>
            
            <p>If you have any questions, our support team is here to help!</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Ask Ya Cham Team</p>
            <p>© 2024 Ask Ya Cham. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Google-style verification template
   */
  private getGoogleStyleVerificationTemplate(firstName: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: 'Google Sans', Arial, sans-serif;
            line-height: 1.6;
            color: #202124;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            overflow: hidden;
          }
          .header {
            background: #1a73e8;
            color: white;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 400;
          }
          .content {
            padding: 32px 24px;
          }
          .content h2 {
            color: #202124;
            font-size: 20px;
            font-weight: 400;
            margin: 0 0 16px 0;
          }
          .content p {
            color: #5f6368;
            margin: 0 0 16px 0;
          }
          .button {
            display: inline-block;
            background: #1a73e8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            margin: 16px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 24px;
            text-align: center;
            color: #5f6368;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email Address</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Thank you for signing up for Ask Ya Cham! To complete your registration and start finding your dream job, please verify your email address.</p>
            
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            
            <p>This link will expire in 24 hours for security reasons.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Ask Ya Cham Team</p>
            <p>© 2024 Ask Ya Cham. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Test SendGrid connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/user/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        logger.info('✅ GOOGLE-STYLE: SendGrid connection test successful');
        return true;
      } else {
        logger.error(`❌ GOOGLE-STYLE: SendGrid connection test failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      logger.error('❌ GOOGLE-STYLE: SendGrid connection test error:', error);
      return false;
    }
  }
}
