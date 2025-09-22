'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { 
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon,
  ArrowRightIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  FlagIcon,
  CheckCircleIcon,
  CpuChipIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { QuantumDashboard } from '@/components/quantum/quantum-dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuthUnified()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [showQuantumDashboard, setShowQuantumDashboard] = useState(false)
  const [displayName, setDisplayName] = useState('User')
  const [showNameInput, setShowNameInput] = useState(false)
  const [customName, setCustomName] = useState('')

  // Debug authentication state
  useEffect(() => {
    console.log('🚀 GOOGLE-STYLE: Dashboard auth state changed:')
    console.log('  - isAuthenticated:', isAuthenticated)
    console.log('  - isLoading:', isLoading)
    console.log('  - user:', user)
    console.log('  - user type:', typeof user)
    if (user) {
      console.log('  - user keys:', Object.keys(user))
      console.log('  - user firstName:', user.firstName)
      console.log('  - user lastName:', user.lastName)
    }
    
    // COMPREHENSIVE localStorage inspection
    console.log('🚀 GOOGLE-STYLE: === COMPLETE localStorage INSPECTION ===')
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const userData = localStorage.getItem('userData')
    const userEmail = localStorage.getItem('userEmail')
    
    console.log('🚀 GOOGLE-STYLE: accessToken:', accessToken)
    console.log('🚀 GOOGLE-STYLE: refreshToken:', refreshToken)
    console.log('🚀 GOOGLE-STYLE: userData:', userData)
    console.log('🚀 GOOGLE-STYLE: userEmail:', userEmail)
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('🚀 GOOGLE-STYLE: Parsed localStorage user:', parsedUser)
        console.log('🚀 GOOGLE-STYLE: Parsed firstName:', parsedUser.firstName)
        console.log('🚀 GOOGLE-STYLE: Parsed lastName:', parsedUser.lastName)
        console.log('🚀 GOOGLE-STYLE: Parsed email:', parsedUser.email)
        console.log('🚀 GOOGLE-STYLE: Parsed name:', parsedUser.name)
        console.log('🚀 GOOGLE-STYLE: All parsed user keys:', Object.keys(parsedUser))
        
        // Check if this is the real user data from registration
        if (parsedUser.firstName && parsedUser.lastName) {
          console.log('🚀 GOOGLE-STYLE: ✅ REAL USER DATA FOUND!')
          console.log('🚀 GOOGLE-STYLE: Full name should be:', `${parsedUser.firstName} ${parsedUser.lastName}`)
        } else {
          console.log('🚀 GOOGLE-STYLE: ❌ User data missing firstName or lastName')
        }
      } catch (e) {
        console.log('🚀 GOOGLE-STYLE: Error parsing localStorage userData:', e)
      }
    } else {
      console.log('🚀 GOOGLE-STYLE: ❌ No userData found in localStorage')
    }
    
    // Check all localStorage keys
    console.log('🚀 GOOGLE-STYLE: All localStorage keys:', Object.keys(localStorage))
    console.log('🚀 GOOGLE-STYLE: === END localStorage INSPECTION ===')
  }, [user, isAuthenticated, isLoading])

  // Update display name when user data changes
  useEffect(() => {
    const newDisplayName = getDisplayName()
    console.log('🚀 GOOGLE-STYLE: Updating display name to:', newDisplayName)
    
    // Ensure displayName is always a clean string
    let cleanDisplayName = newDisplayName
    if (typeof cleanDisplayName !== 'string') {
      console.log('🚀 GOOGLE-STYLE: Display name is not a string, converting:', cleanDisplayName)
      cleanDisplayName = String(cleanDisplayName)
    }
    
    // Remove any JSON artifacts or unwanted characters
    cleanDisplayName = cleanDisplayName.replace(/[\[\]{}"]/g, '').trim()
    
    // If it still looks like JSON, use fallback
    if (cleanDisplayName.includes('id') && cleanDisplayName.includes('email')) {
      console.log('🚀 GOOGLE-STYLE: Display name looks like JSON, using fallback')
      cleanDisplayName = 'Welcome Back'
    }
    
    console.log('🚀 GOOGLE-STYLE: Clean display name:', cleanDisplayName)
    setDisplayName(cleanDisplayName)
  }, [user, isAuthenticated])

  // CLEAN NAME DISPLAY SOLUTION - No more JSON artifacts
  const getDisplayName = () => {
    console.log('🚀 GOOGLE-STYLE: Getting display name - CLEAN VERSION')
    
    // Check ALL possible localStorage keys for user data
    const allKeys = Object.keys(localStorage)
    console.log('🚀 GOOGLE-STYLE: All localStorage keys:', allKeys)
    
    // Try multiple possible user data keys
    const possibleUserKeys = ['userData', 'user', 'currentUser', 'authUser', 'profile']
    let foundUserData = null
    
    for (const key of possibleUserKeys) {
      const data = localStorage.getItem(key)
      if (data) {
        console.log(`🚀 GOOGLE-STYLE: Found data in ${key}:`, data)
        try {
          // Handle both string and already parsed data
          let parsed
          if (typeof data === 'string') {
            parsed = JSON.parse(data)
          } else {
            parsed = data
          }
          
          // Ensure it's a valid object with user data
          if (parsed && typeof parsed === 'object' && (parsed.firstName || parsed.name || parsed.email)) {
            foundUserData = parsed
            console.log(`🚀 GOOGLE-STYLE: Using data from ${key}:`, parsed)
            break
          }
        } catch (e) {
          console.log(`🚀 GOOGLE-STYLE: Error parsing ${key}:`, e)
          // Try to extract name from malformed data
          if (data.includes('firstName') || data.includes('email')) {
            console.log(`🚀 GOOGLE-STYLE: Attempting to extract name from malformed data in ${key}`)
            // Extract name from malformed JSON
            const nameMatch = data.match(/"firstName":"([^"]+)"/)
            if (nameMatch) {
              foundUserData = { firstName: nameMatch[1] }
              console.log(`🚀 GOOGLE-STYLE: Extracted firstName from malformed data:`, nameMatch[1])
              break
            }
            const emailMatch = data.match(/"email":"([^"]+)"/)
            if (emailMatch) {
              const emailName = emailMatch[1].split('@')[0]
              const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
              foundUserData = { firstName: capitalizedName }
              console.log(`🚀 GOOGLE-STYLE: Extracted email name from malformed data:`, capitalizedName)
              break
            }
          }
        }
      }
    }
    
    // PRIORITY 1: Use found user data
    if (foundUserData && typeof foundUserData === 'object') {
      console.log('🚀 GOOGLE-STYLE: Found user data:', foundUserData)
      
      // Ensure we have valid string values
      const firstName = foundUserData.firstName && typeof foundUserData.firstName === 'string' ? foundUserData.firstName : ''
      const lastName = foundUserData.lastName && typeof foundUserData.lastName === 'string' ? foundUserData.lastName : ''
      const name = foundUserData.name && typeof foundUserData.name === 'string' ? foundUserData.name : ''
      const email = foundUserData.email && typeof foundUserData.email === 'string' ? foundUserData.email : ''
      
      if (firstName && lastName) {
        const fullName = `${firstName} ${lastName}`
        console.log('🚀 GOOGLE-STYLE: Using full name:', fullName)
        return fullName
      }
      if (firstName) {
        console.log('🚀 GOOGLE-STYLE: Using first name:', firstName)
        return firstName
      }
      if (name) {
        console.log('🚀 GOOGLE-STYLE: Using name field:', name)
        return name
      }
      if (email) {
        const emailName = email.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🚀 GOOGLE-STYLE: Using email name:', capitalizedName)
        return capitalizedName
      }
    }
    
    // PRIORITY 2: Check authentication context
    if (user && typeof user === 'object') {
      console.log('🚀 GOOGLE-STYLE: Using auth context user:', user)
      const firstName = user.firstName && typeof user.firstName === 'string' ? user.firstName : ''
      const lastName = user.lastName && typeof user.lastName === 'string' ? user.lastName : ''
      const email = user.email && typeof user.email === 'string' ? user.email : ''
      
      if (firstName && lastName) {
        const fullName = `${firstName} ${lastName}`
        console.log('🚀 GOOGLE-STYLE: Using auth context full name:', fullName)
        return fullName
      }
      if (firstName) {
        console.log('🚀 GOOGLE-STYLE: Using auth context first name:', firstName)
        return firstName
      }
      if (email) {
        const emailName = email.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🚀 GOOGLE-STYLE: Using auth context email name:', capitalizedName)
        return capitalizedName
      }
    }
    
    // PRIORITY 3: Check for any email in localStorage
    for (const key of allKeys) {
      const value = localStorage.getItem(key)
      if (value && typeof value === 'string' && value.includes('@') && value.includes('.')) {
        console.log(`🚀 GOOGLE-STYLE: Found email in ${key}:`, value)
        const emailName = value.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🚀 GOOGLE-STYLE: Using email name:', capitalizedName)
        return capitalizedName
      }
    }
    
    // PRIORITY 4: Check if user is authenticated and use a generic but better name
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      console.log('🚀 GOOGLE-STYLE: User is authenticated, using generic name')
      return 'Welcome Back'
    }
    
    // PRIORITY 5: Use a better fallback than "User"
    console.log('🚀 GOOGLE-STYLE: No account data found, using better fallback')
    return 'Guest User'
  }

  // Function to set custom name
  const handleSetCustomName = () => {
    if (customName.trim()) {
      console.log('🚀 GOOGLE-STYLE: Setting custom name:', customName)
      setDisplayName(customName.trim())
      setShowNameInput(false)
      // Store in localStorage for persistence
      localStorage.setItem('customDisplayName', customName.trim())
    }
  }

  // Load custom name from localStorage on mount
  useEffect(() => {
    const storedCustomName = localStorage.getItem('customDisplayName')
    if (storedCustomName) {
      console.log('🚀 GOOGLE-STYLE: Loading custom name from localStorage:', storedCustomName)
      setDisplayName(storedCustomName)
    }
  }, [])

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    console.log('🚀 GOOGLE-STYLE: Not authenticated, redirecting to login...')
    router.push('/auth/login')
    return null
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }
    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim())
    }
    router.push(`/jobs?${params.toString()}`)
  }

  const quickActions = [
    {
      title: 'Browse Jobs',
      description: 'Explore opportunities matched to your profile',
      icon: BriefcaseIcon,
      href: '/jobs',
      color: 'blue'
    },
    {
      title: 'Companies',
      description: 'Discover companies hiring in your field',
      icon: BuildingOfficeIcon,
      href: '/companies',
      color: 'green'
    },
    {
      title: 'Career Tools',
      description: 'Build your professional profile',
      icon: FlagIcon,
      href: '/career-tools',
      color: 'purple'
    },
    {
      title: 'AI Insights',
      description: 'Get personalized career recommendations',
      icon: SparklesIcon,
      href: '/ai-insights',
      color: 'orange'
    },
    {
      title: 'Quantum Matching',
      description: 'IBM Quantum-powered job matching',
      icon: CpuChipIcon,
      action: () => setShowQuantumDashboard(true),
      color: 'indigo'
    },
    {
      title: 'Quantum Analytics',
      description: 'Real-time quantum computing metrics',
      icon: BoltIcon,
      action: () => setShowQuantumDashboard(true),
      color: 'violet'
    }
  ]

  const recentJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $160k',
      posted: '2 hours ago',
      match: 95
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateLabs',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $140k',
      posted: '5 hours ago',
      match: 92
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80k - $120k',
      posted: '1 day ago',
      match: 88
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {displayName || 'John Doe'}!
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNameInput(!showNameInput)}
                className="text-xs"
              >
                {showNameInput ? 'Cancel' : 'Set Name'}
              </Button>
            </div>
            {showNameInput && (
              <div className="mt-3 flex items-center gap-2">
                <Input
                  placeholder="Enter your name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-48"
                />
                <Button onClick={handleSetCustomName} size="sm">
                  Save
                </Button>
              </div>
            )}
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your job search today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
                <Button size="sm" onClick={() => router.push('/profile')}>
                  View Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Job Search</h2>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search jobs, companies, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Location (e.g., San Francisco, Remote)"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action) => (
              <Card 
                key={action.title} 
                className="hover:shadow-md transition-shadow cursor-pointer" 
                onClick={() => {
                  if (action.href) {
                    router.push(action.href)
                  } else if (action.action) {
                    action.action()
                  }
                }}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quantum Dashboard Section */}
          {showQuantumDashboard && (
            <div className="mb-8">
              <Card className="border-2 border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <CpuChipIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-purple-900">IBM Quantum Computing Dashboard</CardTitle>
                        <CardDescription className="text-purple-700">Real-time quantum job matching and analytics</CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowQuantumDashboard(false)}
                      className="text-purple-600 border-purple-300 hover:bg-purple-50"
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <QuantumDashboard />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Job Matches */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-600" />
                    Your Latest Job Matches
                  </CardTitle>
                  <CardDescription>
                    Jobs matched to your profile with high compatibility scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h4>
                            <p className="text-gray-600 mb-2">{job.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="w-4 h-4 mr-1" />
                                {job.posted}
                              </div>
                            </div>
                            <div className="flex items-center mt-3">
                              <Badge variant="secondary" className="mr-2">{job.type}</Badge>
                              <span className="text-sm text-gray-600">{job.salary}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className="bg-green-100 text-green-800">
                              {job.match}% Match
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <HeartIcon className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => router.push('/jobs')}>
                      View All Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profile Strength</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                        <span>Basic Information</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                        <span>Skills & Experience</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                        <span className="text-gray-500">Portfolio</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                        <span className="text-gray-500">References</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => router.push('/profile')}>
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quantum Status */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CpuChipIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Quantum Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">IBM Quantum</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quantum Volume</span>
                      <span className="text-sm font-semibold text-purple-600">64</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gate Fidelity</span>
                      <span className="text-sm font-semibold text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quantum Advantage</span>
                      <span className="text-sm font-semibold text-blue-600">+25%</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => setShowQuantumDashboard(true)}
                    >
                      <BoltIcon className="w-4 h-4 mr-2" />
                      Open Quantum Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Applications</span>
                      <span className="text-sm font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profile Views</span>
                      <span className="text-sm font-semibold">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Job Matches</span>
                      <span className="text-sm font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Interviews</span>
                      <span className="text-sm font-semibold">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}