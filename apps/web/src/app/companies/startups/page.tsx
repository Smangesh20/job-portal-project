'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RocketLaunchIcon, BuildingOfficeIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function StartupsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Startup Companies</h1>
          <p className="text-lg text-gray-600">Discover exciting opportunities at innovative startups</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RocketLaunchIcon className="h-6 w-6 mr-2" />
                Tech Startups
              </CardTitle>
              <CardDescription>
                Cutting-edge technology companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  View Companies
                </Button>
                <Button variant="outline" className="w-full">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fintech Startups</CardTitle>
              <CardDescription>
                Financial technology innovators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Payment solutions</li>
                <li>• Blockchain technology</li>
                <li>• Digital banking</li>
                <li>• Investment platforms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HealthTech Startups</CardTitle>
              <CardDescription>
                Healthcare technology pioneers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Telemedicine platforms</li>
                <li>• Medical devices</li>
                <li>• Health data analytics</li>
                <li>• Digital therapeutics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
