'use client'

import React, { useState } from 'react'
import EnterpriseAuthSystem from '@/components/auth/EnterpriseAuthSystem'

export default function TestAuthSystemPage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo(prev => [...prev.slice(-9), `[${timestamp}] ${message}`])
  }

  // 🚀 OVERRIDE CONSOLE LOGS TO CAPTURE DEBUG INFO
  React.useEffect(() => {
    const originalLog = console.log
    console.log = (...args) => {
      const message = args.join(' ')
      if (message.includes('Sign up here clicked') || message.includes('Sign in here clicked')) {
        addDebugInfo(message)
      }
      originalLog(...args)
    }

    return () => {
      console.log = originalLog
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">🧪 Authentication System Test</h1>
          <p className="text-gray-600">Testing the EnterpriseAuthSystem component</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 🚀 AUTH SYSTEM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <EnterpriseAuthSystem />
            </div>
          </div>

          {/* 🔧 DEBUG INFO */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-lg mb-4">🔧 Debug Info</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="text-sm p-2 rounded bg-gray-100">
                    {info}
                  </div>
                ))}
                {debugInfo.length === 0 && (
                  <div className="text-gray-500 text-sm">No debug info yet...</div>
                )}
              </div>
            </div>

            {/* 📋 TESTING CHECKLIST */}
            <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
              <h3 className="font-semibold text-lg mb-4">📋 Testing Checklist</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="test1" />
                  <label htmlFor="test1">Click "Sign up here" link</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="test2" />
                  <label htmlFor="test2">Verify it switches to register mode</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="test3" />
                  <label htmlFor="test3">Click "Sign in here" link</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="test4" />
                  <label htmlFor="test4">Verify it switches back to login mode</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="test5" />
                  <label htmlFor="test5">Test Email & OTP method</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="test6" />
                  <label htmlFor="test6">Test Google Sign-In method</label>
                </div>
              </div>
            </div>

            {/* 🚀 QUICK ACTIONS */}
            <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
              <h3 className="font-semibold text-lg mb-4">🚀 Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => window.open('/debug-auth', '_blank')}
                  className="w-full text-left p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-800"
                >
                  🔧 Open Debug Center
                </button>
                <button
                  onClick={() => window.open('/test-email', '_blank')}
                  className="w-full text-left p-2 rounded bg-green-50 hover:bg-green-100 text-green-800"
                >
                  📧 Test Email OTP
                </button>
                <button
                  onClick={() => window.open('/test-google', '_blank')}
                  className="w-full text-left p-2 rounded bg-red-50 hover:bg-red-100 text-red-800"
                >
                  🔵 Test Google OAuth
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}







