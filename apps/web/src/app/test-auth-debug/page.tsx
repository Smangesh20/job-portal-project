'use client'

import React, { useState } from 'react'

export default function TestAuthDebug() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testGoogleAuth = async () => {
    setIsLoading(true)
    setStatus('Testing Google OAuth...')

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })

      const data = await response.json()
      console.log('🚀 Google OAuth test result:', data)

      if (data.success && data.data.authUrl) {
        setStatus(`✅ Google OAuth SUCCESS!\n\nOAuth URL: ${data.data.authUrl}\n\nClick below to test OAuth flow:`)
        
        // Create redirect button
        setTimeout(() => {
          const button = document.createElement('button')
          button.textContent = '🚀 Test Google OAuth Redirect'
          button.className = 'mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold'
          button.onclick = () => {
            window.location.href = data.data.authUrl
          }
          const statusDiv = document.getElementById('status')
          if (statusDiv) {
            statusDiv.appendChild(button)
          }
        }, 1000)
      } else {
        setStatus(`❌ Google OAuth FAILED:\n${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('🚨 Google OAuth test error:', error)
      setStatus(`❌ Google OAuth ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testEmailOTP = async () => {
    setIsLoading(true)
    setStatus('Testing Email OTP...')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info@askyacham.com' })
      })

      const data = await response.json()
      console.log('🚀 Email OTP test result:', data)

      if (data.success) {
        setStatus(`✅ Email OTP SUCCESS!\n\nOTP sent to: info@askyacham.com\nOTP Code: ${data.data.otp}\n\nCheck your email for the OTP!`)
      } else {
        setStatus(`❌ Email OTP FAILED:\n${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('🚨 Email OTP test error:', error)
      setStatus(`❌ Email OTP ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSendGrid = async () => {
    setIsLoading(true)
    setStatus('Testing SendGrid directly...')

    try {
      const response = await fetch('/api/test-sendgrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info@askyacham.com' })
      })

      const data = await response.json()
      console.log('🚀 SendGrid test result:', data)

      if (data.success) {
        setStatus(`✅ SendGrid SUCCESS!\n\nEmail sent to: info@askyacham.com\nMessage ID: ${data.data.messageId}\n\nCheck your email!`)
      } else {
        setStatus(`❌ SendGrid FAILED:\n${data.error}\n\nEnvironment: ${JSON.stringify(data.envCheck, null, 2)}`)
      }
    } catch (error) {
      console.error('🚨 SendGrid test error:', error)
      setStatus(`❌ SendGrid ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/test-sendgrid')
      const data = await response.json()
      
      if (data.success) {
        setStatus(`🔧 Environment Status:\n${JSON.stringify(data.data, null, 2)}`)
      } else {
        setStatus(`❌ Environment check failed: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Environment check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🔧 Auth Debug - Google + Email
        </h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={testGoogleAuth}
            disabled={isLoading}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔐 Test Google OAuth
          </button>

          <button
            onClick={testEmailOTP}
            disabled={isLoading}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            📧 Test Email OTP
          </button>

          <button
            onClick={testSendGrid}
            disabled={isLoading}
            className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            📬 Test SendGrid
          </button>

          <button
            onClick={checkEnvironment}
            className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-semibold"
          >
            🔧 Check Environment
          </button>
        </div>

        <div id="status" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[200px]">
          <pre className="text-sm whitespace-pre-wrap text-gray-800">{status || 'Click a button above to test...'}</pre>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">🎯 What Each Test Does:</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>🔐 Google OAuth:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Tests OAuth URL generation</li>
                <li>• Validates redirect flow</li>
                <li>• Creates Google OAuth button</li>
              </ul>
            </div>
            <div>
              <p><strong>📧 Email Tests:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Tests OTP generation</li>
                <li>• Tests SendGrid delivery</li>
                <li>• Validates email service</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






