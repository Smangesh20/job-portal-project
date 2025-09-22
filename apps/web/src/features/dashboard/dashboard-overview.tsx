'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Briefcase, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { getWelcomeBackMessage } from '@/utils/user-name'

const overviewData = {
  profileCompletion: 85,
  activeApplications: 12,
  unreadMessages: 3,
  upcomingInterviews: 2,
  recentMatches: [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      matchScore: 94,
      salary: '$120,000 - $150,000',
      location: 'San Francisco, CA',
      status: 'APPLIED',
      appliedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      matchScore: 89,
      salary: '$100,000 - $130,000',
      location: 'Remote',
      status: 'INTERVIEW_SCHEDULED',
      appliedDate: '2024-01-12'
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'InnovateLab',
      matchScore: 91,
      salary: '$90,000 - $120,000',
      location: 'New York, NY',
      status: 'UNDER_REVIEW',
      appliedDate: '2024-01-10'
    }
  ]
}

export function DashboardOverview() {
  const { user } = useAuthUnified()
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{getWelcomeBackMessage(user)}</CardTitle>
            <CardDescription>
              Here's what's happening with your job search
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-muted-foreground">{overviewData.profileCompletion}%</span>
          </div>
          <Progress value={overviewData.profileCompletion} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Complete your profile to get better job matches
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Briefcase className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{overviewData.activeApplications}</div>
            <div className="text-xs text-blue-600">Active Applications</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <MessageSquare className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{overviewData.unreadMessages}</div>
            <div className="text-xs text-green-600">Unread Messages</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{overviewData.upcomingInterviews}</div>
            <div className="text-xs text-purple-600">Upcoming Interviews</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">94%</div>
            <div className="text-xs text-orange-600">Avg. Match Score</div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Job Matches</h3>
          <div className="space-y-3">
            {overviewData.recentMatches.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{job.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {job.matchScore}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{job.company} • {job.location}</p>
                  <p className="text-sm font-medium text-green-600">{job.salary}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant={
                      job.status === 'APPLIED' ? 'default' :
                      job.status === 'INTERVIEW_SCHEDULED' ? 'secondary' :
                      'outline'
                    }
                    className="text-xs"
                  >
                    {job.status === 'APPLIED' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {job.status === 'INTERVIEW_SCHEDULED' && <Calendar className="h-3 w-3 mr-1" />}
                    {job.status === 'UNDER_REVIEW' && <Clock className="h-3 w-3 mr-1" />}
                    {job.status.replace('_', ' ').toLowerCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Applied {new Date(job.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Action Required
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                You have an interview scheduled for tomorrow at 2:00 PM with TechCorp.
              </p>
              <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
