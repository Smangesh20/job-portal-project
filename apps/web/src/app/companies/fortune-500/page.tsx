'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BuildingOfficeIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function Fortune500Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Fortune 500 Companies</h1>
          <p className="text-lg text-gray-600">Explore opportunities at the world's largest corporations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BuildingOfficeIcon className="h-6 w-6 mr-2" />
                Technology Giants
              </CardTitle>
              <CardDescription>
                Leading technology corporations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  View Companies
                </Button>
                <Button variant="outline" className="w-full">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Career Paths
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Services</CardTitle>
              <CardDescription>
                Major banks and financial institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Investment banking</li>
                <li>• Commercial banking</li>
                <li>• Insurance companies</li>
                <li>• Asset management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manufacturing</CardTitle>
              <CardDescription>
                Industrial and manufacturing leaders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Automotive industry</li>
                <li>• Aerospace & defense</li>
                <li>• Consumer goods</li>
                <li>• Energy & utilities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}





