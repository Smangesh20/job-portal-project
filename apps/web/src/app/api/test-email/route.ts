import { NextRequest, NextResponse } from 'next/server';

// GOOGLE-STYLE EMAIL SERVICE - BULLETPROOF IMPLEMENTATION
class GoogleStyleEmailService {
  private sendGridApiKey: string;
  private fromEmail: string;
  private frontendUrl: string;

  constructor() {
    this.sendGridApiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@askyacham.com';
    this.frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com';
  }

  async sendTestEmail(email: string, type: string = 'password-reset'): Promise<void> {
    try {
      console.log(`📧 GOOGLE-STYLE: Sending ${type} test email to ${email}`);
      
      if (!this.sendGridApiKey) {
        throw new Error('SendGrid API key not configured');
      }
      
      let subject = 'Test Email - Ask Ya Cham';
      let htmlContent = '';
      
      switch (type) {
        case 'password-reset':
          subject = 'Test Password Reset - Ask Ya Cham';
          htmlContent = this.getTestPasswordResetTemplate();
          break;
        case 'welcome':
          subject = 'Test Welcome Email - Ask Ya Cham';
          htmlContent = this.getTestWelcomeTemplate();
          break;
        default:
          htmlContent = this.getTestEmailTemplate();
      }
      
      const emailData = {
        personalizations: [{
          to: [{ email: email }],
          subject: subject
        }],
        from: { 
          email: this.fromEmail,
          name: 'Ask Ya Cham'
        },
        content: [
          {
            type: 'text/html',
            value: htmlContent
          },
          {
            type: 'text/plain',
            value: `This is a test email from Ask Ya Cham to verify your SendGrid configuration is working correctly.`
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
        console.error(`❌ SendGrid API error: ${response.status} - ${errorData}`);
        throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
      }

      const messageId = response.headers.get('x-message-id');
      console.log(`✅ GOOGLE-STYLE: Test email sent successfully - Message ID: ${messageId}`);
      
    } catch (error) {
      console.error('❌ GOOGLE-STYLE: Error sending test email:', error);
      throw new Error('Failed to send test email');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.sendGridApiKey) {
        return false;
      }

      const response = await fetch('https://api.sendgrid.com/v3/user/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json',
        }
      });

      return response.ok;
    } catch (error) {
      console.error('❌ SendGrid connection test error:', error);
      return false;
    }
  }

  private getTestPasswordResetTemplate(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
          .container { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); overflow: hidden; }
          .header { background: #1a73e8; color: white; padding: 32px 24px; text-align: center; }
          .content { padding: 32px 24px; }
          .button { display: inline-block; background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0; }
          .footer { background: #f8f9fa; padding: 24px; text-align: center; color: #5f6368; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧪 Test Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hi Test User,</h2>
            <p>This is a test email to verify your SendGrid configuration is working correctly.</p>
            <a href="#" class="button">Test Reset Password</a>
            <p>If you can see this email, your SendGrid setup is working perfectly! 🎉</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Ask Ya Cham Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getTestWelcomeTemplate(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Welcome Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
          .container { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); overflow: hidden; }
          .header { background: #1a73e8; color: white; padding: 32px 24px; text-align: center; }
          .content { padding: 32px 24px; }
          .footer { background: #f8f9fa; padding: 24px; text-align: center; color: #5f6368; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Test Welcome Email</h1>
          </div>
          <div class="content">
            <h2>Hi Test User,</h2>
            <p>This is a test welcome email to verify your SendGrid configuration is working correctly.</p>
            <p>If you can see this email, your SendGrid setup is working perfectly! 🚀</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Ask Ya Cham Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getTestEmailTemplate(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
          .container { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); overflow: hidden; }
          .header { background: #1a73e8; color: white; padding: 32px 24px; text-align: center; }
          .content { padding: 32px 24px; }
          .footer { background: #f8f9fa; padding: 24px; text-align: center; color: #5f6368; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Test Email</h1>
          </div>
          <div class="content">
            <h2>Hi Test User,</h2>
            <p>This is a test email to verify your SendGrid configuration is working correctly.</p>
            <p>If you can see this email, your SendGrid setup is working perfectly! ✅</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Ask Ya Cham Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 TESTING: SendGrid connection');
    
    const emailService = new GoogleStyleEmailService();
    const isConnected = await emailService.testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: '✅ SendGrid connection successful',
        data: {
          status: 'connected',
          timestamp: new Date().toISOString(),
          provider: 'SendGrid',
          fromEmail: process.env.FROM_EMAIL || 'noreply@askyacham.com',
          frontendUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.askyacham.com'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: 'CONNECTION_FAILED',
          message: 'SendGrid connection failed'
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ CONNECTION TEST ERROR:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'CONNECTION_ERROR',
        message: 'Error testing SendGrid connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, type = 'password-reset' } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_EMAIL',
          message: 'Email address is required for testing'
        }
      }, { status: 400 });
    }

    console.log(`🧪 TESTING: SendGrid email to ${email} (type: ${type})`);

    const emailService = new GoogleStyleEmailService();
    await emailService.sendTestEmail(email, type);

    return NextResponse.json({
      success: true,
      message: `✅ ${type} test email sent successfully to ${email}`,
      data: {
        email,
        type,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }
    });

  } catch (error) {
    console.error('❌ TEST EMAIL ERROR:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'EMAIL_SEND_FAILED',
        message: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}






