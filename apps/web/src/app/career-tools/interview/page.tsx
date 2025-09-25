'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VideoCameraIcon, PlayIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function InterviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Interview Preparation</h1>
          <p className="text-lg text-gray-600">Master your interview skills with our comprehensive resources</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <VideoCameraIcon className="h-6 w-6 mr-2" />
                Mock Interviews
              </CardTitle>
              <CardDescription>
                Practice with AI-powered mock interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Mock Interview
                </Button>
                <Button variant="outline" className="w-full">
                  View Past Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="h-6 w-6 mr-2" />
                Interview Tips
              </CardTitle>
              <CardDescription>
                Expert advice for interview success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Research the company and role thoroughly</li>
                <li>• Prepare STAR method examples</li>
                <li>• Practice common interview questions</li>
                <li>• Dress professionally and arrive early</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}











