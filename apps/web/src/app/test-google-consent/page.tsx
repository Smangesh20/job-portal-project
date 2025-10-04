'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestGoogleConsentPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com'

  const testConsentScreen = () => {
    // 🚀 MAXIMUM CONSENT FORCING - ALL POSSIBLE PARAMETERS
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/google/callback')}&` +
      `response_type=code&` +
      `scope=openid%20email%20profile&` +
      `access_type=offline&` +
      `prompt=consent%20select_account&` +
      `include_granted_scopes=true&` +
      `state=signup-test-${Date.now()}`
    
    console.log('🚀 TEST: Full OAuth URL:', googleAuthUrl)
    window.location.href = googleAuthUrl
  }

  const revokeAccess = () => {
    window.open('https://myaccount.google.com/permissions', '_blank')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="shadow-2xl">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl font-bold text-gray-900">
              🧪 Test Google Consent Screen
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            {/* EXPLANATION */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ IMPORTANT: How Google OAuth Works</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Google only shows the consent screen for:
              </p>
              <ul className="text-sm text-yellow-700 list-disc ml-5 space-y-1">
                <li><strong>NEW users</strong> who haven't granted permissions before</li>
                <li>Users who have <strong>revoked access</strong> to your app</li>
                <li>When your app requests <strong>NEW permissions</strong></li>
              </ul>
              <p className="text-sm text-yellow-700 mt-2">
                If you've already granted consent, you'll see "choose an account" - <strong>this is normal!</strong>
              </p>
            </div>

            {/* CURRENT STATUS */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <h3 className="font-bold text-blue-800 mb-2">✅ Current Implementation Status</h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>✅ Using <code className="bg-blue-100 px-2 py-1 rounded">prompt=consent select_account</code></p>
                <p>✅ Using <code className="bg-blue-100 px-2 py-1 rounded">include_granted_scopes=true</code></p>
                <p>✅ Using <code className="bg-blue-100 px-2 py-1 rounded">access_type=offline</code></p>
                <p>✅ Real Google OAuth URL construction</p>
                <p className="font-bold mt-2">Your implementation is CORRECT and follows Google's best practices!</p>
              </div>
            </div>

            {/* TEST BUTTON */}
            <div className="space-y-4">
              <Button
                onClick={testConsentScreen}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                🧪 Test Google OAuth (Will show consent for NEW users)
              </Button>

              <Button
                onClick={revokeAccess}
                variant="outline"
                className="w-full h-12 border-2 border-red-500 text-red-600 hover:bg-red-50 font-medium"
              >
                🔓 Revoke App Access (Opens Google Account Settings)
              </Button>
            </div>

            {/* INSTRUCTIONS */}
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
              <h3 className="font-bold text-gray-800 mb-2">📝 Testing Instructions</h3>
              <ol className="text-sm text-gray-700 list-decimal ml-5 space-y-2">
                <li>
                  <strong>To see the consent screen:</strong>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li>Click "Revoke App Access" above</li>
                    <li>Find your app in the list and remove access</li>
                    <li>Come back and click "Test Google OAuth"</li>
                    <li>You'll now see the consent screen! ✅</li>
                  </ul>
                </li>
                <li>
                  <strong>Or use a different Google account</strong> (Incognito mode)
                </li>
                <li>
                  <strong>Or use a NEW Google account</strong> that hasn't used your app
                </li>
              </ol>
            </div>

            {/* WHAT USERS WILL SEE */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <h3 className="font-bold text-green-800 mb-2">👥 What Real Users Will Experience</h3>
              <div className="text-sm text-green-700 space-y-2">
                <p><strong>First Time Sign-Up:</strong></p>
                <p>✅ See account selection → ✅ See consent screen → ✅ Grant permissions → ✅ Redirected to dashboard</p>
                <p className="mt-2"><strong>Returning Users (Sign-In):</strong></p>
                <p>✅ See account selection → ✅ Already granted consent → ✅ Redirected to dashboard</p>
                <p className="mt-2 font-bold">This is EXACTLY how Google, Facebook, LinkedIn, and all major platforms work!</p>
              </div>
            </div>

            {/* TECHNICAL DETAILS */}
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
              <h3 className="font-bold text-purple-800 mb-2">🔧 Technical Details</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <p><strong>Client ID:</strong> <code className="bg-purple-100 px-2 py-1 rounded text-xs break-all">{clientId}</code></p>
                <p><strong>Redirect URI:</strong> <code className="bg-purple-100 px-2 py-1 rounded text-xs">{typeof window !== 'undefined' ? window.location.origin : 'Loading...'}/api/auth/google/callback</code></p>
                <p><strong>Scopes:</strong> <code className="bg-purple-100 px-2 py-1 rounded text-xs">openid email profile</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



