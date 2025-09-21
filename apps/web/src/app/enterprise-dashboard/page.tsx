/**
 * Enterprise Dashboard
 * Google-style comprehensive enterprise dashboard with real-time data
 */

'use client'

import { useEnterprise } from '@/hooks/useEnterpriseHooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  HardDrive,
  Monitor,
  Network,
  Server,
  Shield,
  Zap,
  BarChart3,
  Users,
  Settings,
  TestTube
} from 'lucide-react';

export default function EnterpriseDashboard() {
  const { realtime, performance, cache, monitoring, testing, api } = useEnterprise();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enterprise Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Real-time monitoring and management for AskYaCham
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                className={realtime.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              >
                {realtime.isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Badge variant="outline">
                {monitoring.healthStatus.overall.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* System Health */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {monitoring.healthStatus.overall === 'healthy' ? '100' : 
                     monitoring.healthStatus.overall === 'degraded' ? '75' : '25'}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {monitoring.healthStatus.overall} status
                  </p>
                  <Progress 
                    value={monitoring.healthStatus.overall === 'healthy' ? 100 : 
                           monitoring.healthStatus.overall === 'degraded' ? 75 : 25} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              {/* Real-time Connections */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Real-time</CardTitle>
                  <Network className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {realtime.connectionStatus.subscriptionCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active subscriptions
                  </p>
                </CardContent>
              </Card>

              {/* Performance Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {performance.summary['api-response-time']?.average?.toFixed(0) || 0}ms
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avg response time
                  </p>
                </CardContent>
              </Card>

              {/* Cache Hit Rate */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cache</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(cache.stats.hitRate * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hit rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Health Checks */}
            <Card>
              <CardHeader>
                <CardTitle>Health Checks</CardTitle>
                <CardDescription>
                  Current status of all system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoring.healthStatus.checks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {check.status === 'healthy' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : check.status === 'degraded' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">{check.name}</span>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={
                            check.status === 'healthy' ? 'bg-green-100 text-green-800' :
                            check.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {check.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">{check.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Real-time performance monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(performance.summary).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{key}</span>
                        <span className="text-sm text-gray-500">
                          {typeof value === 'number' ? value.toFixed(2) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Metrics</CardTitle>
                  <CardDescription>
                    Latest performance data points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {performance.metrics.slice(0, 10).map((metric, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{metric.name}</span>
                        <span className="text-gray-500">
                          {metric.value} {metric.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Current system monitoring status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Monitoring Active</span>
                      <Badge className={monitoring.monitoringStatus.isMonitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {monitoring.monitoringStatus.isMonitoring ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span>{Math.floor(monitoring.monitoringStatus.uptime / 3600)}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Checks</span>
                      <span>{monitoring.monitoringStatus.checksCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Alerts</span>
                      <span>{monitoring.monitoringStatus.alertsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>
                    Current system alerts and warnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {monitoring.healthStatus.alerts.length > 0 ? (
                      monitoring.healthStatus.alerts.map((alert, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge 
                            className={
                              alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                              alert.type === 'error' ? 'bg-red-100 text-red-800' :
                              alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }
                          >
                            {alert.type}
                          </Badge>
                          <span className="text-sm">{alert.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No active alerts</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cache Tab */}
          <TabsContent value="cache" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cache Statistics</CardTitle>
                  <CardDescription>
                    Current cache performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Hit Rate</span>
                      <span>{(cache.stats.hitRate * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Entries</span>
                      <span>{cache.stats.entries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage</span>
                      <span>{(cache.stats.memoryUsage / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tags</span>
                      <span>{cache.stats.tags}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cache Actions</CardTitle>
                  <CardDescription>
                    Manage cache operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => cache.clear()} 
                      variant="outline" 
                      className="w-full"
                    >
                      Clear All Cache
                    </Button>
                    <Button 
                      onClick={() => cache.invalidate('api')} 
                      variant="outline" 
                      className="w-full"
                    >
                      Invalidate API Cache
                    </Button>
                    <Button 
                      onClick={() => cache.invalidateTags(['jobs', 'users'])} 
                      variant="outline" 
                      className="w-full"
                    >
                      Invalidate by Tags
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Statistics</CardTitle>
                  <CardDescription>
                    Current testing framework status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Suites</span>
                      <span>{testing.statistics.totalSuites}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tests</span>
                      <span>{testing.statistics.totalTests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passed</span>
                      <span className="text-green-600">{testing.statistics.passedTests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Failed</span>
                      <span className="text-red-600">{testing.statistics.failedTests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coverage</span>
                      <span>{testing.statistics.averageCoverage.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Actions</CardTitle>
                  <CardDescription>
                    Run and manage tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => testing.runAllTests()} 
                      className="w-full"
                    >
                      Run All Tests
                    </Button>
                    <Button 
                      onClick={() => testing.createTestSuite('Manual Test', 'Manual test suite')} 
                      variant="outline" 
                      className="w-full"
                    >
                      Create Test Suite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Statistics</CardTitle>
                  <CardDescription>
                    Current API performance and usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Connection Status</span>
                      <Badge className={api.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {api.isConnected ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Requests</span>
                      <span>{api.statistics.totalRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache Hit Rate</span>
                      <span>{(api.statistics.cacheHitRate * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Response Time</span>
                      <span>{api.statistics.averageResponseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span>{(api.statistics.errorRate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Actions</CardTitle>
                  <CardDescription>
                    Test and manage API endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => api.client.healthCheck()} 
                      className="w-full"
                    >
                      Health Check
                    </Button>
                    <Button 
                      onClick={() => api.client.getJobs()} 
                      variant="outline" 
                      className="w-full"
                    >
                      Test Jobs API
                    </Button>
                    <Button 
                      onClick={() => api.client.getUsers()} 
                      variant="outline" 
                      className="w-full"
                    >
                      Test Users API
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
