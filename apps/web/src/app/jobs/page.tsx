'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useJobs } from '@/hooks/useJobs'
import { Job } from '@/lib/jobs-service'
import { 
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  BuildingOfficeIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [applyingJobs, setApplyingJobs] = useState<Set<string>>(new Set())
  const [savingJobs, setSavingJobs] = useState<Set<string>>(new Set())

  const {
    jobs,
    isLoading,
    error,
    hasMore,
    total,
    loadMoreJobs,
    searchJobs,
    applyForJob,
    saveJob,
    getLocations,
    getCompanies,
    getIndustries,
    getTags,
    clearError
  } = useJobs()

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
  const locations = getLocations()
  const companies = getCompanies()
  const industries = getIndustries()
  const tags = getTags()

  // Auto-search when filters change (Google-style)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery || locationFilter || companyFilter || industryFilter || selectedFilters.length > 0) {
        handleSearch()
      }
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery, locationFilter, companyFilter, industryFilter, selectedFilters])

  // Handle search
  const handleSearch = async () => {
    const filters = {
      search: searchQuery,
      location: locationFilter,
      company: companyFilter,
      industry: industryFilter ? [industryFilter] : undefined,
      type: selectedFilters.length > 0 ? selectedFilters : undefined
    }
    console.log('🚀 GOOGLE-STYLE: Searching with filters:', filters)
    await searchJobs(filters)
  }

  // Handle filter toggle
  const toggleFilter = (type: string) => {
    if (selectedFilters.includes(type)) {
      setSelectedFilters(selectedFilters.filter(f => f !== type))
    } else {
      setSelectedFilters([...selectedFilters, type])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setLocationFilter('')
    setCompanyFilter('')
    setIndustryFilter('')
    setSelectedFilters([])
    console.log('🚀 GOOGLE-STYLE: Cleared all filters')
  }

  // Handle apply for job
  const handleApplyForJob = async (job: Job) => {
    setApplyingJobs(prev => new Set(prev).add(job.id))
    try {
      const success = await applyForJob(job.id)
      if (success) {
        // Show success message
        console.log('🚀 ENTERPRISE: Successfully applied for job:', job.title)
      } else {
        console.error('🚀 ENTERPRISE: Failed to apply for job:', job.title)
      }
    } catch (error) {
      console.error('🚀 ENTERPRISE: Error applying for job:', error)
    } finally {
      setApplyingJobs(prev => {
        const newSet = new Set(prev)
        newSet.delete(job.id)
        return newSet
      })
    }
  }

  // Handle save job
  const handleSaveJob = async (job: Job) => {
    setSavingJobs(prev => new Set(prev).add(job.id))
    try {
      const success = await saveJob(job.id)
      if (success) {
        console.log('🚀 ENTERPRISE: Job saved:', job.title)
      } else {
        console.error('🚀 ENTERPRISE: Failed to save job:', job.title)
      }
    } catch (error) {
      console.error('🚀 ENTERPRISE: Error saving job:', error)
    } finally {
      setSavingJobs(prev => {
        const newSet = new Set(prev)
        newSet.delete(job.id)
        return newSet
      })
    }
  }

  // Handle load more
  const handleLoadMore = async () => {
    await loadMoreJobs()
  }

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p className="text-lg text-gray-600">
            Discover your next career opportunity with our quantum-powered matching
          </p>
          {total > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {jobs.length} of {total} jobs
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Connection Issue</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <div className="mt-3 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={clearError}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="w-4 h-4" />
                Filters
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={clearFilters}
              >
                Clear
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Job Type Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedFilters.includes(type) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleFilter(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading jobs...</p>
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className={`hover:shadow-lg transition-shadow ${job.isNew ? 'ring-2 ring-green-200' : ''} ${job.isUpdated ? 'ring-2 ring-blue-200' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BuildingOfficeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          {job.isNew && (
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                              NEW
                            </Badge>
                          )}
                          {job.isUpdated && (
                            <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                              UPDATED
                            </Badge>
                          )}
                          {job.isUrgent && (
                            <Badge variant="destructive" className="text-xs">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${job.saved ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                          onClick={() => handleSaveJob(job)}
                          disabled={savingJobs.has(job.id)}
                        >
                          <HeartIcon className={`w-4 h-4 ${job.saved ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="font-medium">{job.company}</span>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {job.rating}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <EyeIcon className="w-3 h-3 mr-1" />
                          {job.views} views
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <UsersIcon className="w-3 h-3 mr-1" />
                          {job.applications} applications
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {job.posted}
                        </div>
                        {job.isRemote && (
                          <Badge variant="outline" className="text-xs">
                            Remote
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                          {job.applied ? (
                            <div className="flex items-center text-green-600 text-sm">
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Applied
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleApplyForJob(job)}
                              disabled={applyingJobs.has(job.id)}
                            >
                              {applyingJobs.has(job.id) ? 'Applying...' : 'Apply Now'}
                            </Button>
                          )}
                          {job.applicationUrl && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(job.applicationUrl, '_blank')}
                            >
                              <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                              External
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Jobs Found */}
        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-12">
            <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setLocationFilter('')
                setSelectedFilters([])
                handleSearch()
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More Jobs'}
            </Button>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && jobs.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">You've reached the end of the results</p>
          </div>
        )}
      </div>
    </div>
  )
}