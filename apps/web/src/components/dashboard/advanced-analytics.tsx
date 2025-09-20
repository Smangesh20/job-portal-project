'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown,
  Briefcase, 
  MessageSquare, 
  Calendar,
  Users,
  Star,
  Eye,
  Target,
  Award,
  Brain,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Clock,
  DollarSign,
  MapPin,
  Building,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Calendar as CalendarIcon,
  Settings
} from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface AnalyticsData {
  overview: {
    totalApplications: number
    interviewRate: number
    responseRate: number
    profileViews: number
    matchScore: number
    networkGrowth: number
    applicationsThisMonth: number
    interviewsThisMonth: number
    offersReceived: number
    averageResponseTime: number
  }
  applications: {
    total: number
    pending: number
    underReview: number
    interviewScheduled: number
    rejected: number
    offered: number
    withdrawn: number
  }
  performance: {
    applicationTrend: Array<{ month: string; applications: number; interviews: number; offers: number }>
    skillGaps: Array<{ skill: string; current: number; required: number; gap: number }>
    salaryProgression: Array<{ month: string; average: number; median: number; max: number }>
    industryDistribution: Array<{ industry: string; count: number; percentage: number }>
    locationDistribution: Array<{ location: string; count: number; percentage: number }>
  }
  insights: {
    topSkills: Array<{ skill: string; demand: number; supply: number; trend: 'up' | 'down' }>
    marketTrends: Array<{ trend: string; impact: 'positive' | 'negative' | 'neutral'; description: string }>
    recommendations: Array<{ type: 'skill' | 'profile' | 'application' | 'network'; title: string; description: string; priority: 'high' | 'medium' | 'low' }>
    aiInsights: {
      culturalFit: number
      skillAlignment: number
      marketPosition: number
      growthPotential: number
      salaryExpectations: number
    }
  }
  timeline: Array<{
    id: string
    date: string
    type: 'application' | 'interview' | 'offer' | 'rejection' | 'profile_update' | 'skill_added'
    title: string
    description: string
    status: 'success' | 'pending' | 'warning' | 'error'
    company?: string
    position?: string
  }>
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('applications')

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: AnalyticsData = {
        overview: {
          totalApplications: 47,
          interviewRate: 68,
          responseRate: 89,
          profileViews: 234,
          matchScore: 94,
          networkGrowth: 42,
          applicationsThisMonth: 12,
          interviewsThisMonth: 8,
          offersReceived: 3,
          averageResponseTime: 2.3
        },
        applications: {
          total: 47,
          pending: 8,
          underReview: 15,
          interviewScheduled: 12,
          rejected: 7,
          offered: 3,
          withdrawn: 2
        },
        performance: {
          applicationTrend: [
            { month: 'Jan', applications: 8, interviews: 5, offers: 1 },
            { month: 'Feb', applications: 12, interviews: 8, offers: 2 },
            { month: 'Mar', applications: 15, interviews: 10, offers: 1 },
            { month: 'Apr', applications: 18, interviews: 12, offers: 3 },
            { month: 'May', applications: 22, interviews: 15, offers: 2 },
            { month: 'Jun', applications: 25, interviews: 18, offers: 4 }
          ],
          skillGaps: [
            { skill: 'React', current: 85, required: 95, gap: 10 },
            { skill: 'TypeScript', current: 70, required: 90, gap: 20 },
            { skill: 'AWS', current: 60, required: 85, gap: 25 },
            { skill: 'Docker', current: 75, required: 80, gap: 5 },
            { skill: 'GraphQL', current: 40, required: 70, gap: 30 }
          ],
          salaryProgression: [
            { month: 'Jan', average: 95000, median: 90000, max: 120000 },
            { month: 'Feb', average: 98000, median: 92000, max: 125000 },
            { month: 'Mar', average: 102000, median: 95000, max: 130000 },
            { month: 'Apr', average: 105000, median: 98000, max: 135000 },
            { month: 'May', average: 108000, median: 100000, max: 140000 },
            { month: 'Jun', average: 112000, median: 105000, max: 145000 }
          ],
          industryDistribution: [
            { industry: 'Technology', count: 28, percentage: 60 },
            { industry: 'Finance', count: 8, percentage: 17 },
            { industry: 'Healthcare', count: 6, percentage: 13 },
            { industry: 'Education', count: 3, percentage: 6 },
            { industry: 'Other', count: 2, percentage: 4 }
          ],
          locationDistribution: [
            { location: 'San Francisco, CA', count: 15, percentage: 32 },
            { location: 'New York, NY', count: 12, percentage: 26 },
            { location: 'Remote', count: 18, percentage: 38 },
            { location: 'Seattle, WA', count: 2, percentage: 4 }
          ]
        },
        insights: {
          topSkills: [
            { skill: 'React', demand: 95, supply: 78, trend: 'up' },
            { skill: 'TypeScript', demand: 88, supply: 65, trend: 'up' },
            { skill: 'Node.js', demand: 82, supply: 70, trend: 'up' },
            { skill: 'AWS', demand: 90, supply: 60, trend: 'up' },
            { skill: 'Python', demand: 85, supply: 80, trend: 'down' }
          ],
          marketTrends: [
            { trend: 'Remote Work', impact: 'positive', description: 'Remote job postings increased by 25% this month' },
            { trend: 'AI/ML Skills', impact: 'positive', description: 'High demand for AI and machine learning expertise' },
            { trend: 'Salary Growth', impact: 'positive', description: 'Average salaries up 8% compared to last quarter' },
            { trend: 'Competition', impact: 'negative', description: 'Increased competition for senior positions' }
          ],
          recommendations: [
            { type: 'skill', title: 'Learn TypeScript', description: 'Improve your TypeScript skills to match 90% of job requirements', priority: 'high' },
            { type: 'profile', title: 'Add Portfolio Projects', description: 'Showcase 3-5 recent projects to increase profile views', priority: 'medium' },
            { type: 'application', title: 'Apply to Remote Jobs', description: 'Focus on remote opportunities for better match rates', priority: 'high' },
            { type: 'network', title: 'Connect with Recruiters', description: 'Expand your network with 20+ tech recruiters', priority: 'low' }
          ],
          aiInsights: {
            culturalFit: 92,
            skillAlignment: 88,
            marketPosition: 85,
            growthPotential: 90,
            salaryExpectations: 87
          }
        },
        timeline: [
          {
            id: '1',
            date: '2024-01-15',
            type: 'application',
            title: 'Applied to Senior Frontend Developer',
            description: 'Applied to TechCorp for Senior Frontend Developer position',
            status: 'success',
            company: 'TechCorp',
            position: 'Senior Frontend Developer'
          },
          {
            id: '2',
            date: '2024-01-18',
            type: 'interview',
            title: 'Interview Scheduled',
            description: 'Technical interview scheduled for January 25th',
            status: 'pending',
            company: 'TechCorp',
            position: 'Senior Frontend Developer'
          },
          {
            id: '3',
            date: '2024-01-20',
            type: 'skill_added',
            title: 'Added TypeScript Skill',
            description: 'Completed TypeScript certification and updated profile',
            status: 'success'
          },
          {
            id: '4',
            date: '2024-01-22',
            type: 'offer',
            title: 'Job Offer Received',
            description: 'Received offer from StartupXYZ for Full Stack Engineer',
            status: 'success',
            company: 'StartupXYZ',
            position: 'Full Stack Engineer'
          }
        ]
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your job search performance and career growth</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{data.overview.totalApplications}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +{data.overview.applicationsThisMonth} this month
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interview Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data.overview.interviewRate}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +{data.overview.interviewsThisMonth} interviews
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data.overview.responseRate}%</p>
                <p className="text-sm text-gray-500">
                  Avg {data.overview.averageResponseTime} days
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Match Score</p>
                <p className="text-2xl font-bold text-gray-900">{data.overview.matchScore}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +5% this month
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.applications).map(([key, value]) => {
                    if (key === 'total') return null
                    const percentage = (value / data.applications.total) * 100
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{value}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Application Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Application Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.performance.applicationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="interviews" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="offers" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Gaps */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Gaps Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performance.skillGaps.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.skill}</span>
                        <span className="text-sm text-gray-500">
                          {skill.current}% / {skill.required}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Current</span>
                          <span>Required</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${skill.current}%` }}
                            />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${skill.required}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-red-600">
                          Gap: {skill.gap}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Industry Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={data.performance.industryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ industry, percentage }) => `${industry}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.performance.industryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Salary Progression */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.performance.salaryProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="average" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="median" stackId="2" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="max" stackId="3" stroke="#F59E0B" fill="#F59E0B" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.insights.aiInsights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm font-bold">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Top Skills in Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.insights.topSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant={skill.trend === 'up' ? 'default' : 'secondary'}>
                          {skill.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Demand: {skill.demand}%</div>
                        <div className="text-xs text-gray-500">Supply: {skill.supply}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.insights.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.timeline.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      event.status === 'success' ? 'bg-green-500' :
                      event.status === 'pending' ? 'bg-yellow-500' :
                      event.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      {event.company && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {event.company} • {event.position}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
