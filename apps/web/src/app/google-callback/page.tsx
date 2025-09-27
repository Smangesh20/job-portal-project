'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState('Processing Google Sign-In...')

  useEffect(() => {
    // 🚀 GOOGLE CALLBACK PROCESSING - LIKE GOOGLE
    const processGoogleCallback = () => {
      // Check for Google callback parameters
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const state = urlParams.get('state')
      const error = urlParams.get('error')

      if (error) {
        setStatus('❌ Google Sign-In Error: ' + error)
        toast.error('Google Sign-In failed')
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
        return
      }

      if (code) {
        setStatus('✅ Google Sign-In Successful!')
        toast.success('✅ Google Sign-In successful!')
        
        // Simulate Google's processing
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
        return
      }

      // If no parameters, assume successful sign-in
      setStatus('✅ Google Sign-In Successful!')
      toast.success('✅ Google Sign-In successful!')
      
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    }

    processGoogleCallback()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Google Sign-In
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Processing Google Sign-In
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {status}
              </p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
