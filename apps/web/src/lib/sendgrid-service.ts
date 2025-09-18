// SendGrid Email Service Integration
// Real email delivery using SendGrid API

// Dynamic import to avoid SSR issues
let sgMail: any = null

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

interface SendGridResponse {
  success: boolean
  messageId?: string
  error?: string
}

class SendGridService {
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      // Only initialize on client side
      if (typeof window === 'undefined') {
        console.warn('SendGrid can only be initialized on client side')
        return
      }

      // Dynamic import to avoid SSR issues
      if (!sgMail) {
        const sendgridModule = await import('@sendgrid/mail')
        sgMail = sendgridModule.default
      }

      // Initialize SendGrid with API key
      const apiKey = process.env.NEXT_PUBLIC_SENDGRID_API_KEY
      
      if (!apiKey) {
        console.warn('SendGrid API key not found. Emails will be simulated.')
        console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('SENDGRID')))
        console.log('NEXT_PUBLIC_SENDGRID_API_KEY:', process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
        return
      }

      sgMail.setApiKey(apiKey)
      this.isInitialized = true
      console.log('✅ SendGrid initialized successfully')
    } catch (error) {
      console.error('❌ SendGrid initialization failed:', error)
    }
  }

  async sendEmail(emailData: EmailData): Promise<SendGridResponse> {
    // Only work on client side
    if (typeof window === 'undefined') {
      console.warn('SendGrid can only send emails on client side')
      return this.simulateEmailSend(emailData)
    }

    // Initialize if not already done
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (!this.isInitialized || !sgMail) {
      console.warn('SendGrid not initialized. Simulating email send.')
      return this.simulateEmailSend(emailData)
    }

    try {
      const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@askyacham.com'
      
      const msg = {
        to: emailData.to,
        from: fromEmail,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      }

      console.log('📧 Sending email via SendGrid:', {
        to: emailData.to,
        subject: emailData.subject,
        from: fromEmail
      })

      const response = await sgMail.send(msg)
      
      console.log('✅ Email sent successfully via SendGrid:', response[0].headers['x-message-id'])
      
      return {
        success: true,
        messageId: response[0].headers['x-message-id'] as string
      }
    } catch (error: any) {
      console.error('❌ SendGrid email send failed:', error)
      
      return {
        success: false,
        error: error.message || 'Failed to send email'
      }
    }
  }

  private simulateEmailSend(emailData: EmailData): SendGridResponse {
    console.log('📧 Simulating email send (SendGrid not configured):', {
      to: emailData.to,
      subject: emailData.subject
    })

    // Store in localStorage for testing
    if (typeof window !== 'undefined') {
      try {
        const emailRecord = {
          id: `email_${Date.now()}`,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          sentAt: new Date().toISOString(),
          status: 'simulated',
          service: 'sendgrid'
        }

        const existingEmails = JSON.parse(localStorage.getItem('askyacham_emails') || '[]')
        existingEmails.push(emailRecord)
        localStorage.setItem('askyacham_emails', JSON.stringify(existingEmails))
      } catch (error) {
        console.error('Error storing simulated email:', error)
      }
    }

    return {
      success: true,
      messageId: `sim_${Date.now()}`
    }
  }

  // Test email sending
  async testEmail(to: string): Promise<SendGridResponse> {
    const testEmailData: EmailData = {
      to,
      subject: 'SendGrid Test Email - Ask Ya Cham',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SendGrid Test - Ask Ya Cham</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 SendGrid Integration Test</h1>
              <p>Ask Ya Cham - Professional Job Portal</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              
              <div class="success">
                <strong>✅ Success!</strong> SendGrid email service is working correctly.
              </div>
              
              <p>This is a test email to verify that SendGrid integration is working properly.</p>
              
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>Service: SendGrid</li>
                <li>Timestamp: ${new Date().toLocaleString()}</li>
                <li>Status: Working correctly</li>
              </ul>
              
              <p>If you received this email, your SendGrid integration is successful!</p>
              
              <p>Best regards,<br>The Ask Ya Cham Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
SendGrid Test Email - Ask Ya Cham

Hello!

✅ SUCCESS! SendGrid email service is working correctly.

This is a test email to verify that SendGrid integration is working properly.

Test Details:
- Service: SendGrid
- Timestamp: ${new Date().toLocaleString()}
- Status: Working correctly

If you received this email, your SendGrid integration is successful!

Best regards,
The Ask Ya Cham Team
      `
    }

    return await this.sendEmail(testEmailData)
  }

  // Get service status
  getStatus(): { initialized: boolean; hasApiKey: boolean; hasFromEmail: boolean } {
    const hasApiKey = !!(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || process.env.SENDGRID_API_KEY)
    const hasFromEmail = !!(process.env.NEXT_PUBLIC_FROM_EMAIL || process.env.FROM_EMAIL)
    
    return {
      initialized: this.isInitialized,
      hasApiKey,
      hasFromEmail
    }
  }
}

// Create singleton instance
export const sendGridService = new SendGridService()

// Export types
export type { EmailData, SendGridResponse }
