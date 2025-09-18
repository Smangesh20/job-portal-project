'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Users,
  Globe,
  Clock,
  RefreshCw,
  Zap,
  Database,
  Server
} from 'lucide-react'

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'failed_login' | 'suspicious' | 'blocked' | 'verified'
  user: string
  ip: string
  location: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

interface SecurityMetrics {
  totalEvents: number
  failedLogins: number
  blockedAttempts: number
  suspiciousActivity: number
  verifiedUsers: number
  activeSessions: number
  securityScore: number
  lastScan: Date
}

interface SecurityDashboardProps {
  className?: string
  realTime?: boolean
  refreshInterval?: number
}

export function SecurityDashboard({ 
  className, 
  realTime = true, 
  refreshInterval = 10000 
}: SecurityDashboardProps) {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    failedLogins: 0,
    blockedAttempts: 0,
    suspiciousActivity: 0,
    verifiedUsers: 0,
    activeSessions: 0,
    securityScore: 0,
    lastScan: new Date()
  })
  
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time security data
  useEffect(() => {
    if (!realTime) return

    const interval = setInterval(() => {
      // Generate random security events
      const newEvents: SecurityEvent[] = Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        id: `event_${Date.now()}_${i}`,
        type: ['login', 'logout', 'failed_login', 'suspicious', 'blocked', 'verified'][Math.floor(Math.random() * 6)] as any,
        user: `user_${Math.floor(Math.random() * 1000)}@example.com`,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin'][Math.floor(Math.random() * 5)],
        timestamp: new Date(),
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        description: 'Security event detected'
      }))

      setRecentEvents(prev => [...newEvents, ...prev].slice(0, 10))
      
      setMetrics(prev => ({
        totalEvents: prev.totalEvents + newEvents.length,
        failedLogins: prev.failedLogins + newEvents.filter(e => e.type === 'failed_login').length,
        blockedAttempts: prev.blockedAttempts + newEvents.filter(e => e.type === 'blocked').length,
        suspiciousActivity: prev.suspiciousActivity + newEvents.filter(e => e.type === 'suspicious').length,
        verifiedUsers: Math.floor(Math.random() * 1000) + 500,
        activeSessions: Math.floor(Math.random() * 200) + 100,
        securityScore: Math.min(100, prev.securityScore + Math.random() * 2),
        lastScan: new Date()
      }))
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [realTime, refreshInterval])

  const refreshSecurity = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMetrics(prev => ({ ...prev, lastScan: new Date() }))
    setIsLoading(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return CheckCircle
      case 'logout': return XCircle
      case 'failed_login': return AlertTriangle
      case 'suspicious': return AlertTriangle
      case 'blocked': return XCircle
      case 'verified': return CheckCircle
      default: return Activity
    }
  }

  const securityMetrics = [
    {
      title: 'Security Score',
      value: `${metrics.securityScore.toFixed(1)}%`,
      icon: Shield,
      color: metrics.securityScore >= 90 ? 'text-green-600' : metrics.securityScore >= 70 ? 'text-yellow-600' : 'text-red-600',
      description: 'Overall security rating'
    },
    {
      title: 'Active Sessions',
      value: metrics.activeSessions.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      description: 'Currently logged in users'
    },
    {
      title: 'Failed Logins',
      value: metrics.failedLogins.toString(),
      icon: AlertTriangle,
      color: metrics.failedLogins > 10 ? 'text-red-600' : 'text-yellow-600',
      description: 'Recent failed login attempts'
    },
    {
      title: 'Blocked Attempts',
      value: metrics.blockedAttempts.toString(),
      icon: XCircle,
      color: 'text-red-600',
      description: 'Blocked suspicious activities'
    },
    {
      title: 'Verified Users',
      value: metrics.verifiedUsers.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600',
      description: 'Email verified accounts'
    },
    {
      title: 'Total Events',
      value: metrics.totalEvents.toLocaleString(),
      icon: Activity,
      color: 'text-purple-600',
      description: 'Security events tracked'
    }
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Security Dashboard
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Real-time security monitoring and threat detection
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Live Monitoring
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshSecurity}
                disabled={isLoading}
                className="h-8 px-3"
              >
                <RefreshCw className={cn('h-3 w-3 mr-1', isLoading && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityMetrics.map((metric, index) => (
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
                    <metric.icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {metric.title}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <p className="text-xs text-gray-500">
                    {metric.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            Recent Security Events
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Latest security activities and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent security events</p>
              </div>
            ) : (
              recentEvents.map((event, index) => {
                const EventIcon = getEventIcon(event.type)
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <EventIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {event.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs', getSeverityColor(event.severity))}
                        >
                          {event.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {event.ip}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Security Status: All Systems Operational
                </p>
                <p className="text-xs text-gray-600">
                  Last scan: {metrics.lastScan.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-400" />
              <Server className="h-4 w-4 text-gray-400" />
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
