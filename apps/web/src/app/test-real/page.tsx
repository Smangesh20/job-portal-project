'use client'

import React, { useState } from 'react'

export default function TestReal() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testRealEmail = async () => {
    setIsLoading(true)
    setStatus('Testing Real Email with your SendGrid API key...')

    try {
      const response = await fetch('/api/test-real-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info@askyacham.com' })
      })

      const data = await response.json()
      console.log('🚀 Real email test result:', data)

      if (data.success) {
        setStatus(`✅ REAL EMAIL SUCCESS!\n\nEmail sent to: info@askyacham.com\nAPI Key Used: ${data.data.apiKeyUsed}\nMessage ID: ${data.data.messageId}\n\nCheck your email NOW!`)
      } else {
        setStatus(`❌ REAL EMAIL FAILED:\n${data.error}\n\nDetails: ${data.details}`)
      }
    } catch (error) {
      console.error('🚨 Real email test error:', error)
      setStatus(`❌ REAL EMAIL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

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

  const testOTPEmail = async () => {
    setIsLoading(true)
    setStatus('Testing OTP Email with your SendGrid API key...')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info@askyacham.com' })
      })

      const data = await response.json()
      console.log('🚀 OTP email test result:', data)

      if (data.success) {
        setStatus(`✅ OTP EMAIL SUCCESS!\n\nOTP sent to: info@askyacham.com\nOTP Code: ${data.data.otp}\n\nCheck your email for the OTP!`)
      } else {
        setStatus(`❌ OTP EMAIL FAILED:\n${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('🚨 OTP email test error:', error)
      setStatus(`❌ OTP EMAIL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/test-real-email')
      const data = await response.json()
      
      if (data.success) {
        setStatus(`🔧 Status Check:\n${JSON.stringify(data.data, null, 2)}`)
      } else {
        setStatus(`❌ Status check failed: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Status check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🚀 Real Test - Your SendGrid API Key
        </h1>
        
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">✅ Your Configuration:</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• SendGrid API Key: SG.cuaatpUYT3i3-DZTF-ri6w...</li>
            <li>• From Email: info@askyacham.com</li>
            <li>• Status: Ready to send real emails</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={testRealEmail}
            disabled={isLoading}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            📧 Test Real Email
          </button>

          <button
            onClick={testGoogleAuth}
            disabled={isLoading}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔐 Test Google OAuth
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
        </div>

        <div id="status" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[200px]">
          <pre className="text-sm whitespace-pre-wrap text-gray-800">{status || 'Click a button above to test with your SendGrid API key...'}</pre>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">🎯 What Each Test Does:</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>📧 Real Email Test:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Uses your SendGrid API key</li>
                <li>• Sends to info@askyacham.com</li>
                <li>• Real email delivery</li>
              </ul>
            </div>
            <div>
              <p><strong>🔐 Google OAuth:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Tests OAuth URL generation</li>
                <li>• Creates redirect button</li>
                <li>• Validates OAuth flow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}












