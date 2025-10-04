import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 EMAIL DIRECT - BULLETPROOF EMAIL
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 })
    }

    console.log('🚀 EMAIL DIRECT - STARTING...')
    console.log('📧 To:', email)

    // 🚀 CHECK API KEY
    const apiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    console.log('📧 API Key:', apiKey ? 'SET' : 'MISSING')
    console.log('📧 From:', fromEmail)

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'SendGrid API key missing',
        solution: 'Set SENDGRID_API_KEY environment variable'
      }, { status: 500 })
    }

    // 🚀 SETUP SENDGRID
    sgMail.setApiKey(apiKey)

    // 🚀 SIMPLE EMAIL
    const msg = {
      to: email,
      from: fromEmail,
      subject: '✅ EMAIL WORKING - Ask Ya Cham',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4285f4;">🚀 Ask Ya Cham</h1>
          <h2 style="color: #34a853;">✅ EMAIL DELIVERED SUCCESSFULLY!</h2>
          <p>Your email system is working perfectly!</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Recipient:</strong> ${email}</p>
            <p><strong>Sender:</strong> ${fromEmail}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> ✅ Delivered</p>
          </div>
          <p>Visit: <a href="https://askyacham.com">askyacham.com</a></p>
        </div>
      `,
      text: `🚀 Ask Ya Cham - EMAIL WORKING!

✅ EMAIL DELIVERED SUCCESSFULLY!

Your email system is working perfectly!

Recipient: ${email}
Sender: ${fromEmail}
Time: ${new Date().toLocaleString()}
Status: ✅ Delivered

Visit: https://askyacham.com`
    }

    console.log('🚀 Sending email...')
    
    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg)
    
    console.log('✅ Email sent!')
    console.log('📧 Response:', response[0]?.headers?.['x-message-id'])

    return NextResponse.json({
      success: true,
      message: '🚀 EMAIL SENT!',
      data: {
        email,
        messageId: response[0]?.headers?.['x-message-id'] || 'sent',
        status: 'Delivered'
      }
    })

  } catch (error: any) {
    console.error('🚨 Email error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Email failed',
      details: error.message
    }, { status: 500 })
  }
}










