'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function DebugEverythingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [debugResults, setDebugResults] = useState<any>({})

  // 🚀 GOOGLE-STYLE COMPREHENSIVE DEBUGGING
  const debugEverything = async () => {
    setIsLoading(true)
    setStatus('🔍 GOOGLE-STYLE DEBUGGING: Checking ALL possible causes...\n\n')
    setDebugResults({})

    try {
      // 1. Check Environment Variables
      setStatus(prev => prev + '1️⃣ CHECKING ENVIRONMENT VARIABLES...\n')
      const envResponse = await fetch('/api/debug/env')
      const envData = await envResponse.json()
      setDebugResults(prev => ({ ...prev, environment: envData }))
      
      if (envData.success) {
        setStatus(prev => prev + '✅ Environment Check Complete\n')
        setStatus(prev => prev + `   - SENDGRID_API_KEY: ${envData.data.SENDGRID_API_KEY}\n`)
        setStatus(prev => prev + `   - FROM_EMAIL: ${envData.data.FROM_EMAIL}\n`)
        setStatus(prev => prev + `   - GOOGLE_CLIENT_ID: ${envData.data.GOOGLE_CLIENT_ID}\n`)
        setStatus(prev => prev + `   - GOOGLE_CLIENT_SECRET: ${envData.data.GOOGLE_CLIENT_SECRET}\n\n`)
      } else {
        setStatus(prev => prev + '❌ Environment Check Failed\n\n')
      }

      // 2. Test SendGrid API Directly
      setStatus(prev => prev + '2️⃣ TESTING SENDGRID API DIRECTLY...\n')
      const sendGridResponse = await fetch('/api/test-email-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'pullareddypullareddy20@gmail.com', 
          subject: 'GOOGLE-STYLE DEBUG TEST', 
          body: 'This is a comprehensive debugging test email.' 
        })
      })
      const sendGridData = await sendGridResponse.json()
      setDebugResults(prev => ({ ...prev, sendGrid: sendGridData }))
      
      if (sendGridData.success) {
        setStatus(prev => prev + '✅ SendGrid API Working\n')
        setStatus(prev => prev + `   - Message ID: ${sendGridData.data?.messageId || 'N/A'}\n`)
        setStatus(prev => prev + `   - Status Code: ${sendGridData.data?.statusCode || 'N/A'}\n\n`)
      } else {
        setStatus(prev => prev + '❌ SendGrid API Failed\n')
        setStatus(prev => prev + `   - Error: ${sendGridData.error}\n\n`)
      }

      // 3. Test OTP Email Service
      setStatus(prev => prev + '3️⃣ TESTING OTP EMAIL SERVICE...\n')
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      const otpData = await otpResponse.json()
      setDebugResults(prev => ({ ...prev, otp: otpData }))
      
      if (otpData.success) {
        setStatus(prev => prev + '✅ OTP Email Service Working\n')
        setStatus(prev => prev + `   - OTP Generated: ${otpData.data?.otp || 'Generated'}\n\n`)
      } else {
        setStatus(prev => prev + '❌ OTP Email Service Failed\n')
        setStatus(prev => prev + `   - Error: ${otpData.error}\n\n`)
      }

      // 4. Test Google Sign-In
      setStatus(prev => prev + '4️⃣ TESTING GOOGLE SIGN-IN...\n')
      const googleResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      const googleData = await googleResponse.json()
      setDebugResults(prev => ({ ...prev, google: googleData }))
      
      if (googleData.success) {
        setStatus(prev => prev + '✅ Google Sign-In Working\n')
        setStatus(prev => prev + `   - OAuth URL: ${googleData.data?.authUrl ? 'Generated' : 'Not Generated'}\n`)
        setStatus(prev => prev + `   - Demo Mode: ${googleData.data?.demoMode ? 'ON' : 'OFF'}\n\n`)
      } else {
        setStatus(prev => prev + '❌ Google Sign-In Failed\n')
        setStatus(prev => prev + `   - Error: ${googleData.error}\n\n`)
      }

      // 5. Check Email Delivery Status
      setStatus(prev => prev + '5️⃣ CHECKING EMAIL DELIVERY STATUS...\n')
      const statusResponse = await fetch('/api/check-email-status')
      const statusData = await statusResponse.json()
      setDebugResults(prev => ({ ...prev, emailStatus: statusData }))
      
      if (statusData.success) {
        setStatus(prev => prev + '✅ Email Service Status Check Complete\n')
        setStatus(prev => prev + `   - SendGrid Status: ${statusData.data.sendGridStatus}\n`)
        setStatus(prev => prev + `   - Account: ${statusData.data.accountData?.username || 'N/A'}\n\n`)
      } else {
        setStatus(prev => prev + '❌ Email Status Check Failed\n\n')
      }

      // 6. External Causes Analysis
      setStatus(prev => prev + '6️⃣ EXTERNAL CAUSES ANALYSIS...\n')
      setStatus(prev => prev + '📧 EMAIL DELIVERY EXTERNAL CAUSES:\n')
      setStatus(prev => prev + '   • Email in SPAM folder (90% of cases)\n')
      setStatus(prev => prev + '   • Gmail Promotions tab (common for automated emails)\n')
      setStatus(prev => prev + '   • Email provider blocking (Gmail, Yahoo filters)\n')
      setStatus(prev => prev + '   • SendGrid account limits (free tier restrictions)\n')
      setStatus(prev => prev + '   • Domain reputation issues\n')
      setStatus(prev => prev + '   • Email authentication (SPF, DKIM, DMARC)\n')
      setStatus(prev => prev + '   • SendGrid suppression list\n')
      setStatus(prev => prev + '   • Recipient email filters\n')
      setStatus(prev => prev + '   • Network/ISP blocking\n')
      setStatus(prev => prev + '   • Email client settings\n\n')

      setStatus(prev => prev + '🔐 GOOGLE SIGN-IN EXTERNAL CAUSES:\n')
      setStatus(prev => prev + '   • Google Cloud Console setup incomplete\n')
      setStatus(prev => prev + '   • OAuth consent screen not configured\n')
      setStatus(prev => prev + '   • Redirect URI mismatch\n')
      setStatus(prev => prev + '   • Client ID/Secret not set\n')
      setStatus(prev => prev + '   • Domain verification pending\n')
      setStatus(prev => prev + '   • Browser security policies\n')
      setStatus(prev => prev + '   • Pop-up blockers\n')
      setStatus(prev => prev + '   • JavaScript disabled\n\n')

      // 7. Recommendations
      setStatus(prev => prev + '7️⃣ GOOGLE-STYLE RECOMMENDATIONS:\n')
      setStatus(prev => prev + '📧 FOR EMAIL DELIVERY:\n')
      setStatus(prev => prev + '   1. Check SPAM folder immediately\n')
      setStatus(prev => prev + '   2. Check Gmail Promotions tab\n')
      setStatus(prev => prev + '   3. Check Gmail All Mail section\n')
      setStatus(prev => prev + '   4. Wait 2-5 minutes for delivery\n')
      setStatus(prev => prev + '   5. Check SendGrid dashboard for delivery status\n')
      setStatus(prev => prev + '   6. Verify sender email is not blacklisted\n\n')

      setStatus(prev => prev + '🔐 FOR GOOGLE SIGN-IN:\n')
      setStatus(prev => prev + '   1. Complete Google Cloud Console setup\n')
      setStatus(prev => prev + '   2. Configure OAuth consent screen\n')
      setStatus(prev => prev + '   3. Add authorized redirect URIs\n')
      setStatus(prev => prev + '   4. Enable Google+ API\n')
      setStatus(prev => prev + '   5. Test in incognito mode\n')
      setStatus(prev => prev + '   6. Disable pop-up blockers\n\n')

      setStatus(prev => prev + '🎯 SUMMARY:\n')
      setStatus(prev => prev + `   • Environment Variables: ${envData.success ? '✅ OK' : '❌ ISSUES'}\n`)
      setStatus(prev => prev + `   • SendGrid API: ${sendGridData.success ? '✅ WORKING' : '❌ FAILED'}\n`)
      setStatus(prev => prev + `   • OTP Service: ${otpData.success ? '✅ WORKING' : '❌ FAILED'}\n`)
      setStatus(prev => prev + `   • Google Sign-In: ${googleData.success ? '✅ WORKING' : '❌ FAILED'}\n`)
      setStatus(prev => prev + `   • Email Status: ${statusData.success ? '✅ ACTIVE' : '❌ ISSUES'}\n\n`)

      setStatus(prev => prev + '🚀 GOOGLE-STYLE CONCLUSION:\n')
      if (sendGridData.success && otpData.success) {
        setStatus(prev => prev + '✅ EMAIL SERVICE IS WORKING!\n')
        setStatus(prev => prev + '📧 Check your SPAM folder and Promotions tab!\n')
        setStatus(prev => prev + '⏰ Wait 2-5 minutes for email delivery!\n\n')
      } else {
        setStatus(prev => prev + '❌ EMAIL SERVICE HAS ISSUES\n')
        setStatus(prev => prev + '🔧 Check environment variables and SendGrid setup!\n\n')
      }

      if (googleData.success) {
        setStatus(prev => prev + '✅ GOOGLE SIGN-IN IS WORKING!\n')
        setStatus(prev => prev + '🔐 Button should be clickable!\n')
        setStatus(prev => prev + '🚀 OAuth flow is ready!\n\n')
      } else {
        setStatus(prev => prev + '❌ GOOGLE SIGN-IN HAS ISSUES\n')
        setStatus(prev => prev + '🔧 Complete Google Cloud Console setup!\n\n')
      }

    } catch (error: any) {
      console.error('🚨 Debug error:', error)
      setStatus(prev => prev + `❌ DEBUG ERROR: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const testGoogleButton = async () => {
    setIsLoading(true)
    setStatus('🔐 Testing Google Sign-In Button...\n')
    
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      const data = await response.json()
      
      if (data.success && data.data?.authUrl) {
        setStatus(prev => prev + '✅ Google Sign-In Button Working!\n')
        setStatus(prev => prev + '🚀 Creating clickable test button...\n\n')
        
        setTimeout(() => {
          const button = document.createElement('button')
          button.textContent = '🚀 TEST GOOGLE OAUTH (CLICKABLE)'
          button.className = 'mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold w-full'
          button.onclick = () => {
            window.location.href = data.data.authUrl
          }
          
          const statusDiv = document.getElementById('status')
          if (statusDiv) {
            statusDiv.appendChild(button)
          }
        }, 1000)
      } else {
        setStatus(prev => prev + '❌ Google Sign-In Button Failed\n')
        setStatus(prev => prev + `Error: ${data.error || 'Unknown error'}\n`)
      }
    } catch (error: any) {
      setStatus(prev => prev + `❌ Button Test Error: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const testEmailImmediate = async () => {
    setIsLoading(true)
    setStatus('📧 Testing Email Delivery Immediately...\n')
    
    try {
      const response = await fetch('/api/test-email-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'pullareddypullareddy20@gmail.com', 
          subject: 'IMMEDIATE EMAIL TEST', 
          body: 'This email should arrive immediately. Check your SPAM folder!' 
        })
      })
      const data = await response.json()
      
      if (data.success) {
        setStatus(prev => prev + '✅ EMAIL SENT SUCCESSFULLY!\n')
        setStatus(prev => prev + `📧 Message ID: ${data.data?.messageId || 'N/A'}\n`)
        setStatus(prev => prev + `📊 Status Code: ${data.data?.statusCode || 'N/A'}\n\n`)
        setStatus(prev => prev + '🔍 CHECK THESE LOCATIONS:\n')
        setStatus(prev => prev + '   1. 📧 Inbox (primary)\n')
        setStatus(prev => prev + '   2. 🗑️ SPAM folder (most common)\n')
        setStatus(prev => prev + '   3. 📢 Promotions tab (Gmail)\n')
        setStatus(prev => prev + '   4. 📬 All Mail section (Gmail)\n')
        setStatus(prev => prev + '   5. ⏰ Wait 2-5 minutes\n\n')
      } else {
        setStatus(prev => prev + '❌ EMAIL SENDING FAILED\n')
        setStatus(prev => prev + `Error: ${data.error || 'Unknown error'}\n`)
      }
    } catch (error: any) {
      setStatus(prev => prev + `❌ Email Test Error: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-900">
            🔍 GOOGLE-STYLE COMPREHENSIVE DEBUGGING
          </CardTitle>
          <CardDescription className="text-center text-gray-600 mt-2">
            Debugging ALL possible external causes like Google does
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button 
              onClick={debugEverything}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              {isLoading ? '🔍 Debugging...' : '🔍 DEBUG EVERYTHING'}
            </Button>
            
            <Button 
              onClick={testGoogleButton}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              {isLoading ? '🔐 Testing...' : '🔐 TEST GOOGLE BUTTON'}
            </Button>
            
            <Button 
              onClick={testEmailImmediate}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              {isLoading ? '📧 Testing...' : '📧 TEST EMAIL IMMEDIATE'}
            </Button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            <pre id="status" className="whitespace-pre-wrap">
              {status || 'Click "DEBUG EVERYTHING" to start Google-style debugging...'}
            </pre>
          </div>

          {Object.keys(debugResults).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">🔍 Debug Results:</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(debugResults, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
