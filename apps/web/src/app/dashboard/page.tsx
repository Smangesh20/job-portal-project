'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BriefcaseIcon,
  BuildingOfficeIcon,
  FlagIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuthUnified()
  const [displayName, setDisplayName] = useState('User')

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
    <div className="space-y-8">
      {/* DASHBOARD OVERVIEW - PROFESSIONAL HEADER */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🎯 Welcome to Your Professional Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Use the sidebar on the left to search jobs, filter by type, location, and company. 
          All navigation options are now conveniently located in the sidebar for easy access.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => router.push('/jobs')} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
            Browse All Jobs
          </Button>
          <Button variant="outline" onClick={() => router.push('/companies')} className="px-8 py-3 text-lg">
            Explore Companies
          </Button>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => router.push(action.href)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
              <action.icon className={`h-5 w-5 text-${action.color}-600`} />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT JOB OPPORTUNITIES */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Opportunities</CardTitle>
          <CardDescription>Jobs that match your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company} - {job.location}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                  <Badge variant="secondary">{job.type}</Badge>
                  <span>{job.posted}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-gray-900">{job.salary}</p>
                <Badge className="bg-green-100 text-green-800 mt-1">{job.match}% Match</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CAREER PROGRESS */}
      <Card>
        <CardHeader>
          <CardTitle>Your Career Progress</CardTitle>
          <CardDescription>Overview of your job search activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
              <BriefcaseIcon className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-800">124</p>
              <p className="text-sm text-blue-600">Jobs Viewed</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-800">18</p>
              <p className="text-sm text-green-600">Applications Sent</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
              <StarIcon className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-800">6</p>
              <p className="text-sm text-purple-600">Jobs Saved</p>
            </div>
          </div>
          <div className="space-y-2">
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
  )
}