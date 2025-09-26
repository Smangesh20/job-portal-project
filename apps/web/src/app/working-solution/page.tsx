'use client'

import React, { useState } from 'react'

export default function WorkingSolution() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 🚀 GOOGLE SIGN-IN - BULLETPROOF VERSION
  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setStatus('🚀 Starting Google Sign-In...')
    
    // 🚀 IMMEDIATE REDIRECT - WORKS LIKE GOOGLE
    const googleUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      'client_id=1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com&' +
      'redirect_uri=' + encodeURIComponent(window.location.origin + '/api/auth/google/callback') + '&' +
      'response_type=code&' +
      'scope=openid%20email%20profile&' +
      'state=' + Math.random().toString(36).substring(2, 15) + '&' +
      'access_type=offline&' +
      'prompt=consent'
    
    setStatus('✅ Redirecting to Google...')
    
    // 🚀 IMMEDIATE REDIRECT
    window.location.href = googleUrl
  }

  // 🚀 EMAIL - BULLETPROOF VERSION
  const handleEmailTest = async () => {
    setIsLoading(true)
    setStatus('🚀 Sending email...')
    
    try {
      const response = await fetch('/api/email-bulletproof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('✅ EMAIL SENT SUCCESSFULLY!\n\n📧 Email: ' + data.data.email + '\n📧 Status: ' + data.data.status + '\n📧 Time: ' + data.data.timestamp + '\n\n✅ CHECK YOUR EMAIL NOW!')
      } else {
        setStatus('❌ Email failed: ' + data.error)
      }
    } catch (error) {
      setStatus('❌ Email error: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">🚀 WORKING SOLUTION</h1>
          <p className="text-gray-600 mt-2">Bulletproof Google Sign-In & Email</p>
        </div>

        <div className="space-y-4">
          {/* 🚀 GOOGLE SIGN-IN BUTTON */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          {/* 🚀 EMAIL TEST BUTTON */}
          <button
            onClick={handleEmailTest}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {isLoading ? 'Sending...' : 'Test Email NOW'}
          </button>
        </div>

        {/* 🚀 STATUS DISPLAY */}
        <div className="bg-white p-4 rounded-lg border min-h-[120px]">
          <pre className="text-sm whitespace-pre-wrap text-gray-800">
            {status || 'Click a button above to test...'}
          </pre>
        </div>

        {/* 🚀 DIRECT LINKS */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Direct test links:</p>
          <div className="space-y-1">
            <a 
              href="/api/email-realtime" 
              target="_blank"
              className="text-blue-600 hover:text-blue-800 text-sm block"
            >
              🔗 Test Email API Direct
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
