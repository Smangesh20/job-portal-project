'use client'

import React, { useState } from 'react'

export default function TestFix() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testDirectEmail = async () => {
    setIsLoading(true)
    setStatus('📧 Testing Direct Email Delivery...\n')

    try {
      const response = await fetch('/api/test-email-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })

      const data = await response.json()
      console.log('📧 Direct email test result:', data)

      if (data.success) {
        setStatus(`✅ DIRECT EMAIL: SUCCESS!\n\nEmail sent to: pullareddypullareddy20@gmail.com\nMessage ID: ${data.data?.messageId || 'N/A'}\nStatus Code: ${data.data?.statusCode || 'N/A'}\n\nCheck your email NOW!\n\nIf you don't see it, check your SPAM folder!`)
      } else {
        setStatus(`❌ DIRECT EMAIL: FAILED\n\nError: ${data.error || 'Unknown error'}\nDetails: ${data.details || 'No details'}\n\nSendGrid Error: ${JSON.stringify(data.sendGridError || {}, null, 2)}`)
      }
    } catch (error) {
      console.error('📧 Direct email test error:', error)
      setStatus(`❌ DIRECT EMAIL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testGoogleButton = async () => {
    setIsLoading(true)
    setStatus('🔐 Testing Google Sign-In Button...\n')

    try {
      // Test the Google OAuth endpoint directly
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })

      const data = await response.json()
      console.log('🔐 Google button test result:', data)

      if (data.success && data.data?.authUrl) {
        setStatus(`✅ GOOGLE SIGN-IN: WORKING!\n\nOAuth URL: ${data.data.authUrl}\n\nClick below to test the OAuth flow:`)
        
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
        setStatus(`❌ GOOGLE SIGN-IN: FAILED\n\nError: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('🔐 Google button test error:', error)
      setStatus(`❌ GOOGLE BUTTON ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testOTPEmail = async () => {
    setIsLoading(true)
    setStatus('🔑 Testing OTP Email...\n')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })

      const data = await response.json()
      console.log('🔑 OTP email test result:', data)

      if (data.success) {
        setStatus(`✅ OTP EMAIL: SUCCESS!\n\nOTP sent to: pullareddypullareddy20@gmail.com\nOTP Code: ${data.data?.otp || 'Generated'}\n\nCheck your email for the OTP!\n\nIf you don't see it, check your SPAM folder!`)
      } else {
        setStatus(`❌ OTP EMAIL: FAILED\n\nError: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('🔑 OTP email test error:', error)
      setStatus(`❌ OTP EMAIL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testEverything = async () => {
    setIsLoading(true)
    setStatus('🚀 TESTING EVERYTHING TO FIX THE PROBLEMS...\n\n')

    try {
      // Test Direct Email
      setStatus(prev => prev + '1. DIRECT EMAIL TEST:\n')
      const emailResponse = await fetch('/api/test-email-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      const emailData = await emailResponse.json()
      
      if (emailData.success) {
        setStatus(prev => prev + '✅ Direct Email: WORKING\n')
        setStatus(prev => prev + `   - Message ID: ${emailData.data.messageId}\n`)
        setStatus(prev => prev + `   - Status Code: ${emailData.data.statusCode}\n\n`)
      } else {
        setStatus(prev => prev + '❌ Direct Email: FAILED\n')
        setStatus(prev => prev + `   - Error: ${emailData.error}\n\n`)
      }

      // Test Google OAuth
      setStatus(prev => prev + '2. GOOGLE SIGN-IN TEST:\n')
      const googleResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      const googleData = await googleResponse.json()
      
      if (googleData.success) {
        setStatus(prev => prev + '✅ Google Sign-In: WORKING\n')
        setStatus(prev => prev + `   - OAuth URL: ${googleData.data?.authUrl?.substring(0, 50) || 'Generated'}...\n`)
        setStatus(prev => prev + `   - Demo Mode: ${googleData.data.demoMode ? 'ON' : 'OFF'}\n\n`)
      } else {
        setStatus(prev => prev + '❌ Google Sign-In: FAILED\n')
        setStatus(prev => prev + `   - Error: ${googleData.error}\n\n`)
      }

      // Test OTP Email
      setStatus(prev => prev + '3. OTP EMAIL TEST:\n')
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      const otpData = await otpResponse.json()
      
      if (otpData.success) {
        setStatus(prev => prev + '✅ OTP Email: WORKING\n')
        setStatus(prev => prev + `   - OTP Code: ${otpData.data.otp}\n`)
        setStatus(prev => prev + `   - Check pullareddypullareddy20@gmail.com\n\n`)
      } else {
        setStatus(prev => prev + '❌ OTP Email: FAILED\n')
        setStatus(prev => prev + `   - Error: ${otpData.error}\n\n`)
      }

      // Final Status
      setStatus(prev => prev + '🏆 TEST COMPLETE:\n')
      setStatus(prev => prev + 'Check the results above!\n')
      setStatus(prev => prev + 'If emails are working, check your SPAM folder!\n')

    } catch (error) {
      console.error('🚀 Test everything error:', error)
      setStatus(prev => prev + `❌ TEST FAILED: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🔧 FIX THE PROBLEMS - WORKING SOLUTION
        </h1>
        
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">✅ CURRENT STATUS:</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• OTP shows success (status 200) but email not received</li>
            <li>• Google Sign-In button not clickable</li>
            <li>• Need to fix email delivery and button functionality</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={testDirectEmail}
            disabled={isLoading}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            📧 TEST DIRECT EMAIL
          </button>

          <button
            onClick={testGoogleButton}
            disabled={isLoading}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔐 TEST GOOGLE BUTTON
          </button>

          <button
            onClick={testOTPEmail}
            disabled={isLoading}
            className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🔑 TEST OTP EMAIL
          </button>

          <button
            onClick={testEverything}
            disabled={isLoading}
            className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            🚀 TEST EVERYTHING
          </button>
        </div>

        <div id="status" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[400px]">
          <pre className="text-sm whitespace-pre-wrap text-gray-800 font-mono">{status || 'Click a button above to test and fix the problems...'}</pre>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">🎯 FIXING THE PROBLEMS:</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>📧 Email Issues:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Test direct email delivery</li>
                <li>• Check SendGrid configuration</li>
                <li>• Verify email goes to inbox</li>
              </ul>
            </div>
            <div>
              <p><strong>🔐 Google Button Issues:</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Test Google OAuth endpoint</li>
                <li>• Verify OAuth URL generation</li>
                <li>• Check button click functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
