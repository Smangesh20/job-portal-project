'use client'

import React, { useState } from 'react'

export default function TestEmailReal() {
  const [email, setEmail] = useState('info@askyacham.com')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testEmailSending = async () => {
    setIsLoading(true)
    setStatus('Sending test email...')

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log('🚀 Email test result:', data)

      if (data.success) {
        setStatus(`✅ Email sent successfully! Check ${email} for OTP: ${data.data.otp}`)
      } else {
        setStatus(`❌ Failed: ${data.error}`)
      }
    } catch (error) {
      console.error('🚨 Email test error:', error)
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/test-email')
      const data = await response.json()
      
      if (data.success) {
        setStatus(`🔧 Environment Status:
        ${data.data.SENDGRID_API_KEY}
        From Email: ${data.data.FROM_EMAIL}
        Environment: ${data.data.NODE_ENV}`)
      } else {
        setStatus(`❌ Environment check failed: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Environment check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">🚀 Real Email Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={testEmailSending}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : '🚀 Send Test Email'}
            </button>

            <button
              onClick={checkEnvironment}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              🔧 Check Environment
            </button>
          </div>

          {status && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">{status}</pre>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>This will send a real email using your SendGrid API key</p>
          <p>Check your email: <strong>{email}</strong></p>
        </div>
      </div>
    </div>
  )
}










