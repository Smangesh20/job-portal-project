'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async () => {
    if (!email) {
      setResult('Please enter an email address')
      return
    }

    setIsLoading(true)
    setResult('')

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
        setResult(`✅ OTP sent successfully to ${email}! Check your console for the OTP code.`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!email || !otp) {
      setResult('Please enter both email and OTP')
      return
    }

    setIsLoading(true)
    setResult('')

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
        setResult(`✅ OTP verified successfully! User: ${data.user?.email}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Email OTP Test</CardTitle>
            <CardDescription>
              Test the email OTP functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <Button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>

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

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            {result && (
              <div className="mt-4 p-3 rounded-md bg-gray-100">
                <p className="text-sm">{result}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-2">📧 How to Test:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Enter your email address</li>
                <li>2. Click "Send OTP"</li>
                <li>3. Check the browser console for the OTP code</li>
                <li>4. Enter the OTP code and click "Verify OTP"</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}







