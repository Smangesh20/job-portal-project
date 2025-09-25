'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestGoogleSimplePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [authUrl, setAuthUrl] = useState('')

  const testGoogleSimple = async () => {
    setIsLoading(true)
    setStatus('🔐 Testing Google Sign-In Simple...\n')
    setAuthUrl('')
    
    try {
      console.log('🚀 Testing Google Sign-In simple...')
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      
      const data = await response.json()
      console.log('🚀 Google simple test result:', data)
      
      if (data.success) {
        setStatus(prev => prev + '✅ GOOGLE SIGN-IN WORKING!\n\n')
        setStatus(prev => prev + '🔐 GOOGLE DETAILS:\n')
        setStatus(prev => prev + `   • Success: ${data.success}\n`)
        setStatus(prev => prev + `   • OAuth URL: ${data.data?.authUrl ? 'Generated' : 'Not Generated'}\n`)
        setStatus(prev => prev + `   • Demo Mode: ${data.data?.demoMode ? 'ON' : 'OFF'}\n`)
        setStatus(prev => prev + `   • State: ${data.data?.state || 'N/A'}\n\n`)
        
        if (data.data?.authUrl) {
          setAuthUrl(data.data.authUrl)
          setStatus(prev => prev + '🚀 OAUTH URL GENERATED!\n')
          setStatus(prev => prev + '🔐 Button is CLICKABLE!\n')
          setStatus(prev => prev + '✅ Google Sign-In is WORKING!\n\n')
          
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            setStatus(prev => prev + '🚀 Auto-redirecting to Google OAuth in 3 seconds...\n')
            setTimeout(() => {
              setStatus(prev => prev + '🚀 Redirecting NOW...\n')
              window.location.href = data.data.authUrl
            }, 3000)
          }, 1000)
        }
        
      } else {
        setStatus(prev => prev + '❌ GOOGLE SIGN-IN FAILED\n\n')
        setStatus(prev => prev + '🚨 ERROR DETAILS:\n')
        setStatus(prev => prev + `   • Error: ${data.error || 'Unknown error'}\n`)
        setStatus(prev => prev + `   • Success: ${data.success}\n\n`)
        
        setStatus(prev => prev + '🔧 EXTERNAL CAUSES:\n')
        setStatus(prev => prev + '   • Google Cloud Console setup incomplete\n')
        setStatus(prev => prev + '   • OAuth consent screen not configured\n')
        setStatus(prev => prev + '   • Client ID/Secret not set\n')
        setStatus(prev => prev + '   • Redirect URI mismatch\n')
        setStatus(prev => prev + '   • Domain verification pending\n')
        setStatus(prev => prev + '   • Google API quotas exceeded\n\n')
        
        setStatus(prev => prev + '🎯 TROUBLESHOOTING:\n')
        setStatus(prev => prev + '   1. Complete Google Cloud Console setup\n')
        setStatus(prev => prev + '   2. Configure OAuth consent screen\n')
        setStatus(prev => prev + '   3. Add authorized redirect URIs\n')
        setStatus(prev => prev + '   4. Enable Google+ API\n')
        setStatus(prev => prev + '   5. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET\n')
      }
      
    } catch (error: any) {
      console.error('🚨 Google simple test error:', error)
      setStatus(prev => prev + `❌ TEST ERROR: ${error.message}\n`)
      setStatus(prev => prev + '🔧 Check network connection and try again\n')
    } finally {
      setIsLoading(false)
    }
  }

  const testGoogleButton = async () => {
    setIsLoading(true)
    setStatus('🔐 Testing Google Button Click...\n')
    
    try {
      // Simulate button click
      console.log('🚀 Simulating Google button click...')
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      
      const data = await response.json()
      
      if (data.success && data.data?.authUrl) {
        setStatus(prev => prev + '✅ GOOGLE BUTTON CLICK WORKING!\n')
        setStatus(prev => prev + '🚀 Creating clickable button...\n\n')
        
        setTimeout(() => {
          const button = document.createElement('button')
          button.textContent = '🚀 CLICK TO GOOGLE OAUTH (WORKING)'
          button.className = 'mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold w-full'
          button.onclick = () => {
            console.log('🚀 Button clicked, redirecting to Google OAuth...')
            window.location.href = data.data.authUrl
          }
          
          const statusDiv = document.getElementById('status')
          if (statusDiv) {
            statusDiv.appendChild(button)
          }
        }, 1000)
        
      } else {
        setStatus(prev => prev + '❌ GOOGLE BUTTON CLICK FAILED\n')
        setStatus(prev => prev + `Error: ${data.error || 'Unknown error'}\n`)
      }
    } catch (error: any) {
      setStatus(prev => prev + `❌ Button Test Error: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-900">
            🔐 GOOGLE SIGN-IN SIMPLE TEST
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={testGoogleSimple}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '🔐 Testing...' : '🔐 TEST GOOGLE SIMPLE'}
            </Button>
            
            <Button 
              onClick={testGoogleButton}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
            >
              {isLoading ? '🔐 Testing...' : '🔐 TEST GOOGLE BUTTON'}
            </Button>
          </div>

          {authUrl && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🚀 Google OAuth URL Generated:</h3>
              <p className="text-blue-700 text-sm break-all mb-2">{authUrl}</p>
              <Button 
                onClick={() => {
                  console.log('🚀 Manual redirect to Google OAuth...')
                  window.location.href = authUrl
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                🚀 GO TO GOOGLE OAUTH
              </Button>
            </div>
          )}

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            <pre id="status" className="whitespace-pre-wrap">
              {status || 'Click buttons above to test Google Sign-In...'}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 EXTERNAL ACTIONS REQUIRED:</h3>
            <div className="text-yellow-700 text-sm space-y-1">
              <p><strong>For Google Sign-In to work:</strong></p>
              <p>1. Complete Google Cloud Console setup</p>
              <p>2. Configure OAuth consent screen</p>
              <p>3. Add authorized redirect URIs</p>
              <p>4. Enable Google+ API</p>
              <p>5. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables</p>
              <p>6. Test in incognito mode</p>
              <p>7. Disable pop-up blockers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
