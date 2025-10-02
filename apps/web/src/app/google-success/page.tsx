'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function GoogleSuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing Google authentication...')

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      setStatus('❌ Google authentication failed: ' + error)
      setTimeout(() => {
        window.location.href = '/login?error=google_auth_failed'
      }, 3000)
      return
    }

    if (code) {
      // 🚀 SUCCESS - REDIRECT TO DASHBOARD
      setStatus('✅ Google authentication successful! Redirecting to dashboard...')
      
      // 🚀 DETERMINE ACTION FROM STATE
      let action = 'signin'
      if (state?.includes('signup')) {
        action = 'signup'
      }
      
      setTimeout(() => {
        window.location.href = `/dashboard?google_success=true&action=${action}&auth_method=google&state=${state}&timestamp=${Date.now()}`
      }, 2000)
    } else {
      setStatus('❌ No authentication code received')
      setTimeout(() => {
        window.location.href = '/login?error=no_code'
      }, 3000)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-8"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Google Authentication</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}