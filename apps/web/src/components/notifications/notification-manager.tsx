'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  BellOff, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  Briefcase,
  Users,
  Star,
  Zap,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface NotificationSettings {
  email: {
    enabled: boolean
    jobMatches: boolean
    applicationUpdates: boolean
    interviewReminders: boolean
    weeklyDigest: boolean
    marketing: boolean
  }
  push: {
    enabled: boolean
    jobMatches: boolean
    applicationUpdates: boolean
    interviewReminders: boolean
    messages: boolean
    urgentJobs: boolean
  }
  sms: {
    enabled: boolean
    interviewReminders: boolean
    urgentUpdates: boolean
    twoFactor: boolean
  }
  frequency: {
    digest: 'daily' | 'weekly' | 'monthly' | 'never'
    realTime: boolean
    quietHours: {
      enabled: boolean
      start: string
      end: string
    }
  }
  privacy: {
    showOnlineStatus: boolean
    allowNotifications: boolean
    dataSharing: boolean
  }
}

interface NotificationItem {
  id: string
  type: 'job_match' | 'application_update' | 'interview' | 'message' | 'system' | 'marketing'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionUrl?: string
  actionText?: string
  icon?: string
  data?: any
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'job_match',
    title: 'New Job Match Found!',
    message: 'Senior Frontend Developer at TechCorp - 95% match with your profile',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    priority: 'high',
    actionUrl: '/jobs/123',
    actionText: 'View Job',
    icon: 'briefcase'
  },
  {
    id: '2',
    type: 'application_update',
    title: 'Application Status Updated',
    message: 'Your application for Full Stack Engineer at StartupXYZ is now under review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    priority: 'medium',
    actionUrl: '/applications/456',
    actionText: 'View Application'
  },
  {
    id: '3',
    type: 'interview',
    title: 'Interview Scheduled',
    message: 'Technical interview with TechCorp scheduled for tomorrow at 2:00 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
    priority: 'high',
    actionUrl: '/interviews/789',
    actionText: 'View Details'
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message from Recruiter',
    message: 'Sarah from TechCorp sent you a message about the Senior Frontend Developer position',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    read: false,
    priority: 'medium',
    actionUrl: '/messages/101',
    actionText: 'Reply'
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Optimization Suggestion',
    message: 'Add 3 more skills to increase your match score by 15%',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: 'low',
    actionUrl: '/profile',
    actionText: 'Update Profile'
  }
]

export function NotificationManager() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      jobMatches: true,
      applicationUpdates: true,
      interviewReminders: true,
      weeklyDigest: true,
      marketing: false
    },
    push: {
      enabled: true,
      jobMatches: true,
      applicationUpdates: true,
      interviewReminders: true,
      messages: true,
      urgentJobs: true
    },
    sms: {
      enabled: false,
      interviewReminders: true,
      urgentUpdates: true,
      twoFactor: true
    },
    frequency: {
      digest: 'weekly',
      realTime: true,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    },
    privacy: {
      showOnlineStatus: true,
      allowNotifications: true,
      dataSharing: false
    }
  })
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    checkNotificationPermission()
    loadSettings()
    loadNotifications()
  }, [])

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = Notification.permission
      setPermission(permission)
      
      if (permission === 'granted') {
        await checkPushSubscription()
      }
    }
  }

  const checkPushSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error('Error checking push subscription:', error)
      }
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      
      if (permission === 'granted') {
        await subscribeToPush()
        toast.success('Notifications enabled!')
      } else {
        toast.error('Notification permission denied')
      }
    }
  }

  const subscribeToPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        })
        
        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        })
        
        setIsSubscribed(true)
        toast.success('Push notifications enabled!')
      } catch (error) {
        console.error('Error subscribing to push notifications:', error)
        toast.error('Failed to enable push notifications')
      }
    }
  }

  const unsubscribeFromPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        
        if (subscription) {
          await subscription.unsubscribe()
          
          // Notify server
          await fetch('/api/notifications/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint: subscription.endpoint })
          })
        }
        
        setIsSubscribed(false)
        toast.success('Push notifications disabled')
      } catch (error) {
        console.error('Error unsubscribing from push notifications:', error)
        toast.error('Failed to disable push notifications')
      }
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/notification-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    }
  }

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      })
      
      if (response.ok) {
        setSettings(newSettings)
        toast.success('Notification settings saved!')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving notification settings:', error)
      toast.error('Failed to save settings')
    }
  }

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PUT'
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        )
        toast.success('All notifications marked as read')
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match': return <Briefcase className="h-5 w-5 text-blue-600" />
      case 'application_update': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'interview': return <Calendar className="h-5 w-5 text-purple-600" />
      case 'message': return <MessageSquare className="h-5 w-5 text-orange-600" />
      case 'system': return <Settings className="h-5 w-5 text-gray-600" />
      case 'marketing': return <Star className="h-5 w-5 text-yellow-600" />
      default: return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Manage your notification preferences and view updates</p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`transition-all hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.actionUrl && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                                  onClick={() => window.location.href = notification.actionUrl!}
                                >
                                  {notification.actionText}
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive real-time notifications in your browser</p>
                </div>
                <div className="flex items-center space-x-2">
                  {permission === 'granted' ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={requestNotificationPermission}
                      disabled={permission === 'denied'}
                    >
                      {permission === 'denied' ? 'Permission Denied' : 'Enable'}
                    </Button>
                  )}
                </div>
              </div>

              {permission === 'granted' && (
                <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Job Matches</span>
                    <Switch
                      checked={settings.push.jobMatches}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          push: { ...settings.push, jobMatches: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Application Updates</span>
                    <Switch
                      checked={settings.push.applicationUpdates}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          push: { ...settings.push, applicationUpdates: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interview Reminders</span>
                    <Switch
                      checked={settings.push.interviewReminders}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          push: { ...settings.push, interviewReminders: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Messages</span>
                    <Switch
                      checked={settings.push.messages}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          push: { ...settings.push, messages: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Urgent Jobs</span>
                    <Switch
                      checked={settings.push.urgentJobs}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          push: { ...settings.push, urgentJobs: checked }
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) => 
                    saveSettings({
                      ...settings,
                      email: { ...settings.email, enabled: checked }
                    })
                  }
                />
              </div>

              {settings.email.enabled && (
                <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Job Matches</span>
                    <Switch
                      checked={settings.email.jobMatches}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          email: { ...settings.email, jobMatches: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Application Updates</span>
                    <Switch
                      checked={settings.email.applicationUpdates}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          email: { ...settings.email, applicationUpdates: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interview Reminders</span>
                    <Switch
                      checked={settings.email.interviewReminders}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          email: { ...settings.email, interviewReminders: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Digest</span>
                    <Switch
                      checked={settings.email.weeklyDigest}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          email: { ...settings.email, weeklyDigest: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Marketing Emails</span>
                    <Switch
                      checked={settings.email.marketing}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          email: { ...settings.email, marketing: checked }
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
                </div>
                <Switch
                  checked={settings.sms.enabled}
                  onCheckedChange={(checked) => 
                    saveSettings({
                      ...settings,
                      sms: { ...settings.sms, enabled: checked }
                    })
                  }
                />
              </div>

              {settings.sms.enabled && (
                <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interview Reminders</span>
                    <Switch
                      checked={settings.sms.interviewReminders}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          sms: { ...settings.sms, interviewReminders: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Urgent Updates</span>
                    <Switch
                      checked={settings.sms.urgentUpdates}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          sms: { ...settings.sms, urgentUpdates: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <Switch
                      checked={settings.sms.twoFactor}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          sms: { ...settings.sms, twoFactor: checked }
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Online Status</h4>
                  <p className="text-sm text-gray-500">Let others see when you're online</p>
                </div>
                <Switch
                  checked={settings.privacy.showOnlineStatus}
                  onCheckedChange={(checked) => 
                    saveSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showOnlineStatus: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications from the platform</p>
                </div>
                <Switch
                  checked={settings.privacy.allowNotifications}
                  onCheckedChange={(checked) => 
                    saveSettings({
                      ...settings,
                      privacy: { ...settings.privacy, allowNotifications: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Sharing</h4>
                  <p className="text-sm text-gray-500">Share anonymized data for platform improvement</p>
                </div>
                <Switch
                  checked={settings.privacy.dataSharing}
                  onCheckedChange={(checked) => 
                    saveSettings({
                      ...settings,
                      privacy: { ...settings.privacy, dataSharing: checked }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
