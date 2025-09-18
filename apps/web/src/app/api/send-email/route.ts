import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

interface EmailRequest {
  to: string
  subject: string
  html: string
  text: string
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text }: EmailRequest = await request.json()

    // Use regular environment variables for server-side
    const apiKey = process.env.SENDGRID_API_KEY || process.env.NEXT_PUBLIC_SENDGRID_API_KEY
    
    if (!apiKey) {
      console.error('❌ SendGrid API key not found in environment variables')
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('SENDGRID')))
      return NextResponse.json(
        { success: false, error: 'SendGrid API key not configured' },
        { status: 500 }
      )
    }

    // Initialize SendGrid with the API key
    sgMail.setApiKey(apiKey)
    
    const fromEmail = process.env.FROM_EMAIL || process.env.NEXT_PUBLIC_FROM_EMAIL || 'info@askyacham.com'

    const msg = {
      to,
      from: fromEmail,
      subject,
      text,
      html,
    }

    console.log('📧 Sending email via SendGrid API:', {
      to,
      subject,
      from: fromEmail
    })

    const response = await sgMail.send(msg)
    
    console.log('✅ Email sent successfully via SendGrid:', response[0].headers['x-message-id'])

    return NextResponse.json({
      success: true,
      messageId: response[0].headers['x-message-id']
    })

  } catch (error: any) {
    console.error('❌ SendGrid email send failed:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send email' 
      },
      { status: 500 }
    )
  }
}
