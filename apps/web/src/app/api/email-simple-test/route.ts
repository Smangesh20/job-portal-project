import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 SIMPLE EMAIL TEST - GUARANTEED TO WORK
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // 🚀 DEBUG: Check environment variables
    console.log('🔍 DEBUGGING EMAIL SERVICE:')
    console.log('📧 SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET (length: ' + process.env.SENDGRID_API_KEY.length + ')' : 'MISSING')
    console.log('📧 FROM_EMAIL:', process.env.FROM_EMAIL || 'NOT SET')
    console.log('📧 NODE_ENV:', process.env.NODE_ENV)
    console.log('📧 Target Email:', email)

    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    if (!sendGridApiKey) {
      console.log('❌ SENDGRID_API_KEY is missing!')
      return NextResponse.json({
        success: false,
        error: 'SendGrid API key is missing. Please set SENDGRID_API_KEY environment variable.',
        debug: {
          sendGridApiKey: 'MISSING',
          fromEmail: fromEmail,
          nodeEnv: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    // 🚀 SETUP SENDGRID
    sgMail.setApiKey(sendGridApiKey)

    // 🚀 SIMPLE EMAIL
    const msg = {
      to: email,
      from: {
        email: fromEmail,
        name: 'Ask Ya Cham'
      },
      subject: '🚀 SIMPLE EMAIL TEST - WORKING!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">🚀 EMAIL WORKING!</h1>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af;">✅ EMAIL DELIVERY CONFIRMED!</h2>
            <p>This email was sent successfully using SendGrid!</p>
          </div>
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #047857;">📧 Email Details:</h3>
            <ul>
              <li><strong>To:</strong> ${email}</li>
              <li><strong>From:</strong> ${fromEmail}</li>
              <li><strong>Sent At:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Status:</strong> ✅ Delivered</li>
            </ul>
          </div>
          <p style="text-align: center; color: #6b7280;">
            🎉 Your email system is working perfectly!
          </p>
        </div>
      `,
      text: `🚀 EMAIL WORKING!

✅ EMAIL DELIVERY CONFIRMED!
This email was sent successfully using SendGrid!

📧 Email Details:
- To: ${email}
- From: ${fromEmail}
- Sent At: ${new Date().toLocaleString()}
- Status: ✅ Delivered

🎉 Your email system is working perfectly!`
    }

    console.log('🚀 Sending simple email...')
    
    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg)
    
    console.log('✅ Simple email sent successfully!')
    console.log('📧 SendGrid response:', JSON.stringify(response, null, 2))

    return NextResponse.json({
      success: true,
      message: '🚀 SIMPLE EMAIL SENT SUCCESSFULLY!',
      data: {
        email,
        fromEmail,
        messageId: response[0]?.headers?.['x-message-id'] || 'unknown',
        timestamp: new Date().toISOString(),
        sendGridResponse: response[0]
      }
    })

  } catch (error: any) {
    console.error('🚨 Simple email error:', error)
    console.error('🚨 Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body
    })
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send simple email',
      details: error.message || 'Unknown error',
      debug: {
        errorCode: error.code,
        errorResponse: error.response?.body
      }
    }, { status: 500 })
  }
}

// 🚀 GET STATUS
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      service: 'Simple Email Test Service',
      status: 'Active',
      sendGridConfigured: !!process.env.SENDGRID_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'info@askyacham.com',
      nodeEnv: process.env.NODE_ENV,
      lastUpdated: new Date().toISOString()
    }
  })
}







