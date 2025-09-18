'use client'

import { useState } from 'react'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { sendGridService } from '@/lib/sendgrid-service'
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

export default function TestEmailPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [status, setStatus] = useState(sendGridService.getStatus())

  const handleTestEmail = async () => {
    if (!testEmail) {
      setResult({ success: false, error: 'Please enter an email address' })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await sendGridService.testEmail(testEmail)
      setResult({
        success: response.success,
        message: response.success ? 'Test email sent successfully!' : 'Failed to send test email',
        error: response.error
      })
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'An error occurred while sending test email'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStatus = () => {
    setStatus(sendGridService.getStatus())
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
              <p className="mt-1 text-sm text-gray-500">
                You need admin privileges to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">SendGrid Email Test</h1>
          <p className="mt-2 text-gray-600">
            Test SendGrid integration and email delivery
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SendGrid Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                SendGrid Status
              </CardTitle>
              <CardDescription>
                Current SendGrid configuration status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Service Initialized</span>
                <Badge className={status.initialized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {status.initialized ? 'Yes' : 'No'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">API Key Found</span>
                <Badge className={status.hasApiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {status.hasApiKey ? 'Yes' : 'No'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">From Email Set</span>
                <Badge className={status.hasFromEmail ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {status.hasFromEmail ? 'Yes' : 'No'}
                </Badge>
              </div>

              <Button onClick={refreshStatus} variant="outline" className="w-full">
                Refresh Status
              </Button>
            </CardContent>
          </Card>

          {/* Test Email Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Send Test Email
              </CardTitle>
              <CardDescription>
                Send a test email to verify SendGrid integration
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
                  placeholder="Enter email address to test"
                />
              </div>

              <Button
                onClick={handleTestEmail}
                disabled={isLoading || !testEmail}
                className="w-full"
              >
                {isLoading ? 'Sending...' : 'Send Test Email'}
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
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Help */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Configuration Help</CardTitle>
            <CardDescription>
              If SendGrid is not working, check your configuration
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
                      Setup Required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>To enable real email sending, you need to:</p>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Create a SendGrid account at <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">sendgrid.com</a></li>
                        <li>Get your API key from SendGrid dashboard</li>
                        <li>Verify your sender email address</li>
                        <li>Add environment variables to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Environment Variables:</h4>
                <div className="bg-gray-100 rounded-md p-4">
                  <pre className="text-sm text-gray-800">
{`# Add these to your .env.local file
NEXT_PUBLIC_SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
NEXT_PUBLIC_FROM_EMAIL=noreply@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Quick Setup Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Sign up at <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">sendgrid.com</a></li>
                  <li>Go to Settings → API Keys and create a new key</li>
                  <li>Go to Settings → Sender Authentication and verify your email</li>
                  <li>Add the environment variables above</li>
                  <li>Restart your development server</li>
                  <li>Test again using this page</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
