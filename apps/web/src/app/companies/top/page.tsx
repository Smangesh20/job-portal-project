'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StarIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline'

export default function TopCompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Top Companies</h1>
          <p className="text-lg text-gray-600">Discover the most sought-after employers in the industry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <StarIcon className="h-6 w-6 mr-2" />
                Top Rated
              </CardTitle>
              <CardDescription>
                Highest-rated companies by employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  View Rankings
                </Button>
                <Button variant="outline" className="w-full">
                  <TrophyIcon className="h-4 w-4 mr-2" />
                  Company Reviews
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Workplaces</CardTitle>
              <CardDescription>
                Companies with exceptional culture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Work-life balance</li>
                <li>• Career development</li>
                <li>• Employee benefits</li>
                <li>• Diversity & inclusion</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Innovation Leaders</CardTitle>
              <CardDescription>
                Companies driving technological advancement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AI & Machine Learning</li>
                <li>• Cloud Computing</li>
                <li>• Blockchain Technology</li>
                <li>• Quantum Computing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
