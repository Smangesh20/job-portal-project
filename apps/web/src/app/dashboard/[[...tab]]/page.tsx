'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { ProtectedPage } from '@/components/auth/google-auth-guard'
import { EnterpriseProfile } from '@/components/profile/enterprise-profile'
import { EnterpriseSettings } from '@/components/settings/enterprise-settings'
import { EnterpriseNotifications } from '@/components/notifications/enterprise-notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Settings, 
  Bell, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Award,
  BarChart3,
  Target,
  Users,
  Building,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Eye,
  EyeOff
} from 'lucide-react'

export default function DashboardTabPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const tab = params.tab?.[0] || 'overview'
    if (['overview', 'profile', 'notifications', 'settings'].includes(tab)) {
      setActiveTab(tab)
    } else {
      // Google-style: Redirect to overview for invalid tabs
      router.replace('/dashboard/overview')
    }
  }, [params, router])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Update URL without causing a full page reload
    const url = new URL(window.location.href)
    url.pathname = `/dashboard/${tab}`
    window.history.replaceState({}, '', url.toString())
  }

  const stats = [
    {
      title: 'Profile Views',
      value: '1,247',
      change: '+12%',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Job Applications',
      value: '23',
      change: '+5',
      icon: Briefcase,
      color: 'text-green-600'
    },
    {
      title: 'Interviews',
      value: '8',
      change: '+2',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Offers',
      value: '3',
      change: '+1',
      icon: Award,
      color: 'text-yellow-600'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'application',
      title: 'Applied to Senior Software Engineer at Google',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview scheduled with Microsoft',
      time: '1 day ago',
      status: 'upcoming'
    },
    {
      id: 3,
      type: 'offer',
      title: 'Received offer from Amazon',
      time: '3 days ago',
      status: 'reviewing'
    },
    {
      id: 4,
      type: 'profile',
      title: 'Profile viewed by 12 recruiters',
      time: '1 week ago',
      status: 'completed'
    }
  ]

  const jobMatches = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      match: 95,
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Lead Software Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$100k - $130k',
      match: 88,
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'Principal Engineer',
      company: 'BigTech Inc',
      location: 'Seattle, WA',
      salary: '$150k - $180k',
      match: 92,
      posted: '3 days ago'
    }
  ]

  return (
    <ProtectedPage>
      <DashboardLayout>
      <div className="min-h-screen w-full">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
              Welcome back! Here's what's happening with your job search.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button size="sm" className="w-full sm:w-auto">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Find Jobs</span>
              <span className="sm:hidden">Jobs</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-2">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 px-2">
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm py-2 px-2">
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 px-2">
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          {stat.title}
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{stat.change}</span>
                        </p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color} flex-shrink-0 ml-2`}>
                        <stat.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest job search activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {activity.type === 'application' && (
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          )}
                          {activity.type === 'interview' && (
                            <Calendar className="h-5 w-5 text-purple-600" />
                          )}
                          {activity.type === 'offer' && (
                            <Award className="h-5 w-5 text-yellow-600" />
                          )}
                          {activity.type === 'profile' && (
                            <Eye className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                          <div className="flex items-center mt-1">
                            {activity.status === 'pending' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                            {activity.status === 'upcoming' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Upcoming
                              </span>
                            )}
                            {activity.status === 'reviewing' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Reviewing
                              </span>
                            )}
                            {activity.status === 'completed' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Job Matches */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Top Job Matches
                  </CardTitle>
                  <CardDescription>
                    Jobs that match your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobMatches.map((job) => (
                      <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {job.company} • {job.location}
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              {job.salary}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Posted {job.posted}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{job.match}% match</span>
                            </div>
                            <Button size="sm" variant="outline">
                              Apply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <EnterpriseProfile />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <EnterpriseNotifications />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <EnterpriseSettings />
          </TabsContent>
        </Tabs>
      </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}
