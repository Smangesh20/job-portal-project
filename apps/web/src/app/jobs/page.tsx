'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  const [locationFilter, setLocationFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
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
    getIndustries
  } = useJobs()

  // SIMPLE FILTER OPTIONS - NO COMPLEX DROPDOWNS
  const locations = ['San Francisco', 'New York', 'London', 'Remote', 'Hybrid', 'Seattle', 'Boston', 'Austin']
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Airbnb']
  const industries = ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Manufacturing', 'Consulting']
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship', 'Freelance']

  useEffect(() => {
    // Load initial jobs
    searchJobs({
      search: searchQuery,
      location: locationFilter,
      company: companyFilter,
      industry: industryFilter ? [industryFilter] : undefined,
      type: jobTypeFilter ? [jobTypeFilter] : undefined
    })
  }, [searchQuery, locationFilter, companyFilter, industryFilter, jobTypeFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchJobs({
      search: searchQuery,
      location: locationFilter,
      company: companyFilter,
      industry: industryFilter ? [industryFilter] : undefined,
      type: jobTypeFilter ? [jobTypeFilter] : undefined
    })
  }

  const handleApply = async (jobId: string) => {
    setApplyingJobs(prev => new Set([...prev, jobId]))
    try {
      await applyForJob(jobId)
    } catch (error) {
      console.error('Failed to apply for job:', error)
    } finally {
      setApplyingJobs(prev => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

  const handleSave = async (jobId: string) => {
    setSavingJobs(prev => new Set([...prev, jobId]))
    try {
      await saveJob(jobId)
    } catch (error) {
      console.error('Failed to save job:', error)
    } finally {
      setSavingJobs(prev => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

  const clearAllFilters = () => {
    setLocationFilter('')
    setCompanyFilter('')
    setIndustryFilter('')
    setJobTypeFilter('')
    setSearchQuery('')
  }

  const hasActiveFilters = locationFilter || companyFilter || industryFilter || jobTypeFilter || searchQuery

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p className="text-lg text-gray-600">
            Discover {total.toLocaleString()} job opportunities tailored to your skills
          </p>
        </div>

        {/* SIMPLE SEARCH AND FILTERS */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FunnelIcon className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {/* SIMPLE FILTER BUTTONS - NO DROPDOWNS */}
            {showFilters && (
              <div className="space-y-6 border-t pt-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((location) => (
                      <Button
                        key={location}
                        type="button"
                        variant={locationFilter === location ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLocationFilter(locationFilter === location ? '' : location)}
                      >
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Company Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Company</label>
                  <div className="flex flex-wrap gap-2">
                    {companies.map((company) => (
                      <Button
                        key={company}
                        type="button"
                        variant={companyFilter === company ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCompanyFilter(companyFilter === company ? '' : company)}
                      >
                        {company}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((industry) => (
                      <Button
                        key={industry}
                        type="button"
                        variant={industryFilter === industry ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIndustryFilter(industryFilter === industry ? '' : industry)}
                      >
                        {industry}
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
                        variant={jobTypeFilter === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setJobTypeFilter(jobTypeFilter === type ? '' : type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Active Filters:</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {locationFilter && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Location: {locationFilter}
                        </Badge>
                      )}
                      {companyFilter && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Company: {companyFilter}
                        </Badge>
                      )}
                      {industryFilter && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          Industry: {industryFilter}
                        </Badge>
                      )}
                      {jobTypeFilter && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Type: {jobTypeFilter}
                        </Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearAllFilters}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* JOBS LIST */}
        {isLoading && jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading jobs</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job: Job) => (
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
                              {job.posted}
                            </div>
                            <div className="flex items-center">
                              <UsersIcon className="w-4 h-4 mr-1" />
                              {job.type}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {job.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                            {job.tags.length > 4 && (
                              <Badge variant="outline">
                                +{job.tags.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{job.salary}</p>
                        <p className="text-sm text-gray-500">{job.experienceLevel}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSave(job.id)}
                          disabled={savingJobs.has(job.id)}
                        >
                          {savingJobs.has(job.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          ) : (
                            <HeartIcon className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApply(job.id)}
                          disabled={applyingJobs.has(job.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {applyingJobs.has(job.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Apply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* LOAD MORE BUTTON */}
            {hasMore && (
              <div className="text-center py-8">
                <Button
                  variant="outline"
                  onClick={loadMoreJobs}
                  disabled={isLoading}
                  className="px-8"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Jobs'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}