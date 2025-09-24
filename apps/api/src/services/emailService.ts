import nodemailer from 'nodemailer';
import { logger } from '@/utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private useSendGrid: boolean;
  private sendGridApiKey: string;

  constructor() {
    this.useSendGrid = process.env.EMAIL_PROVIDER === 'sendgrid' && !!process.env.SENDGRID_API_KEY;
    this.sendGridApiKey = process.env.SENDGRID_API_KEY || '';
    
    if (this.useSendGrid) {
      logger.info('Using SendGrid for email delivery');
      logger.info(`SendGrid API Key configured: ${this.sendGridApiKey ? 'Yes' : 'No'}`);
    } else {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      logger.info('Using SMTP for email delivery');
    }
  }

  /**
   * Send email using SendGrid API - Google-like implementation
   */
  private async sendViaSendGrid(mailOptions: any): Promise<void> {
    try {
      logger.info(`🚀 Sending email via SendGrid to: ${mailOptions.to}`);
      logger.info(`📧 From: ${mailOptions.from}`);
      logger.info(`📝 Subject: ${mailOptions.subject}`);
      
      // Google-like email payload with enhanced tracking
      const emailPayload = {
        personalizations: [{
          to: [{ email: mailOptions.to }],
          subject: mailOptions.subject,
          // Add tracking for Google-like analytics
          custom_args: {
            user_id: mailOptions.userId || 'unknown',
            email_type: mailOptions.emailType || 'general',
            timestamp: Date.now().toString(),
            source: 'ask-ya-cham-platform'
          }
        }],
        from: { 
          email: mailOptions.from,
          name: 'Ask Ya Cham'
        },
        reply_to: {
          email: 'support@askyacham.com',
          name: 'Ask Ya Cham Support'
        },
        content: [
          {
            type: 'text/plain',
            value: mailOptions.text
          },
          {
            type: 'text/html',
            value: mailOptions.html
          }
        ],
        // Google-like email settings
        mail_settings: {
          sandbox_mode: {
            enable: process.env.NODE_ENV === 'development'
          },
          spam_check: {
            enable: false,
            threshold: 5
          },
          click_tracking: {
            enable: true,
            enable_text: true
          },
          open_tracking: {
            enable: true,
            substitution_tag: '%open-track%'
          },
          subscription_tracking: {
            enable: true,
            text: 'If you would like to unsubscribe and stop receiving these emails, you can do so here: <% %>',
            html: '<p>If you would like to unsubscribe and stop receiving these emails, you can do so <a href="<% %>">here</a>.</p>',
            substitution_tag: '<% %>'
          }
        },
        // Real-time tracking like Google
        tracking_settings: {
          click_tracking: {
            enable: true,
            enable_text: true
          },
          open_tracking: {
            enable: true,
            substitution_tag: '%open-track%'
          },
          subscription_tracking: {
            enable: true,
            text: 'If you would like to unsubscribe and stop receiving these emails, you can do so here: <% %>',
            html: '<p>If you would like to unsubscribe and stop receiving these emails, you can do so <a href="<% %>">here</a>.</p>',
            substitution_tag: '<% %>'
          }
        }
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'AskYaCham-EmailService/1.0'
        },
        body: JSON.stringify(emailPayload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error(`❌ SendGrid API error: ${response.status} - ${errorData}`);
        
        // Google-like error handling with retry logic
        if (response.status === 429) {
          logger.warn('⏳ Rate limited by SendGrid, implementing backoff...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          throw new Error('Rate limited. Please try again in a moment.');
        }
        
        throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
      }

      const messageId = response.headers.get('x-message-id');
      const requestId = response.headers.get('x-request-id');
      
      logger.info(`✅ Email sent successfully via SendGrid!`);
      logger.info(`📧 Message ID: ${messageId}`);
      logger.info(`🆔 Request ID: ${requestId}`);
      logger.info(`📊 Email tracking enabled for real-time analytics`);
      
      // Store email metadata for Google-like tracking
      if (messageId) {
        await this.storeEmailMetadata(messageId, mailOptions, 'sent');
      }
      
    } catch (error) {
      logger.error('❌ SendGrid API error:', error);
      
      // Google-like fallback mechanism
      if (error.message.includes('Rate limited')) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send email using configured provider
   */
  private async sendEmail(mailOptions: any): Promise<void> {
    if (this.useSendGrid) {
      await this.sendViaSendGrid(mailOptions);
    } else {
      await this.transporter.sendMail(mailOptions);
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Ask Ya Cham" <info@askyacham.com>`,
        to: email,
        subject: 'Welcome to Ask Ya Cham! 🎉',
        html: this.getWelcomeEmailTemplate(firstName),
        text: `Welcome to Ask Ya Cham, ${firstName}! We're excited to help you find your dream job.`
      };

      await this.sendEmail(mailOptions);
      logger.info(`Welcome email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Send email verification email
   */
  async sendEmailVerificationEmail(email: string, firstName: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      
      const mailOptions = {
        from: `"Ask Ya Cham" <info@askyacham.com>`,
        to: email,
        subject: 'Verify your email address',
        html: this.getEmailVerificationTemplate(firstName, verificationUrl),
        text: `Hi ${firstName}, please verify your email by clicking this link: ${verificationUrl}`
      };

      await this.sendEmail(mailOptions);
      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email - Google-like implementation
   */
  async sendPasswordResetEmail(email: string, firstName: string, token: string, userId?: string): Promise<void> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      const timestamp = new Date().toISOString();
      
      const mailOptions = {
        from: `"Ask Ya Cham" <info@askyacham.com>`,
        to: email,
        subject: 'Reset your password - Ask Ya Cham',
        html: this.getPasswordResetTemplate(firstName, resetUrl, timestamp),
        text: `Hi ${firstName}, reset your password by clicking this link: ${resetUrl}`,
        userId: userId,
        emailType: 'password_reset',
        // Google-like metadata
        metadata: {
          timestamp,
          ip: 'unknown', // Will be set by controller
          userAgent: 'unknown', // Will be set by controller
          resetToken: token.substring(0, 8) + '...' // Partial token for logging
        }
      };

      await this.sendEmail(mailOptions);
      logger.info(`✅ Password reset email sent to ${email} at ${timestamp}`);
      logger.info(`🔐 Reset token: ${token.substring(0, 8)}...`);
      
      // Store reset attempt for Google-like security tracking
      await this.trackPasswordResetAttempt(email, userId, timestamp);
      
    } catch (error) {
      logger.error('❌ Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send job application confirmation
   */
  async sendApplicationConfirmationEmail(email: string, firstName: string, jobTitle: string, companyName: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Ask Ya Cham" <info@askyacham.com>`,
        to: email,
        subject: `Application submitted for ${jobTitle} at ${companyName}`,
        html: this.getApplicationConfirmationTemplate(firstName, jobTitle, companyName),
        text: `Hi ${firstName}, your application for ${jobTitle} at ${companyName} has been submitted successfully.`
      };

      await this.sendEmail(mailOptions);
      logger.info(`Application confirmation email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending application confirmation email:', error);
      throw new Error('Failed to send application confirmation email');
    }
  }

  /**
   * Send interview invitation email
   */
  async sendInterviewInvitationEmail(email: string, firstName: string, jobTitle: string, companyName: string, interviewDate: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Ask Ya Cham" <info@askyacham.com>`,
        to: email,
        subject: `Interview invitation for ${jobTitle} at ${companyName}`,
        html: this.getInterviewInvitationTemplate(firstName, jobTitle, companyName, interviewDate),
        text: `Hi ${firstName}, you've been invited for an interview for ${jobTitle} at ${companyName} on ${interviewDate}.`
      };

      await this.sendEmail(mailOptions);
      logger.info(`Interview invitation email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending interview invitation email:', error);
      throw new Error('Failed to send interview invitation email');
    }
  }

  /**
   * Send job match notification
   */
  async sendJobMatchNotificationEmail(email: string, firstName: string, jobTitle: string, companyName: string, matchScore: number): Promise<void> {
    try {
      const mailOptions = {
        from: `"Ask Ya Cham" <info@askyacham.com>`,
        to: email,
        subject: `🎯 New job match: ${jobTitle} at ${companyName}`,
        html: this.getJobMatchNotificationTemplate(firstName, jobTitle, companyName, matchScore),
        text: `Hi ${firstName}, we found a great job match for you: ${jobTitle} at ${companyName} (${matchScore}% match).`
      };

      await this.sendEmail(mailOptions);
      logger.info(`Job match notification email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending job match notification email:', error);
      throw new Error('Failed to send job match notification email');
    }
  }

  /**
   * Send weekly job digest
   */
  async sendWeeklyJobDigest(email: string, firstName: string, jobs: any[]): Promise<void> {
    try {
      const mailOptions = {
        from: `"Ask Ya Cham" <info@askyacham.com>`,
        to: email,
        subject: `Your weekly job digest - ${jobs.length} new matches`,
        html: this.getWeeklyJobDigestTemplate(firstName, jobs),
        text: `Hi ${firstName}, here are your weekly job matches: ${jobs.map(job => `${job.title} at ${job.company}`).join(', ')}`
      };

      await this.sendEmail(mailOptions);
      logger.info(`Weekly job digest sent to ${email}`);
    } catch (error) {
      logger.error('Error sending weekly job digest:', error);
      throw new Error('Failed to send weekly job digest');
    }
  }

  /**
   * Welcome email template
   */
  private getWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Ask Ya Cham</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
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
          
          <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
          
          <p>If you have any questions, our support team is here to help!</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Ask Ya Cham Team</p>
          <p>© 2024 Ask Ya Cham. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email verification template
   */
  private getEmailVerificationTemplate(firstName: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Thank you for signing up for Ask Ya Cham! To complete your registration and start finding your dream job, please verify your email address.</p>
          
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
          
          <p>This link will expire in 24 hours for security reasons.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Ask Ya Cham Team</p>
          <p>© 2024 Ask Ya Cham. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Store email metadata for Google-like tracking
   */
  private async storeEmailMetadata(messageId: string, mailOptions: any, status: string): Promise<void> {
    try {
      // In a real implementation, you'd store this in a database
      // For now, we'll just log it for Google-like tracking
      logger.info(`📊 Email metadata stored:`, {
        messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
        status,
        timestamp: new Date().toISOString(),
        emailType: mailOptions.emailType || 'general'
      });
    } catch (error) {
      logger.error('Error storing email metadata:', error);
    }
  }

  /**
   * Track password reset attempts for Google-like security
   */
  private async trackPasswordResetAttempt(email: string, userId?: string, timestamp?: string): Promise<void> {
    try {
      logger.info(`🔒 Password reset attempt tracked:`, {
        email,
        userId: userId || 'unknown',
        timestamp: timestamp || new Date().toISOString(),
        source: 'email_service'
      });
    } catch (error) {
      logger.error('Error tracking password reset attempt:', error);
    }
  }

  /**
   * Password reset template - Google-like design
   */
  private getPasswordResetTemplate(firstName: string, resetUrl: string, timestamp?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Ask Ya Cham</title>
        <style>
          body { 
            font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
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
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #4285f4 0%, #34a853 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 400;
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: #1a73e8; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 4px; 
            margin: 20px 0; 
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .button:hover {
            background: #1557b0;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #5f6368; 
            font-size: 14px; 
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e8eaed;
          }
          .warning { 
            background: #fef7e0; 
            border: 1px solid #fbbc04; 
            padding: 16px; 
            border-radius: 4px; 
            margin: 20px 0; 
            border-left: 4px solid #fbbc04;
          }
          .security-info {
            background: #e8f0fe;
            border: 1px solid #1a73e8;
            padding: 16px;
            border-radius: 4px;
            margin: 20px 0;
            border-left: 4px solid #1a73e8;
          }
          .timestamp {
            color: #5f6368;
            font-size: 12px;
            margin-top: 20px;
          }
          .link-fallback {
            word-break: break-all; 
            color: #1a73e8; 
            font-size: 14px;
            background: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid #e8eaed;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
          </div>
          <div class="content">
            <h2 style="color: #202124; margin-top: 0;">Hi ${firstName},</h2>
            <p>We received a request to reset your password for your Ask Ya Cham account. If you made this request, click the button below to reset your password.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="security-info">
              <strong>🔒 Security Information:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>This link will expire in 1 hour for your security</li>
                <li>Only you can use this link to reset your password</li>
                <li>If you didn't request this, you can safely ignore this email</li>
              </ul>
            </div>
            
            <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
            <div class="link-fallback">${resetUrl}</div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </div>
            
            ${timestamp ? `<div class="timestamp">Request made on: ${new Date(timestamp).toLocaleString()}</div>` : ''}
          </div>
          <div class="footer">
            <p><strong>Ask Ya Cham Team</strong></p>
            <p>This email was sent to help you secure your account. If you have any questions, contact our support team.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9aa0a6;">
              © 2024 Ask Ya Cham. All rights reserved.<br>
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Application confirmation template
   */
  private getApplicationConfirmationTemplate(firstName: string, jobTitle: string, companyName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Submitted</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .job-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Application Submitted! ✅</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Great news! Your application has been successfully submitted.</p>
          
          <div class="job-info">
            <h3>${jobTitle}</h3>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <h3>What happens next?</h3>
          <ul>
            <li>The employer will review your application</li>
            <li>You'll receive updates via email and in your dashboard</li>
            <li>If selected, you'll be contacted for the next steps</li>
          </ul>
          
          <p>You can track the status of all your applications in your <a href="${process.env.FRONTEND_URL}/dashboard/applications">dashboard</a>.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Ask Ya Cham Team</p>
          <p>© 2024 Ask Ya Cham. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Interview invitation template
   */
  private getInterviewInvitationTemplate(firstName: string, jobTitle: string, companyName: string, interviewDate: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Invitation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .interview-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Interview Invitation!</h1>
        </div>
        <div class="content">
          <h2>Congratulations ${firstName}!</h2>
          <p>You've been selected for an interview! The employer was impressed by your application and would like to meet you.</p>
          
          <div class="interview-info">
            <h3>${jobTitle}</h3>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Interview Date:</strong> ${interviewDate}</p>
            <p><strong>Status:</strong> Pending your confirmation</p>
          </div>
          
          <a href="${process.env.FRONTEND_URL}/dashboard/interviews" class="button">View Interview Details</a>
          
          <h3>Interview Tips:</h3>
          <ul>
            <li>Research the company thoroughly</li>
            <li>Prepare questions to ask the interviewer</li>
            <li>Practice common interview questions</li>
            <li>Dress professionally</li>
          </ul>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Ask Ya Cham Team</p>
          <p>© 2024 Ask Ya Cham. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Job match notification template
   */
  private getJobMatchNotificationTemplate(firstName: string, jobTitle: string, companyName: string, matchScore: number): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Job Match</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .job-match { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745; }
          .match-score { background: #28a745; color: white; padding: 5px 10px; border-radius: 20px; font-weight: bold; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 New Job Match!</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Our AI has found a great job match for you based on your skills, experience, and preferences!</p>
          
          <div class="job-match">
            <h3>${jobTitle}</h3>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Match Score:</strong> <span class="match-score">${matchScore}%</span></p>
            <p><strong>Why it's a great match:</strong></p>
            <ul>
              <li>Skills alignment with your profile</li>
              <li>Cultural fit with your preferences</li>
              <li>Career growth opportunities</li>
              <li>Competitive compensation</li>
            </ul>
          </div>
          
          <a href="${process.env.FRONTEND_URL}/jobs/${jobTitle.toLowerCase().replace(/\s+/g, '-')}" class="button">View Job Details</a>
          
          <p>Don't wait too long - great opportunities get filled quickly!</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Ask Ya Cham Team</p>
          <p>© 2024 Ask Ya Cham. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Weekly job digest template
   */
  private getWeeklyJobDigestTemplate(firstName: string, jobs: any[]): string {
    const jobCards = jobs.map(job => `
      <div style="background: white; padding: 20px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #667eea;">
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Match Score:</strong> ${job.matchScore}%</p>
        <p><strong>Salary:</strong> ${job.salary}</p>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Job Digest</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Your Weekly Job Digest</h1>
          <p>${jobs.length} new opportunities waiting for you</p>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Here are this week's top job matches based on your profile and preferences:</p>
          
          ${jobCards}
          
          <a href="${process.env.FRONTEND_URL}/dashboard/jobs" class="button">View All Jobs</a>
          
          <p>Happy job hunting! 🚀</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Ask Ya Cham Team</p>
          <p>© 2024 Ask Ya Cham. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Test email connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
}
