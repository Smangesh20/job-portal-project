'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EnterpriseWelcome } from '@/components/professional/enterprise-welcome'
import { 
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon,
  ArrowRightIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  FlagIcon,
  CheckCircleIcon,
  CpuChipIcon,
  BoltIcon,
  ChevronDownIcon,
  FilterIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuthUnified()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [displayName, setDisplayName] = useState('User')

  // SIMPLE FILTER STATES - NO COMPLEX DROPDOWNS
  const [selectedJobType, setSelectedJobType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')

  // SIMPLE DATA - NO COMPLEX ARRAYS
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
  const locations = ['San Francisco', 'New York', 'London', 'Remote', 'Hybrid']
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta']

  // SIMPLE NAME DETECTION - BULLETPROOF
  useEffect(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          if (parsedUser.firstName) {
            setDisplayName(parsedUser.firstName)
            return
          }
          if (parsedUser.name) {
            setDisplayName(parsedUser.name)
            return
          }
        } catch (e) {
          console.log('Error parsing user data:', e)
        }
      }
    }

    // Check auth user
    if (user) {
      if (user.firstName) {
        setDisplayName(user.firstName)
        return
      }
      if (user.name) {
        setDisplayName(user.name)
        return
      }
      if (user.email) {
        const emailName = user.email.split('@')[0]
        setDisplayName(emailName.charAt(0).toUpperCase() + emailName.slice(1))
        return
      }
    }

    // Final fallback
    setDisplayName('User')
  }, [user])

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('search', searchQuery.trim())
    if (locationQuery.trim()) params.set('location', locationQuery.trim())
    if (selectedJobType) params.set('type', selectedJobType)
    if (selectedLocation) params.set('location_filter', selectedLocation)
    if (selectedCompany) params.set('company', selectedCompany)
    router.push(`/jobs?${params.toString()}`)
  }

  // SIMPLE QUICK ACTIONS
  const quickActions = [
    {
      title: 'Browse Jobs',
      description: 'Explore opportunities matched to your profile',
      icon: BriefcaseIcon,
      href: '/jobs',
      color: 'blue'
    },
    {
      title: 'Companies',
      description: 'Discover companies hiring in your field',
      icon: BuildingOfficeIcon,
      href: '/companies',
      color: 'green'
    },
    {
      title: 'Career Tools',
      description: 'Build your professional profile',
      icon: FlagIcon,
      href: '/career-tools',
      color: 'purple'
    },
    {
      title: 'AI Insights',
      description: 'Get personalized career recommendations',
      icon: SparklesIcon,
      href: '/ai-insights',
      color: 'orange'
    }
  ]

  // SIMPLE RECENT JOBS
  const recentJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $160k',
      posted: '2 hours ago',
      match: 95
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateLabs',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $140k',
      posted: '5 hours ago',
      match: 92
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80k - $120k',
      posted: '1 day ago',
      match: 88
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PROFESSIONAL DASHBOARD HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <EnterpriseWelcome 
                user={user}
                variant="default"
                showEditButton={true}
                onNameUpdate={(name) => setDisplayName(name)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" onClick={() => router.push('/profile')}>
                View Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PROFESSIONAL SEARCH SECTION */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FilterIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Advanced Job Search</h2>
            </div>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Location (e.g., San Francisco, Remote)"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* PROFESSIONAL DROPDOWN FILTERS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Job Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                      >
                        {selectedJobType || "Select job type"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Job Types</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedJobType('')}>
                        All Types
                      </DropdownMenuItem>
                      {jobTypes.map((type) => (
                        <DropdownMenuItem 
                          key={type}
                          onClick={() => setSelectedJobType(type)}
                        >
                          {type}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Location Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                      >
                        {selectedLocation || "Select location"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Locations</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedLocation('')}>
                        All Locations
                      </DropdownMenuItem>
                      {locations.map((location) => (
                        <DropdownMenuItem 
                          key={location}
                          onClick={() => setSelectedLocation(location)}
                        >
                          {location}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Company Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                      >
                        {selectedCompany || "Select company"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Companies</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedCompany('')}>
                        All Companies
                      </DropdownMenuItem>
                      {companies.map((company) => (
                        <DropdownMenuItem 
                          key={company}
                          onClick={() => setSelectedCompany(company)}
                        >
                          {company}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Search Jobs
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* SIMPLE QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => (
            <Card 
              key={action.title} 
              className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => router.push(action.href)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
                <ArrowRightIcon className="w-4 h-4 text-gray-400 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SIMPLE RECENT JOBS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-600" />
                  Your Latest Job Matches
                </CardTitle>
                <CardDescription>
                  Jobs matched to your profile with high compatibility scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h4>
                          <p className="text-gray-600 mb-2">{job.company}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {job.posted}
                            </div>
                          </div>
                          <div className="flex items-center mt-3">
                            <Badge variant="secondary" className="mr-2">{job.type}</Badge>
                            <span className="text-sm text-gray-600">{job.salary}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className="bg-green-100 text-green-800">
                            {job.match}% Match
                          </Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <HeartIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Apply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => router.push('/jobs')}>
                    View All Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIMPLE SIDEBAR */}
          <div className="space-y-6">
            {/* SIMPLE NAME DISPLAY */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{displayName}</p>
                      <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => router.push('/profile')}>
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SIMPLE ACTIVITY SUMMARY */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="text-sm font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <span className="text-sm font-semibold">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Job Matches</span>
                    <span className="text-sm font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interviews</span>
                    <span className="text-sm font-semibold">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}