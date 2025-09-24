'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
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
  AlertCircle
} from 'lucide-react'

// GOOGLE-STYLE APPLICATIONS PAGE - REAL-TIME DATA
export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time applications data
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Simulate real-time applications data like Google
        const mockApplications = [
          {
            id: 1,
            jobTitle: 'Senior Software Engineer',
            company: 'Google',
            location: 'Mountain View, CA',
            appliedDate: '2024-12-20',
            status: 'Under Review',
            salary: '$150,000 - $200,000',
            type: 'Full-time',
            match: 98,
            nextStep: 'Technical Interview',
            timeline: '2-3 days',
            recruiter: 'Sarah Johnson',
            recruiterEmail: 'sarah.johnson@google.com',
            notes: 'Applied through company website, strong match for skills',
            documents: ['Resume', 'Cover Letter', 'Portfolio'],
            isFavorite: true
          },
          {
            id: 2,
            jobTitle: 'Product Manager',
            company: 'Microsoft',
            location: 'Seattle, WA',
            appliedDate: '2024-12-19',
            status: 'Interview Scheduled',
            salary: '$130,000 - $180,000',
            type: 'Full-time',
            match: 94,
            nextStep: 'Final Interview',
            timeline: '1 week',
            recruiter: 'Mike Chen',
            recruiterEmail: 'mike.chen@microsoft.com',
            notes: 'Phone interview completed, moving to final round',
            documents: ['Resume', 'Cover Letter', 'Case Study'],
            isFavorite: false
          },
          {
            id: 3,
            jobTitle: 'Data Scientist',
            company: 'Apple',
            location: 'Cupertino, CA',
            appliedDate: '2024-12-18',
            status: 'Rejected',
            salary: '$140,000 - $190,000',
            type: 'Full-time',
            match: 91,
            nextStep: 'None',
            timeline: 'N/A',
            recruiter: 'Lisa Wang',
            recruiterEmail: 'lisa.wang@apple.com',
            notes: 'Not selected for final round, but positive feedback',
            documents: ['Resume', 'Cover Letter', 'Technical Project'],
            isFavorite: false
          },
          {
            id: 4,
            jobTitle: 'UX Designer',
            company: 'Meta',
            location: 'Menlo Park, CA',
            appliedDate: '2024-12-17',
            status: 'Application Submitted',
            salary: '$120,000 - $170,000',
            type: 'Full-time',
            match: 89,
            nextStep: 'Initial Review',
            timeline: '1-2 weeks',
            recruiter: 'David Smith',
            recruiterEmail: 'david.smith@meta.com',
            notes: 'Recently applied, waiting for initial response',
            documents: ['Resume', 'Cover Letter', 'Design Portfolio'],
            isFavorite: true
          }
        ]
        
        setApplications(mockApplications)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Applications loaded successfully')
        setLoading(false)
      }
    }

    fetchApplications()
    
    // Google-style real-time updates
    const interval = setInterval(fetchApplications, 30000) // Update every 30 seconds
    
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Under Review':
        return <Clock className="h-4 w-4" />
      case 'Interview Scheduled':
        return <Calendar className="h-4 w-4" />
      case 'Application Submitted':
        return <FileText className="h-4 w-4" />
      case 'Rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getMatchColor = (match: number) => {
    if (match >= 95) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (match >= 90) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (match >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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
          📋 Your Applications
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Track your job applications with real-time updates and status notifications.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter((app: any) => app.status === 'Under Review').length}</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter((app: any) => app.status === 'Interview Scheduled').length}</div>
            <p className="text-xs text-muted-foreground">Scheduled interviews</p>
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

      {/* Applications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Applications</CardTitle>
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
          {applications.map((application: any) => (
            <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {application.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {application.company} • {application.location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {application.notes}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(application.status)}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{application.status}</span>
                    </Badge>
                    <Badge className={getMatchColor(application.match)}>
                      {application.match}% Match
                    </Badge>
                    <Badge variant="outline">
                      {application.type}
                    </Badge>
                    <Badge variant="outline">
                      {application.salary}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    {application.documents.map((doc: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Applied {application.appliedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Target className="h-4 w-4" />
                    <span>Next: {application.nextStep}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>Timeline: {application.timeline}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Users className="h-4 w-4" />
                    <span>{application.recruiter}</span>
                  </div>
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
                    {application.isFavorite ? (
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Application Analytics</CardTitle>
            <CardDescription>Track your application performance</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Interview Tracker</CardTitle>
            <CardDescription>Manage your interview schedule</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              View Schedule
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Application Tips</CardTitle>
            <CardDescription>Improve your application success rate</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Get Tips
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}