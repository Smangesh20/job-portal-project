'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestSimpleButtonPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [authUrl, setAuthUrl] = useState('')

  const testGoogleClick = async () => {
    setIsLoading(true)
    setStatus('🔐 Testing Google Sign-In Click...\n')
    
    try {
      console.log('🚀 Testing Google Sign-In click...')
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      
      const data = await response.json()
      console.log('🚀 Google response:', data)
      
      if (data.success && data.data?.authUrl) {
        setAuthUrl(data.data.authUrl)
        setStatus(prev => prev + '✅ Google Sign-In Click Working!\n')
        setStatus(prev => prev + '🚀 OAuth URL Generated Successfully!\n')
        setStatus(prev => prev + '🔐 Button is CLICKABLE!\n\n')
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          setStatus(prev => prev + '🚀 Auto-redirecting to Google OAuth...\n')
          window.location.href = data.data.authUrl
        }, 2000)
        
      } else {
        setStatus(prev => prev + '❌ Google Sign-In Click Failed\n')
        setStatus(prev => prev + `Error: ${data.error || 'Unknown error'}\n`)
      }
    } catch (error: any) {
      console.error('🚨 Google click test error:', error)
      setStatus(prev => prev + `❌ Click Test Error: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const testEmailClick = async () => {
    setIsLoading(true)
    setStatus('📧 Testing Email OTP Click...\n')
    
    try {
      console.log('🚀 Testing Email OTP click...')
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      
      const data = await response.json()
      console.log('🚀 Email OTP response:', data)
      
      if (data.success) {
        setStatus(prev => prev + '✅ Email OTP Click Working!\n')
        setStatus(prev => prev + '📧 OTP Sent Successfully!\n')
        setStatus(prev => prev + '📬 Check your email (including SPAM folder)!\n\n')
        setStatus(prev => prev + '🔍 EMAIL LOCATIONS TO CHECK:\n')
        setStatus(prev => prev + '   1. 📧 Inbox\n')
        setStatus(prev => prev + '   2. 🗑️ SPAM folder (most common)\n')
        setStatus(prev => prev + '   3. 📢 Promotions tab\n')
        setStatus(prev => prev + '   4. 📬 All Mail section\n')
        setStatus(prev => prev + '   5. ⏰ Wait 2-5 minutes\n\n')
      } else {
        setStatus(prev => prev + '❌ Email OTP Click Failed\n')
        setStatus(prev => prev + `Error: ${data.error || 'Unknown error'}\n`)
      }
    } catch (error: any) {
      console.error('🚨 Email click test error:', error)
      setStatus(prev => prev + `❌ Email Click Test Error: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-900">
            🔧 SIMPLE BUTTON TEST
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={testGoogleClick}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '🔐 Testing...' : '🔐 TEST GOOGLE BUTTON'}
            </Button>
            
            <Button 
              onClick={testEmailClick}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '📧 Testing...' : '📧 TEST EMAIL BUTTON'}
            </Button>
          </div>

          {authUrl && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🚀 Google OAuth URL Generated:</h3>
              <p className="text-blue-700 text-sm break-all">{authUrl}</p>
              <Button 
                onClick={() => window.location.href = authUrl}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                🚀 GO TO GOOGLE OAUTH
              </Button>
            </div>
          )}

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap">
              {status || 'Click buttons above to test functionality...'}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 EXTERNAL ACTIONS REQUIRED:</h3>
            <div className="text-yellow-700 text-sm space-y-1">
              <p><strong>For Email:</strong> Check SPAM folder, Promotions tab, wait 2-5 minutes</p>
              <p><strong>For Google:</strong> Complete Google Cloud Console setup, configure OAuth consent screen</p>
              <p><strong>Environment:</strong> Ensure SENDGRID_API_KEY and GOOGLE_CLIENT_ID are set</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}







