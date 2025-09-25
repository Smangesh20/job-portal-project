'use client'

import React, { useState } from 'react'

export default function TestDebug() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const debugEmail = async () => {
    setIsLoading(true)
    setStatus('🔧 DEBUGGING EMAIL SERVICE...\n\n')

    try {
      // Test the email service directly
      const response = await fetch('/api/test-email-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info@askyacham.com' })
      })

      const data = await response.json()
      console.log('🔧 Email debug result:', data)

      setStatus(prev => prev + `📧 EMAIL SERVICE DEBUG:\n`)
      setStatus(prev => prev + `Response: ${JSON.stringify(data, null, 2)}\n\n`)

      if (data.success) {
        setStatus(prev => prev + '✅ EMAIL SERVICE: WORKING\n')
        setStatus(prev => prev + `Message ID: ${data.data.messageId}\n`)
        setStatus(prev => prev + `Check info@askyacham.com for the email!\n\n`)
      } else {
        setStatus(prev => prev + '❌ EMAIL SERVICE: FAILED\n')
        setStatus(prev => prev + `Error: ${data.error}\n`)
        if (data.instructions) {
          setStatus(prev => prev + `Instructions: ${JSON.stringify(data.instructions, null, 2)}\n`)
        }
      }

    } catch (error) {
      console.error('🔧 Email debug error:', error)
      setStatus(prev => prev + `❌ EMAIL DEBUG ERROR: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const debugGoogle = async () => {
    setIsLoading(true)
    setStatus('🔧 DEBUGGING GOOGLE SIGN-IN...\n\n')

    try {
      // Test the Google OAuth endpoint
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })

      const data = await response.json()
      console.log('🔧 Google debug result:', data)

      setStatus(prev => prev + `🔐 GOOGLE OAUTH DEBUG:\n`)
      setStatus(prev => prev + `Response: ${JSON.stringify(data, null, 2)}\n\n`)

      if (data.success) {
        setStatus(prev => prev + '✅ GOOGLE OAUTH: WORKING\n')
        setStatus(prev => prev + `OAuth URL: ${data.data.authUrl}\n`)
        setStatus(prev => prev + `Demo Mode: ${data.data.demoMode ? 'ON' : 'OFF'}\n\n`)
        
        // Create test button
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
        setStatus(prev => prev + '❌ GOOGLE OAUTH: FAILED\n')
        setStatus(prev => prev + `Error: ${data.error}\n`)
      }

    } catch (error) {
      console.error('🔧 Google debug error:', error)
      setStatus(prev => prev + `❌ GOOGLE DEBUG ERROR: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const debugEnvironment = async () => {
    setIsLoading(true)
    setStatus('🔧 DEBUGGING ENVIRONMENT VARIABLES...\n\n')

    try {
      const response = await fetch('/api/debug-auth')
      const data = await response.json()
      console.log('🔧 Environment debug result:', data)

      setStatus(prev => prev + `🔧 ENVIRONMENT DEBUG:\n`)
      setStatus(prev => prev + `Response: ${JSON.stringify(data, null, 2)}\n\n`)

      if (data.success) {
        setStatus(prev => prev + '✅ ENVIRONMENT: LOADED\n')
        setStatus(prev => prev + `Google OAuth: ${data.data.google.clientId}\n`)
        setStatus(prev => prev + `SendGrid API: ${data.data.email.sendGridApiKey}\n`)
        setStatus(prev => prev + `From Email: ${data.data.email.fromEmail}\n`)
        setStatus(prev => prev + `App URL: ${data.data.app.url}\n\n`)
      } else {
        setStatus(prev => prev + '❌ ENVIRONMENT: FAILED\n')
        setStatus(prev => prev + `Error: ${data.error}\n`)
      }

    } catch (error) {
      console.error('🔧 Environment debug error:', error)
      setStatus(prev => prev + `❌ ENVIRONMENT DEBUG ERROR: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  const debugEverything = async () => {
    setIsLoading(true)
    setStatus('🔧 DEBUGGING EVERYTHING...\n\n')

    try {
      // Debug Environment
      setStatus(prev => prev + '1. ENVIRONMENT VARIABLES:\n')
      const envResponse = await fetch('/api/debug-auth')
      const envData = await envResponse.json()
      
      if (envData.success) {
        setStatus(prev => prev + '✅ Environment: OK\n')
        setStatus(prev => prev + `   - Google OAuth: ${envData.data.google.clientId}\n`)
        setStatus(prev => prev + `   - SendGrid API: ${envData.data.email.sendGridApiKey}\n`)
        setStatus(prev => prev + `   - From Email: ${envData.data.email.fromEmail}\n\n`)
      } else {
        setStatus(prev => prev + '❌ Environment: FAILED\n\n')
      }

      // Debug Email
      setStatus(prev => prev + '2. EMAIL SERVICE:\n')
      const emailResponse = await fetch('/api/test-email-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info@askyacham.com' })
      })
      const emailData = await emailResponse.json()
      
      if (emailData.success) {
        setStatus(prev => prev + '✅ Email Service: OK\n')
        setStatus(prev => prev + `   - Message ID: ${emailData.data.messageId}\n`)
        setStatus(prev => prev + `   - Check info@askyacham.com!\n\n`)
      } else {
        setStatus(prev => prev + '❌ Email Service: FAILED\n')
        setStatus(prev => prev + `   - Error: ${emailData.error}\n\n`)
      }

      // Debug Google
      setStatus(prev => prev + '3. GOOGLE OAUTH:\n')
      const googleResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      const googleData = await googleResponse.json()
      
      if (googleData.success) {
        setStatus(prev => prev + '✅ Google OAuth: OK\n')
        setStatus(prev => prev + `   - OAuth URL: ${googleData.data.authUrl.substring(0, 50)}...\n`)
        setStatus(prev => prev + `   - Demo Mode: ${googleData.data.demoMode ? 'ON' : 'OFF'}\n\n`)
      } else {
        setStatus(prev => prev + '❌ Google OAuth: FAILED\n')
        setStatus(prev => prev + `   - Error: ${googleData.error}\n\n`)
      }

      // Final Status
      setStatus(prev => prev + '🏆 DEBUG COMPLETE:\n')
      setStatus(prev => prev + 'Check the results above to see what\'s working!\n')

    } catch (error) {
      console.error('🔧 Everything debug error:', error)
      setStatus(prev => prev + `❌ DEBUG FAILED: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          🔧 DEBUG EVERYTHING - FIND THE PROBLEM
        </h1>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-yellow-800 font-semibold mb-2">⚠️ CURRENT ISSUES:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Email was working before but now not sending</li>
            <li>• Google Sign-In button not clickable</li>
            <li>• Need to debug exactly what's wrong</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={debugEnvironment}
            disabled={isLoading}
            className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔧 DEBUG ENVIRONMENT
          </button>

          <button
            onClick={debugEmail}
            disabled={isLoading}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            📧 DEBUG EMAIL
          </button>

          <button
            onClick={debugGoogle}
            disabled={isLoading}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔐 DEBUG GOOGLE
          </button>

          <button
            onClick={debugEverything}
            disabled={isLoading}
            className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🚀 DEBUG EVERYTHING
          </button>
        </div>

        <div id="status" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[400px]">
          <pre className="text-sm whitespace-pre-wrap text-gray-800 font-mono">{status || 'Click a button above to debug...'}</pre>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">🎯 DEBUGGING LIKE GOOGLE:</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>🔧 Environment:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Check all environment variables</li>
                <li>• Verify API keys are loaded</li>
                <li>• Show configuration status</li>
              </ul>
            </div>
            <div>
              <p><strong>📧 Email & Google:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Test email service directly</li>
                <li>• Test Google OAuth endpoint</li>
                <li>• Show detailed responses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
