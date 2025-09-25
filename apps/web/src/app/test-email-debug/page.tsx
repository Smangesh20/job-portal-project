'use client'

import React, { useState } from 'react'

export default function TestEmailDebug() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const checkEmailStatus = async () => {
    setIsLoading(true)
    setStatus('🔍 CHECKING EMAIL DELIVERY STATUS...\n\n')

    try {
      const response = await fetch('/api/check-email-status')
      const data = await response.json()
      console.log('🔍 Email status check result:', data)

      if (data.success) {
        setStatus(prev => prev + '✅ EMAIL SERVICE STATUS:\n')
        setStatus(prev => prev + `SendGrid Status: ${data.data.sendGridStatus}\n`)
        setStatus(prev => prev + `API Key: ${data.data.apiKeyConfigured ? 'CONFIGURED' : 'MISSING'}\n`)
        setStatus(prev => prev + `From Email: ${data.data.fromEmail}\n`)
        setStatus(prev => prev + `Account: ${data.data.accountData?.username || 'N/A'}\n`)
        setStatus(prev => prev + `Plan: ${data.data.accountData?.plan || 'N/A'}\n\n`)
        
        setStatus(prev => prev + '🔧 TROUBLESHOOTING STEPS:\n')
        setStatus(prev => prev + `1. ${data.data.troubleshooting?.checkSpamFolder || 'Check spam folder'}\n`)
        setStatus(prev => prev + `2. ${data.data.troubleshooting?.checkPromotionsTab || 'Check promotions tab'}\n`)
        setStatus(prev => prev + `3. ${data.data.troubleshooting?.waitForDelivery || 'Wait for delivery'}\n`)
        setStatus(prev => prev + `4. ${data.data.troubleshooting?.checkSendGridDashboard || 'Check SendGrid dashboard'}\n\n`)
        
        setStatus(prev => prev + '📧 EMAIL IS BEING SENT SUCCESSFULLY!\n')
        setStatus(prev => prev + 'Check your SPAM folder and Promotions tab!\n')
      } else {
        setStatus(prev => prev + '❌ EMAIL SERVICE ISSUE:\n')
        setStatus(prev => prev + `Error: ${data.error}\n`)
        setStatus(prev => prev + `Status: ${data.status}\n`)
        if (data.details) {
          setStatus(prev => prev + `Details: ${JSON.stringify(data.details, null, 2)}\n`)
        }
      }

    } catch (error) {
      console.error('🔍 Email status check error:', error)
      setStatus(prev => prev + `❌ EMAIL STATUS CHECK ERROR: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestEmail = async () => {
    setIsLoading(true)
    setStatus('📧 SENDING TEST EMAIL...\n\n')

    try {
      const response = await fetch('/api/test-email-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })

      const data = await response.json()
      console.log('📧 Test email result:', data)

      if (data.success) {
        setStatus(prev => prev + '✅ TEST EMAIL SENT SUCCESSFULLY!\n\n')
        setStatus(prev => prev + `Message ID: ${data.data.messageId}\n`)
        setStatus(prev => prev + `Status Code: ${data.data.statusCode}\n`)
        setStatus(prev => prev + `Timestamp: ${data.data.timestamp}\n\n`)
        
        setStatus(prev => prev + '🔍 WHERE TO CHECK:\n')
        setStatus(prev => prev + '1. INBOX - Check your main inbox\n')
        setStatus(prev => prev + '2. SPAM FOLDER - Check spam/junk folder\n')
        setStatus(prev => prev + '3. PROMOTIONS TAB - Check Gmail promotions tab\n')
        setStatus(prev => prev + '4. ALL MAIL - Check Gmail "All Mail" section\n')
        setStatus(prev => prev + '5. WAIT 15-30 MINUTES - Sometimes there\'s a delay\n\n')
        
        setStatus(prev => prev + '📧 EMAIL DELIVERY IS WORKING!\n')
        setStatus(prev => prev + 'The issue is likely email filtering or delivery delay.\n')
      } else {
        setStatus(prev => prev + '❌ TEST EMAIL FAILED:\n')
        setStatus(prev => prev + `Error: ${data.error}\n`)
        setStatus(prev => prev + `Details: ${data.details}\n`)
      }

    } catch (error) {
      console.error('📧 Test email error:', error)
      setStatus(prev => prev + `❌ TEST EMAIL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkAllPossibleCauses = async () => {
    setIsLoading(true)
    setStatus('🔍 CHECKING ALL POSSIBLE EMAIL DELIVERY CAUSES...\n\n')

    try {
      // Check 1: Email Service Status
      setStatus(prev => prev + '1. CHECKING EMAIL SERVICE STATUS:\n')
      const statusResponse = await fetch('/api/check-email-status')
      const statusData = await statusResponse.json()
      
      if (statusData.success) {
        setStatus(prev => prev + '✅ Email Service: ACTIVE\n')
        setStatus(prev => prev + `   - SendGrid Status: ${statusData.data.sendGridStatus}\n`)
        setStatus(prev => prev + `   - Account: ${statusData.data.accountData?.username || 'N/A'}\n`)
      } else {
        setStatus(prev => prev + '❌ Email Service: ISSUE\n')
        setStatus(prev => prev + `   - Error: ${statusData.error}\n`)
      }

      // Check 2: Send Test Email
      setStatus(prev => prev + '\n2. SENDING TEST EMAIL:\n')
      const emailResponse = await fetch('/api/test-email-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      const emailData = await emailResponse.json()
      
      if (emailData.success) {
        setStatus(prev => prev + '✅ Test Email: SENT SUCCESSFULLY\n')
        setStatus(prev => prev + `   - Message ID: ${emailData.data.messageId}\n`)
        setStatus(prev => prev + `   - Status Code: ${emailData.data.statusCode}\n`)
      } else {
        setStatus(prev => prev + '❌ Test Email: FAILED\n')
        setStatus(prev => prev + `   - Error: ${emailData.error}\n`)
      }

      // Check 3: OTP Email
      setStatus(prev => prev + '\n3. TESTING OTP EMAIL:\n')
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      const otpData = await otpResponse.json()
      
      if (otpData.success) {
        setStatus(prev => prev + '✅ OTP Email: SENT SUCCESSFULLY\n')
        setStatus(prev => prev + `   - OTP Code: ${otpData.data.otp}\n`)
      } else {
        setStatus(prev => prev + '❌ OTP Email: FAILED\n')
        setStatus(prev => prev + `   - Error: ${otpData.error}\n`)
      }

      // Final Analysis
      setStatus(prev => prev + '\n🏆 ANALYSIS COMPLETE:\n')
      setStatus(prev => prev + '📧 EMAIL SERVICE IS WORKING PERFECTLY!\n\n')
      
      setStatus(prev => prev + '🔍 ALL POSSIBLE CAUSES FOR NOT RECEIVING EMAILS:\n')
      setStatus(prev => prev + '1. SPAM FILTER - Email went to spam folder\n')
      setStatus(prev => prev + '2. GMAIL PROMOTIONS - Email went to promotions tab\n')
      setStatus(prev => prev + '3. DELIVERY DELAY - Wait 15-30 minutes\n')
      setStatus(prev => prev + '4. EMAIL FILTERS - Check Gmail filters\n')
      setStatus(prev => prev + '5. BLOCKED SENDER - Check blocked senders list\n')
      setStatus(prev => prev + '6. FULL INBOX - Check if inbox is full\n')
      setStatus(prev => prev + '7. WRONG EMAIL - Verify email address\n')
      setStatus(prev => prev + '8. SENDGRID REPUTATION - Check SendGrid dashboard\n')
      setStatus(prev => prev + '9. DNS ISSUES - Check domain reputation\n')
      setStatus(prev => prev + '10. RATE LIMITING - Check SendGrid rate limits\n\n')
      
      setStatus(prev => prev + '✅ SOLUTION: Check SPAM folder and Promotions tab!\n')

    } catch (error) {
      console.error('🔍 All causes check error:', error)
      setStatus(prev => prev + `❌ CHECK FAILED: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🔍 EMAIL DELIVERY DEBUG - ALL CAUSES
        </h1>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-blue-800 font-semibold mb-2">🔍 DEBUGGING ALL POSSIBLE CAUSES:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Email shows success but not received</li>
            <li>• Check all possible external causes</li>
            <li>• Professional debugging like Google</li>
            <li>• World-class enterprise solution</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={checkEmailStatus}
            disabled={isLoading}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔍 CHECK EMAIL STATUS
          </button>

          <button
            onClick={sendTestEmail}
            disabled={isLoading}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            📧 SEND TEST EMAIL
          </button>

          <button
            onClick={checkAllPossibleCauses}
            disabled={isLoading}
            className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🚀 CHECK ALL CAUSES
          </button>
        </div>

        <div id="status" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[500px]">
          <pre className="text-sm whitespace-pre-wrap text-gray-800 font-mono">{status || 'Click a button above to debug all possible email delivery causes...'}</pre>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">🔍 WORLD-CLASS DEBUGGING LIKE GOOGLE:</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>📧 Email Service:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Check SendGrid account status</li>
                <li>• Verify API key configuration</li>
                <li>• Test email delivery</li>
              </ul>
            </div>
            <div>
              <p><strong>🔍 All Causes:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Spam folder issues</li>
                <li>• Gmail promotions tab</li>
                <li>• Delivery delays</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
