'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TestGoogleRealtimePage() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults(prev => [...prev.slice(-9), `[${timestamp}] ${type.toUpperCase()}: ${message}`])
  }

  // 🚀 CHECK ENVIRONMENT VARIABLES
  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/debug/env')
      const data = await response.json()
      setEnvStatus(data.data)
      
      if (data.success) {
        addResult('✅ Environment variables checked successfully', 'success')
      } else {
        addResult('❌ Failed to check environment variables', 'error')
      }
    } catch (error) {
      addResult(`❌ Error checking environment: ${error}`, 'error')
    }
  }

  // 🚀 TEST GOOGLE OAUTH INITIATION
  const testGoogleOAuth = async () => {
    setIsLoading(true)
    addResult('🚀 Testing Google OAuth initiation...', 'info')

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
        addResult(`✅ Google OAuth initiated successfully!`, 'success')
        addResult(`🔗 Auth URL: ${data.data.authUrl}`, 'info')
        
        // Test if we can redirect
        setTimeout(() => {
          addResult('🚀 Redirecting to Google OAuth...', 'info')
          window.location.href = data.data.authUrl
        }, 2000)
      } else {
        addResult(`❌ Google OAuth failed: ${data.error}`, 'error')
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔵 Google OAuth Real-Time Test</CardTitle>
            <CardDescription>
              Test Google Sign-In functionality in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* 🚀 ENVIRONMENT STATUS */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">🔧 Environment Status</h3>
              {envStatus ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Google Client ID:</span>
                    <Badge variant={envStatus.GOOGLE_CLIENT_ID === '✅ Set' ? 'default' : 'destructive'}>
                      {envStatus.GOOGLE_CLIENT_ID}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Google Client Secret:</span>
                    <Badge variant={envStatus.GOOGLE_CLIENT_SECRET === '✅ Set' ? 'default' : 'destructive'}>
                      {envStatus.GOOGLE_CLIENT_SECRET}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Redirect URI:</span>
                    <Badge variant="outline">
                      {envStatus.computed?.googleRedirectUri}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">App URL:</span>
                    <Badge variant="outline">
                      {envStatus.computed?.appUrl}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Loading environment status...</div>
              )}
              <Button onClick={checkEnvironment} className="mt-4" variant="outline">
                🔄 Refresh Environment Status
              </Button>
            </div>

            {/* 🚀 GOOGLE OAUTH TEST */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">🔵 Google OAuth Test</h3>
              <Button
                onClick={testGoogleOAuth}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Testing...' : '🔵 Test Google Sign-In'}
              </Button>
            </div>

            {/* 📊 TEST RESULTS */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">📊 Test Results</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm p-2 rounded bg-gray-100">
                    {result}
                  </div>
                ))}
                {testResults.length === 0 && (
                  <div className="text-gray-500 text-sm">No test results yet...</div>
                )}
              </div>
            </div>

            {/* 📋 SETUP INSTRUCTIONS */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-lg mb-4 text-blue-900">📋 Setup Instructions</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div><strong>If Google OAuth is not working:</strong></div>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" className="underline">Google Cloud Console</a></li>
                  <li>Create OAuth 2.0 Client ID</li>
                  <li>Add redirect URI: <code>{envStatus?.computed?.googleRedirectUri}</code></li>
                  <li>Copy Client ID and Secret</li>
                  <li>Add to environment variables in Vercel</li>
                  <li>Redeploy your application</li>
                </ol>
                <div className="mt-3"><strong>Environment Variables to Set:</strong></div>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><code>GOOGLE_CLIENT_ID</code> - Your Google Client ID</li>
                  <li><code>GOOGLE_CLIENT_SECRET</code> - Your Google Client Secret</li>
                  <li><code>GOOGLE_REDIRECT_URI</code> - {envStatus?.computed?.googleRedirectUri}</li>
                  <li><code>NEXT_PUBLIC_APP_URL</code> - {envStatus?.computed?.appUrl}</li>
                </ul>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
