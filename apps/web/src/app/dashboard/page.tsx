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
  SparklesIcon
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
    <div className="space-y-8">
      {/* DASHBOARD OVERVIEW - SIDEBAR HAS ALL OPTIONS */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎯 Welcome to Your Professional Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Use the sidebar on the left to search jobs, filter by type, location, and company. 
          All navigation options are now conveniently located in the sidebar for easy access.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => router.push('/jobs')} className="bg-blue-600 hover:bg-blue-700">
            Browse All Jobs
          </Button>
          <Button variant="outline" onClick={() => router.push('/companies')}>
            Explore Companies
          </Button>
        </div>
      </div>

      {/* SIMPLE QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => (
          <Card 
            key={action.title}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(action.href)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-${action.color}-100`}>
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT JOBS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Opportunities</CardTitle>
          <CardDescription>Jobs that match your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    <span className="text-sm text-gray-500">{job.salary}</span>
                    <span className="text-sm text-gray-500">{job.posted}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    {job.match}% match
                  </Badge>
                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-600">12</h3>
              <p className="text-gray-600">Jobs Applied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600">8</h3>
              <p className="text-gray-600">Interviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-600">3</h3>
              <p className="text-gray-600">Offers</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}