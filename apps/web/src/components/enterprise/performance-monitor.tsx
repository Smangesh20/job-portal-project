'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Activity, 
  Zap, 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Cpu,
  Database,
  Globe
} from 'lucide-react'

interface PerformanceMetrics {
  responseTime: number
  uptime: number
  errorRate: number
  throughput: number
  memoryUsage: number
  cpuUsage: number
  activeUsers: number
  requestsPerSecond: number
}

interface PerformanceMonitorProps {
  className?: string
  realTime?: boolean
  refreshInterval?: number
}

export function PerformanceMonitor({ 
  className, 
  realTime = true, 
  refreshInterval = 5000 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    uptime: 0,
    errorRate: 0,
    throughput: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    activeUsers: 0,
    requestsPerSecond: 0
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Simulate real-time performance data
  useEffect(() => {
    if (!realTime) return

    const interval = setInterval(() => {
      setMetrics(prev => ({
        responseTime: Math.random() * 200 + 50,
        uptime: 99.9 + Math.random() * 0.1,
        errorRate: Math.random() * 0.5,
        throughput: Math.random() * 1000 + 500,
        memoryUsage: Math.random() * 40 + 30,
        cpuUsage: Math.random() * 30 + 20,
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        requestsPerSecond: Math.floor(Math.random() * 100) + 50
      }))
      setLastUpdated(new Date())
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [realTime, refreshInterval])

  const refreshMetrics = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600'
    if (value <= thresholds.warning) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return CheckCircle
    if (value <= thresholds.warning) return AlertTriangle
    return AlertTriangle
  }

  const metricsData = [
    {
      title: 'Response Time',
      value: `${metrics.responseTime.toFixed(0)}ms`,
      icon: Clock,
      color: getStatusColor(metrics.responseTime, { good: 100, warning: 200 }),
      status: getStatusIcon(metrics.responseTime, { good: 100, warning: 200 }),
      progress: Math.min((metrics.responseTime / 300) * 100, 100),
      description: 'Average API response time'
    },
    {
      title: 'Uptime',
      value: `${metrics.uptime.toFixed(2)}%`,
      icon: Activity,
      color: getStatusColor(100 - metrics.uptime, { good: 0.1, warning: 1 }),
      status: getStatusIcon(100 - metrics.uptime, { good: 0.1, warning: 1 }),
      progress: metrics.uptime,
      description: 'System availability'
    },
    {
      title: 'Error Rate',
      value: `${metrics.errorRate.toFixed(2)}%`,
      icon: AlertTriangle,
      color: getStatusColor(metrics.errorRate, { good: 0.1, warning: 1 }),
      status: getStatusIcon(metrics.errorRate, { good: 0.1, warning: 1 }),
      progress: Math.min(metrics.errorRate * 100, 100),
      description: 'Failed requests percentage'
    },
    {
      title: 'Throughput',
      value: `${metrics.throughput.toFixed(0)} req/min`,
      icon: TrendingUp,
      color: 'text-blue-600',
      status: CheckCircle,
      progress: Math.min((metrics.throughput / 1500) * 100, 100),
      description: 'Requests per minute'
    },
    {
      title: 'Memory Usage',
      value: `${metrics.memoryUsage.toFixed(1)}%`,
      icon: Database,
      color: getStatusColor(metrics.memoryUsage, { good: 60, warning: 80 }),
      status: getStatusIcon(metrics.memoryUsage, { good: 60, warning: 80 }),
      progress: metrics.memoryUsage,
      description: 'System memory utilization'
    },
    {
      title: 'CPU Usage',
      value: `${metrics.cpuUsage.toFixed(1)}%`,
      icon: Cpu,
      color: getStatusColor(metrics.cpuUsage, { good: 50, warning: 80 }),
      status: getStatusIcon(metrics.cpuUsage, { good: 50, warning: 80 }),
      progress: metrics.cpuUsage,
      description: 'Processor utilization'
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      icon: Globe,
      color: 'text-green-600',
      status: CheckCircle,
      progress: Math.min((metrics.activeUsers / 2000) * 100, 100),
      description: 'Currently online users'
    },
    {
      title: 'Requests/sec',
      value: metrics.requestsPerSecond.toString(),
      icon: Zap,
      color: 'text-purple-600',
      status: CheckCircle,
      progress: Math.min((metrics.requestsPerSecond / 200) * 100, 100),
      description: 'Current request rate'
    }
  ]

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Performance Monitor
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Real-time system performance metrics
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshMetrics}
              disabled={isLoading}
              className="h-8 px-3"
            >
              <RefreshCw className={cn('h-3 w-3 mr-1', isLoading && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsData.map((metric, index) => {
            const StatusIcon = metric.status
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gray-50/50 rounded-lg border border-gray-200/50 hover:border-gray-300/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <metric.icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {metric.title}
                    </span>
                  </div>
                  <StatusIcon className={cn('h-4 w-4', metric.color)} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className={cn('text-2xl font-bold', metric.color)}>
                      {metric.value}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                    <Progress 
                      value={metric.progress} 
                      className="h-2"
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    {metric.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">All systems operational</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
