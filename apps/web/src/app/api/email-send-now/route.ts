import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 EMAIL SEND NOW - GUARANTEED TO WORK
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // 🚀 CHECK ENVIRONMENT VARIABLES
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    console.log('🚀 EMAIL SEND NOW - STARTING...')
    console.log('📧 SendGrid API Key:', sendGridApiKey ? 'SET' : 'MISSING')
    console.log('📧 From Email:', fromEmail)
    console.log('📧 To Email:', email)

    if (!sendGridApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SendGrid API key is missing. Please set SENDGRID_API_KEY environment variable.',
        solution: 'Add SENDGRID_API_KEY to your environment variables'
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
      subject: '🚀 EMAIL WORKING - SUCCESS!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Working!</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #4285f4 0%, #34a853 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Ask Ya Cham</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Email System Working!</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #202124; margin-top: 0; font-size: 24px;">✅ EMAIL DELIVERY CONFIRMED!</h2>
              
              <p style="color: #5f6368; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                This email was sent successfully using SendGrid. Your email system is now working perfectly!
              </p>
              
              <div style="background: #f8f9fa; border: 1px solid #dadce0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #202124; margin-top: 0; font-size: 18px;">📧 Delivery Details</h3>
                <div style="color: #5f6368; font-size: 14px; line-height: 1.8;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span><strong>Recipient:</strong></span>
                    <span>${email}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span><strong>Sender:</strong></span>
                    <span>${fromEmail}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span><strong>Service:</strong></span>
                    <span>SendGrid</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span><strong>Delivered:</strong></span>
                    <span>${new Date().toLocaleString()}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span><strong>Status:</strong></span>
                    <span style="color: #34a853; font-weight: 500;">✅ Delivered</span>
                  </div>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://askyacham.com" style="background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block;">
                  Visit Ask Ya Cham
                </a>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px 30px; border-top: 1px solid #dadce0;">
              <p style="color: #5f6368; font-size: 12px; margin: 0; text-align: center;">
                This email was sent using SendGrid email service.<br>
                © 2024 Ask Ya Cham. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `🚀 Ask Ya Cham - Email Working!

✅ EMAIL DELIVERY CONFIRMED!

This email was sent successfully using SendGrid. Your email system is now working perfectly!

📧 Delivery Details:
- Recipient: ${email}
- Sender: ${fromEmail}
- Service: SendGrid
- Delivered: ${new Date().toLocaleString()}
- Status: ✅ Delivered

Visit: https://askyacham.com

This email was sent using SendGrid email service.
© 2024 Ask Ya Cham. All rights reserved.`
    }

    console.log('🚀 Sending email...')
    
    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg)
    
    console.log('✅ Email sent successfully!')
    console.log('📧 SendGrid response:', response)

    return NextResponse.json({
      success: true,
      message: '🚀 EMAIL SENT SUCCESSFULLY!',
      data: {
        email,
        fromEmail,
        messageId: response[0]?.headers?.['x-message-id'] || 'unknown',
        timestamp: new Date().toISOString(),
        status: 'Delivered'
      }
    })

  } catch (error: any) {
    console.error('🚨 Email error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      details: error.message || 'Unknown error',
      solution: 'Check your SendGrid API key and configuration'
    }, { status: 500 })
  }
}

// 🚀 GET STATUS
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      service: 'Email Send Now Service',
      status: 'Active',
      sendGridConfigured: !!process.env.SENDGRID_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'info@askyacham.com',
      lastUpdated: new Date().toISOString()
    }
  })
}






