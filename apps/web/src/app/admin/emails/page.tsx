'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { emailService } from '@/lib/email-service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface EmailData {
  id: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  sentAt: string;
  status: string;
}

export default function EmailsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [emails, setEmails] = useState<EmailData[]>([])
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      loadEmails()
    }
  }, [isAuthenticated, user])

  const loadEmails = () => {
    try {
      const sentEmails = emailService.getSentEmails()
      setEmails(sentEmails)
    } catch (error) {
      console.error('Error loading emails:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearEmails = () => {
    emailService.clearSentEmails()
    setEmails([])
    setSelectedEmail(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
          <p className="mt-2 text-gray-600">
            View and manage sent emails (Development Mode)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Sent Emails ({emails.length})
            </h2>
            <p className="text-sm text-gray-600">
              In development mode, emails are stored locally for testing
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={loadEmails} variant="outline">
              Refresh
            </Button>
            <Button onClick={clearEmails} variant="outline" className="text-red-600 hover:text-red-700">
              <TrashIcon className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {emails.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No emails sent yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Emails will appear here when users request password resets.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email List */}
            <div className="space-y-4">
              {emails.map((email) => (
                <Card
                  key={email.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedEmail?.id === email.id ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {email.subject}
                          </h3>
                          <Badge className={getStatusColor(email.status)}>
                            {email.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          To: {email.to}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(email.sentAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEmail(email)
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Email Preview */}
            <div>
              {selectedEmail ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 mr-2" />
                      Email Preview
                    </CardTitle>
                    <CardDescription>
                      {selectedEmail.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To
                        </label>
                        <p className="text-sm text-gray-900">{selectedEmail.to}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <p className="text-sm text-gray-900">{selectedEmail.subject}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sent At
                        </label>
                        <p className="text-sm text-gray-900">{formatDate(selectedEmail.sentAt)}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <Badge className={getStatusColor(selectedEmail.status)}>
                          {selectedEmail.status}
                        </Badge>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          HTML Content
                        </label>
                        <div 
                          className="border rounded-md p-4 max-h-96 overflow-y-auto bg-gray-50"
                          dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Text Content
                        </label>
                        <pre className="border rounded-md p-4 max-h-96 overflow-y-auto bg-gray-50 text-xs whitespace-pre-wrap">
                          {selectedEmail.text}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Select an email</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Click on an email to view its content.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Integration Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Email Service Integration</CardTitle>
            <CardDescription>
              To send real emails in production, integrate with an email service provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommended Email Services:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>SendGrid</strong> - Reliable and feature-rich</li>
                  <li><strong>Mailgun</strong> - Developer-friendly API</li>
                  <li><strong>AWS SES</strong> - Cost-effective for high volume</li>
                  <li><strong>Nodemailer</strong> - For custom SMTP servers</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Integration Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Sign up for an email service provider</li>
                  <li>Get your API key and configuration</li>
                  <li>Update the email service in <code className="bg-gray-100 px-1 rounded">apps/web/src/lib/email-service.ts</code></li>
                  <li>Replace the simulated email sending with real API calls</li>
                  <li>Test with your email service provider</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Current Status: Development Mode
                    </h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Emails are being generated and stored locally. The password reset functionality works perfectly - you just need to integrate with a real email service for production use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
