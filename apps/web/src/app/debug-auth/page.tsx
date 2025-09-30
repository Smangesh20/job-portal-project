'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DebugAuthPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])

  // 🚀 CAPTURE CONSOLE LOGS
  useEffect(() => {
    const originalLog = console.log
    const originalError = console.error
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      setConsoleLogs(prev => [...prev.slice(-9), `LOG: ${message}`])
      originalLog(...args)
    }
    
    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      setConsoleLogs(prev => [...prev.slice(-9), `ERROR: ${message}`])
      originalError(...args)
    }

    return () => {
      console.log = originalLog
      console.error = originalError
    }
  }, [])

  const addResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setResults(prev => [...prev.slice(-9), `[${timestamp}] ${type.toUpperCase()}: ${message}`])
  }

  const handleSendOTP = async () => {
    if (!email) {
      addResult('Please enter an email address', 'error')
      return
    }

    setIsLoading(true)
    addResult(`Sending OTP to ${email}...`, 'info')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (data.success) {
        addResult(`✅ OTP sent successfully to ${email}! Check console for the OTP code.`, 'success')
      } else {
        addResult(`❌ Error: ${data.error}`, 'error')
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!email || !otp) {
      addResult('Please enter both email and OTP', 'error')
      return
    }

    setIsLoading(true)
    addResult(`Verifying OTP ${otp} for ${email}...`, 'info')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()
      
      if (data.success) {
        addResult(`✅ OTP verified successfully! User: ${data.data.user?.email}`, 'success')
      } else {
        addResult(`❌ Error: ${data.error}`, 'error')
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    addResult('Initiating Google Sign-In...', 'info')

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: 'google' }),
      })

      const data = await response.json()
      
      if (data.success) {
        addResult(`✅ Google OAuth initiated! Redirecting to: ${data.data.authUrl}`, 'success')
        // Redirect to Google OAuth
        window.location.href = data.data.authUrl
      } else {
        addResult(`❌ Error: ${data.error}`, 'error')
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setResults([])
    setConsoleLogs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Authentication Debug Center</CardTitle>
            <CardDescription>
              Comprehensive testing and debugging for all authentication features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* 🚀 EMAIL OTP TESTING */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">📧 Email OTP Testing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Sending...' : '📧 Send OTP'}
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? 'Verifying...' : '✅ Verify OTP'}
                </Button>
              </div>
            </div>

            {/* 🔵 GOOGLE SIGN-IN TESTING */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">🔵 Google Sign-In Testing</h3>
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Initiating...' : '🔵 Sign in with Google'}
              </Button>
            </div>

            {/* 📊 RESULTS */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">📊 Test Results</h3>
                <Button onClick={clearLogs} variant="outline" size="sm">
                  Clear Logs
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm p-2 rounded bg-gray-100">
                    {result}
                  </div>
                ))}
                {results.length === 0 && (
                  <div className="text-gray-500 text-sm">No test results yet...</div>
                )}
              </div>
            </div>

            {/* 🖥️ CONSOLE LOGS */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">🖥️ Console Logs</h3>
              <div className="space-y-1 max-h-60 overflow-y-auto bg-black text-green-400 p-3 rounded font-mono text-xs">
                {consoleLogs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
                {consoleLogs.length === 0 && (
                  <div className="text-gray-500">No console logs yet...</div>
                )}
              </div>
            </div>

            {/* 📋 INSTRUCTIONS */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-lg mb-4 text-blue-900">📋 Testing Instructions</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div><strong>📧 Email OTP:</strong></div>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Enter your email address</li>
                  <li>Click "Send OTP"</li>
                  <li>Check the Console Logs section for the OTP code</li>
                  <li>Enter the OTP code and click "Verify OTP"</li>
                </ol>
                <div className="mt-3"><strong>🔵 Google Sign-In:</strong></div>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Click "Sign in with Google"</li>
                  <li>Complete Google OAuth flow</li>
                  <li>You'll be redirected back to dashboard</li>
                </ol>
                <div className="mt-3"><strong>🔧 Debugging:</strong></div>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All API calls are logged in Test Results</li>
                  <li>Console logs show detailed debugging info</li>
                  <li>OTP codes are extracted and highlighted</li>
                </ul>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}






