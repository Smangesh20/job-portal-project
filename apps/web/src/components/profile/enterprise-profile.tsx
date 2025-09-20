'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Users,
  Building,
  Clock
} from 'lucide-react'

interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  bio: string
  avatar: string
  title: string
  company: string
  experienceYears: number
  skills: string[]
  education: Education[]
  workExperience: WorkExperience[]
  achievements: Achievement[]
  socialLinks: SocialLink[]
  preferences: UserPreferences
  verification: VerificationStatus
  lastActive: string
  profileViews: number
  connections: number
  recommendations: number
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

interface WorkExperience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  issuer: string
  type: 'certification' | 'award' | 'publication' | 'project'
}

interface SocialLink {
  id: string
  platform: string
  url: string
  verified: boolean
}

interface UserPreferences {
  privacy: 'public' | 'connections' | 'private'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  jobAlerts: boolean
  profileVisibility: 'public' | 'connections' | 'private'
}

interface VerificationStatus {
  email: boolean
  phone: boolean
  identity: boolean
  professional: boolean
  premium: boolean
}

export function EnterpriseProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Senior Software Engineer with 8+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading technical teams.',
    avatar: '',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    experienceYears: 8,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Python', 'PostgreSQL'],
    education: [
      {
        id: '1',
        institution: 'Stanford University',
        degree: 'Master of Science',
        field: 'Computer Science',
        startDate: '2015-09',
        endDate: '2017-06',
        gpa: '3.8',
        description: 'Specialized in Machine Learning and Artificial Intelligence'
      }
    ],
    workExperience: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2020-03',
        endDate: '',
        current: true,
        description: 'Leading development of microservices architecture and mentoring junior developers',
        achievements: [
          'Increased system performance by 40%',
          'Led team of 5 developers',
          'Implemented CI/CD pipeline'
        ]
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'AWS Solutions Architect',
        description: 'Certified in designing distributed systems on AWS',
        date: '2023-06',
        issuer: 'Amazon Web Services',
        type: 'certification'
      }
    ],
    socialLinks: [
      {
        id: '1',
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/johndoe',
        verified: true
      }
    ],
    preferences: {
      privacy: 'public',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      jobAlerts: true,
      profileVisibility: 'public'
    },
    verification: {
      email: true,
      phone: true,
      identity: false,
      professional: true,
      premium: true
    },
    lastActive: '2 hours ago',
    profileViews: 1247,
    connections: 342,
    recommendations: 12
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset logic here
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Profile Header */}
        <Card className="mb-4 sm:mb-8">
          <CardContent className="p-4 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="relative">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg sm:text-xl lg:text-2xl">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      onClick={() => {/* Handle avatar upload */}}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                      {profileData.name}
                    </h1>
                    {profileData.verification.premium && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 w-fit">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-1 truncate">
                    {profileData.title} at {profileData.company}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 truncate">
                    {profileData.location} • {profileData.experienceYears} years experience
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{profileData.profileViews} views</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{profileData.connections} connections</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{profileData.recommendations} recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Save Changes</span>
                      <span className="sm:hidden">Save</span>
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                    <Edit className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(profileData.verification).map(([key, verified]) => (
                <div key={key} className="flex items-center space-x-2">
                  {verified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm font-medium capitalize">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* About */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="min-h-[120px]"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {profileData.bio}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profileData.location}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            {profileData.workExperience.map((exp) => (
              <Card key={exp.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-gray-500 text-sm">{exp.location}</p>
                      <p className="text-gray-500 text-sm">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    {exp.description}
                  </p>
                  {exp.achievements.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            {profileData.education.map((edu) => (
              <Card key={edu.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{edu.degree} in {edu.field}</h3>
                      <p className="text-blue-600 font-medium">{edu.institution}</p>
                      <p className="text-gray-500 text-sm">
                        {edu.startDate} - {edu.endDate}
                      </p>
                      {edu.gpa && (
                        <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {edu.description && (
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      {edu.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {profileData.achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{achievement.title}</h3>
                      <p className="text-blue-600 font-medium">{achievement.issuer}</p>
                      <p className="text-gray-500 text-sm">{achievement.date}</p>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {achievement.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your profile and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Visibility</label>
                  <select 
                    value={profileData.preferences.profileVisibility}
                    onChange={(e) => setProfileData({
                      ...profileData, 
                      preferences: {
                        ...profileData.preferences,
                        profileVisibility: e.target.value as 'public' | 'connections' | 'private'
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(profileData.preferences.notifications).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium capitalize">{key} Notifications</label>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          notifications: {
                            ...profileData.preferences.notifications,
                            [key]: e.target.checked
                          }
                        }
                      })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
