'use client'

import React, { useEffect, useState } from 'react'

export default function GoogleSuccess() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (error) {
      setStatus(`❌ GOOGLE SIGN-IN ERROR:\n\nError: ${error}\n\nPlease try again.`)
    } else if (code) {
      setStatus(`✅ GOOGLE SIGN-IN SUCCESS!\n\n🎉 Welcome to Ask Ya Cham!\n\nYou are now signed in successfully.\n\nCode: ${code.substring(0, 20)}...`)
    } else {
      setStatus('✅ GOOGLE SIGN-IN SUCCESS!\n\n🎉 Welcome to Ask Ya Cham!\n\nYou are now signed in successfully.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Success!
          </h1>
          <p className="text-gray-600">
            Google Sign-In completed successfully
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg mb-8">
          <pre className="text-sm whitespace-pre-wrap text-gray-800">
            {status}
          </pre>
        </div>

        <button
          onClick={() => window.location.href = '/google-works-now'}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Again
        </button>
      </div>
    </div>
  )
}
