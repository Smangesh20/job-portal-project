'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestGooglePage() {
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setResult('')

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
        setResult(`✅ Google OAuth initiated! Redirecting to: ${data.data.authUrl}`)
        // Redirect to Google OAuth
        window.location.href = data.data.authUrl
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
            <CardTitle>🔵 Google OAuth Test</CardTitle>
            <CardDescription>
              Test the Google Sign-In functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Initiating...' : '🔵 Sign in with Google'}
            </Button>

            {result && (
              <div className="mt-4 p-3 rounded-md bg-gray-100">
                <p className="text-sm">{result}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-2">🔵 How to Test:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Click "Sign in with Google"</li>
                <li>2. You'll be redirected to Google OAuth</li>
                <li>3. Complete the Google authentication</li>
                <li>4. You'll be redirected back to the dashboard</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Setup Required:</h3>
              <p className="text-sm text-yellow-800">
                Make sure you have set up Google OAuth credentials in your environment variables:
              </p>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                <li>• GOOGLE_CLIENT_ID</li>
                <li>• GOOGLE_CLIENT_SECRET</li>
                <li>• GOOGLE_REDIRECT_URI</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}










