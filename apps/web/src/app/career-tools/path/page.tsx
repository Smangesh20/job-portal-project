'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapIcon, ArrowRightIcon, StarIcon } from '@heroicons/react/24/outline'

export default function CareerPathPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Path Planning</h1>
          <p className="text-lg text-gray-600">Discover your ideal career path with our AI-powered guidance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapIcon className="h-6 w-6 mr-2" />
                Career Assessment
              </CardTitle>
              <CardDescription>
                Take our comprehensive career assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
                <Button variant="outline" className="w-full">
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <StarIcon className="h-6 w-6 mr-2" />
                Career Goals
              </CardTitle>
              <CardDescription>
                Set and track your career objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Define your short and long-term goals</li>
                <li>• Identify skills to develop</li>
                <li>• Create a timeline for achievements</li>
                <li>• Track your progress regularly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

















