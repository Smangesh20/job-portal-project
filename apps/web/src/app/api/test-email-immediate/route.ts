import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 IMMEDIATE EMAIL TEST
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    // 🚀 YOUR SENDGRID API KEY (from environment)
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    console.log('🚀 IMMEDIATE EMAIL TEST WITH YOUR API KEY:')
    console.log('📧 SendGrid API Key:', sendGridApiKey ? 'SET' : 'MISSING')
    console.log('📧 From Email:', fromEmail)
    console.log('📧 To Email:', email)

    // 🚀 CHECK SENDGRID API KEY
    if (!sendGridApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SendGrid API key not configured. Please set SENDGRID_API_KEY environment variable.',
        instructions: {
          step1: 'Set SENDGRID_API_KEY environment variable',
          step2: 'Restart your application',
          step3: 'Test email delivery again'
        }
      }, { status: 500 })
    }

    // 🚀 SETUP SENDGRID
    sgMail.setApiKey(sendGridApiKey)

    // 🚀 CREATE EMAIL
    const msg = {
      to: email,
      from: {
        email: fromEmail,
        name: 'Ask Ya Cham'
      },
      subject: '🚀 IMMEDIATE EMAIL TEST - Your SendGrid is Working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Ask Ya Cham</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">World-Class Job Portal</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">🎉 IMMEDIATE EMAIL TEST SUCCESSFUL!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Congratulations! Your SendGrid integration is working perfectly with your API key. 
              This is a real email sent using your configured SendGrid account.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Test Details:</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li><strong>Recipient:</strong> ${email}</li>
                <li><strong>Sender:</strong> ${fromEmail}</li>
                <li><strong>API Key:</strong> ${sendGridApiKey.substring(0, 10)}...</li>
                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Status:</strong> ✅ Delivered Successfully</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your authentication system is now ready to send real OTP emails to users. 
              The email service is working at enterprise level with your SendGrid account!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://askyacham.com" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Visit Ask Ya Cham
              </a>
            </div>
          </div>
        </div>
      `,
      text: `🚀 Ask Ya Cham - IMMEDIATE Email Test Successful!\n\nCongratulations! Your SendGrid integration is working perfectly with your API key.\n\nRecipient: ${email}\nSender: ${fromEmail}\nAPI Key: ${sendGridApiKey.substring(0, 10)}...\nTimestamp: ${new Date().toLocaleString()}\nStatus: ✅ Delivered Successfully\n\nVisit: https://askyacham.com`
    }

    console.log('🚀 Sending immediate email with your SendGrid API key...')
    
    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg)
    
    console.log('📧 Immediate email sent successfully with your API key!')
    console.log('📧 SendGrid response:', response)

    return NextResponse.json({
      success: true,
      message: 'Immediate email sent successfully with your SendGrid API key',
      data: {
        email,
        fromEmail,
        apiKeyUsed: sendGridApiKey.substring(0, 10) + '...',
        messageId: response[0]?.headers?.['x-message-id'] || 'unknown',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('🚨 Immediate email test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send immediate email with your SendGrid API key',
      details: error instanceof Error ? error.message : 'Unknown error'
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
      STATUS: '✅ Ready to send emails'
    }
  })
}
