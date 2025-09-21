'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const companies = [
    {
      id: 1,
      name: 'Quantum Tech Solutions',
      logo: '/logos/quantum-tech.png',
      industry: 'Technology',
      location: 'San Francisco, CA',
      size: '50-200 employees',
      rating: 4.8,
      jobs: 12,
      description: 'Leading quantum computing company revolutionizing data processing.'
    },
    {
      id: 2,
      name: 'AI Innovations Inc',
      logo: '/logos/ai-innovations.png',
      industry: 'Artificial Intelligence',
      location: 'Seattle, WA',
      size: '200-500 employees',
      rating: 4.6,
      jobs: 8,
      description: 'Pioneering AI solutions for enterprise applications.'
    },
    {
      id: 3,
      name: 'Future Finance Corp',
      logo: '/logos/future-finance.png',
      industry: 'Financial Services',
      location: 'New York, NY',
      size: '500-1000 employees',
      rating: 4.7,
      jobs: 15,
      description: 'Next-generation financial technology and blockchain solutions.'
    },
    {
      id: 4,
      name: 'Green Energy Systems',
      logo: '/logos/green-energy.png',
      industry: 'Clean Energy',
      location: 'Austin, TX',
      size: '100-500 employees',
      rating: 4.9,
      jobs: 6,
      description: 'Sustainable energy solutions for a better tomorrow.'
    }
  ]

  const industries = ['Technology', 'Artificial Intelligence', 'Financial Services', 'Clean Energy', 'Healthcare', 'E-commerce']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Companies</h1>
          <p className="text-lg text-gray-600">
            Discover innovative companies that match your career goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <FunnelIcon className="w-4 h-4" />
                Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </div>
          </div>

          {/* Industry Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Badge
                key={industry}
                variant={selectedFilters.includes(industry) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  if (selectedFilters.includes(industry)) {
                    setSelectedFilters(selectedFilters.filter(f => f !== industry))
                  } else {
                    setSelectedFilters([...selectedFilters, industry])
                  }
                }}
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {company.industry}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{company.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {company.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    {company.size}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {company.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-blue-600 font-medium">
                      {company.jobs} open positions
                    </span>
                    <Button size="sm" variant="outline">
                      View Jobs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Companies
          </Button>
        </div>
      </div>
    </div>
  )
}