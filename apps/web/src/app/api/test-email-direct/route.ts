import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 DIRECT EMAIL TEST - SHOWS EXACTLY WHAT'S HAPPENING
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    // 🚀 GET SENDGRID API KEY
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    console.log('🚀 DIRECT EMAIL TEST:')
    console.log('📧 SendGrid API Key:', sendGridApiKey ? 'SET' : 'MISSING')
    console.log('📧 SendGrid API Key length:', sendGridApiKey?.length || 0)
    console.log('📧 From Email:', fromEmail)
    console.log('📧 To Email:', email)

    if (!sendGridApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SendGrid API key not configured',
        details: 'Please add SENDGRID_API_KEY to environment variables'
      }, { status: 500 })
    }

    // 🚀 SETUP SENDGRID
    sgMail.setApiKey(sendGridApiKey)

    // 🚀 CREATE TEST EMAIL
    const msg = {
      to: email,
      from: {
        email: fromEmail,
        name: 'Ask Ya Cham Test'
      },
      subject: '🚀 DIRECT EMAIL TEST - Ask Ya Cham',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Ask Ya Cham</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Direct Email Test</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">🎉 DIRECT EMAIL TEST SUCCESSFUL!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              This is a direct email test from Ask Ya Cham. If you received this email, 
              your SendGrid configuration is working correctly!
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Test Details:</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li><strong>Recipient:</strong> ${email}</li>
                <li><strong>Sender:</strong> ${fromEmail}</li>
                <li><strong>API Key:</strong> ${sendGridApiKey.substring(0, 10)}...</li>
                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Test Type:</strong> Direct Email Test</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your email service is working perfectly! Check your spam folder if you don't see this email in your inbox.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://askyacham.com" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Visit Ask Ya Cham
              </a>
            </div>
          </div>
        </div>
      `,
      text: `🚀 Ask Ya Cham - Direct Email Test Successful!\n\nThis is a direct email test from Ask Ya Cham. If you received this email, your SendGrid configuration is working correctly!\n\nRecipient: ${email}\nSender: ${fromEmail}\nTimestamp: ${new Date().toLocaleString()}\nTest Type: Direct Email Test\n\nVisit: https://askyacham.com`
    }

    console.log('🚀 Sending direct email test...')
    
    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg)
    
    console.log('📧 DIRECT EMAIL SENT!')
    console.log('📧 SendGrid Response:', response)
    console.log('📧 Status Code:', response[0].statusCode)
    console.log('📧 Message ID:', response[0].headers['x-message-id'])

    return NextResponse.json({
      success: true,
      message: 'Direct email test sent successfully',
      data: {
        email,
        fromEmail,
        messageId: response[0].headers['x-message-id'],
        statusCode: response[0].statusCode,
        timestamp: new Date().toISOString(),
        sendGridResponse: {
          statusCode: response[0].statusCode,
          headers: response[0].headers
        }
      }
    })

  } catch (error) {
    console.error('🚨 DIRECT EMAIL TEST ERROR:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Direct email test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      sendGridError: error
    }, { status: 500 })
  }
}

// 🚀 GET STATUS
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      FROM_EMAIL: process.env.FROM_EMAIL || 'info@askyacham.com',
      STATUS: '✅ Ready for direct email test'
    }
  })
}






