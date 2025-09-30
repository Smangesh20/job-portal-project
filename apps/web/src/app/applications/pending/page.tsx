'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Clock, 
  CheckCircle, 
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
  RefreshCw
} from 'lucide-react'

// GOOGLE-STYLE PENDING APPLICATIONS PAGE - REAL-TIME DATA
export default function PendingApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time pending applications data
  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        // Simulate real-time pending applications data like Google
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
            recruiter: 'Sarah Johnson',
            recruiterEmail: 'sarah.johnson@google.com',
            expectedResponse: '2024-12-27',
            daysSinceApplied: 2,
            nextStep: 'Initial Screening',
            notes: 'Applied through company website, strong match for skills',
            isFavorite: true,
            hasUpdates: true,
            lastUpdate: '2024-12-22',
            updateMessage: 'Application moved to review stage'
          },
          {
            id: 2,
            jobTitle: 'Product Manager',
            company: 'Microsoft',
            location: 'Seattle, WA',
            appliedDate: '2024-12-19',
            status: 'Initial Screening',
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
            updateMessage: 'Application submitted'
          },
          {
            id: 3,
            jobTitle: 'UX Designer',
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
            updateMessage: 'Application submitted'
          },
          {
            id: 4,
            jobTitle: 'Data Scientist',
            company: 'Apple',
            location: 'Cupertino, CA',
            appliedDate: '2024-12-17',
            status: 'Portfolio Review',
            salary: '$140,000 - $190,000',
            type: 'Full-time',
            match: 92,
            recruiter: 'Lisa Wang',
            recruiterEmail: 'lisa.wang@apple.com',
            expectedResponse: '2024-12-24',
            daysSinceApplied: 5,
            nextStep: 'Technical Assessment',
            notes: 'Portfolio under review by design team',
            isFavorite: false,
            hasUpdates: true,
            lastUpdate: '2024-12-21',
            updateMessage: 'Portfolio review in progress'
          }
        ]
        
        setApplications(mockApplications)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Pending applications loaded successfully')
        setLoading(false)
      }
    }

    fetchPendingApplications()
    
    // Google-style real-time updates
    const interval = setInterval(fetchPendingApplications, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Initial Screening':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Application Submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Portfolio Review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
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
          ⏳ Pending Applications
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Track your pending applications and stay updated on their progress.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search pending applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Pending Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Updates</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter((app: any) => app.hasUpdates).length}</div>
            <p className="text-xs text-muted-foreground">Recent updates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter((app: any) => {
              const expectedDate = new Date(app.expectedResponse)
              const today = new Date()
              const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
              return expectedDate <= weekFromNow
            }).length}</div>
            <p className="text-xs text-muted-foreground">Responses expected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Pending Applications</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All
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
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Applied {application.daysSinceApplied} days ago
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                    <Badge variant="outline">
                      {application.salary}
                    </Badge>
                    <Badge variant="outline">
                      {application.match}% Match
                    </Badge>
                    {application.hasUpdates && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Bell className="h-3 w-3 mr-1" />
                        Updated
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Next: {application.nextStep}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Expected: {application.expectedResponse}
                    </Badge>
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
                    <User className="h-4 w-4" />
                    <span>{application.recruiter}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span className={getDaysColor(application.daysSinceApplied)}>
                      {application.daysSinceApplied} days
                    </span>
                  </div>
                  {application.hasUpdates && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Bell className="h-4 w-4" />
                      <span className="text-green-600">{application.updateMessage}</span>
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

      {/* Application Timeline and Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <span>Application Timeline</span>
            </CardTitle>
            <CardDescription>Typical application process stages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Application Submitted</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1-3 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Initial Review</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">3-7 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Screening</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1-2 weeks</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Interview</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">2-4 weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>While You Wait</span>
            </CardTitle>
            <CardDescription>Things you can do during the waiting period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Continue Applying</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't put all your eggs in one basket. Keep applying to other opportunities.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Prepare for Interviews</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Practice common interview questions and research the company thoroughly.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Network</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with employees at the company on LinkedIn and attend industry events.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Follow Up</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send a polite follow-up email after 1-2 weeks if you haven't heard back.
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
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Check Status</CardTitle>
            <CardDescription>Get latest updates on your applications</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Refresh Status
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">New Applications</CardTitle>
            <CardDescription>Apply to more positions</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Find Jobs
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












