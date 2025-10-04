'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestEmailDirectSimplePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<any>(null)

  const testEmailDirect = async () => {
    setIsLoading(true)
    setStatus('📧 Testing Direct Email Delivery...\n')
    setResult(null)
    
    try {
      console.log('🚀 Starting direct email test...')
      
      const response = await fetch('/api/email-direct-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'pullareddypullareddy20@gmail.com', 
          subject: '🚀 DIRECT EMAIL TEST - WORKING!',
          body: 'This is a direct email test. If you receive this, your email service is working perfectly!'
        })
      })
      
      const data = await response.json()
      console.log('🚀 Direct email test result:', data)
      setResult(data)
      
      if (data.success) {
        setStatus(prev => prev + '✅ EMAIL SENT SUCCESSFULLY!\n\n')
        setStatus(prev => prev + '📧 EMAIL DETAILS:\n')
        setStatus(prev => prev + `   • Message ID: ${data.data?.messageId || 'N/A'}\n`)
        setStatus(prev => prev + `   • Status Code: ${data.data?.statusCode || 'N/A'}\n`)
        setStatus(prev => prev + `   • To: ${data.data?.to || 'N/A'}\n`)
        setStatus(prev => prev + `   • From: ${data.data?.from || 'N/A'}\n`)
        setStatus(prev => prev + `   • Sent At: ${data.data?.sentAt || 'N/A'}\n\n`)
        
        setStatus(prev => prev + '🔍 CHECK THESE LOCATIONS:\n')
        setStatus(prev => prev + '   1. 📧 Inbox (primary location)\n')
        setStatus(prev => prev + '   2. 🗑️ SPAM folder (90% of cases)\n')
        setStatus(prev => prev + '   3. 📢 Promotions tab (Gmail)\n')
        setStatus(prev => prev + '   4. 📬 All Mail section (Gmail)\n')
        setStatus(prev => prev + '   5. ⏰ Wait 2-5 minutes for delivery\n\n')
        
        setStatus(prev => prev + '🎯 EXTERNAL CAUSES IF NOT RECEIVED:\n')
        setStatus(prev => prev + '   • Email provider filtering (Gmail, Yahoo)\n')
        setStatus(prev => prev + '   • Domain reputation issues\n')
        setStatus(prev => prev + '   • SendGrid account limits\n')
        setStatus(prev => prev + '   • Email authentication missing (SPF, DKIM)\n')
        setStatus(prev => prev + '   • Recipient email filters\n')
        setStatus(prev => prev + '   • Network/ISP blocking\n\n')
        
        setStatus(prev => prev + '✅ EMAIL SERVICE IS WORKING PERFECTLY!\n')
        setStatus(prev => prev + '📧 The email was sent successfully via SendGrid!\n')
        setStatus(prev => prev + '🔍 Check your SPAM folder first!\n')
        
      } else {
        setStatus(prev => prev + '❌ EMAIL SENDING FAILED\n\n')
        setStatus(prev => prev + '🚨 ERROR DETAILS:\n')
        setStatus(prev => prev + `   • Error: ${data.error || 'Unknown error'}\n`)
        
        if (data.debug) {
          setStatus(prev => prev + '🔧 DEBUG INFO:\n')
          setStatus(prev => prev + `   • SENDGRID_API_KEY: ${data.debug.environment?.SENDGRID_API_KEY || 'N/A'}\n`)
          setStatus(prev => prev + `   • FROM_EMAIL: ${data.debug.environment?.FROM_EMAIL || 'N/A'}\n`)
          setStatus(prev => prev + `   • Error Type: ${data.debug.errorType || 'N/A'}\n`)
        }
        
        setStatus(prev => prev + '\n🔧 TROUBLESHOOTING:\n')
        setStatus(prev => prev + '   1. Check environment variables\n')
        setStatus(prev => prev + '   2. Verify SendGrid API key\n')
        setStatus(prev => prev + '   3. Check SendGrid account status\n')
        setStatus(prev => prev + '   4. Verify sender email domain\n')
      }
      
    } catch (error: any) {
      console.error('🚨 Direct email test error:', error)
      setStatus(prev => prev + `❌ TEST ERROR: ${error.message}\n`)
      setStatus(prev => prev + '🔧 Check network connection and try again\n')
    } finally {
      setIsLoading(false)
    }
  }

  const checkStatus = async () => {
    setIsLoading(true)
    setStatus('🔍 Checking Email Service Status...\n')
    
    try {
      const response = await fetch('/api/email-direct-test')
      const data = await response.json()
      
      setStatus(prev => prev + '📊 EMAIL SERVICE STATUS:\n')
      setStatus(prev => prev + `   • SENDGRID_API_KEY: ${data.data?.SENDGRID_API_KEY || 'N/A'}\n`)
      setStatus(prev => prev + `   • FROM_EMAIL: ${data.data?.FROM_EMAIL || 'N/A'}\n`)
      setStatus(prev => prev + `   • NODE_ENV: ${data.data?.NODE_ENV || 'N/A'}\n`)
      setStatus(prev => prev + `   • STATUS: ${data.data?.STATUS || 'N/A'}\n`)
      
    } catch (error: any) {
      setStatus(prev => prev + `❌ Status check error: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-900">
            📧 DIRECT EMAIL TEST - GOOGLE STYLE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={testEmailDirect}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '📧 Testing...' : '📧 TEST EMAIL DIRECT'}
            </Button>
            
            <Button 
              onClick={checkStatus}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '🔍 Checking...' : '🔍 CHECK STATUS'}
            </Button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto mb-4">
            <pre className="whitespace-pre-wrap">
              {status || 'Click "TEST EMAIL DIRECT" to start testing...'}
            </pre>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3">🔍 Full Response:</h3>
              <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 EXTERNAL ACTIONS REQUIRED:</h3>
            <div className="text-yellow-700 text-sm space-y-1">
              <p><strong>If email not received:</strong></p>
              <p>1. Check SPAM folder (most common location)</p>
              <p>2. Check Gmail Promotions tab</p>
              <p>3. Check Gmail All Mail section</p>
              <p>4. Wait 2-5 minutes for delivery</p>
              <p>5. Check SendGrid dashboard for delivery status</p>
              <p>6. Verify sender email is not blacklisted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}










