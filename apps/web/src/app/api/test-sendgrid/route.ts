import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_EMAIL',
          message: 'Email is required'
        }
      }, { status: 400 });
    }

    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@askyacham.com';

    console.log(`🧪 Testing SendGrid with email: ${email}`);
    console.log(`📧 From Email: ${fromEmail}`);
    console.log(`🔑 API Key: ${sendGridApiKey ? 'Present' : 'Missing'}`);

    if (!sendGridApiKey) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NO_API_KEY',
          message: 'SendGrid API key not configured'
        }
      }, { status: 500 });
    }

    // Simple test email
    const emailData = {
      personalizations: [{
        to: [{ email: email }],
        subject: 'Test Email from Ask Ya Cham'
      }],
      from: { 
        email: fromEmail,
        name: 'Ask Ya Cham'
      },
      content: [
        {
          type: 'text/plain',
          value: 'This is a test email to verify SendGrid is working correctly.'
        }
      ]
    };

    console.log('📤 Sending email via SendGrid...');
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    console.log(`📡 SendGrid Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ SendGrid Error: ${errorData}`);
      return NextResponse.json({
        success: false,
        error: {
          code: 'SENDGRID_ERROR',
          message: `SendGrid API error: ${response.status}`,
          details: errorData
        }
      }, { status: response.status });
    }

    const messageId = response.headers.get('x-message-id');
    console.log(`✅ Email sent successfully! Message ID: ${messageId}`);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      data: {
        email,
        messageId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Test SendGrid Error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'TEST_ERROR',
        message: 'Error testing SendGrid',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
