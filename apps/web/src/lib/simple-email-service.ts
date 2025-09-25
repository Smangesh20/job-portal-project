// 🚀 REAL-TIME EMAIL SERVICE - Sends actual emails
// This service sends real emails using SendGrid

import sgMail from '@sendgrid/mail'

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

  // 🚀 SEND EMAIL (Real SendGrid implementation)
  async sendEmail(request: SimpleEmailRequest): Promise<SimpleEmailResponse> {
    try {
      console.log('🚀 REAL-TIME EMAIL SERVICE - Sending email:')
      console.log('📧 To:', request.to)
      console.log('📝 Subject:', request.subject)
      
      // 🚀 CONFIGURE SENDGRID
      const sendGridApiKey = process.env.SENDGRID_API_KEY
      const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'
      
      console.log('🚀 EMAIL CONFIG: SendGrid API Key exists:', !!sendGridApiKey)
      console.log('🚀 EMAIL CONFIG: SendGrid API Key length:', sendGridApiKey?.length || 0)
      console.log('🚀 EMAIL CONFIG: From Email:', fromEmail)
      console.log('🚀 EMAIL CONFIG: Sending to:', request.to)
      console.log('🔧 Environment Variables:')
      console.log('  - SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'MISSING')
      console.log('  - FROM_EMAIL:', process.env.FROM_EMAIL || 'DEFAULT: info@askyacham.com')
      
      if (!sendGridApiKey) {
        console.error('🚨 SENDGRID_API_KEY not found in environment variables')
        return {
          success: false,
          error: 'SendGrid API key not configured. Please add SENDGRID_API_KEY to environment variables.'
        }
      }

      // 🚀 SETUP SENDGRID
      sgMail.setApiKey(sendGridApiKey)

      // 🚀 SEND REAL EMAIL
      const msg = {
        to: request.to,
        from: {
          email: fromEmail,
          name: 'Ask Ya Cham'
        },
        subject: request.subject,
        html: request.html,
        text: request.text || request.html.replace(/<[^>]*>/g, ''),
      }

      console.log('🚀 Sending real email via SendGrid...')
      const response = await sgMail.send(msg)
      
      console.log('📧 REAL EMAIL SENT SUCCESSFULLY!')
      console.log('📧 SendGrid Response:', response[0].statusCode)
      console.log('📧 Message ID:', response[0].headers['x-message-id'])
      
      // 🚀 STORE EMAIL IN MEMORY
      const emailId = response[0].headers['x-message-id'] || `email_${Date.now()}`
      this.sentEmails.push({
        id: emailId,
        to: request.to,
        subject: request.subject,
        html: request.html,
        text: request.text || '',
        sentAt: new Date().toISOString(),
        status: 'sent'
      })

      return {
        success: true,
        messageId: emailId
      }

    } catch (error) {
      console.error('🚨 Real email sending failed:', error)
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
