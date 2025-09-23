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
  
  // SIMPLE FILTER STATES - NO COMPLEX DROPDOWNS
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

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
  const locations = ['San Francisco, CA', 'Seattle, WA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Remote', 'Hybrid']
  const companySizes = ['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '501-1000 employees', '1000+ employees']

  // FILTER COMPANIES BASED ON SELECTIONS
  const filteredCompanies = companies.filter(company => {
    if (selectedIndustry && company.industry !== selectedIndustry) return false
    if (selectedLocation && company.location !== selectedLocation) return false
    if (selectedSize && company.size !== selectedSize) return false
    if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Companies</h1>
          <p className="text-lg text-gray-600">
            Discover innovative companies that match your career goals
          </p>
        </div>

        {/* SIMPLE SEARCH AND FILTERS */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </div>
          </div>

          {/* SIMPLE FILTER BUTTONS - NO DROPDOWNS */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <Button
                    key={industry}
                    type="button"
                    variant={selectedIndustry === industry ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIndustry(selectedIndustry === industry ? '' : industry)}
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <Button
                    key={location}
                    type="button"
                    variant={selectedLocation === location ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLocation(selectedLocation === location ? '' : location)}
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <div className="flex flex-wrap gap-2">
                {companySizes.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIVE FILTERS DISPLAY */}
          {(selectedIndustry || selectedLocation || selectedSize) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Active Filters:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedIndustry && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Industry: {selectedIndustry}
                  </Badge>
                )}
                {selectedLocation && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Location: {selectedLocation}
                  </Badge>
                )}
                {selectedSize && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Size: {selectedSize}
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedIndustry('')
                    setSelectedLocation('')
                    setSelectedSize('')
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* COMPANIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{company.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{company.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {company.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    {company.size}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                    {company.jobs} open positions
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                    View Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedIndustry('')
                setSelectedLocation('')
                setSelectedSize('')
                setSearchQuery('')
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}