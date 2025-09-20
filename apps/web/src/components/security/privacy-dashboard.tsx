'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  Key, 
  User, 
  Globe, 
  Database, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  FileText, 
  Clock, 
  Users, 
  Activity, 
  BarChart3, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Share2, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp,
  Fingerprint,
  ShieldCheck,
  AlertCircle,
  XCircle,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PrivacySettings {
  dataCollection: {
    profileData: boolean
    jobSearchHistory: boolean
    applicationData: boolean
    analyticsData: boolean
    marketingData: boolean
    locationData: boolean
    deviceData: boolean
  }
  dataSharing: {
    withEmployers: boolean
    withPartners: boolean
    forResearch: boolean
    forMarketing: boolean
    anonymizedData: boolean
  }
  visibility: {
    profileVisibility: 'public' | 'private' | 'connections'
    showOnlineStatus: boolean
    showLastActive: boolean
    showContactInfo: boolean
    showSalaryExpectations: boolean
  }
  security: {
    twoFactorAuth: boolean
    loginAlerts: boolean
    sessionTimeout: number
    passwordExpiry: number
    deviceManagement: boolean
  }
  communications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    partnerCommunications: boolean
  }
  dataRetention: {
    profileDataRetention: number
    applicationDataRetention: number
    searchHistoryRetention: number
    analyticsDataRetention: number
  }
}

interface DataActivity {
  id: string
  type: 'login' | 'profile_update' | 'application' | 'search' | 'data_export' | 'data_deletion'
  description: string
  timestamp: Date
  ipAddress: string
  location: string
  device: string
  status: 'success' | 'failed' | 'pending'
}

interface DataRequest {
  id: string
  type: 'access' | 'portability' | 'deletion' | 'correction'
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  submittedAt: Date
  completedAt?: Date
  estimatedCompletion: Date
}

const mockDataActivities: DataActivity[] = [
  {
    id: '1',
    type: 'login',
    description: 'Successful login from Chrome on Windows',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    device: 'Chrome on Windows 10',
    status: 'success'
  },
  {
    id: '2',
    type: 'profile_update',
    description: 'Updated skills and experience',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    device: 'Chrome on Windows 10',
    status: 'success'
  },
  {
    id: '3',
    type: 'application',
    description: 'Applied to Senior Frontend Developer at TechCorp',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    device: 'Chrome on Windows 10',
    status: 'success'
  },
  {
    id: '4',
    type: 'data_export',
    description: 'Requested data export',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    device: 'Chrome on Windows 10',
    status: 'completed'
  }
]

const mockDataRequests: DataRequest[] = [
  {
    id: '1',
    type: 'access',
    description: 'Request for personal data access',
    status: 'completed',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    estimatedCompletion: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: '2',
    type: 'portability',
    description: 'Request for data portability',
    status: 'in_progress',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    estimatedCompletion: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6) // 6 days from now
  }
]

export function PrivacyDashboard() {
  const [settings, setSettings] = useState<PrivacySettings>({
    dataCollection: {
      profileData: true,
      jobSearchHistory: true,
      applicationData: true,
      analyticsData: true,
      marketingData: false,
      locationData: true,
      deviceData: true
    },
    dataSharing: {
      withEmployers: true,
      withPartners: false,
      forResearch: false,
      forMarketing: false,
      anonymizedData: true
    },
    visibility: {
      profileVisibility: 'connections',
      showOnlineStatus: true,
      showLastActive: true,
      showContactInfo: false,
      showSalaryExpectations: false
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      deviceManagement: true
    },
    communications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      partnerCommunications: false
    },
    dataRetention: {
      profileDataRetention: 365,
      applicationDataRetention: 730,
      searchHistoryRetention: 90,
      analyticsDataRetention: 365
    }
  })

  const [dataActivities, setDataActivities] = useState<DataActivity[]>(mockDataActivities)
  const [dataRequests, setDataRequests] = useState<DataRequest[]>(mockDataRequests)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const saveSettings = async (newSettings: PrivacySettings) => {
    try {
      const response = await fetch('/api/user/privacy-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      })
      
      if (response.ok) {
        setSettings(newSettings)
        // Show success message
      } else {
        // Show error message
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error)
    }
  }

  const requestDataAccess = async () => {
    try {
      const response = await fetch('/api/user/data-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'access',
          description: 'Request for personal data access'
        })
      })
      
      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Error requesting data access:', error)
    }
  }

  const requestDataDeletion = async () => {
    try {
      const response = await fetch('/api/user/data-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'deletion',
          description: 'Request for account and data deletion'
        })
      })
      
      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Error requesting data deletion:', error)
    }
  }

  const downloadData = async () => {
    try {
      const response = await fetch('/api/user/data-export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'askyacham-data-export.zip'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading data:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress': return <RefreshCw className="h-4 w-4 text-blue-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
          <p className="text-gray-600">Manage your data privacy, security settings, and data rights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={downloadData}>
            <Download className="h-4 w-4 mr-2" />
            Download Data
          </Button>
          <Button variant="outline" onClick={requestDataAccess}>
            <FileText className="h-4 w-4 mr-2" />
            Request Data
          </Button>
        </div>
      </div>

      {/* Privacy Score */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Privacy Score: 85/100</h3>
              <p className="text-green-700">Your privacy settings are well configured</p>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-8 w-8 text-green-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">85</div>
                <div className="text-sm text-green-600">Good</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="data-collection" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="data-collection">Data Collection</TabsTrigger>
          <TabsTrigger value="data-sharing">Data Sharing</TabsTrigger>
          <TabsTrigger value="visibility">Visibility</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="data-collection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Collection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Profile Data</h4>
                    <p className="text-sm text-gray-500">Collect your profile information for job matching</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection.profileData}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataCollection: { ...settings.dataCollection, profileData: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Job Search History</h4>
                    <p className="text-sm text-gray-500">Track your job searches to improve recommendations</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection.jobSearchHistory}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataCollection: { ...settings.dataCollection, jobSearchHistory: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Application Data</h4>
                    <p className="text-sm text-gray-500">Store your job applications and interview history</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection.applicationData}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataCollection: { ...settings.dataCollection, applicationData: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytics Data</h4>
                    <p className="text-sm text-gray-500">Collect usage analytics to improve the platform</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection.analyticsData}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataCollection: { ...settings.dataCollection, analyticsData: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Data</h4>
                    <p className="text-sm text-gray-500">Collect data for marketing and promotional purposes</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection.marketingData}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataCollection: { ...settings.dataCollection, marketingData: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Location Data</h4>
                    <p className="text-sm text-gray-500">Collect location data for job recommendations</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection.locationData}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataCollection: { ...settings.dataCollection, locationData: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Device Data</h4>
                    <p className="text-sm text-gray-500">Collect device information for security and optimization</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection.deviceData}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataCollection: { ...settings.dataCollection, deviceData: checked }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-sharing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Data Sharing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Share with Employers</h4>
                    <p className="text-sm text-gray-500">Allow employers to see your profile and application data</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing.withEmployers}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataSharing: { ...settings.dataSharing, withEmployers: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Share with Partners</h4>
                    <p className="text-sm text-gray-500">Share data with trusted third-party partners</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing.withPartners}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataSharing: { ...settings.dataSharing, withPartners: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Research Purposes</h4>
                    <p className="text-sm text-gray-500">Allow anonymized data to be used for research</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing.forResearch}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataSharing: { ...settings.dataSharing, forResearch: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Purposes</h4>
                    <p className="text-sm text-gray-500">Allow data to be used for marketing campaigns</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing.forMarketing}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataSharing: { ...settings.dataSharing, forMarketing: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Anonymized Data Sharing</h4>
                    <p className="text-sm text-gray-500">Share anonymized and aggregated data for platform improvement</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing.anonymizedData}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        dataSharing: { ...settings.dataSharing, anonymizedData: checked }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Profile Visibility Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Profile Visibility</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="public"
                        checked={settings.visibility.profileVisibility === 'public'}
                        onChange={(e) => 
                          saveSettings({
                            ...settings,
                            visibility: { ...settings.visibility, profileVisibility: e.target.value as any }
                          })
                        }
                      />
                      <span className="text-sm">Public - Visible to everyone</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="connections"
                        checked={settings.visibility.profileVisibility === 'connections'}
                        onChange={(e) => 
                          saveSettings({
                            ...settings,
                            visibility: { ...settings.visibility, profileVisibility: e.target.value as any }
                          })
                        }
                      />
                      <span className="text-sm">Connections - Visible to your network</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="private"
                        checked={settings.visibility.profileVisibility === 'private'}
                        onChange={(e) => 
                          saveSettings({
                            ...settings,
                            visibility: { ...settings.visibility, profileVisibility: e.target.value as any }
                          })
                        }
                      />
                      <span className="text-sm">Private - Only visible to you</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Online Status</h4>
                      <p className="text-sm text-gray-500">Let others see when you're online</p>
                    </div>
                    <Switch
                      checked={settings.visibility.showOnlineStatus}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          visibility: { ...settings.visibility, showOnlineStatus: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Last Active</h4>
                      <p className="text-sm text-gray-500">Show when you were last active</p>
                    </div>
                    <Switch
                      checked={settings.visibility.showLastActive}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          visibility: { ...settings.visibility, showLastActive: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Contact Information</h4>
                      <p className="text-sm text-gray-500">Display your contact details on your profile</p>
                    </div>
                    <Switch
                      checked={settings.visibility.showContactInfo}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          visibility: { ...settings.visibility, showContactInfo: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Salary Expectations</h4>
                      <p className="text-sm text-gray-500">Display your salary expectations to employers</p>
                    </div>
                    <Switch
                      checked={settings.visibility.showSalaryExpectations}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          visibility: { ...settings.visibility, showSalaryExpectations: checked }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        saveSettings({
                          ...settings,
                          security: { ...settings.security, twoFactorAuth: checked }
                        })
                      }
                    />
                    {!settings.security.twoFactorAuth && (
                      <Button size="sm" variant="outline">
                        Setup
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Login Alerts</h4>
                    <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        security: { ...settings.security, loginAlerts: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Device Management</h4>
                    <p className="text-sm text-gray-500">Manage devices that can access your account</p>
                  </div>
                  <Switch
                    checked={settings.security.deviceManagement}
                    onCheckedChange={(checked) => 
                      saveSettings({
                        ...settings,
                        security: { ...settings.security, deviceManagement: checked }
                      })
                    }
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Session Timeout</h4>
                  <p className="text-sm text-gray-500 mb-2">Automatically log out after inactivity</p>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => 
                      saveSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Password Expiry</h4>
                  <p className="text-sm text-gray-500 mb-2">Require password change after specified days</p>
                  <select
                    value={settings.security.passwordExpiry}
                    onChange={(e) => 
                      saveSettings({
                        ...settings,
                        security: { ...settings.security, passwordExpiry: parseInt(e.target.value) }
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>6 months</option>
                    <option value={365}>1 year</option>
                    <option value={0}>Never</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Data Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>{formatTimestamp(activity.timestamp)}</span>
                          <span>{activity.location}</span>
                          <span>{activity.device}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Data Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataRequests.map((request) => (
                    <div key={request.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(request.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{request.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>Submitted: {formatTimestamp(request.submittedAt)}</span>
                          {request.completedAt && (
                            <span>Completed: {formatTimestamp(request.completedAt)}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Your Data Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Right to Access</h4>
                  <p className="text-sm text-gray-600 mb-3">Request a copy of all personal data we hold about you</p>
                  <Button size="sm" onClick={requestDataAccess}>
                    Request Access
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Right to Portability</h4>
                  <p className="text-sm text-gray-600 mb-3">Export your data in a machine-readable format</p>
                  <Button size="sm" variant="outline" onClick={downloadData}>
                    Download Data
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Right to Correction</h4>
                  <p className="text-sm text-gray-600 mb-3">Request correction of inaccurate personal data</p>
                  <Button size="sm" variant="outline">
                    Request Correction
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Right to Deletion</h4>
                  <p className="text-sm text-gray-600 mb-3">Request deletion of your personal data</p>
                  <Button size="sm" variant="destructive" onClick={requestDataDeletion}>
                    Request Deletion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
