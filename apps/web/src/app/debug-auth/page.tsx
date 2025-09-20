'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { localAuthService } from '@/lib/local-auth'

export default function DebugAuthPage() {
  const [users, setUsers] = useState<any[]>([])
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    // Get all users from local auth service
    const allUsers = localAuthService.getAllUsers()
    setUsers(allUsers)
    console.log('🚀 DEBUG: All users:', allUsers)
  }, [])

  const testLogin = async () => {
    try {
      console.log('🚀 DEBUG: Testing login...')
      const response = await localAuthService.login('test@example.com', 'password123')
      console.log('🚀 DEBUG: Login response:', response)
    } catch (error) {
      console.error('🚀 DEBUG: Login error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
            <div className="space-y-2">
              <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? user.email : 'None'}</p>
            </div>
          </div>

          {/* Test Users */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Users ({users.length})</h2>
            <div className="space-y-2">
              {users.map((user, index) => (
                <div key={index} className="border p-2 rounded">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
                  <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Test Login */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Login</h2>
            <button
              onClick={testLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Login (test@example.com / password123)
            </button>
          </div>

          {/* Local Storage */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Local Storage</h2>
            <div className="space-y-2">
              <p><strong>Users:</strong> {localStorage.getItem('askyacham_users') ? 'Present' : 'Empty'}</p>
              <p><strong>Sessions:</strong> {localStorage.getItem('askyacham_sessions') ? 'Present' : 'Empty'}</p>
              <p><strong>Access Token:</strong> {localStorage.getItem('accessToken') ? 'Present' : 'Empty'}</p>
              <p><strong>Refresh Token:</strong> {localStorage.getItem('refreshToken') ? 'Present' : 'Empty'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
