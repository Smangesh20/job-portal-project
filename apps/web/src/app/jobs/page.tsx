'use client'

import { useState, useEffect } from 'react'
import { realtimeDataService, JobListing, SearchFilters, SearchResult } from '@/lib/realtime-data-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  StarIcon,
  EyeIcon,
  UsersIcon,
  GlobeAltIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function JobsPage() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    type: [],
    salaryMin: undefined,
    salaryMax: undefined,
    experience: [],
    skills: [],
    remote: false,
    postedWithin: undefined,
    sortBy: 'relevance',
    page: 1,
    limit: 20
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)

  useEffect(() => {
    searchJobs()
  }, [])

  const searchJobs = async () => {
    setIsLoading(true)
    try {
      const result = await realtimeDataService.searchJobs(filters)
      setSearchResult(result)
    } catch (error) {
      console.error('Error searching jobs:', error)
      toast.error('Failed to search jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchJobs()
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      type: [],
      salaryMin: undefined,
      salaryMax: undefined,
      experience: [],
      skills: [],
      remote: false,
      postedWithin: undefined,
      sortBy: 'relevance',
      page: 1,
      limit: 20
    })
  }

  const formatSalary = (salary: JobListing['salary']) => {
    if (!salary) return 'Salary not specified'
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    
    const min = formatter.format(salary.min)
    const max = formatter.format(salary.max)
    const period = salary.period === 'yearly' ? '/year' : salary.period === 'monthly' ? '/month' : '/hour'
    
    return `${min} - ${max}${period}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getJobTypeColor = (type: string) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-yellow-100 text-yellow-800',
      'remote': 'bg-indigo-100 text-indigo-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
          <p className="mt-2 text-gray-600">
            Discover opportunities from top companies worldwide with real-time data
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Search and Filters */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Search Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title or Keywords
                    </label>
                    <Input
                      value={filters.query || ''}
                      onChange={(e) => handleFilterChange('query', e.target.value)}
                      placeholder="e.g. Software Engineer, React Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <Input
                      value={filters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="e.g. San Francisco, Remote"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remote"
                      checked={filters.remote || false}
                      onChange={(e) => handleFilterChange('remote', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="remote" className="text-sm text-gray-700">
                      Remote only
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Salary
                      </label>
                      <Input
                        type="number"
                        value={filters.salaryMin || ''}
                        onChange={(e) => handleFilterChange('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="80000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Salary
                      </label>
                      <Input
                        type="number"
                        value={filters.salaryMax || ''}
                        onChange={(e) => handleFilterChange('salaryMax', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="150000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy || 'relevance'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Date Posted</option>
                      <option value="salary">Salary</option>
                      <option value="company">Company</option>
                    </select>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isLoading ? 'Searching...' : 'Search Jobs'}
                    </Button>
                    <Button
                      type="button"
                      onClick={clearFilters}
                      variant="outline"
                      className="px-3"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {searchResult && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Jobs</span>
                      <span className="font-medium">{searchResult.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Remote Jobs</span>
                      <span className="font-medium">
                        {searchResult.jobs.filter(job => job.isRemote).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Featured Jobs</span>
                      <span className="font-medium">
                        {searchResult.jobs.filter(job => job.isFeatured).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Job Listings */}
          <div className="lg:w-2/3">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResult ? (
              <div className="space-y-4">
                {searchResult.jobs.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search criteria or filters.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  searchResult.jobs.map((job) => (
                    <Card
                      key={job.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedJob?.id === job.id ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {job.title}
                              </h3>
                              {job.isFeatured && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <StarIcon className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {job.isUrgent && (
                                <Badge className="bg-red-100 text-red-800">
                                  Urgent
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                                {job.company}
                              </div>
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {job.location}
                                {job.isRemote && (
                                  <Badge className="ml-2 bg-indigo-100 text-indigo-800">
                                    <GlobeAltIcon className="h-3 w-3 mr-1" />
                                    Remote
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {formatDate(job.postedDate)}
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-3">
                              <Badge className={getJobTypeColor(job.type)}>
                                {job.type.replace('-', ' ').toUpperCase()}
                              </Badge>
                              {job.salary && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                  {formatSalary(job.salary)}
                                </div>
                              )}
                            </div>

                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                              {job.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.skills.slice(0, 5).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.skills.length - 5} more
                                </Badge>
                              )}
          </div>
          
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                {job.applicationCount && (
                                  <div className="flex items-center">
                                    <UsersIcon className="h-4 w-4 mr-1" />
                                    {job.applicationCount} applications
                                  </div>
                                )}
                                {job.views && (
                                  <div className="flex items-center">
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    {job.views} views
                                  </div>
                                )}
                              </div>
                              <div className="text-xs">
                                via {job.source}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
          </div>
        </div>
  )
}
