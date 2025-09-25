// 🚀 SIMPLE EMAIL SERVICE - Works without external dependencies
// This service provides email functionality for development and testing

export interface SimpleEmailRequest {
  to: string
  subject: string
  html: string
  text?: string
}

export interface SimpleEmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

// 🚀 SIMPLE EMAIL SERVICE CLASS
export class SimpleEmailService {
  private sentEmails: Array<{
    id: string
    to: string
    subject: string
    html: string
    text: string
    sentAt: string
    status: string
  }> = []

  // 🚀 SEND EMAIL (Mock implementation for development)
  async sendEmail(request: SimpleEmailRequest): Promise<SimpleEmailResponse> {
    try {
      console.log('🚀 SIMPLE EMAIL SERVICE - Sending email:')
      console.log('📧 To:', request.to)
      console.log('📝 Subject:', request.subject)
      console.log('📄 Content:', request.text || 'HTML content')
      
      // 🚀 STORE EMAIL IN MEMORY (for testing)
      const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      this.sentEmails.push({
        id: emailId,
        to: request.to,
        subject: request.subject,
        html: request.html,
        text: request.text || '',
        sentAt: new Date().toISOString(),
        status: 'sent'
      })

      // 🚀 IN DEVELOPMENT: Log to console
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 EMAIL SENT SUCCESSFULLY!')
        console.log('📧 Email ID:', emailId)
        console.log('📧 To:', request.to)
        console.log('📧 Subject:', request.subject)
        console.log('📧 Content Preview:', request.html.substring(0, 200) + '...')
        console.log('📧 Full HTML:', request.html)
      }

      // 🚀 IN PRODUCTION: Use actual email service
      if (process.env.NODE_ENV === 'production') {
        // Here you would integrate with SendGrid, AWS SES, or other email service
        console.log('🚀 PRODUCTION: Would send email via SendGrid/SES')
      }

      return {
        success: true,
        messageId: emailId
      }

    } catch (error) {
      console.error('🚨 Email sending failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 🚀 SEND OTP EMAIL
  async sendOTPEmail(email: string, otp: string): Promise<SimpleEmailResponse> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 28px; margin: 0;">Ask Ya Cham</h1>
          <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">Your secure login code</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 15px 0;">Your Login Code</h2>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px dashed #d1d5db;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">This code expires in 5 minutes</p>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: #92400e; font-size: 16px; margin: 0 0 10px 0;">🔒 Security Notice</h3>
          <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 20px;">
            <li>Never share this code with anyone</li>
            <li>Ask Ya Cham will never ask for your login code</li>
            <li>If you didn't request this code, please ignore this email</li>
          </ul>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 12px;">
          <p>This email was sent to ${email}</p>
          <p>© 2024 Ask Ya Cham. All rights reserved.</p>
        </div>
      </div>
    `

    const text = `
      Ask Ya Cham - Your Login Code
      
      Your secure login code is: ${otp}
      
      This code expires in 5 minutes.
      
      Security Notice:
      - Never share this code with anyone
      - Ask Ya Cham will never ask for your login code
      - If you didn't request this code, please ignore this email
      
      This email was sent to ${email}
      © 2024 Ask Ya Cham. All rights reserved.
    `

    return this.sendEmail({
      to: email,
      subject: 'Your Ask Ya Cham Login Code',
      html,
      text
    })
  }

  // 🚀 GET SENT EMAILS (for testing)
  getSentEmails() {
    return this.sentEmails
  }

  // 🚀 CLEAR SENT EMAILS (for testing)
  clearSentEmails() {
    this.sentEmails = []
    console.log('🚀 Cleared sent emails')
  }
}

// 🚀 CREATE SINGLETON INSTANCE
export const simpleEmailService = new SimpleEmailService()

// 🚀 EXPORT FUNCTIONS
export async function sendEmail(request: SimpleEmailRequest): Promise<SimpleEmailResponse> {
  return simpleEmailService.sendEmail(request)
}

export async function sendOTPEmail(email: string, otp: string): Promise<SimpleEmailResponse> {
  return simpleEmailService.sendOTPEmail(email, otp)
}
