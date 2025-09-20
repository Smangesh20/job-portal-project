'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  X,
  Copy,
  ExternalLink,
  Database,
  Cloud,
  Wifi,
  WifiOff,
  Zap,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

interface SettingsData {
  account: {
    email: string
    phone: string
    firstName: string
    lastName: string
    username: string
    timezone: string
    language: string
    dateFormat: string
  }
  security: {
    twoFactorEnabled: boolean
    loginNotifications: boolean
    sessionTimeout: number
    passwordLastChanged: string
    activeSessions: number
    trustedDevices: number
  }
  notifications: {
    email: {
      jobAlerts: boolean
      messages: boolean
      updates: boolean
      marketing: boolean
    }
    push: {
      enabled: boolean
      jobMatches: boolean
      messages: boolean
      reminders: boolean
    }
    sms: {
      enabled: boolean
      security: boolean
      urgent: boolean
    }
  }
  privacy: {
    profileVisibility: 'public' | 'connections' | 'private'
    showEmail: boolean
    showPhone: boolean
    showLocation: boolean
    allowMessages: 'everyone' | 'connections' | 'none'
    dataSharing: boolean
    analytics: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'system'
    fontSize: 'small' | 'medium' | 'large'
    density: 'compact' | 'comfortable' | 'spacious'
    animations: boolean
    reducedMotion: boolean
  }
  integrations: {
    calendar: boolean
    email: boolean
    socialMedia: boolean
    crm: boolean
    analytics: boolean
  }
  data: {
    exportEnabled: boolean
    autoBackup: boolean
    retentionPeriod: number
    lastExport: string
    storageUsed: string
  }
}

export function EnterpriseSettings() {
  const [activeTab, setActiveTab] = useState('account')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [settingsData, setSettingsData] = useState<SettingsData>({
    account: {
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      timezone: 'America/Los_Angeles',
      language: 'en',
      dateFormat: 'MM/DD/YYYY'
    },
    security: {
      twoFactorEnabled: true,
      loginNotifications: true,
      sessionTimeout: 30,
      passwordLastChanged: '2024-01-15',
      activeSessions: 3,
      trustedDevices: 2
    },
    notifications: {
      email: {
        jobAlerts: true,
        messages: true,
        updates: true,
        marketing: false
      },
      push: {
        enabled: true,
        jobMatches: true,
        messages: true,
        reminders: false
      },
      sms: {
        enabled: false,
        security: true,
        urgent: true
      }
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true,
      allowMessages: 'connections',
      dataSharing: false,
      analytics: true
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
      density: 'comfortable',
      animations: true,
      reducedMotion: false
    },
    integrations: {
      calendar: true,
      email: true,
      socialMedia: false,
      crm: false,
      analytics: true
    },
    data: {
      exportEnabled: true,
      autoBackup: true,
      retentionPeriod: 365,
      lastExport: '2024-01-20',
      storageUsed: '2.3 GB'
    }
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleExportData = () => {
    // Export logic here
  }

  const handleDeleteAccount = () => {
    // Delete account logic here
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={settingsData.account.firstName}
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        account: { ...settingsData.account, firstName: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={settingsData.account.lastName}
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        account: { ...settingsData.account, lastName: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    value={settingsData.account.email}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      account: { ...settingsData.account, email: e.target.value }
                    })}
                    disabled={!isEditing}
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={settingsData.account.phone}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      account: { ...settingsData.account, phone: e.target.value }
                    })}
                    disabled={!isEditing}
                    type="tel"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={settingsData.account.username}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      account: { ...settingsData.account, username: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <select
                      value={settingsData.account.timezone}
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        account: { ...settingsData.account, timezone: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/New_York">Eastern Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Language</label>
                    <select
                      value={settingsData.account.language}
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        account: { ...settingsData.account, language: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date Format</label>
                    <select
                      value={settingsData.account.dateFormat}
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        account: { ...settingsData.account, dateFormat: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settingsData.security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSettingsData({
                      ...settingsData,
                      security: { ...settingsData.security, twoFactorEnabled: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Login Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={settingsData.security.loginNotifications}
                    onCheckedChange={(checked) => setSettingsData({
                      ...settingsData,
                      security: { ...settingsData.security, loginNotifications: checked }
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={settingsData.security.sessionTimeout}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      security: { ...settingsData.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                    min="5"
                    max="480"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-2xl font-bold text-blue-600">{settingsData.security.activeSessions}</p>
                    <p className="text-sm text-gray-500">Currently active</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">Trusted Devices</h4>
                    <p className="text-2xl font-bold text-green-600">{settingsData.security.trustedDevices}</p>
                    <p className="text-sm text-gray-500">Remembered devices</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settingsData.notifications.email).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setSettingsData({
                        ...settingsData,
                        notifications: {
                          ...settingsData.notifications,
                          email: { ...settingsData.notifications.email, [key]: checked }
                        }
                      })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications on your device</p>
                  </div>
                  <Switch
                    checked={settingsData.notifications.push.enabled}
                    onCheckedChange={(checked) => setSettingsData({
                      ...settingsData,
                      notifications: {
                        ...settingsData.notifications,
                        push: { ...settingsData.notifications.push, enabled: checked }
                      }
                    })}
                  />
                </div>
                {settingsData.notifications.push.enabled && (
                  <div className="space-y-3 ml-4">
                    {Object.entries(settingsData.notifications.push).filter(([key]) => key !== 'enabled').map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => setSettingsData({
                            ...settingsData,
                            notifications: {
                              ...settingsData.notifications,
                              push: { ...settingsData.notifications.push, [key]: checked }
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Privacy Controls
                </CardTitle>
                <CardDescription>
                  Control who can see your information and how it's used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Profile Visibility</label>
                  <select
                    value={settingsData.privacy.profileVisibility}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      privacy: { ...settingsData.privacy, profileVisibility: e.target.value as any }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>
                  {Object.entries(settingsData.privacy).filter(([key]) => key.startsWith('show')).map(([key, visible]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace('show', 'Show ')}</span>
                      <Switch
                        checked={visible}
                        onCheckedChange={(checked) => setSettingsData({
                          ...settingsData,
                          privacy: { ...settingsData.privacy, [key]: checked }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <div className="flex space-x-2 mt-2">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'system', icon: Monitor, label: 'System' }
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => setSettingsData({
                          ...settingsData,
                          appearance: { ...settingsData.appearance, theme: value as any }
                        })}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                          settingsData.appearance.theme === value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Font Size</label>
                  <select
                    value={settingsData.appearance.fontSize}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      appearance: { ...settingsData.appearance, fontSize: e.target.value as any }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Density</label>
                  <select
                    value={settingsData.appearance.density}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      appearance: { ...settingsData.appearance, density: e.target.value as any }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Animations</h3>
                      <p className="text-sm text-gray-500">Enable smooth transitions and animations</p>
                    </div>
                    <Switch
                      checked={settingsData.appearance.animations}
                      onCheckedChange={(checked) => setSettingsData({
                        ...settingsData,
                        appearance: { ...settingsData.appearance, animations: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Reduced Motion</h3>
                      <p className="text-sm text-gray-500">Minimize motion for accessibility</p>
                    </div>
                    <Switch
                      checked={settingsData.appearance.reducedMotion}
                      onCheckedChange={(checked) => setSettingsData({
                        ...settingsData,
                        appearance: { ...settingsData.appearance, reducedMotion: checked }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Settings */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Manage your data export, backup, and storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">Storage Used</h4>
                    <p className="text-2xl font-bold text-blue-600">{settingsData.data.storageUsed}</p>
                    <p className="text-sm text-gray-500">of 10 GB available</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">Last Export</h4>
                    <p className="text-2xl font-bold text-green-600">{settingsData.data.lastExport}</p>
                    <p className="text-sm text-gray-500">Data export date</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto Backup</h3>
                      <p className="text-sm text-gray-500">Automatically backup your data</p>
                    </div>
                    <Switch
                      checked={settingsData.data.autoBackup}
                      onCheckedChange={(checked) => setSettingsData({
                        ...settingsData,
                        data: { ...settingsData.data, autoBackup: checked }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data Retention Period (days)</label>
                    <Input
                      type="number"
                      value={settingsData.data.retentionPeriod}
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        data: { ...settingsData.data, retentionPeriod: parseInt(e.target.value) }
                      })}
                      min="30"
                      max="3650"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleExportData} className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-red-600">Delete Account</h3>
                    <p className="text-sm text-gray-500">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Settings'}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
