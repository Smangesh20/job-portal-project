'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AcademicCapIcon, TrophyIcon, BookOpenIcon } from '@heroicons/react/24/outline'

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Skills Development</h1>
          <p className="text-lg text-gray-600">Enhance your skills with our comprehensive learning resources</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AcademicCapIcon className="h-6 w-6 mr-2" />
                Skill Assessment
              </CardTitle>
              <CardDescription>
                Evaluate your current skill level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <TrophyIcon className="h-4 w-4 mr-2" />
                  Take Assessment
                </Button>
                <Button variant="outline" className="w-full">
                  View Skills Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpenIcon className="h-6 w-6 mr-2" />
                Learning Paths
              </CardTitle>
              <CardDescription>
                Structured learning paths for skill development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Technical skills (programming, design)</li>
                <li>• Soft skills (communication, leadership)</li>
                <li>• Industry-specific certifications</li>
                <li>• Personalized learning recommendations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



