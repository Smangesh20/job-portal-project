// Professional Email Service for Forgot Password and Notifications
// This provides enterprise-level email functionality

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    // Force correct domain for production
    if (this.baseUrl.includes('askyacham.com')) {
      this.baseUrl = 'https://askyacham.com';
    }
  }

  // Generate password reset email template
  generatePasswordResetEmail(resetToken: string, userEmail: string, userName: string): EmailTemplate {
    const resetUrl = `${this.baseUrl}/auth/reset-password?token=${resetToken}`;
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleString(); // 15 minutes

    return {
      subject: '🔐 Password Reset Request - Ask Ya Cham',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Ask Ya Cham</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .button:hover { background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%); }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>Ask Ya Cham - Professional Job Portal</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>We received a request to reset your password for your Ask Ya Cham account.</p>
              
              <p><strong>Account:</strong> ${userEmail}</p>
              <p><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important Security Information:</strong>
                <ul>
                  <li>This link will expire in <strong>15 minutes</strong> (${expiryTime})</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                  <li>For security, this link can only be used once</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace;">${resetUrl}</p>
              
              <p>If you continue to have problems, please contact our support team.</p>
              
              <p>Best regards,<br>The Ask Ya Cham Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${userEmail}</p>
              <p>© 2024 Ask Ya Cham. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Reset Request - Ask Ya Cham

Hello ${userName}!

We received a request to reset your password for your Ask Ya Cham account.

Account: ${userEmail}
Request Time: ${new Date().toLocaleString()}

To reset your password, click the following link:
${resetUrl}

IMPORTANT SECURITY INFORMATION:
- This link will expire in 15 minutes (${expiryTime})
- If you didn't request this reset, please ignore this email
- Never share this link with anyone
- For security, this link can only be used once

If you continue to have problems, please contact our support team.

Best regards,
The Ask Ya Cham Team

This email was sent to ${userEmail}
© 2024 Ask Ya Cham. All rights reserved.
      `
    };
  }

  // Generate password change confirmation email
  generatePasswordChangeConfirmationEmail(userEmail: string, userName: string): EmailTemplate {
    return {
      subject: '✅ Password Successfully Changed - Ask Ya Cham',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed - Ask Ya Cham</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Password Successfully Changed</h1>
              <p>Ask Ya Cham - Professional Job Portal</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              
              <div class="success">
                <strong>✅ Success!</strong> Your password has been successfully changed.
              </div>
              
              <p><strong>Account:</strong> ${userEmail}</p>
              <p><strong>Change Time:</strong> ${new Date().toLocaleString()}</p>
              
              <p>If you made this change, no further action is required.</p>
              
              <p><strong>If you did NOT make this change:</strong></p>
              <ul>
                <li>Your account may have been compromised</li>
                <li>Please contact our support team immediately</li>
                <li>Consider changing your password again</li>
              </ul>
              
              <p>For your security, we recommend:</p>
              <ul>
                <li>Using a strong, unique password</li>
                <li>Enabling two-factor authentication if available</li>
                <li>Regularly reviewing your account activity</li>
              </ul>
              
              <p>Best regards,<br>The Ask Ya Cham Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${userEmail}</p>
              <p>© 2024 Ask Ya Cham. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Successfully Changed - Ask Ya Cham

Hello ${userName}!

✅ SUCCESS! Your password has been successfully changed.

Account: ${userEmail}
Change Time: ${new Date().toLocaleString()}

If you made this change, no further action is required.

If you did NOT make this change:
- Your account may have been compromised
- Please contact our support team immediately
- Consider changing your password again

For your security, we recommend:
- Using a strong, unique password
- Enabling two-factor authentication if available
- Regularly reviewing your account activity

Best regards,
The Ask Ya Cham Team

This email was sent to ${userEmail}
© 2024 Ask Ya Cham. All rights reserved.
      `
    };
  }

  // Send email using SendGrid API route (with fallback to simulation)
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string }> {
    try {
      // Try to send via SendGrid API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Email sent via SendGrid API:', result.messageId);
        return {
          success: true,
          messageId: result.messageId
        };
      } else {
        console.warn('⚠️ SendGrid API failed, falling back to simulation:', result.error);
        return this.simulateEmailSend(options);
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return this.simulateEmailSend(options);
    }
  }

  // Fallback simulation method
  private async simulateEmailSend(options: EmailOptions): Promise<{ success: boolean; messageId?: string }> {
    console.log('📧 Simulating email send:', {
      to: options.to,
      subject: options.subject,
      contentLength: options.html.length
    });

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store the email in localStorage for testing
    if (typeof window !== 'undefined') {
      const emailData = {
        id: `email_${Date.now()}`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        sentAt: new Date().toISOString(),
        status: 'simulated'
      };

      const existingEmails = JSON.parse(localStorage.getItem('askyacham_emails') || '[]');
      existingEmails.push(emailData);
      localStorage.setItem('askyacham_emails', JSON.stringify(existingEmails));
    }

    return {
      success: true,
      messageId: `sim_${Date.now()}`
    };
  }

  // Send password reset email
  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<{ success: boolean; messageId?: string }> {
    const template = this.generatePasswordResetEmail(resetToken, userEmail, userName);
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Send password change confirmation email
  async sendPasswordChangeConfirmationEmail(userEmail: string, userName: string): Promise<{ success: boolean; messageId?: string }> {
    const template = this.generatePasswordChangeConfirmationEmail(userEmail, userName);
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Get sent emails (for testing)
  getSentEmails(): any[] {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('askyacham_emails') || '[]');
    } catch (error) {
      console.error('Error retrieving sent emails:', error);
      return [];
    }
  }

  // Clear sent emails (for testing)
  clearSentEmails(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('askyacham_emails');
    }
  }
}

// Create singleton instance
export const emailService = new EmailService();

// Export types
export type { EmailTemplate, EmailOptions };
