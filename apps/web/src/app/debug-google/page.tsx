'use client'

import React, { useState } from 'react'

export default function DebugGoogle() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testGoogleButtonClick = async () => {
    setIsLoading(true)
    setStatus('Testing Google Sign-In button click...')

    try {
      // Test the exact same call that the button makes
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })

      const data = await response.json()
      console.log('🚀 Google OAuth test result:', data)

      if (data.success && data.data.authUrl) {
        setStatus(`✅ Google Sign-In Button Works!\n\nOAuth URL: ${data.data.authUrl}\n\nClick below to test OAuth flow:`)
        
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
        setStatus(`❌ Google Sign-In Button Failed:\n${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('🚨 Google button test error:', error)
      setStatus(`❌ Google Button Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testEmailWithYourKey = async () => {
    setIsLoading(true)
    setStatus('Testing Email with your SendGrid API key...')

    try {
      // Test email with your API key
      const response = await fetch('/api/test-email-working', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info@askyacham.com' })
      })

      const data = await response.json()
      console.log('🚀 Email test result:', data)

      if (data.success) {
        setStatus(`✅ Email Delivery Works!\n\nOTP sent to: info@askyacham.com\nOTP Code: ${data.data.otp}\n\nCheck your email NOW!`)
      } else {
        setStatus(`❌ Email Delivery Failed:\n${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('🚨 Email test error:', error)
      setStatus(`❌ Email Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testEnvironmentVariables = async () => {
    setIsLoading(true)
    setStatus('Checking environment variables...')

    try {
      const response = await fetch('/api/debug/env')
      const data = await response.json()
      
      if (data.success) {
        setStatus(`🔧 Environment Variables:\n${JSON.stringify(data.data, null, 2)}`)
      } else {
        setStatus(`❌ Environment check failed: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Environment check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateButtonClick = () => {
    setStatus('Simulating Google Sign-In button click...')
    
    // Simulate the exact button click behavior
    const mockMethodSelect = (method: string) => {
      console.log('🚀 MOCK METHOD SELECTED:', method)
      if (method === 'social') {
        console.log('🚀 MOCK: Switching to social method - calling handleSocialLogin')
        // Simulate the social login call
        testGoogleButtonClick()
      }
    }

    // Simulate clicking the Google Sign-In button
    mockMethodSelect('social')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          🔍 Debug Google Sign-In & Email
        </h1>
        
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">⚠️ Current Issues:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            <li>• Google Sign-In button not clickable</li>
            <li>• Email not receiving</li>
            <li>• Environment variables added but not working</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={simulateButtonClick}
            disabled={isLoading}
            className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔍 Simulate Button Click
          </button>

          <button
            onClick={testGoogleButtonClick}
            disabled={isLoading}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔐 Test Google OAuth
          </button>

          <button
            onClick={testEmailWithYourKey}
            disabled={isLoading}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            📧 Test Email Delivery
          </button>

          <button
            onClick={testEnvironmentVariables}
            disabled={isLoading}
            className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-semibold"
          >
            🔧 Check Environment
          </button>
        </div>

        <div id="status" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[200px]">
          <pre className="text-sm whitespace-pre-wrap text-gray-800">{status || 'Click a button above to debug...'}</pre>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">🎯 What Each Test Does:</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>🔍 Button Simulation:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Simulates exact button click</li>
                <li>• Tests method selection</li>
                <li>• Tests social login flow</li>
              </ul>
            </div>
            <div>
              <p><strong>📧 Email Tests:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Tests OTP email delivery</li>
                <li>• Uses your SendGrid API key</li>
                <li>• Validates email service</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
