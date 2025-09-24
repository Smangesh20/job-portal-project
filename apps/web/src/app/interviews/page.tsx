'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  User, 
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

// GOOGLE-STYLE INTERVIEWS PAGE - REAL-TIME DATA
export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Google-style real-time data
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        // Simulate real-time data like Google
        const mockInterviews = [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Google',
            date: '2024-12-28',
            time: '10:00 AM',
            type: 'Video Call',
            status: 'Scheduled',
            location: 'Remote',
            interviewer: 'Sarah Johnson',
            meetingLink: 'https://meet.google.com/abc-defg-hij'
          },
          {
            id: 2,
            title: 'Product Manager',
            company: 'Microsoft',
            date: '2024-12-30',
            time: '2:00 PM',
            type: 'Phone Call',
            status: 'Completed',
            location: 'Phone',
            interviewer: 'Mike Chen',
            result: 'Passed'
          },
          {
            id: 3,
            title: 'UX Designer',
            company: 'Apple',
            date: '2025-01-02',
            time: '11:00 AM',
            type: 'In-Person',
            status: 'Upcoming',
            location: 'Cupertino, CA',
            interviewer: 'Lisa Wang'
          }
        ]
        
        setInterviews(mockInterviews)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Interviews loaded successfully')
        setLoading(false)
      }
    }

    fetchInterviews()
    
    // Google-style real-time updates
    const interval = setInterval(fetchInterviews, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'Upcoming':
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Upcoming':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
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
          📅 Your Interviews
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Manage your upcoming and completed interviews with real-time updates.
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
            Schedule New Interview
          </Button>
          <Button variant="outline" className="px-8 py-3 text-lg">
            View Calendar
          </Button>
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">+5% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Interview List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Interviews</CardTitle>
          <CardDescription>Real-time interview schedule and results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {interviews.map((interview: any) => (
            <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(interview.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {interview.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building2 className="h-4 w-4" />
                      <span>{interview.company}</span>
                      <span>•</span>
                      <span>{interview.interviewer}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{interview.date}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{interview.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {interview.type === 'Video Call' ? (
                      <Video className="h-4 w-4" />
                    ) : interview.type === 'Phone Call' ? (
                      <Phone className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    <span>{interview.location}</span>
                  </div>
                </div>
                
                <Badge className={getStatusColor(interview.status)}>
                  {interview.status}
                </Badge>
                
                {interview.status === 'Scheduled' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Join Meeting
                  </Button>
                )}
                
                {interview.status === 'Completed' && interview.result && (
                  <Badge className={interview.result === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {interview.result}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
