import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 BULLETPROOF EMAIL SERVICE - WORKS LIKE GOOGLE
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // 🚀 BULLETPROOF SENDGRID CONFIGURATION
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    // 🚀 SETUP SENDGRID (BULLETPROOF)
    if (!sendGridApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY not configured in environment variables',
        bulletproof: false
      }, { status: 500 })
    }
    
    sgMail.setApiKey(sendGridApiKey)

    // 🚀 BULLETPROOF EMAIL MESSAGE
    const msg = {
      to: email,
      from: { 
        email: fromEmail, 
        name: 'Ask Ya Cham' 
      },
      subject: '🚀 BULLETPROOF EMAIL - WORKING!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Working!</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; text-align: center; font-size: 28px; margin-bottom: 20px;">
              🚀 EMAIL WORKING PERFECTLY!
            </h1>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h2 style="color: #1e40af; margin-top: 0;">✅ BULLETPROOF DELIVERY CONFIRMED!</h2>
              <p style="color: #1e3a8a; font-size: 16px; line-height: 1.6;">
                This email was sent using bulletproof SendGrid integration. 
                If you received this, your email service is working like Google!
              </p>
            </div>
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #047857; margin-top: 0;">📧 Email Details:</h3>
              <ul style="color: #065f46; line-height: 1.8;">
                <li><strong>From:</strong> ${fromEmail}</li>
                <li><strong>To:</strong> ${email}</li>
                <li><strong>Subject:</strong> BULLETPROOF EMAIL - WORKING!</li>
                <li><strong>Sent At:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Service:</strong> SendGrid (Enterprise Grade)</li>
              </ul>
            </div>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0;">🎯 What This Proves:</h3>
              <ul style="color: #78350f; line-height: 1.8;">
                <li>✅ SendGrid API is working perfectly</li>
                <li>✅ Email service is bulletproof</li>
                <li>✅ Environment variables are configured</li>
                <li>✅ Email delivery is successful</li>
                <li>✅ Your system works like Google!</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
              <p style="color: #6b7280; margin: 0; font-size: 18px;">
                🎉 <strong style="color: #2563eb;">SUCCESS!</strong> Your email service is bulletproof!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        🚀 EMAIL WORKING PERFECTLY!

        ✅ BULLETPROOF DELIVERY CONFIRMED!
        This email was sent using bulletproof SendGrid integration. 
        If you received this, your email service is working like Google!

        📧 Email Details:
        - From: ${fromEmail}
        - To: ${email}
        - Subject: BULLETPROOF EMAIL - WORKING!
        - Sent At: ${new Date().toLocaleString()}
        - Service: SendGrid (Enterprise Grade)

        🎯 What This Proves:
        ✅ SendGrid API is working perfectly
        ✅ Email service is bulletproof
        ✅ Environment variables are configured
        ✅ Email delivery is successful
        ✅ Your system works like Google!

        🎉 SUCCESS! Your email service is bulletproof!
      `
    }

    // 🚀 SEND BULLETPROOF EMAIL
    const response = await sgMail.send(msg)
    
    const messageId = response[0].headers['x-message-id'] as string || `bulletproof_${Date.now()}`

    return NextResponse.json({
      success: true,
      message: '🚀 BULLETPROOF EMAIL SENT SUCCESSFULLY!',
      data: {
        messageId,
        statusCode: response[0].statusCode,
        to: email,
        from: fromEmail,
        sentAt: new Date().toISOString(),
        bulletproof: true
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send bulletproof email',
      bulletproof: false
    }, { status: 500 })
  }
}