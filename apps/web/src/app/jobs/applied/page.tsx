'use client'

import { useState, useEffect } from 'react'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface AppliedJob {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  posted: string
  description: string
  requirements: string[]
  tags: string[]
  rating: number
  logo?: string
  isRemote: boolean
  isUrgent: boolean
  isNew: boolean
  companySize: string
  industry: string
  experienceLevel: string
  benefits: string[]
  views: number
  applications: number
  appliedDate: string
  status: 'Applied' | 'Under Review' | 'Interview' | 'Rejected' | 'Accepted'
}

export default function AppliedJobsPage() {
  const { user, isAuthenticated, isLoading } = useAuthUnified()
  const router = useRouter()
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    console.log('🚀 GOOGLE-STYLE: Not authenticated, redirecting to login...')
    router.push('/auth/login')
    return null
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        console.log('🚀 GOOGLE-STYLE: Fetching applied jobs...')
        const response = await fetch('/api/jobs/applied')
        const data = await response.json()
        
        if (data.success) {
          console.log('🚀 GOOGLE-STYLE: Applied jobs fetched:', data.data.length)
          setAppliedJobs(data.data)
        } else {
          console.error('🚀 GOOGLE-STYLE: Error fetching applied jobs:', data.error)
        }
      } catch (error) {
        console.error('🚀 GOOGLE-STYLE: Error fetching applied jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppliedJobs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800'
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800'
      case 'Interview':
        return 'bg-purple-100 text-purple-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
          <p className="text-gray-600 mt-2">
            {appliedJobs.length} job application{appliedJobs.length !== 1 ? 's' : ''} submitted
          </p>
        </div>

        {appliedJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-6">
                Start applying to jobs and track your applications here.
              </p>
              <Button onClick={() => router.push('/jobs')}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appliedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      {job.isUrgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        Applied {job.appliedDate}
                      </div>
                      <div className="text-sm">
                        {job.experienceLevel} Level
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {job.views} views • {job.applications} applications
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.slice(0, 4).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.tags.length - 4} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{job.companySize}</span> • {job.industry}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Track Application
                      </Button>
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
