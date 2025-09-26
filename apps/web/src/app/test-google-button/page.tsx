'use client'

import React, { useState } from 'react'

export default function TestGoogleButton() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testGoogleButton = async () => {
    setIsLoading(true)
    setStatus('🔍 Testing Google Sign-In button (Debug Mode)...')

    try {
      console.log('🚀 Testing Google OAuth endpoint...')
      
      // Test the Google OAuth endpoint directly
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })

      const data = await response.json()
      console.log('🚀 Google OAuth test result:', data)

      if (data.success && data.data.authUrl) {
        setStatus(`✅ Google Sign-In Button Works!\n\nOAuth URL: ${data.data.authUrl}\n\n🎯 Google OAuth Details:\n• Provider: ${data.data.provider || 'google'}\n• Demo Mode: ${data.data.demoMode ? 'YES' : 'NO'}\n• State: ${data.data.state || 'N/A'}\n\n🚀 Click the button below to test OAuth flow:`)
        
        // Create redirect button immediately
        const button = document.createElement('button')
        button.textContent = '🚀 Test Google OAuth Redirect'
        button.className = 'mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold cursor-pointer'
        button.onclick = () => {
          console.log('🚀 Redirecting to Google OAuth...')
          window.location.href = data.data.authUrl
        }
        const statusDiv = document.getElementById('status')
        if (statusDiv) {
          statusDiv.appendChild(button)
        }
      } else {
        setStatus(`❌ Google Sign-In Button Failed:\n${data.error || 'Unknown error'}\n\n🔍 Debug Info:\n${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      console.error('🚨 Google button test error:', error)
      setStatus(`❌ Google Button Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n🔍 Full Error:\n${JSON.stringify(error, null, 2)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testEmailDelivery = async () => {
    setIsLoading(true)
    setStatus('🚀 Testing Simple Email Delivery (Debug Mode)...')

    try {
      const response = await fetch('/api/email-simple-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'pullareddypullareddy20@gmail.com'
        })
      })

      const data = await response.json()
      console.log('🚀 Simple email test result:', data)

      if (data.success) {
        setStatus(`✅ SIMPLE EMAIL DELIVERED!\n\n📧 Email Details:\n• To: ${data.data.email}\n• From: ${data.data.fromEmail}\n• Message ID: ${data.data.messageId}\n• Timestamp: ${data.data.timestamp}\n\n🎯 SendGrid Response:\n${JSON.stringify(data.data.sendGridResponse, null, 2)}\n\n✅ CHECK YOUR EMAIL NOW!`)
      } else {
        setStatus(`❌ Simple Email Failed:\n${data.error}\n\nDetails: ${data.details || 'No details available'}\n\n🔍 Debug Info:\n${JSON.stringify(data.debug, null, 2)}`)
      }
    } catch (error) {
      console.error('🚨 Simple email test error:', error)
      setStatus(`❌ Simple Email Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testOTPEmail = async () => {
    setIsLoading(true)
    setStatus('🚀 Testing Google-Level OTP Email...')

    try {
      const response = await fetch('/api/email-google-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'pullareddypullareddy20@gmail.com',
          type: 'otp'
        })
      })

      const data = await response.json()
      console.log('🚀 Google-level OTP email test result:', data)

      if (data.success) {
        setStatus(`✅ GOOGLE-LEVEL OTP EMAIL DELIVERED!\n\n📧 OTP Details:\n• To: ${data.data.email}\n• From: ${data.data.fromEmail}\n• Message ID: ${data.data.messageId}\n• Type: ${data.data.type}\n• Google-Level: ${data.data.googleLevel ? 'YES' : 'NO'}\n• Delivery Status: ${data.data.deliveryStatus}\n\n🎯 Google-Level Features:\n${data.data.features.map((f: string) => `• ${f}`).join('\n')}\n\n✅ CHECK YOUR EMAIL FOR OTP!`)
      } else {
        setStatus(`❌ Google-Level OTP Email Failed:\n${data.error}\n\nDetails: ${data.details || 'No details available'}`)
      }
    } catch (error) {
      console.error('🚨 Google-level OTP email test error:', error)
      setStatus(`❌ Google-Level OTP Email Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/email-simple-test')
      const data = await response.json()
      
      if (data.success) {
        setStatus(`🔧 Simple Email Service Status:\n\nService: ${data.data.service}\nStatus: ${data.data.status}\nSendGrid Configured: ${data.data.sendGridConfigured ? 'YES' : 'NO'}\nFrom Email: ${data.data.fromEmail}\nNode Environment: ${data.data.nodeEnv}\n\nLast Updated: ${data.data.lastUpdated}`)
      } else {
        setStatus(`❌ Status check failed: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Status check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          🚀 Google Sign-In & Email - ENTERPRISE LEVEL
        </h1>
        
        {/* 🚀 GOOGLE SIGN-IN BUTTON - EXACTLY LIKE GOOGLE */}
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-gray-800 font-semibold mb-4 text-center">🔐 Sign in with Google</h3>
          <div className="flex justify-center">
            <button
              onClick={testGoogleButton}
              disabled={isLoading}
              className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md text-gray-700 font-medium py-2.5 px-4 rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed min-w-[240px] text-sm"
              style={{ 
                fontFamily: 'Roboto, Arial, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.25px'
              }}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">✅ Fixed Issues:</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Google Sign-In button now clickable (moved to top like Google)</li>
            <li>• Email delivery restored with working SendGrid</li>
            <li>• Real-time testing enabled</li>
            <li>• Enterprise-level reliability</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={testEmailDelivery}
            disabled={isLoading}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            📧 Test Email Delivery
          </button>

          <button
            onClick={testOTPEmail}
            disabled={isLoading}
            className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔑 Test OTP Email
          </button>

          <button
            onClick={checkStatus}
            className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-semibold"
          >
            🔧 Check Status
          </button>

          <button
            onClick={() => {
              setStatus('')
            }}
            className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 font-semibold"
          >
            🧹 Clear Results
          </button>
        </div>

        <div id="status" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[200px]">
          <pre className="text-sm whitespace-pre-wrap text-gray-800">{status || 'Click a button above to test...'}</pre>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">🎯 What This Tests:</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>🔐 Google Button:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Tests OAuth endpoint</li>
                <li>• Generates OAuth URL</li>
                <li>• Creates redirect button</li>
              </ul>
            </div>
            <div>
              <p><strong>📧 Email Tests:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Tests email delivery</li>
                <li>• Tests OTP generation</li>
                <li>• Validates SendGrid</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}