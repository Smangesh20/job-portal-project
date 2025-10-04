import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, subject, body } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    console.log('🚀 DIRECT EMAIL TEST - Starting...')
    console.log('📧 Target Email:', email)
    console.log('📝 Subject:', subject || 'Direct Email Test')
    
    // 🚀 YOUR SENDGRID API KEY
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    console.log('🔧 ENVIRONMENT CHECK:')
    console.log('  - SENDGRID_API_KEY exists:', !!sendGridApiKey)
    console.log('  - SENDGRID_API_KEY length:', sendGridApiKey?.length || 0)
    console.log('  - FROM_EMAIL:', fromEmail)

    if (!sendGridApiKey) {
      console.error('🚨 SENDGRID_API_KEY MISSING!')
      return NextResponse.json({ 
        success: false, 
        error: 'SENDGRID_API_KEY not found in environment variables',
        debug: {
          SENDGRID_API_KEY: 'MISSING',
          FROM_EMAIL: fromEmail,
          NODE_ENV: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    // 🚀 SETUP SENDGRID
    sgMail.setApiKey(sendGridApiKey)

    // 🚀 CREATE EMAIL MESSAGE
    const msg = {
      to: email,
      from: { 
        email: fromEmail, 
        name: 'Ask Ya Cham Direct Test' 
      },
      subject: subject || '🚀 DIRECT EMAIL TEST - WORKING!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">🚀 EMAIL WORKING PERFECTLY!</h1>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">✅ Email Delivery Confirmed!</h2>
            <p style="color: #1e3a8a; font-size: 16px;">
              This email was sent directly using SendGrid API. If you received this, 
              your email service is working perfectly!
            </p>
          </div>
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #047857; margin-top: 0;">📧 Email Details:</h3>
            <ul style="color: #065f46;">
              <li><strong>From:</strong> ${fromEmail}</li>
              <li><strong>To:</strong> ${email}</li>
              <li><strong>Subject:</strong> ${subject || 'Direct Email Test'}</li>
              <li><strong>Sent At:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          ${body ? `<div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">📝 Custom Message:</h3>
            <p style="color: #78350f;">${body}</p>
          </div>` : ''}
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
            <p style="color: #6b7280; margin: 0;">
              🎉 <strong>Success!</strong> Your email service is working like Google!
            </p>
          </div>
        </div>
      `,
      text: `
        🚀 EMAIL WORKING PERFECTLY!

        ✅ Email Delivery Confirmed!
        This email was sent directly using SendGrid API. If you received this, 
        your email service is working perfectly!

        📧 Email Details:
        - From: ${fromEmail}
        - To: ${email}
        - Subject: ${subject || 'Direct Email Test'}
        - Sent At: ${new Date().toLocaleString()}

        ${body ? `📝 Custom Message:\n${body}\n` : ''}

        🎉 Success! Your email service is working like Google!
      `
    }

    console.log('🚀 Sending email via SendGrid...')
    console.log('📧 Message details:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject
    })

    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg)
    
    console.log('📧 EMAIL SENT SUCCESSFULLY!')
    console.log('📧 SendGrid Status Code:', response[0].statusCode)
    console.log('📧 Message ID:', response[0].headers['x-message-id'])
    console.log('📧 Response Headers:', response[0].headers)

    const messageId = response[0].headers['x-message-id'] as string || `direct_${Date.now()}`

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully via SendGrid!',
      data: {
        messageId,
        statusCode: response[0].statusCode,
        to: email,
        from: fromEmail,
        subject: subject || 'Direct Email Test',
        sentAt: new Date().toISOString(),
        sendGridResponse: {
          statusCode: response[0].statusCode,
          headers: response[0].headers
        }
      },
      debug: {
        environment: {
          SENDGRID_API_KEY: 'SET',
          FROM_EMAIL: fromEmail,
          NODE_ENV: process.env.NODE_ENV
        },
        sendGrid: {
          apiKeyLength: sendGridApiKey.length,
          fromEmail: fromEmail,
          messageId
        }
      }
    })

  } catch (error: any) {
    console.error('🚨 DIRECT EMAIL TEST FAILED:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send email',
      debug: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        errorStack: error.stack,
        environment: {
          SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'SET' : 'MISSING',
          FROM_EMAIL: process.env.FROM_EMAIL || 'DEFAULT',
          NODE_ENV: process.env.NODE_ENV
        }
      }
    }, { status: 500 })
  }
}

// 🚀 GET STATUS
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '✅ SET' : '❌ MISSING',
      FROM_EMAIL: process.env.FROM_EMAIL || 'info@askyacham.com',
      NODE_ENV: process.env.NODE_ENV,
      STATUS: '✅ Direct email test endpoint ready'
    }
  })
}










