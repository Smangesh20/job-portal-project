'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { getWelcomeBackMessage } from '@/utils/user-name'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  
  // Dashboard dropdown filters
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  
  // Dropdown data
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
  const locations = ['San Francisco', 'New York', 'London', 'Remote', 'Hybrid', 'Seattle', 'Austin', 'Boston']
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Tesla', 'Netflix', 'Uber']
  const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting']

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

  // AUTOMATIC NAME DETECTION - Like Google
  useEffect(() => {
    const autoDetectName = () => {
      console.log('🚀 AUTO: Automatically detecting user name...')
      
      // Check if user is logged in
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        setDisplayName('Guest')
        return
      }
      
      // Get user data from localStorage
      const userData = localStorage.getItem('userData')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          console.log('🚀 AUTO: Found user data:', user)
          
          // AUTO: Use firstName and lastName if available
          if (user.firstName && user.lastName) {
            const fullName = `${user.firstName} ${user.lastName}`
            console.log('🚀 AUTO: Using full name:', fullName)
            setDisplayName(fullName)
            return
          }
          
          // AUTO: Use firstName only
          if (user.firstName) {
            console.log('🚀 AUTO: Using first name:', user.firstName)
            setDisplayName(user.firstName)
            return
          }
          
          // AUTO: Use name field
          if (user.name) {
            console.log('🚀 AUTO: Using name field:', user.name)
            setDisplayName(user.name)
            return
          }
          
          // AUTO: Use email to create name
          if (user.email) {
            const emailName = user.email.split('@')[0]
            const name = emailName.charAt(0).toUpperCase() + emailName.slice(1)
            console.log('🚀 AUTO: Using email name:', name)
            setDisplayName(name)
            return
          }
        } catch (e) {
          console.log('🚀 AUTO: Error parsing userData:', e)
        }
      }
      
      // AUTO: Check auth context
      if (user) {
        console.log('🚀 AUTO: Using auth context user:', user)
        if (user.firstName && user.lastName) {
          const fullName = `${user.firstName} ${user.lastName}`
          console.log('🚀 AUTO: Using auth full name:', fullName)
          setDisplayName(fullName)
          return
        }
        if (user.firstName) {
          console.log('🚀 AUTO: Using auth first name:', user.firstName)
          setDisplayName(user.firstName)
          return
        }
        if (user.email) {
          const emailName = user.email.split('@')[0]
          const name = emailName.charAt(0).toUpperCase() + emailName.slice(1)
          console.log('🚀 AUTO: Using auth email name:', name)
          setDisplayName(name)
          return
        }
      }
      
      // AUTO: Final fallback - use email from localStorage
      const email = localStorage.getItem('userEmail')
      if (email) {
        const emailName = email.split('@')[0]
        const name = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🚀 AUTO: Using localStorage email name:', name)
        setDisplayName(name)
        return
      }
      
      // Last resort
      setDisplayName('User')
    }
    
    autoDetectName()
  }, [user, isAuthenticated])

  // SIMPLE DIRECT SOLUTION - This will work 100%
  const getDisplayName = () => {
    console.log('🚀 GOOGLE-STYLE: Getting display name - SIMPLE DIRECT VERSION')
    
    // Check if user is logged in
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      console.log('🚀 GOOGLE-STYLE: No access token, user not logged in')
      return 'Guest'
    }
    
    console.log('🚀 GOOGLE-STYLE: User is logged in, looking for name...')
    
    // Try to get user data from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      console.log('🚀 GOOGLE-STYLE: Found userData:', userData)
      try {
        const user = JSON.parse(userData)
        console.log('🚀 GOOGLE-STYLE: Parsed user:', user)
        console.log('🚀 GOOGLE-STYLE: User firstName:', user.firstName)
        console.log('🚀 GOOGLE-STYLE: User lastName:', user.lastName)
        console.log('🚀 GOOGLE-STYLE: User email:', user.email)
        console.log('🚀 GOOGLE-STYLE: User name field:', user.name)
        
        // Check for firstName and lastName
        if (user.firstName && user.lastName) {
          const fullName = `${user.firstName} ${user.lastName}`
          console.log('🚀 GOOGLE-STYLE: ✅ FOUND FULL NAME:', fullName)
          return fullName
        }
        
        // Check for firstName only
        if (user.firstName) {
          console.log('🚀 GOOGLE-STYLE: ✅ FOUND FIRST NAME:', user.firstName)
          return user.firstName
        }
        
        // Check for name field
        if (user.name) {
          console.log('🚀 GOOGLE-STYLE: ✅ FOUND NAME FIELD:', user.name)
          return user.name
        }
        
        // Check for email
        if (user.email) {
          const emailName = user.email.split('@')[0]
          const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
          console.log('🚀 GOOGLE-STYLE: ✅ FOUND EMAIL NAME:', capitalizedName)
          return capitalizedName
        }
        
        console.log('🚀 GOOGLE-STYLE: ❌ NO NAME FOUND IN USER DATA')
      } catch (e) {
        console.log('🚀 GOOGLE-STYLE: Error parsing userData:', e)
      }
    } else {
      console.log('🚀 GOOGLE-STYLE: ❌ NO USER DATA FOUND IN LOCALSTORAGE')
    }
    
    // If no userData found, check auth context
    if (user) {
      console.log('🚀 GOOGLE-STYLE: Using auth context user:', user)
      if (user.firstName && user.lastName) {
        const fullName = `${user.firstName} ${user.lastName}`
        console.log('🚀 GOOGLE-STYLE: ✅ FOUND AUTH CONTEXT FULL NAME:', fullName)
        return fullName
      }
      if (user.firstName) {
        console.log('🚀 GOOGLE-STYLE: ✅ FOUND AUTH CONTEXT FIRST NAME:', user.firstName)
        return user.firstName
      }
      if (user.email) {
        const emailName = user.email.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🚀 GOOGLE-STYLE: ✅ FOUND AUTH CONTEXT EMAIL NAME:', capitalizedName)
        return capitalizedName
      }
    }
    
    // If still no name found, use a simple fallback
    console.log('🚀 GOOGLE-STYLE: ❌ NO NAME FOUND ANYWHERE, using simple fallback')
    return 'User'
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

  // Function to refresh name detection
  const handleRefreshName = () => {
    console.log('🚀 GOOGLE-STYLE: Manually refreshing name detection...')
    const newDisplayName = getDisplayName()
    console.log('🚀 GOOGLE-STYLE: Refreshed display name:', newDisplayName)
    setDisplayName(newDisplayName)
  }

  // Function to directly set name in localStorage
  const handleSetNameDirectly = () => {
    if (customName.trim()) {
      console.log('🚀 GOOGLE-STYLE: Setting name directly in localStorage:', customName)
      
      // Get current userData
      const userData = localStorage.getItem('userData')
      let user: any = {}
      
      if (userData) {
        try {
          user = JSON.parse(userData)
        } catch (e) {
          console.log('🚀 GOOGLE-STYLE: Error parsing userData, creating new user object')
        }
      }
      
      // Set the name
      user.firstName = customName.trim()
      user.name = customName.trim()
      
      // Save back to localStorage
      localStorage.setItem('userData', JSON.stringify(user))
      console.log('🚀 GOOGLE-STYLE: Name set directly in localStorage:', user)
      
      // Update display
      setDisplayName(customName.trim())
      setShowNameInput(false)
      setCustomName('')
    }
  }

  // Function to show what's in localStorage
  const handleShowLocalStorage = () => {
    console.log('🚀 GOOGLE-STYLE: === LOCALSTORAGE INSPECTION ===')
    console.log('🚀 GOOGLE-STYLE: accessToken:', localStorage.getItem('accessToken'))
    console.log('🚀 GOOGLE-STYLE: refreshToken:', localStorage.getItem('refreshToken'))
    console.log('🚀 GOOGLE-STYLE: userData:', localStorage.getItem('userData'))
    
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        console.log('🚀 GOOGLE-STYLE: Parsed userData:', user)
        console.log('🚀 GOOGLE-STYLE: firstName:', user.firstName)
        console.log('🚀 GOOGLE-STYLE: lastName:', user.lastName)
        console.log('🚀 GOOGLE-STYLE: email:', user.email)
        console.log('🚀 GOOGLE-STYLE: name field:', user.name)
        
        // Show in alert for easy viewing
        alert(`Your account data:
Email: ${user.email || 'undefined'}
First Name: ${user.firstName || 'NOT SET'}
Last Name: ${user.lastName || 'NOT SET'}
Name Field: ${user.name || 'NOT SET'}

This is the name you provided during registration!`)
      } catch (e) {
        console.log('🚀 GOOGLE-STYLE: Error parsing userData:', e)
        alert('Error parsing user data. Check console for details.')
      }
    } else {
      alert('No user data found in localStorage!')
    }
    console.log('🚀 GOOGLE-STYLE: === END LOCALSTORAGE INSPECTION ===')
  }

  // Function to force set a name directly
  const handleForceSetName = () => {
    const name = prompt('Enter your name:')
    if (name && name.trim()) {
      console.log('🚀 GOOGLE-STYLE: Force setting name:', name)
      
      // Get current userData or create new
      const userData = localStorage.getItem('userData')
      let user: any = {}
      
      if (userData) {
        try {
          user = JSON.parse(userData)
        } catch (e) {
          console.log('🚀 GOOGLE-STYLE: Error parsing userData, creating new user object')
        }
      }
      
      // Set the name in multiple fields
      user.firstName = name.trim()
      user.lastName = name.trim()
      user.name = name.trim()
      
      // Save back to localStorage
      localStorage.setItem('userData', JSON.stringify(user))
      console.log('🚀 GOOGLE-STYLE: Name force set in localStorage:', user)
      
      // Update display immediately
      setDisplayName(name.trim())
      
      alert(`Name set successfully! Your name is now: ${name.trim()}`)
    }
  }

  // Function to auto-fix name issues
  const handleAutoFixName = () => {
    console.log('🚀 GOOGLE-STYLE: Auto-fixing name issues...')
    
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        console.log('🚀 GOOGLE-STYLE: Current user data:', user)
        
        // Check if name fields are missing or empty
        if (!user.firstName || !user.lastName || !user.name) {
          console.log('🚀 GOOGLE-STYLE: Name fields are missing, auto-fixing...')
          
          // Try to extract name from email
          if (user.email) {
            const emailName = user.email.split('@')[0]
            const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
            
            // Set the name
            user.firstName = capitalizedName
            user.lastName = capitalizedName
            user.name = capitalizedName
            
            // Save back to localStorage
            localStorage.setItem('userData', JSON.stringify(user))
            console.log('🚀 GOOGLE-STYLE: Auto-fixed name from email:', capitalizedName)
            
            // Update display
            setDisplayName(capitalizedName)
            
            alert(`Auto-fixed! Your name is now: ${capitalizedName}`)
          } else {
            alert('No email found to extract name from. Please use "Force Set Name" button.')
          }
        } else {
          alert('Name fields are already set. No auto-fix needed.')
        }
      } catch (e) {
        console.log('🚀 GOOGLE-STYLE: Error in auto-fix:', e)
        alert('Error in auto-fix. Please use "Force Set Name" button.')
      }
    } else {
      alert('No user data found. Please use "Force Set Name" button.')
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
                {getWelcomeBackMessage(user)}
              </h1>
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
                <Button onClick={handleSetNameDirectly} size="sm" variant="outline">
                  Set Directly
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
              
              {/* Dashboard Dropdown Filters */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                      <SelectTrigger className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Job Types</SelectItem>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                      <SelectTrigger className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <Select value={industryFilter} onValueChange={setIndustryFilter}>
                      <SelectTrigger className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Filter Summary */}
                {(jobTypeFilter && jobTypeFilter !== 'all') || (locationFilter && locationFilter !== 'all') || (companyFilter && companyFilter !== 'all') || (industryFilter && industryFilter !== 'all') ? (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Active Filters:</strong> 
                      {jobTypeFilter && jobTypeFilter !== 'all' && ` Job Type: ${jobTypeFilter}`}
                      {locationFilter && locationFilter !== 'all' && ` Location: ${locationFilter}`}
                      {companyFilter && companyFilter !== 'all' && ` Company: ${companyFilter}`}
                      {industryFilter && industryFilter !== 'all' && ` Industry: ${industryFilter}`}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setJobTypeFilter('all')
                        setLocationFilter('all')
                        setCompanyFilter('all')
                        setIndustryFilter('all')
                      }}
                      className="mt-2"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                ) : null}
              </div>
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