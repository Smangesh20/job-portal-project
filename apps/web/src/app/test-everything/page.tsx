'use client'

import React, { useState } from 'react'

export default function TestEverything() {
  const [email, setEmail] = useState('info@askyacham.com')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testSendGrid = async () => {
    setIsLoading(true)
    setStatus('Testing SendGrid email delivery...')

    try {
      const response = await fetch('/api/test-sendgrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log('🚀 SendGrid test result:', data)

      if (data.success) {
        setStatus(`✅ SendGrid Test SUCCESSFUL!\nEmail sent to: ${email}\nMessage ID: ${data.data.messageId}`)
      } else {
        setStatus(`❌ SendGrid Test FAILED:\n${data.error}\n\nEnvironment Check:\n${JSON.stringify(data.envCheck, null, 2)}`)
      }
    } catch (error) {
      console.error('🚨 SendGrid test error:', error)
      setStatus(`❌ SendGrid Test ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: 'google' }),
      })

      const data = await response.json()
      console.log('🚀 Google OAuth test result:', data)

      if (data.success && data.data.authUrl) {
        setStatus(`✅ Google OAuth Test SUCCESSFUL!\nOAuth URL: ${data.data.authUrl}\n\nClick the button below to test the OAuth flow:`)
        
        // Create a button to redirect to Google OAuth
        setTimeout(() => {
          const testButton = document.createElement('button')
          testButton.textContent = '🚀 Test Google OAuth Flow'
          testButton.className = 'mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          testButton.onclick = () => {
            window.location.href = data.data.authUrl
          }
          const statusDiv = document.getElementById('status')
          if (statusDiv) {
            statusDiv.appendChild(testButton)
          }
        }, 1000)
      } else {
        setStatus(`❌ Google OAuth Test FAILED:\n${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('🚨 Google OAuth test error:', error)
      setStatus(`❌ Google OAuth Test ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
          🚀 Test Everything - Google OAuth + Email
        </h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testSendGrid}
              disabled={isLoading}
              className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              📧 Test SendGrid
            </button>

            <button
              onClick={testGoogleAuth}
              disabled={isLoading}
              className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              🔐 Test Google OAuth
            </button>

            <button
              onClick={checkEnvironment}
              className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-semibold"
            >
              🔧 Check Environment
            </button>
          </div>

          <div id="status" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[100px]">
            <pre className="text-sm whitespace-pre-wrap text-gray-800">{status || 'Click a button above to test...'}</pre>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">🎯 What This Tests:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>📧 SendGrid Test:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Real email delivery via SendGrid</li>
                <li>• API key validation</li>
                <li>• Email formatting</li>
                <li>• Delivery confirmation</li>
              </ul>
            </div>
            <div>
              <p><strong>🔐 Google OAuth Test:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• OAuth URL generation</li>
                <li>• State parameter security</li>
                <li>• Redirect flow</li>
                <li>• Real Google OAuth</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}







