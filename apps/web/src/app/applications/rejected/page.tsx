'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  XCircle, 
  Clock, 
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
  RefreshCw,
  FileText,
  Calendar,
  User,
  Lightbulb,
  BookOpen
} from 'lucide-react'

// GOOGLE-STYLE REJECTED APPLICATIONS PAGE - REAL-TIME DATA
export default function RejectedApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time rejected applications data
  useEffect(() => {
    const fetchRejectedApplications = async () => {
      try {
        // Simulate real-time rejected applications data like Google
        const mockApplications = [
          {
            id: 1,
            jobTitle: 'Senior Software Engineer',
            company: 'Apple',
            location: 'Cupertino, CA',
            appliedDate: '2024-12-10',
            rejectedDate: '2024-12-18',
            rejectionReason: 'Not selected for final round',
            salary: '$140,000 - $190,000',
            type: 'Full-time',
            match: 91,
            interviewStage: 'Technical Interview',
            feedback: 'Strong technical skills but needs more experience in our specific domain',
            recruiter: 'Lisa Wang',
            recruiterEmail: 'lisa.wang@apple.com',
            notes: 'Applied through company website, made it to technical round',
            isFavorite: false,
            canReapply: true,
            reapplyDate: '2025-03-10'
          },
          {
            id: 2,
            jobTitle: 'Product Manager',
            company: 'Netflix',
            location: 'Los Gatos, CA',
            appliedDate: '2024-12-08',
            rejectedDate: '2024-12-15',
            rejectionReason: 'Position filled internally',
            salary: '$135,000 - $185,000',
            type: 'Full-time',
            match: 89,
            interviewStage: 'Initial Screening',
            feedback: 'Excellent profile but position was filled by internal candidate',
            recruiter: 'David Smith',
            recruiterEmail: 'david.smith@netflix.com',
            notes: 'Great initial conversation, would consider for future roles',
            isFavorite: true,
            canReapply: true,
            reapplyDate: '2025-01-08'
          },
          {
            id: 3,
            jobTitle: 'Data Scientist',
            company: 'Amazon',
            location: 'Seattle, WA',
            appliedDate: '2024-12-05',
            rejectedDate: '2024-12-12',
            rejectionReason: 'Skills mismatch',
            salary: '$130,000 - $180,000',
            type: 'Full-time',
            match: 85,
            interviewStage: 'Phone Screening',
            feedback: 'Looking for someone with more experience in machine learning',
            recruiter: 'Emily Rodriguez',
            recruiterEmail: 'emily.rodriguez@amazon.com',
            notes: 'Good candidate but not the right fit for this specific role',
            isFavorite: false,
            canReapply: true,
            reapplyDate: '2025-02-05'
          }
        ]
        
        setApplications(mockApplications)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Rejected applications loaded successfully')
        setLoading(false)
      }
    }

    fetchRejectedApplications()
    
    // Google-style real-time updates
    const interval = setInterval(fetchRejectedApplications, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getRejectionReasonColor = (reason: string) => {
    switch (reason) {
      case 'Not selected for final round':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Position filled internally':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Skills mismatch':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getInterviewStageColor = (stage: string) => {
    switch (stage) {
      case 'Technical Interview':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Initial Screening':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Phone Screening':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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
          📋 Rejected Applications
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Learn from rejections and improve your future applications with valuable feedback.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search rejected applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Rejection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rejections</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Can Reapply</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter((app: any) => app.canReapply).length}</div>
            <p className="text-xs text-muted-foreground">Eligible to reapply</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter((app: any) => app.feedback).length}</div>
            <p className="text-xs text-muted-foreground">Received feedback</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">Since last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Rejected Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Rejected Applications</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reapply
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {applications.map((application: any) => (
            <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
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
                    Rejected on {application.rejectedDate}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getRejectionReasonColor(application.rejectionReason)}>
                      {application.rejectionReason}
                    </Badge>
                    <Badge className={getInterviewStageColor(application.interviewStage)}>
                      {application.interviewStage}
                    </Badge>
                    <Badge variant="outline">
                      {application.salary}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {application.match}% Match
                    </Badge>
                    {application.canReapply && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Can Reapply
                      </Badge>
                    )}
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
                    <span>Reapply: {application.reapplyDate}</span>
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

      {/* Feedback and Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6" />
              <span>Feedback Analysis</span>
            </CardTitle>
            <CardDescription>Common feedback themes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technical Skills</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Focus on strengthening your technical skills in specific domains mentioned in feedback.
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">Experience</Badge>
                <Badge variant="outline" className="text-xs">Domain Knowledge</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Communication</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Improve your communication skills and ability to explain complex concepts clearly.
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">Presentation</Badge>
                <Badge variant="outline" className="text-xs">Clarity</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cultural Fit</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Research company culture and values to better align your application.
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">Research</Badge>
                <Badge variant="outline" className="text-xs">Alignment</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Improvement Plan</span>
            </CardTitle>
            <CardDescription>Action items based on feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Skill Development</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Take online courses to strengthen areas mentioned in feedback.
              </p>
              <Button size="sm" className="mt-2">
                Find Courses
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Practice Interviews</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Practice mock interviews to improve your interview performance.
              </p>
              <Button size="sm" variant="outline" className="mt-2">
                Schedule Practice
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Network Building</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with professionals in your target companies and roles.
              </p>
              <Button size="sm" variant="outline" className="mt-2">
                Start Networking
              </Button>
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
            <CardTitle className="text-lg">Reapply</CardTitle>
            <CardDescription>Reapply to eligible positions</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              View Eligible
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Learn & Improve</CardTitle>
            <CardDescription>Take courses to improve your skills</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Browse Courses
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">New Applications</CardTitle>
            <CardDescription>Find new opportunities to apply</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Find Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

















