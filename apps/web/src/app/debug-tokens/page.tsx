'use client'

import { useState, useEffect } from 'react'
import { localAuthService } from '@/lib/local-auth'

export default function DebugTokensPage() {
  const [tokens, setTokens] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    // Get data from localStorage
    const loadData = () => {
      try {
        const storedData = localStorage.getItem('localAuthData')
        if (storedData) {
          const data = JSON.parse(storedData)
          setTokens(data.resetTokens || [])
          setUsers(data.users || [])
          setSessions(data.sessions || [])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  const clearAllData = () => {
    localAuthService.clearAllData()
    setTokens([])
    setUsers([])
    setSessions([])
  }

  const testTokenValidation = async (token: string) => {
    try {
      const result = await localAuthService.validateResetToken(token)
      alert(`Token validation result: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      alert(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Debug Tokens & Auth Data</h1>
          <p className="mt-2 text-gray-600">Debug page for troubleshooting authentication issues</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reset Tokens */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Reset Tokens ({tokens.length})</h2>
            {tokens.length === 0 ? (
              <p className="text-gray-500">No reset tokens found</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(tokens).map(([token, data]: [string, any]) => (
                  <div key={token} className="border rounded p-3">
                    <div className="text-sm">
                      <strong>Token:</strong> {token.substring(0, 20)}...
                    </div>
                    <div className="text-sm">
                      <strong>Email:</strong> {data.email}
                    </div>
                    <div className="text-sm">
                      <strong>Expires:</strong> {new Date(data.expiresAt).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <strong>Used:</strong> {data.used ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm">
                      <strong>Valid:</strong> {new Date(data.expiresAt) > new Date() ? 'Yes' : 'No'}
                    </div>
                    <button
                      onClick={() => testTokenValidation(token)}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      Test Validation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(users).map(([id, user]: [string, any]) => (
                  <div key={id} className="border rounded p-3">
                    <div className="text-sm">
                      <strong>ID:</strong> {user.id}
                    </div>
                    <div className="text-sm">
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div className="text-sm">
                      <strong>Name:</strong> {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm">
                      <strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sessions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sessions ({sessions.length})</h2>
            {sessions.length === 0 ? (
              <p className="text-gray-500">No sessions found</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(sessions).map(([token, session]: [string, any]) => (
                  <div key={token} className="border rounded p-3">
                    <div className="text-sm">
                      <strong>Token:</strong> {token.substring(0, 20)}...
                    </div>
                    <div className="text-sm">
                      <strong>User ID:</strong> {session.userId}
                    </div>
                    <div className="text-sm">
                      <strong>Expires:</strong> {new Date(session.expiresAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={clearAllData}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Clear All Data
          </button>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Request a password reset from the forgot password page</li>
            <li>Check if a reset token appears in the "Reset Tokens" section above</li>
            <li>Click the "Test Validation" button to see if the token validates correctly</li>
            <li>Check the browser console for any error messages</li>
            <li>Try clicking the reset link from the email and see what happens</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
