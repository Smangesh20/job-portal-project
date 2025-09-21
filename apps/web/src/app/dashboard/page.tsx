'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/protected-route'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  BellIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon,
  ArrowRightIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  FlagIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`)
    }
  }

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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your job search today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <BellIcon className="w-4 h-4 mr-2" />
                  Notifications
                  <Badge variant="secondary" className="ml-2">3</Badge>
                </Button>
                <Button size="sm" onClick={() => router.push('/profile')}>
                  View Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    router.push('/auth/login')
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Job Search</h2>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action) => (
              <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(action.href)}>
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

          {/* Recent Job Matches */}
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profile Strength</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                        <span>Basic Information</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                        <span>Skills & Experience</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                        <span className="text-gray-500">Portfolio</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                        <span className="text-gray-500">References</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => router.push('/profile')}>
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Summary */}
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
    </ProtectedRoute>
  )
}