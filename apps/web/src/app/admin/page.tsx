'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { securityService, SecurityMetrics } from '@/lib/security-service'
import { errorPreventionService, ErrorMetrics } from '@/lib/error-prevention-service'
import { realtimeDataService } from '@/lib/realtime-data-service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CpuChipIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [errorMetrics, setErrorMetrics] = useState<ErrorMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (isAuthenticated && user) {
      loadMetrics()
    }
  }, [isAuthenticated, user])

  const loadMetrics = async () => {
    setIsLoading(true)
    try {
      const security = securityService.getSecurityMetrics()
      const errors = errorPreventionService.getErrorMetrics()
      
      setSecurityMetrics(security)
      setErrorMetrics(errors)
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
              <p className="mt-1 text-sm text-gray-500">
                You need admin privileges to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor system health, security, and performance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Security Events</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {securityMetrics?.totalEvents || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">System Errors</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {errorMetrics?.totalErrors || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CpuChipIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cache Hit Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {errorMetrics ? 
                      `${Math.round((errorMetrics.cacheHits / (errorMetrics.cacheHits + errorMetrics.cacheMisses)) * 100)}%` 
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GlobeAltIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Data Sources</p>
                  <p className="text-2xl font-semibold text-gray-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'security', name: 'Security', icon: ShieldCheckIcon },
                { id: 'errors', name: 'Errors', icon: ExclamationTriangleIcon },
                { id: 'performance', name: 'Performance', icon: CpuChipIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Overall system status and metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Authentication</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Data Services</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Security Monitoring</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Error Prevention</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">System started successfully</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">Cache optimized</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">Memory usage increased</p>
                        <p className="text-xs text-gray-500">10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security' && securityMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Events by Type</CardTitle>
                  <CardDescription>Distribution of security events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(securityMetrics.eventsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 capitalize">
                          {type.replace('_', ' ')}
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Events by Severity</CardTitle>
                  <CardDescription>Severity distribution of security events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(securityMetrics.eventsBySeverity).map(([severity, count]) => (
                      <div key={severity} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 capitalize">
                          {severity}
                        </span>
                        <Badge 
                          className={
                            severity === 'critical' ? 'bg-red-100 text-red-800' :
                            severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }
                        >
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Statistics</CardTitle>
                  <CardDescription>Key security metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Blocked IPs</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {securityMetrics.blockedIPs}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Suspicious Activities</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {securityMetrics.suspiciousActivities}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Brute Force Attempts</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {securityMetrics.bruteForceAttempts}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last 24 Hours</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {securityMetrics.last24Hours}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'errors' && errorMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Error Types</CardTitle>
                  <CardDescription>Distribution of error types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(errorMetrics.errorsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 capitalize">
                          {type.replace('_', ' ')}
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Severity</CardTitle>
                  <CardDescription>Severity distribution of errors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(errorMetrics.errorsBySeverity).map(([severity, count]) => (
                      <div key={severity} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 capitalize">
                          {severity}
                        </span>
                        <Badge 
                          className={
                            severity === 'critical' ? 'bg-red-100 text-red-800' :
                            severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }
                        >
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Issues</CardTitle>
                  <CardDescription>Detected performance problems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Memory Leaks</span>
                      <Badge className="bg-red-100 text-red-800">{errorMetrics.memoryLeaks}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Infinite Loops</span>
                      <Badge className="bg-orange-100 text-orange-800">{errorMetrics.infiniteLoops}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Circular References</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{errorMetrics.circularReferences}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cache Performance</CardTitle>
                  <CardDescription>Cache hit/miss statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Cache Hits</span>
                      <span className="text-lg font-semibold text-gray-900">{errorMetrics.cacheHits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Cache Misses</span>
                      <span className="text-lg font-semibold text-gray-900">{errorMetrics.cacheMisses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Hit Rate</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {Math.round((errorMetrics.cacheHits / (errorMetrics.cacheHits + errorMetrics.cacheMisses)) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Actions</CardTitle>
                  <CardDescription>Manage system components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => realtimeDataService.clearCache()}
                    className="w-full"
                    variant="outline"
                  >
                    Clear Data Cache
                  </Button>
                  <Button 
                    onClick={() => errorPreventionService.clearCache()}
                    className="w-full"
                    variant="outline"
                  >
                    Clear Error Cache
                  </Button>
                  <Button 
                    onClick={() => errorPreventionService.clearErrorLog()}
                    className="w-full"
                    variant="outline"
                  >
                    Clear Error Log
                  </Button>
                  <Button 
                    onClick={loadMetrics}
                    className="w-full"
                  >
                    Refresh Metrics
                  </Button>
                  <Button 
                    onClick={() => window.open('/admin/emails', '_blank')}
                    className="w-full"
                    variant="outline"
                  >
                    View Email Management
                  </Button>
                  <Button 
                    onClick={() => window.open('/admin/test-email', '_blank')}
                    className="w-full"
                    variant="outline"
                  >
                    Test SendGrid Integration
                  </Button>
                  <Button 
                    onClick={() => window.open('/admin/enterprise', '_blank')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    🚀 Enterprise Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Current system configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Environment</span>
                      <Badge variant="outline">{process.env.NODE_ENV || 'development'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">User Agent</span>
                      <span className="text-xs text-gray-500 truncate max-w-32">
                        {navigator.userAgent.substring(0, 30)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Platform</span>
                      <span className="text-sm text-gray-900">{navigator.platform}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Language</span>
                      <span className="text-sm text-gray-900">{navigator.language}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
