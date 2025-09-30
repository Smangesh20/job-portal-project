'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing Google Sign-In...')

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')
        const state = urlParams.get('state')

        console.log('🚀 Google Callback:', { code, error, state })

        if (error) {
          console.error('🚨 Google OAuth Error:', error)
          setStatus(`❌ Google Sign-In Error: ${error}`)
          
          // Redirect back to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
          return
        }

        if (code && state === 'google_signin') {
          console.log('✅ Google OAuth Success - Code received:', code)
          setStatus('✅ Google Sign-In Successful! Redirecting to dashboard...')
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          console.log('⚠️ No code or invalid state')
          setStatus('⚠️ No authorization code received. Redirecting to login...')
          
          // Redirect back to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        }
      } catch (error) {
        console.error('🚨 Callback Error:', error)
        setStatus('❌ Error processing Google Sign-In. Redirecting to login...')
        
        // Redirect back to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    }

    handleGoogleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Google Sign-In
          </h2>
          <p className="text-gray-600">
            {status}
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          Please wait while we process your Google Sign-In...
        </div>
      </div>
    </div>
  )
}





