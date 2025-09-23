'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function DebugEmailPage() {
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string; details?: any } | null>(null)

  const handleTestEmail = async () => {
    if (!testEmail) {
      setResult({ success: false, error: 'Please enter an email address' })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      console.log('🧪 Testing email to:', testEmail)
      
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      })

      const data = await response.json()
      
      console.log('📧 Email API Response:', data)
      console.log('📧 Response Status:', response.status)

      setResult({
        success: data.success,
        message: data.message,
        error: data.error?.message,
        details: {
          status: response.status,
          response: data,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error: any) {
      console.error('❌ Email test error:', error)
      setResult({
        success: false,
        error: error.message || 'An error occurred while testing email',
        details: {
          error: error.toString(),
          timestamp: new Date().toISOString()
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnvironmentVariables = () => {
    const envVars = {
      'NEXT_PUBLIC_SENDGRID_API_KEY': process.env.NEXT_PUBLIC_SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      'SENDGRID_API_KEY': process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      'NEXT_PUBLIC_FROM_EMAIL': process.env.NEXT_PUBLIC_FROM_EMAIL || '❌ Missing',
      'FROM_EMAIL': process.env.FROM_EMAIL || '❌ Missing',
    }
    
    return envVars
  }

  const envVars = checkEnvironmentVariables()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Email Debug Tool</h1>
          <p className="mt-2 text-gray-600">
            Debug SendGrid email delivery issues
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                Environment Variables
              </CardTitle>
              <CardDescription>
                Check if SendGrid configuration is properly set
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{key}</span>
                  <Badge className={value.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Test Email Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Test Email Sending
              </CardTitle>
              <CardDescription>
                Send a test email to debug delivery issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Email Address
                </label>
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <Button
                onClick={handleTestEmail}
                disabled={isLoading || !testEmail}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Email Sending'}
              </Button>

              {result && (
                <div className={`p-4 rounded-md ${
                  result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {result.success ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.success ? 'Success!' : 'Error'}
                      </h3>
                      <p className={`mt-1 text-sm ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message || result.error}
                      </p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer">View Details</summary>
                          <pre className="text-xs text-gray-600 mt-2 bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Troubleshooting Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Email Delivery Troubleshooting</CardTitle>
            <CardDescription>
              Common reasons why emails might not be received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Check These First
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ol className="list-decimal list-inside space-y-1">
                        <li><strong>Spam Folder:</strong> Check your spam/junk folder first</li>
                        <li><strong>Sender Verification:</strong> Verify sender email in SendGrid dashboard</li>
                        <li><strong>API Key Permissions:</strong> Ensure API key has "Mail Send" access</li>
                        <li><strong>Rate Limits:</strong> Check if you've exceeded 100 emails/day limit</li>
                        <li><strong>Email Address:</strong> Use a real, valid email address</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">SendGrid Dashboard Checks:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Go to <a href="https://app.sendgrid.com/email_activity" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Activity Feed</a> to see email delivery status</li>
                  <li>Check <a href="https://app.sendgrid.com/settings/sender_authentication" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Sender Authentication</a> to verify your email</li>
                  <li>Review <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">API Keys</a> for proper permissions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




