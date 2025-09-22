'use client'

import { useState, useEffect } from 'react'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface SavedJob {
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
}

export default function SavedJobsPage() {
  const { user, isAuthenticated, isLoading } = useAuthUnified()
  const router = useRouter()
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
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
    const fetchSavedJobs = async () => {
      try {
        console.log('🚀 GOOGLE-STYLE: Fetching saved jobs...')
        const response = await fetch('/api/jobs/saved')
        const data = await response.json()
        
        if (data.success) {
          console.log('🚀 GOOGLE-STYLE: Saved jobs fetched:', data.data.length)
          setSavedJobs(data.data)
        } else {
          console.error('🚀 GOOGLE-STYLE: Error fetching saved jobs:', data.error)
        }
      } catch (error) {
        console.error('🚀 GOOGLE-STYLE: Error fetching saved jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedJobs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">
            {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
              <p className="text-gray-600 mb-6">
                Start exploring jobs and save the ones you're interested in.
              </p>
              <Button onClick={() => router.push('/jobs')}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {savedJobs.map((job) => (
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
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Saved
                      </Badge>
                      {job.isUrgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                      {job.isNew && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          New
                        </Badge>
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
                        {job.posted}
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
                        View Details
                      </Button>
                      <Button size="sm">
                        Apply Now
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
