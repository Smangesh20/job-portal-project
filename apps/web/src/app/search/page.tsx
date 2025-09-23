'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlassIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '@/stores/enhanced-auth-store'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  postedAt: string
  description: string
  requirements: string[]
  benefits: string[]
}

export default function SearchPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // SIMPLE FILTER OPTIONS - NO COMPLEX DROPDOWNS
  const locations = ['San Francisco', 'New York', 'Remote', 'Seattle', 'Boston', 'Austin', 'London']
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
  const salaryRanges = ['$50k-80k', '$80k-120k', '$120k-160k', '$160k+']

  // Mock job data
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      postedAt: '2 days ago',
      description: 'We are looking for a senior software engineer to join our team...',
      requirements: ['5+ years experience', 'React, Node.js', 'AWS experience'],
      benefits: ['Health insurance', '401k', 'Flexible hours']
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80,000 - $110,000',
      postedAt: '1 week ago',
      description: 'Join our frontend team to build amazing user experiences...',
      requirements: ['3+ years experience', 'React, TypeScript', 'UI/UX skills'],
      benefits: ['Health insurance', 'Stock options', 'Remote work']
    },
    {
      id: '3',
      title: 'Backend Developer',
      company: 'DataFlow Inc',
      location: 'Remote',
      type: 'Contract',
      salary: '$100,000 - $130,000',
      postedAt: '3 days ago',
      description: 'Build scalable backend systems for our data platform...',
      requirements: ['4+ years experience', 'Python, Django', 'PostgreSQL'],
      benefits: ['Flexible schedule', 'Learning budget', 'Equipment provided']
    }
  ]

  useEffect(() => {
    // Filter jobs based on search criteria
    let filteredJobs = mockJobs

    if (searchQuery) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (jobType) {
      filteredJobs = filteredJobs.filter(job =>
        job.type.toLowerCase().includes(jobType.toLowerCase())
      )
    }

    if (salaryRange) {
      filteredJobs = filteredJobs.filter(job => {
        const salary = job.salary
        switch (salaryRange) {
          case '$50k-80k':
            return salary.includes('80,000') || salary.includes('70,000') || salary.includes('60,000')
          case '$80k-120k':
            return salary.includes('80,000') || salary.includes('100,000') || salary.includes('110,000')
          case '$120k-160k':
            return salary.includes('120,000') || salary.includes('130,000') || salary.includes('150,000')
          case '$160k+':
            return salary.includes('160,000') || salary.includes('200,000')
          default:
            return true
        }
      })
    }

    setJobs(filteredJobs)
  }, [searchQuery, location, jobType, salaryRange])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setLocation('')
    setJobType('')
    setSalaryRange('')
  }

  const hasActiveFilters = location || jobType || salaryRange || searchQuery

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Search</h1>
          <p className="text-lg text-gray-600">
            Find your perfect job opportunity
          </p>
        </div>

        {/* SIMPLE SEARCH AND FILTERS */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* SEARCH INPUT */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* SIMPLE FILTER BUTTONS - NO DROPDOWNS */}
              <div className="space-y-4">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((loc) => (
                      <Button
                        key={loc}
                        type="button"
                        variant={location === loc ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLocation(location === loc ? '' : loc)}
                      >
                        {loc}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Job Type</label>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={jobType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setJobType(jobType === type ? '' : type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Salary Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Salary Range</label>
                  <div className="flex flex-wrap gap-2">
                    {salaryRanges.map((range) => (
                      <Button
                        key={range}
                        type="button"
                        variant={salaryRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSalaryRange(salaryRange === range ? '' : range)}
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTIVE FILTERS DISPLAY */}
              {hasActiveFilters && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Active Filters:</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {location && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Location: {location}
                      </Badge>
                    )}
                    {jobType && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Type: {jobType}
                      </Badge>
                    )}
                    {salaryRange && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Salary: {salaryRange}
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  'Search Jobs'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* RESULTS */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Search Results ({jobs.length} jobs found)
          </h2>
          <p className="text-gray-600">
            {hasActiveFilters ? 'Filtered results' : 'All available jobs'}
          </p>
        </div>

        {/* JOBS LIST */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {job.company.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.company}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {job.postedAt}
                            </div>
                            <div className="flex items-center">
                              <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                              {job.salary}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{job.type}</Badge>
                            {job.requirements.slice(0, 3).map((req) => (
                              <Badge key={req} variant="outline">
                                {req}
                              </Badge>
                            ))}
                            {job.requirements.length > 3 && (
                              <Badge variant="outline">
                                +{job.requirements.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{job.salary}</p>
                        <p className="text-sm text-gray-500">{job.type}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Save
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}