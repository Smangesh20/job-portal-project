'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DocumentTextIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline'

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resume Builder</h1>
          <p className="text-lg text-gray-600">Create a professional resume that stands out to employers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-2" />
                Resume Templates
              </CardTitle>
              <CardDescription>
                Choose from our professional resume templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Templates
                </Button>
                <Button variant="outline" className="w-full">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Tips</CardTitle>
              <CardDescription>
                Expert advice for creating an effective resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use action verbs to describe your achievements</li>
                <li>• Keep it concise and relevant to the job</li>
                <li>• Include quantifiable results</li>
                <li>• Proofread for grammar and spelling</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
