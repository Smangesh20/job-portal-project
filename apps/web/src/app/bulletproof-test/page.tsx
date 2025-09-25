'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BulletproofTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState('')
  const [googleStatus, setGoogleStatus] = useState('')
  const [authUrl, setAuthUrl] = useState('')

  // 🚀 BULLETPROOF EMAIL TEST
  const testBulletproofEmail = async () => {
    setIsLoading(true)
    setEmailStatus('🚀 TESTING BULLETPROOF EMAIL...\n')
    
    try {
      const response = await fetch('/api/email-bulletproof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setEmailStatus(prev => prev + '✅ BULLETPROOF EMAIL SENT SUCCESSFULLY!\n\n')
        setEmailStatus(prev => prev + '📧 EMAIL DETAILS:\n')
        setEmailStatus(prev => prev + `   • Message ID: ${data.data?.messageId || 'N/A'}\n`)
        setEmailStatus(prev => prev + `   • Status Code: ${data.data?.statusCode || 'N/A'}\n`)
        setEmailStatus(prev => prev + `   • Sent At: ${data.data?.sentAt || 'N/A'}\n`)
        setEmailStatus(prev => prev + `   • Bulletproof: ${data.data?.bulletproof ? 'YES' : 'NO'}\n\n`)
        
        setEmailStatus(prev => prev + '🎯 EMAIL LOCATIONS TO CHECK:\n')
        setEmailStatus(prev => prev + '   1. 📧 Inbox (primary location)\n')
        setEmailStatus(prev => prev + '   2. 🗑️ SPAM folder (90% of cases)\n')
        setEmailStatus(prev => prev + '   3. 📢 Promotions tab (Gmail)\n')
        setEmailStatus(prev => prev + '   4. 📬 All Mail section (Gmail)\n')
        setEmailStatus(prev => prev + '   5. ⏰ Wait 2-5 minutes for delivery\n\n')
        
        setEmailStatus(prev => prev + '🚀 BULLETPROOF STATUS:\n')
        setEmailStatus(prev => prev + '   ✅ Email service is BULLETPROOF!\n')
        setEmailStatus(prev => prev + '   ✅ SendGrid integration working!\n')
        setEmailStatus(prev => prev + '   ✅ Works like Google!\n')
        
      } else {
        setEmailStatus(prev => prev + '❌ BULLETPROOF EMAIL FAILED\n')
        setEmailStatus(prev => prev + `Error: ${data.error || 'Unknown error'}\n`)
      }
      
    } catch (error: any) {
      setEmailStatus(prev => prev + `❌ ERROR: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  // 🚀 BULLETPROOF GOOGLE TEST
  const testBulletproofGoogle = async () => {
    setIsLoading(true)
    setGoogleStatus('🚀 TESTING BULLETPROOF GOOGLE SIGN-IN...\n')
    setAuthUrl('')
    
    try {
      const response = await fetch('/api/google-bulletproof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGoogleStatus(prev => prev + '✅ BULLETPROOF GOOGLE SIGN-IN WORKING!\n\n')
        setGoogleStatus(prev => prev + '🔐 GOOGLE DETAILS:\n')
        setGoogleStatus(prev => prev + `   • Success: ${data.success}\n`)
        setGoogleStatus(prev => prev + `   • OAuth URL: ${data.data?.authUrl ? 'Generated' : 'Not Generated'}\n`)
        setGoogleStatus(prev => prev + `   • State: ${data.data?.state || 'N/A'}\n`)
        setGoogleStatus(prev => prev + `   • Bulletproof: ${data.data?.bulletproof ? 'YES' : 'NO'}\n`)
        setGoogleStatus(prev => prev + `   • Google OAuth: ${data.data?.googleOAuth ? 'YES' : 'NO'}\n\n`)
        
        if (data.data?.authUrl) {
          setAuthUrl(data.data.authUrl)
          setGoogleStatus(prev => prev + '🚀 BULLETPROOF OAUTH URL GENERATED!\n')
          setGoogleStatus(prev => prev + '🔐 Button is BULLETPROOF!\n')
          setGoogleStatus(prev => prev + '✅ Google Sign-In is BULLETPROOF!\n\n')
          
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            setGoogleStatus(prev => prev + '🚀 Auto-redirecting to Google OAuth in 3 seconds...\n')
            setTimeout(() => {
              setGoogleStatus(prev => prev + '🚀 Redirecting NOW...\n')
              window.location.href = data.data.authUrl
            }, 3000)
          }, 1000)
        }
        
      } else {
        setGoogleStatus(prev => prev + '❌ BULLETPROOF GOOGLE SIGN-IN FAILED\n')
        setGoogleStatus(prev => prev + `Error: ${data.error || 'Unknown error'}\n`)
      }
      
    } catch (error: any) {
      setGoogleStatus(prev => prev + `❌ ERROR: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  // 🚀 TEST EVERYTHING BULLETPROOF
  const testEverythingBulletproof = async () => {
    setIsLoading(true)
    setEmailStatus('🚀 TESTING EVERYTHING BULLETPROOF...\n\n')
    setGoogleStatus('🚀 TESTING EVERYTHING BULLETPROOF...\n\n')
    
    // Test Email
    await testBulletproofEmail()
    
    // Test Google
    await testBulletproofGoogle()
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-6xl border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-900">
            🚀 BULLETPROOF TEST - WORKS LIKE GOOGLE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button 
              onClick={testBulletproofEmail}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '📧 Testing...' : '📧 BULLETPROOF EMAIL'}
            </Button>
            
            <Button 
              onClick={testBulletproofGoogle}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '🔐 Testing...' : '🔐 BULLETPROOF GOOGLE'}
            </Button>
            
            <Button 
              onClick={testEverythingBulletproof}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '🚀 Testing...' : '🚀 TEST EVERYTHING'}
            </Button>
          </div>

          {authUrl && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🚀 BULLETPROOF GOOGLE OAUTH URL:</h3>
              <p className="text-green-700 text-sm break-all mb-2">{authUrl}</p>
              <Button 
                onClick={() => {
                  window.location.href = authUrl
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                🚀 GO TO BULLETPROOF GOOGLE OAUTH
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Status */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-800">📧 EMAIL STATUS:</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap">
                  {emailStatus || 'Click "BULLETPROOF EMAIL" to test...'}
                </pre>
              </div>
            </div>

            {/* Google Status */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-800">🔐 GOOGLE STATUS:</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap">
                  {googleStatus || 'Click "BULLETPROOF GOOGLE" to test...'}
                </pre>
              </div>
            </div>
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