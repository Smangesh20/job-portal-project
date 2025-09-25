import { NextRequest, NextResponse } from 'next/server'

// 🚀 FORCE DYNAMIC RENDERING
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 🚀 CHECK EMAIL DELIVERY STATUS
export async function GET() {
  try {
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || 'info@askyacham.com'

    console.log('🔍 CHECKING EMAIL DELIVERY STATUS:')
    console.log('📧 SendGrid API Key:', sendGridApiKey ? 'SET' : 'MISSING')
    console.log('📧 From Email:', fromEmail)

    if (!sendGridApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SendGrid API key not configured',
        status: 'MISSING_API_KEY'
      })
    }

    // 🚀 CHECK SENDGRID ACCOUNT STATUS
    try {
      const response = await fetch('https://api.sendgrid.com/v3/user/account', {
        headers: {
          'Authorization': `Bearer ${sendGridApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const accountData = await response.json()
        console.log('✅ SendGrid account status:', accountData)
        
        return NextResponse.json({
          success: true,
          message: 'Email service is properly configured',
          data: {
            sendGridStatus: 'ACTIVE',
            apiKeyConfigured: true,
            fromEmail: fromEmail,
            accountData: {
              username: accountData.username,
              email: accountData.email,
              plan: accountData.plan_type
            },
            troubleshooting: {
              checkSpamFolder: 'Check your SPAM folder',
              checkPromotionsTab: 'Check Gmail Promotions tab',
              waitForDelivery: 'Wait 15-30 minutes for delivery',
              checkSendGridDashboard: 'Check SendGrid dashboard for delivery status'
            }
          }
        })
      } else {
        console.error('❌ SendGrid account check failed:', response.status)
        
        return NextResponse.json({
          success: false,
          error: 'SendGrid account check failed',
          status: 'ACCOUNT_ISSUE',
          details: {
            statusCode: response.status,
            statusText: response.statusText
          }
        })
      }
    } catch (fetchError) {
      console.error('❌ SendGrid API error:', fetchError)
      
      return NextResponse.json({
        success: false,
        error: 'SendGrid API connection failed',
        status: 'API_CONNECTION_FAILED',
        details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
      })
    }

  } catch (error) {
    console.error('🚨 Email status check error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check email status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
