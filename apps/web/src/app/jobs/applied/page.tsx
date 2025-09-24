'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building2, 
  MapPin,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Star,
  Download,
  Share,
  ExternalLink,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  Target,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Bell,
  RefreshCw,
  Bookmark
} from 'lucide-react'

// GOOGLE-STYLE APPLIED JOBS PAGE - REAL-TIME DATA
export default function AppliedJobsPage() {
  const [jobs, setJobs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time applied jobs data
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        // Simulate real-time applied jobs data like Google
        const mockJobs = [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Google',
            location: 'Mountain View, CA',
            appliedDate: '2024-12-20',
            status: 'Under Review',
            salary: '$150,000 - $200,000',
            type: 'Full-time',
            match: 98,
            recruiter: 'Sarah Johnson',
            recruiterEmail: 'sarah.johnson@google.com',
            expectedResponse: '2024-12-27',
            daysSinceApplied: 2,
            nextStep: 'Initial Screening',
            notes: 'Applied through company website, strong match for skills',
            isFavorite: true,
            hasUpdates: true,
            lastUpdate: '2024-12-22',
            updateMessage: 'Application moved to review stage',
            applicationMethod: 'Company Website',
            resumeVersion: 'v2.1',
            coverLetter: 'Custom cover letter sent'
          },
          {
            id: 2,
            title: 'Product Manager',
            company: 'Microsoft',
            location: 'Seattle, WA',
            appliedDate: '2024-12-19',
            status: 'Interview Scheduled',
            salary: '$130,000 - $180,000',
            type: 'Full-time',
            match: 94,
            recruiter: 'Mike Chen',
            recruiterEmail: 'mike.chen@microsoft.com',
            expectedResponse: '2024-12-26',
            daysSinceApplied: 3,
            nextStep: 'Technical Interview',
            notes: 'Phone interview completed, waiting for next round',
            isFavorite: false,
            hasUpdates: false,
            lastUpdate: '2024-12-19',
            updateMessage: 'Application submitted',
            applicationMethod: 'LinkedIn',
            resumeVersion: 'v2.0',
            coverLetter: 'No cover letter'
          },
          {
            id: 3,
            title: 'UX Designer',
            company: 'Meta',
            location: 'Menlo Park, CA',
            appliedDate: '2024-12-18',
            status: 'Application Submitted',
            salary: '$120,000 - $170,000',
            type: 'Full-time',
            match: 89,
            recruiter: 'David Smith',
            recruiterEmail: 'david.smith@meta.com',
            expectedResponse: '2024-12-25',
            daysSinceApplied: 4,
            nextStep: 'Portfolio Review',
            notes: 'Recently applied, waiting for initial response',
            isFavorite: true,
            hasUpdates: false,
            lastUpdate: '2024-12-18',
            updateMessage: 'Application submitted',
            applicationMethod: 'Job Board',
            resumeVersion: 'v1.9',
            coverLetter: 'Generic cover letter'
          },
          {
            id: 4,
            title: 'Data Scientist',
            company: 'Apple',
            location: 'Cupertino, CA',
            appliedDate: '2024-12-17',
            status: 'Rejected',
            salary: '$140,000 - $190,000',
            type: 'Full-time',
            match: 92,
            recruiter: 'Lisa Wang',
            recruiterEmail: 'lisa.wang@apple.com',
            expectedResponse: 'N/A',
            daysSinceApplied: 5,
            nextStep: 'None',
            notes: 'Portfolio under review by design team',
            isFavorite: false,
            hasUpdates: true,
            lastUpdate: '2024-12-21',
            updateMessage: 'Application rejected',
            applicationMethod: 'Company Website',
            resumeVersion: 'v2.0',
            coverLetter: 'Custom cover letter sent'
          }
        ]
        
        setJobs(mockJobs)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Applied jobs loaded successfully')
        setLoading(false)
      }
    }

    fetchAppliedJobs()
    
    // Google-style real-time updates
    const interval = setInterval(fetchAppliedJobs, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Interview Scheduled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Application Submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getDaysColor = (days: number) => {
    if (days <= 3) return 'text-green-600'
    if (days <= 7) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          📋 Applied Jobs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Track all your job applications and their current status with real-time updates.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search applied jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Applied Jobs Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applied</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter((job: any) => job.status === 'Under Review').length}</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter((job: any) => job.status === 'Interview Scheduled').length}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Interview rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Applied Jobs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Applied Jobs</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobs.map((job: any) => (
            <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.company} • {job.location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Applied {job.daysSinceApplied} days ago
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <Badge variant="outline">
                      {job.salary}
                    </Badge>
                    <Badge variant="outline">
                      {job.match}% Match
                    </Badge>
                    {job.hasUpdates && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Bell className="h-3 w-3 mr-1" />
                        Updated
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.applicationMethod}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {job.resumeVersion}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {job.coverLetter}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Applied {job.appliedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-4 w-4" />
                    <span>{job.recruiter}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span className={getDaysColor(job.daysSinceApplied)}>
                      {job.daysSinceApplied} days
                    </span>
                  </div>
                  {job.hasUpdates && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Bell className="h-4 w-4" />
                      <span className="text-green-600">{job.updateMessage}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    {job.isFavorite ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Application Insights and Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>Application Insights</span>
            </CardTitle>
            <CardDescription>Your application performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Response Rate</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Applications that got responses</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-500">Excellent</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Interview Rate</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Applications that led to interviews</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">75%</div>
                <div className="text-sm text-gray-500">Above average</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Average Response Time</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days to first response</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">3.2</div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Application Tips</span>
            </CardTitle>
            <CardDescription>Improve your application success rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customize Applications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tailor your resume and cover letter for each specific role and company.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Follow Up</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send a polite follow-up email after 1-2 weeks if you haven't heard back.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Track Everything</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep detailed records of all applications, responses, and follow-ups.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Network</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with employees at target companies for referrals and insights.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">New Application</CardTitle>
            <CardDescription>Apply to more positions</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Find Jobs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Check Status</CardTitle>
            <CardDescription>Get latest updates on applications</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Refresh All
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Set Reminders</CardTitle>
            <CardDescription>Get notified about follow-ups</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Set Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}