import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 SIMPLE EMAIL TEST
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    // 🚀 CHECK ENVIRONMENT
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    console.log('🚀 SIMPLE EMAIL TEST:')
    console.log('📧 SendGrid API Key exists:', !!sendGridApiKey)
    console.log('📧 From Email:', fromEmail)
    console.log('📧 To Email:', email)

    if (!sendGridApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY not found in environment variables',
        envCheck: {
          SENDGRID_API_KEY: 'MISSING',
          FROM_EMAIL: fromEmail
        }
      }, { status: 500 })
    }

    // 🚀 SETUP SENDGRID
    sgMail.setApiKey(sendGridApiKey)

    // 🚀 CREATE SIMPLE EMAIL
    const msg = {
      to: email,
      from: {
        email: fromEmail,
        name: 'Ask Ya Cham'
      },
      subject: '🚀 Simple Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">🚀 Test Email</h1>
          <p style="color: #666; font-size: 16px;">
            This is a simple test email to verify that your SendGrid integration is working correctly.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Test Details:</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li><strong>Recipient:</strong> ${email}</li>
              <li><strong>Sender:</strong> ${fromEmail}</li>
              <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Status:</strong> ✅ Email Sent Successfully</li>
            </ul>
          </div>
          <p style="color: #666; font-size: 16px;">
            If you received this email, your SendGrid integration is working perfectly!
          </p>
        </div>
      `,
      text: `🚀 Test Email\n\nThis is a simple test email to verify that your SendGrid integration is working correctly.\n\nRecipient: ${email}\nSender: ${fromEmail}\nTimestamp: ${new Date().toLocaleString()}\nStatus: ✅ Email Sent Successfully\n\nIf you received this email, your SendGrid integration is working perfectly!`
    }

    console.log('🚀 Sending simple email via SendGrid...')
    
    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg)
    
    console.log('📧 Simple email sent successfully!')
    console.log('📧 SendGrid response:', response)

    return NextResponse.json({
      success: true,
      message: 'Simple test email sent successfully',
      data: {
        email,
        fromEmail,
        messageId: response[0]?.headers?.['x-message-id'] || 'unknown',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('🚨 Simple email test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send simple test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// 🚀 GET ENVIRONMENT STATUS
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      FROM_EMAIL: process.env.FROM_EMAIL || 'info@askyacham.com',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  })
}






