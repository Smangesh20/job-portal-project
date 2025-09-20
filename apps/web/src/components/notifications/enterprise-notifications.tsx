'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, 
  Check, 
  X, 
  MoreVertical, 
  Filter, 
  Search, 
  Settings, 
  CheckCircle2, 
  Circle, 
  Archive, 
  Trash2, 
  Star, 
  StarOff,
  ExternalLink,
  Clock,
  User,
  Briefcase,
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Globe,
  Shield,
  Award,
  Target,
  Users,
  Building,
  FileText,
  Download,
  Eye,
  EyeOff
} from 'lucide-react'

interface Notification {
  id: string
  type: 'job_match' | 'message' | 'application' | 'interview' | 'offer' | 'reminder' | 'system' | 'security' | 'achievement' | 'recommendation'
  title: string
  message: string
  timestamp: string
  read: boolean
  starred: boolean
  archived: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  actionUrl?: string
  metadata?: {
    company?: string
    jobTitle?: string
    sender?: string
    amount?: string
    deadline?: string
    location?: string
  }
}

interface NotificationSettings {
  email: {
    jobMatches: boolean
    messages: boolean
    applications: boolean
    interviews: boolean
    offers: boolean
    reminders: boolean
    system: boolean
    security: boolean
  }
  push: {
    enabled: boolean
    jobMatches: boolean
    messages: boolean
    applications: boolean
    interviews: boolean
    offers: boolean
    reminders: boolean
  }
  sms: {
    enabled: boolean
    urgent: boolean
    security: boolean
  }
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export function EnterpriseNotifications() {
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      jobMatches: true,
      messages: true,
      applications: true,
      interviews: true,
      offers: true,
      reminders: true,
      system: false,
      security: true
    },
    push: {
      enabled: true,
      jobMatches: true,
      messages: true,
      applications: true,
      interviews: true,
      offers: true,
      reminders: false
    },
    sms: {
      enabled: false,
      urgent: true,
      security: true
    },
    frequency: 'instant',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  })
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        type: 'job_match',
        title: 'New Job Match Found',
        message: 'Senior Software Engineer at Tech Corp matches your profile',
        timestamp: '2 minutes ago',
        read: false,
        starred: false,
        archived: false,
        priority: 'high',
        category: 'Job Matches',
        actionUrl: '/jobs/123',
        metadata: {
          company: 'Tech Corp',
          jobTitle: 'Senior Software Engineer',
          location: 'San Francisco, CA'
        }
      },
      {
        id: '2',
        type: 'interview',
        title: 'Interview Scheduled',
        message: 'Your interview with Google is scheduled for tomorrow at 2:00 PM',
        timestamp: '1 hour ago',
        read: false,
        starred: true,
        archived: false,
        priority: 'urgent',
        category: 'Interviews',
        actionUrl: '/interviews/456',
        metadata: {
          company: 'Google',
          deadline: 'Tomorrow at 2:00 PM',
          location: 'Mountain View, CA'
        }
      },
      {
        id: '3',
        type: 'message',
        title: 'New Message',
        message: 'Sarah Johnson sent you a message about the project',
        timestamp: '3 hours ago',
        read: true,
        starred: false,
        archived: false,
        priority: 'medium',
        category: 'Messages',
        actionUrl: '/messages/789',
        metadata: {
          sender: 'Sarah Johnson'
        }
      },
      {
        id: '4',
        type: 'offer',
        title: 'Job Offer Received',
        message: 'Congratulations! You received an offer from Microsoft',
        timestamp: '1 day ago',
        read: true,
        starred: true,
        archived: false,
        priority: 'high',
        category: 'Offers',
        actionUrl: '/offers/101',
        metadata: {
          company: 'Microsoft',
          amount: '$120,000 - $150,000'
        }
      },
      {
        id: '5',
        type: 'security',
        title: 'Security Alert',
        message: 'New login detected from a new device',
        timestamp: '2 days ago',
        read: true,
        starred: false,
        archived: false,
        priority: 'urgent',
        category: 'Security',
        actionUrl: '/security'
      },
      {
        id: '6',
        type: 'achievement',
        title: 'Achievement Unlocked',
        message: 'You completed your profile and earned the "Profile Complete" badge',
        timestamp: '3 days ago',
        read: true,
        starred: false,
        archived: false,
        priority: 'low',
        category: 'Achievements',
        actionUrl: '/profile/achievements'
      }
    ])
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match': return <Briefcase className="h-5 w-5" />
      case 'message': return <MessageSquare className="h-5 w-5" />
      case 'application': return <FileText className="h-5 w-5" />
      case 'interview': return <Calendar className="h-5 w-5" />
      case 'offer': return <Award className="h-5 w-5" />
      case 'reminder': return <Clock className="h-5 w-5" />
      case 'system': return <Settings className="h-5 w-5" />
      case 'security': return <Shield className="h-5 w-5" />
      case 'achievement': return <Star className="h-5 w-5" />
      case 'recommendation': return <Users className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-blue-600 bg-blue-100'
      case 'low': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !notification.read) ||
      (activeTab === 'starred' && notification.starred) ||
      (activeTab === 'archived' && notification.archived) ||
      notification.category.toLowerCase() === activeTab

    const matchesFilter = filter === 'all' || notification.type === filter
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const starredCount = notifications.filter(n => n.starred).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: false } : n
    ))
  }

  const toggleStar = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ))
  }

  const archive = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, archived: true } : n
    ))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Stay updated with your job search and professional activities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                </div>
                <EyeOff className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Starred</p>
                  <p className="text-2xl font-bold text-yellow-600">{starredCount}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-green-600">
                    {notifications.filter(n => 
                      new Date(n.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                    ).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="starred">Starred ({starredCount})</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="job_match">Job Matches</option>
                <option value="message">Messages</option>
                <option value="interview">Interviews</option>
                <option value="offer">Offers</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <TabsContent value={activeTab} className="space-y-4">
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`${!notification.read ? 'border-blue-500 bg-blue-50' : ''} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                                  {notification.title}
                                </h3>
                                {notification.starred && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {notification.category}
                                </Badge>
                              </div>
                              <p className={`text-sm ${!notification.read ? 'text-blue-700' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                              {notification.metadata && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {notification.metadata.company && (
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {notification.metadata.company}
                                    </span>
                                  )}
                                  {notification.metadata.jobTitle && (
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {notification.metadata.jobTitle}
                                    </span>
                                  )}
                                  {notification.metadata.amount && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                      {notification.metadata.amount}
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500">{notification.timestamp}</span>
                                {notification.actionUrl && (
                                  <a
                                    href={notification.actionUrl}
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    View Details
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!notification.read ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsUnread(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Circle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleStar(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                {notification.starred ? (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                ) : (
                                  <StarOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => archive(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">
                    {activeTab === 'unread' ? 'You have no unread notifications' :
                     activeTab === 'starred' ? 'You have no starred notifications' :
                     activeTab === 'archived' ? 'You have no archived notifications' :
                     'You have no notifications'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Customize how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries(settings.email).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            email: { ...settings.email, [key]: checked }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications on your device</p>
                      </div>
                      <Switch
                        checked={settings.push.enabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          push: { ...settings.push, enabled: checked }
                        })}
                      />
                    </div>
                    {settings.push.enabled && (
                      <div className="space-y-3 ml-4">
                        {Object.entries(settings.push).filter(([key]) => key !== 'enabled').map(([key, enabled]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => setSettings({
                                ...settings,
                                push: { ...settings.push, [key]: checked }
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div>
                  <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive urgent notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.sms.enabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          sms: { ...settings.sms, enabled: checked }
                        })}
                      />
                    </div>
                    {settings.sms.enabled && (
                      <div className="space-y-3 ml-4">
                        {Object.entries(settings.sms).filter(([key]) => key !== 'enabled').map(([key, enabled]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => setSettings({
                                ...settings,
                                sms: { ...settings.sms, [key]: checked }
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Frequency and Quiet Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Notification Frequency</label>
                    <select
                      value={settings.frequency}
                      onChange={(e) => setSettings({
                        ...settings,
                        frequency: e.target.value as any
                      })}
                      className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                    >
                      <option value="instant">Instant</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Quiet Hours</label>
                      <Switch
                        checked={settings.quietHours.enabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          quietHours: { ...settings.quietHours, enabled: checked }
                        })}
                      />
                    </div>
                    {settings.quietHours.enabled && (
                      <div className="flex space-x-2">
                        <input
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) => setSettings({
                            ...settings,
                            quietHours: { ...settings.quietHours, start: e.target.value }
                          })}
                          className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                        <span className="flex items-center">to</span>
                        <input
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) => setSettings({
                            ...settings,
                            quietHours: { ...settings.quietHours, end: e.target.value }
                          })}
                          className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
