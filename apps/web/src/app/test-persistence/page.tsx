'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { localAuthService } from '@/lib/local-auth'

export default function TestPersistencePage() {
  const { user, isAuthenticated, login, register, logout } = useAuthStore()
  const [testResults, setTestResults] = useState<string[]>([])
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'CANDIDATE'
  })

  const addResult = (message: string, isSuccess: boolean = true) => {
    setTestResults(prev => [...prev, `${isSuccess ? '✅' : '❌'} ${message}`])
  }

  const clearResults = () => {
    setTestResults([])
  }

  const testRegistration = async () => {
    try {
      addResult('Testing user registration...')
      await register(formData)
      addResult(`User registered successfully: ${formData.email}`)
    } catch (error: any) {
      addResult(`Registration failed: ${error.message}`, false)
    }
  }

  const testLogin = async () => {
    try {
      addResult('Testing user login...')
      await login(formData.email, formData.password)
      addResult(`User logged in successfully: ${formData.email}`)
    } catch (error: any) {
      addResult(`Login failed: ${error.message}`, false)
    }
  }

  const testLogout = async () => {
    try {
      addResult('Testing user logout...')
      await logout()
      addResult('User logged out successfully')
    } catch (error: any) {
      addResult(`Logout failed: ${error.message}`, false)
    }
  }

  const testPersistence = async () => {
    try {
      addResult('Testing data persistence...')
      const users = localAuthService.getAllUsers()
      addResult(`Found ${users.length} users in storage`)
      
      if (users.length > 0) {
        users.forEach((user, index) => {
          addResult(`User ${index + 1}: ${user.firstName} ${user.lastName} (${user.email})`)
        })
      }
    } catch (error: any) {
      addResult(`Persistence test failed: ${error.message}`, false)
    }
  }

  const clearAllData = () => {
    try {
      localAuthService.clearAllData()
      addResult('All test data cleared')
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'CANDIDATE'
      })
    } catch (error: any) {
      addResult(`Clear data failed: ${error.message}`, false)
    }
  }

  const runFullTest = async () => {
    clearResults()
    addResult('🧪 Starting Full Account Persistence Test...')
    
    // Test 1: Registration
    await testRegistration()
    
    // Test 2: Login
    await testLogin()
    
    // Test 3: Persistence check
    await testPersistence()
    
    // Test 4: Logout
    await testLogout()
    
    // Test 5: Login again (to test persistence)
    await testLogin()
    
    addResult('🎉 Full test completed!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Account Data Persistence Test
          </h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Status</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p><strong>User:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Test Form</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="password123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CANDIDATE">Candidate</option>
                  <option value="EMPLOYER">Employer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Test Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={testRegistration}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Test Registration
              </button>
              <button
                onClick={testLogin}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Test Login
              </button>
              <button
                onClick={testLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Test Logout
              </button>
              <button
                onClick={testPersistence}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Test Persistence
              </button>
              <button
                onClick={runFullTest}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Run Full Test
              </button>
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear All Data
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Clear Results
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Test Results</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run a test to see results here.</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Fill in the form with test data</li>
              <li>Click "Test Registration" to create a new account</li>
              <li>Click "Test Login" to login with the account</li>
              <li>Click "Test Persistence" to verify data is saved</li>
              <li>Refresh the page and login again to test persistence across page reloads</li>
              <li>Use "Run Full Test" to test all functionality at once</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
