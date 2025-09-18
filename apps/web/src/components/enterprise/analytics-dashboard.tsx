'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Eye,
  MousePointer,
  Clock,
  Star,
  Target,
  Zap,
  Globe,
  Calendar,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react'

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  jobPostings: number
  applications: number
  matches: number
  conversionRate: number
  avgResponseTime: number
  userSatisfaction: number
  revenue: number
  growthRate: number
}

interface ChartData {
  label: string
  value: number
  change: number
  color: string
}

interface AnalyticsDashboardProps {
  className?: string
  realTime?: boolean
  refreshInterval?: number
}

export function AnalyticsDashboard({ 
  className, 
  realTime = true, 
  refreshInterval = 15000 
}: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    jobPostings: 0,
    applications: 0,
    matches: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    userSatisfaction: 0,
    revenue: 0,
    growthRate: 0
  })
  
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Simulate real-time analytics data
  useEffect(() => {
    if (!realTime) return

    const interval = setInterval(() => {
      setData(prev => ({
        totalUsers: Math.floor(Math.random() * 50000) + 10000,
        activeUsers: Math.floor(Math.random() * 5000) + 1000,
        jobPostings: Math.floor(Math.random() * 2000) + 500,
        applications: Math.floor(Math.random() * 10000) + 2000,
        matches: Math.floor(Math.random() * 2000) + 500,
        conversionRate: Math.random() * 20 + 10,
        avgResponseTime: Math.random() * 24 + 2,
        userSatisfaction: Math.random() * 2 + 3,
        revenue: Math.random() * 100000 + 50000,
        growthRate: Math.random() * 20 - 5
      }))

      // Generate chart data
      const newChartData: ChartData[] = [
        { label: 'Users', value: Math.floor(Math.random() * 1000) + 500, change: Math.random() * 20 - 10, color: 'bg-blue-500' },
        { label: 'Jobs', value: Math.floor(Math.random() * 200) + 100, change: Math.random() * 30 - 15, color: 'bg-green-500' },
        { label: 'Matches', value: Math.floor(Math.random() * 150) + 50, change: Math.random() * 25 - 12, color: 'bg-purple-500' },
        { label: 'Revenue', value: Math.floor(Math.random() * 50000) + 10000, change: Math.random() * 40 - 20, color: 'bg-yellow-500' }
      ]
      setChartData(newChartData)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [realTime, refreshInterval])

  const refreshAnalytics = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const exportData = () => {
    // Simulate data export
    const csvContent = `Metric,Value,Change
Total Users,${data.totalUsers.toLocaleString()},${data.growthRate.toFixed(1)}%
Active Users,${data.activeUsers.toLocaleString()},${(Math.random() * 20 - 10).toFixed(1)}%
Job Postings,${data.jobPostings.toLocaleString()},${(Math.random() * 30 - 15).toFixed(1)}%
Applications,${data.applications.toLocaleString()},${(Math.random() * 25 - 12).toFixed(1)}%
Matches,${data.matches.toLocaleString()},${(Math.random() * 35 - 17).toFixed(1)}%
Conversion Rate,${data.conversionRate.toFixed(1)}%,${(Math.random() * 10 - 5).toFixed(1)}%
Avg Response Time,${data.avgResponseTime.toFixed(1)}h,${(Math.random() * 20 - 10).toFixed(1)}%
User Satisfaction,${data.userSatisfaction.toFixed(1)}/5,${(Math.random() * 0.5 - 0.25).toFixed(2)}
Revenue,$${data.revenue.toLocaleString()},${data.growthRate.toFixed(1)}%`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const metrics = [
    {
      title: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      change: data.growthRate,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Users',
      value: data.activeUsers.toLocaleString(),
      change: Math.random() * 20 - 10,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Job Postings',
      value: data.jobPostings.toLocaleString(),
      change: Math.random() * 30 - 15,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Applications',
      value: data.applications.toLocaleString(),
      change: Math.random() * 25 - 12,
      icon: MousePointer,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Matches',
      value: data.matches.toLocaleString(),
      change: Math.random() * 35 - 17,
      icon: Target,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Conversion Rate',
      value: `${data.conversionRate.toFixed(1)}%`,
      change: Math.random() * 10 - 5,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Avg Response Time',
      value: `${data.avgResponseTime.toFixed(1)}h`,
      change: Math.random() * 20 - 10,
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'User Satisfaction',
      value: `${data.userSatisfaction.toFixed(1)}/5`,
      change: Math.random() * 0.5 - 0.25,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Analytics Dashboard
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Comprehensive insights and performance metrics
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAnalytics}
                disabled={isLoading}
                className="h-8 px-3"
              >
                <RefreshCw className={cn('h-3 w-3 mr-1', isLoading && 'animate-spin')} />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className="h-8 px-3"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('p-2 rounded-lg', metric.bgColor)}>
                      <metric.icon className={cn('h-4 w-4', metric.color)} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {metric.title}
                    </span>
                  </div>
                  
                  <div className={cn(
                    'flex items-center gap-1 text-xs font-medium',
                    metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {metric.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(metric.change).toFixed(1)}%
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                
                <div className="text-xs text-gray-500">
                  vs previous period
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            Performance Trends
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Key metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-3 w-3 rounded-full', item.color)} />
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {item.value.toLocaleString()}
                    </span>
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      item.change >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {item.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(item.change).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>0</span>
                    <span>{Math.max(...chartData.map(d => d.value)).toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(item.value / Math.max(...chartData.map(d => d.value))) * 100} 
                    className="h-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue</h3>
              <p className="text-3xl font-bold text-green-600">
                ${data.revenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {data.growthRate >= 0 ? '+' : ''}{data.growthRate.toFixed(1)}% from last period
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <span>Global Revenue</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
