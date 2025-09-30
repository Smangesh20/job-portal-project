import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 FINAL EMAIL TEST
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    // 🚀 GET SENDGRID API KEY FROM ENVIRONMENT
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    console.log('🚀 FINAL EMAIL TEST:')
    console.log('📧 SendGrid API Key exists:', !!sendGridApiKey)
    console.log('📧 From Email:', fromEmail)
    console.log('📧 To Email:', email)

    if (!sendGridApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY not found in environment variables',
        instructions: {
          step1: 'Add SENDGRID_API_KEY to environment variables',
          step2: 'Add FROM_EMAIL to environment variables',
          step3: 'Restart the application',
          step4: 'Test email delivery'
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
      subject: '🚀 Final Email Test - Your SendGrid is Working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Ask Ya Cham</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">World-Class Job Portal</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">🎉 Final Email Test Successful!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Congratulations! Your SendGrid integration is working perfectly. 
              This is a real email sent using your configured SendGrid account.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Test Details:</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li><strong>Recipient:</strong> ${email}</li>
                <li><strong>Sender:</strong> ${fromEmail}</li>
                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Status:</strong> ✅ Delivered Successfully</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your authentication system is now ready to send real OTP emails to users. 
              The email service is working at enterprise level!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://askyacham.com" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Visit Ask Ya Cham
              </a>
            </div>
          </div>
        </div>
      `,
      text: `🚀 Ask Ya Cham - Final Email Test Successful!\n\nCongratulations! Your SendGrid integration is working perfectly.\n\nRecipient: ${email}\nSender: ${fromEmail}\nTimestamp: ${new Date().toLocaleString()}\nStatus: ✅ Delivered Successfully\n\nVisit: https://askyacham.com`
    }

    console.log('🚀 Sending final email test...')
    
    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg)
    
    console.log('📧 Final email test sent successfully!')
    console.log('📧 SendGrid response:', response)

    return NextResponse.json({
      success: true,
      message: 'Final email test sent successfully',
      data: {
        email,
        fromEmail,
        messageId: response[0]?.headers?.['x-message-id'] || 'unknown',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('🚨 Final email test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send final email test',
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
      STATUS: process.env.SENDGRID_API_KEY ? '✅ Ready to send emails' : '❌ Configure SendGrid API key'
    }
  })
}






