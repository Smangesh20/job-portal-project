'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthUnified } from '@/hooks/useAuthUnified'

export default function TestHeaderPage() {
  const { user, isAuthenticated, isLoading } = useAuthUnified()
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  useEffect(() => {
    addTestResult('Test page loaded')
    addTestResult(`Authentication status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`)
    addTestResult(`User: ${user ? user.firstName || user.name || 'Unknown' : 'No user'}`)
  }, [isAuthenticated, user])

  const testNotifications = () => {
    addTestResult('Testing notifications...')
    // Check if notification button exists
    const notificationButton = document.querySelector('[data-testid="notification-button"]')
    if (notificationButton) {
      addTestResult('✅ Notification button found')
      // Simulate click
      ;(notificationButton as HTMLElement).click()
      addTestResult('✅ Notification button clicked')
    } else {
      addTestResult('❌ Notification button not found')
    }
  }

  const testDropdowns = () => {
    addTestResult('Testing dropdowns...')
    // Check if dropdown items exist
    const dropdownItems = document.querySelectorAll('[data-testid="dropdown-item"]')
    if (dropdownItems.length > 0) {
      addTestResult(`✅ Found ${dropdownItems.length} dropdown items`)
      // Simulate click on first dropdown
      ;(dropdownItems[0] as HTMLElement).click()
      addTestResult('✅ First dropdown clicked')
    } else {
      addTestResult('❌ No dropdown items found')
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Header Functionality Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={testNotifications} className="w-full">
                Test Notifications
              </Button>
              <Button onClick={testDropdowns} className="w-full">
                Test Dropdowns
              </Button>
            </div>
            
            <Button onClick={clearResults} variant="outline" className="w-full">
              Clear Results
            </Button>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
              <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500">No test results yet. Click the test buttons above.</p>
                ) : (
                  <div className="space-y-1">
                    {testResults.map((result, index) => (
                      <div key={index} className="text-sm font-mono">
                        {result}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Current State:</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                <p><strong>User:</strong> {user ? `${user.firstName || user.name || 'Unknown'} (${user.email})` : 'None'}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Make sure you're logged in to test notifications</li>
                  <li>Click "Test Notifications" to test the notification button</li>
                  <li>Click "Test Dropdowns" to test the dropdown functionality</li>
                  <li>Check the browser console for detailed debug logs</li>
                  <li>Look for console messages starting with "🔔 GOOGLE-STYLE:" and "🖱️ GOOGLE-STYLE:"</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

















