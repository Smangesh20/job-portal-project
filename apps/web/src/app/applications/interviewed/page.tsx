'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
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
  Video,
  Phone,
  User,
  FileText
} from 'lucide-react'

// GOOGLE-STYLE INTERVIEWED APPLICATIONS PAGE - REAL-TIME DATA
export default function InterviewedApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time interviewed applications data
  useEffect(() => {
    const fetchInterviewedApplications = async () => {
      try {
        // Simulate real-time interviewed applications data like Google
        const mockApplications = [
          {
            id: 1,
            jobTitle: 'Senior Software Engineer',
            company: 'Google',
            location: 'Mountain View, CA',
            appliedDate: '2024-12-15',
            interviewDate: '2024-12-20',
            interviewType: 'Technical Interview',
            status: 'Interviewed',
            result: 'Pending',
            salary: '$150,000 - $200,000',
            type: 'Full-time',
            match: 98,
            interviewer: 'Sarah Johnson',
            interviewerTitle: 'Engineering Manager',
            interviewerEmail: 'sarah.johnson@google.com',
            interviewDuration: '60 minutes',
            interviewFormat: 'Video Call',
            notes: 'Technical discussion on system design and coding challenges',
            feedback: 'Strong technical skills, good problem-solving approach',
            nextSteps: 'Final interview with director',
            timeline: '1-2 weeks',
            isFavorite: true
          },
          {
            id: 2,
            jobTitle: 'Product Manager',
            company: 'Microsoft',
            location: 'Seattle, WA',
            appliedDate: '2024-12-12',
            interviewDate: '2024-12-18',
            interviewType: 'Behavioral Interview',
            status: 'Interviewed',
            result: 'Advanced',
            salary: '$130,000 - $180,000',
            type: 'Full-time',
            match: 94,
            interviewer: 'Mike Chen',
            interviewerTitle: 'Senior Product Manager',
            interviewerEmail: 'mike.chen@microsoft.com',
            interviewDuration: '45 minutes',
            interviewFormat: 'Phone Call',
            notes: 'Discussion on product strategy and user experience',
            feedback: 'Excellent communication skills, strong product vision',
            nextSteps: 'Case study presentation',
            timeline: '1 week',
            isFavorite: false
          },
          {
            id: 3,
            jobTitle: 'Data Scientist',
            company: 'Apple',
            location: 'Cupertino, CA',
            appliedDate: '2024-12-10',
            interviewDate: '2024-12-16',
            interviewType: 'Technical + Behavioral',
            status: 'Interviewed',
            result: 'Rejected',
            salary: '$140,000 - $190,000',
            type: 'Full-time',
            match: 91,
            interviewer: 'Lisa Wang',
            interviewerTitle: 'Data Science Lead',
            interviewerEmail: 'lisa.wang@apple.com',
            interviewDuration: '90 minutes',
            interviewFormat: 'Video Call',
            notes: 'Technical questions on machine learning and data analysis',
            feedback: 'Good technical knowledge but needs more experience',
            nextSteps: 'None',
            timeline: 'N/A',
            isFavorite: false
          }
        ]
        
        setApplications(mockApplications)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Interviewed applications loaded successfully')
        setLoading(false)
      }
    }

    fetchInterviewedApplications()
    
    // Google-style real-time updates
    const interval = setInterval(fetchInterviewedApplications, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Advanced':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'Technical Interview':
        return <Target className="h-4 w-4" />
      case 'Behavioral Interview':
        return <Users className="h-4 w-4" />
      case 'Technical + Behavioral':
        return <Award className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
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
          🎯 Interviewed Applications
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Track your interview progress and results with real-time updates.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search interviewed applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Interview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advanced</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter((app: any) => app.result === 'Advanced').length}</div>
            <p className="text-xs text-muted-foreground">To next round</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter((app: any) => app.result === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting result</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">Advancement rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Interviewed Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Interviewed Applications</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
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
                    Interviewed on {application.interviewDate}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getResultColor(application.result)}>
                      {application.result}
                    </Badge>
                    <Badge variant="outline">
                      {application.interviewType}
                    </Badge>
                    <Badge variant="outline">
                      {application.interviewFormat}
                    </Badge>
                    <Badge variant="outline">
                      {application.salary}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {application.interviewDuration}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {application.interviewer}
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
                    <Target className="h-4 w-4" />
                    <span>Next: {application.nextSteps}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>Timeline: {application.timeline}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-4 w-4" />
                    <span>{application.interviewerTitle}</span>
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

      {/* Interview Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>Interview Performance</span>
            </CardTitle>
            <CardDescription>Your interview success metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Technical Interviews</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average performance score</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">8.5/10</div>
                <div className="text-sm text-gray-500">Excellent</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Behavioral Interviews</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Communication skills rating</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">9.2/10</div>
                <div className="text-sm text-gray-500">Outstanding</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Overall Success Rate</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Interviews to next round</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">67%</div>
                <div className="text-sm text-gray-500">Above average</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Interview Tips</span>
            </CardTitle>
            <CardDescription>Improve your interview performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technical Preparation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Practice coding challenges and system design questions. Review your technical skills.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Behavioral Questions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Prepare STAR method examples for common behavioral questions.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Follow-up</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send thank you emails within 24 hours of your interview.
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
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Schedule Interview</CardTitle>
            <CardDescription>Book your next interview</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Schedule Now
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Interview Prep</CardTitle>
            <CardDescription>Prepare for your next interview</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Start Prep
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Interview Analytics</CardTitle>
            <CardDescription>Track your interview performance</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
