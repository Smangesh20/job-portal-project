'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { 
  Search,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Globe,
  Shield,
  ChevronDown,
  Building2,
  Briefcase,
  Users,
  BarChart3,
  BookOpen,
  HelpCircle,
  Star,
  Zap,
  Target,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Filter,
  SortAsc,
  Heart,
  Share2,
  Download,
  Eye,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Home,
  Calendar,
  MessageSquare,
  FileText,
  PieChart,
  Layers,
  Database,
  Cpu,
  Brain,
  Sparkles,
  Rocket,
  Crown,
  Gem,
  ShieldCheck,
  Lock,
  Key,
  UserCheck,
  UserPlus,
  Mail,
  Phone,
  DollarSign,
  Percent,
  BarChart,
  LineChart,
  Activity,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Edit,
  Trash2,
  Copy,
  Save,
  RefreshCw,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Scissors,
  Palette,
  Brush,
  Eraser,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Terminal,
  Command,
  Keyboard,
  MousePointer,
  Hand,
  MousePointer2
} from 'lucide-react'

export function EnterpriseHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New job match found', message: 'Software Engineer at Google', time: '2m ago', unread: true },
    { id: 2, title: 'Application status update', message: 'Your application at Microsoft was reviewed', time: '1h ago', unread: true },
    { id: 3, title: 'Profile completion', message: 'Complete your profile to get better matches', time: '3h ago', unread: false },
  ])
  
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  const searchRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Simulate search suggestions
    if (value.length > 2) {
      setSearchSuggestions([
        `${value} jobs`,
        `${value} companies`,
        `${value} remote`,
        `${value} full-time`
      ])
    } else {
      setSearchSuggestions([])
    }
  }

  interface NavigationItem {
    name: string
    href: string
    current?: boolean
    badge?: string
    icon?: React.ReactNode
    description?: string
    children?: NavigationItem[]
  }

  const publicNavigation: NavigationItem[] = [
    { 
      name: 'Home', 
      href: '/', 
      current: pathname === '/',
      icon: <Home className="w-4 h-4" />
    },
    { 
      name: 'About', 
      href: '/about',
      icon: <Info className="w-4 h-4" />
    },
    { 
      name: 'How it Works', 
      href: '/how-it-works',
      icon: <HelpCircle className="w-4 h-4" />
    },
    { 
      name: 'Pricing', 
      href: '/pricing',
      icon: <DollarSign className="w-4 h-4" />
    },
    { 
      name: 'Contact', 
      href: '/contact',
      icon: <MessageSquare className="w-4 h-4" />
    },
  ]

  const dashboardNavigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      current: pathname === '/dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'Overview & Analytics'
    },
    { 
      name: 'Jobs', 
      href: '/jobs', 
      badge: '12',
      icon: <Briefcase className="w-4 h-4" />,
      description: 'Find Your Next Role',
      children: [
        { name: 'All Jobs', href: '/jobs' },
        { name: 'Saved Jobs', href: '/jobs/saved' },
        { name: 'Applied Jobs', href: '/jobs/applied' },
        { name: 'Recommended', href: '/jobs/recommended' }
      ]
    },
    { 
      name: 'Companies', 
      href: '/companies',
      icon: <Building2 className="w-4 h-4" />,
      description: 'Explore Companies',
      children: [
        { name: 'All Companies', href: '/companies' },
        { name: 'Top Companies', href: '/companies/top' },
        { name: 'Startups', href: '/companies/startups' },
        { name: 'Fortune 500', href: '/companies/fortune-500' }
      ]
    },
    { 
      name: 'Career Tools', 
      href: '/career-tools',
      icon: <Target className="w-4 h-4" />,
      description: 'Professional Development',
      children: [
        { name: 'Resume Builder', href: '/career-tools/resume' },
        { name: 'Interview Prep', href: '/career-tools/interview' },
        { name: 'Skills Assessment', href: '/career-tools/skills' },
        { name: 'Career Path', href: '/career-tools/path' }
      ]
    },
    { 
      name: 'AI Insights', 
      href: '/ai-insights',
      icon: <Brain className="w-4 h-4" />,
      description: 'AI-Powered Analytics',
      badge: 'NEW'
    },
    { 
      name: 'Resources', 
      href: '/resources',
      icon: <BookOpen className="w-4 h-4" />,
      description: 'Learning & Guides'
    },
  ]

  const navigation = isAuthenticated ? dashboardNavigation : publicNavigation

  return (
    <>
      {/* Top Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold">Quantum-Powered Job Matching</span>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <a href="mailto:info@askyacham.com" className="hover:text-blue-200 transition-colors">
                  <Mail className="w-3 h-3 inline mr-1" />
                  info@askyacham.com
                </a>
                <a href="tel:+15552759242" className="hover:text-blue-200 transition-colors">
                  <Phone className="w-3 h-3 inline mr-1" />
                  +1 (555) ASK-YACH
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <select className="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-green-300">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="fixed top-8 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 min-h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">AskYaCham</h1>
                  <p className="text-xs text-gray-500 font-medium">Quantum Job Matching</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        item.badge === 'NEW' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                          : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                      }`}>
                        {String(item.badge)}
                      </span>
                    )}
                    {item.children && (
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.children && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                        >
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-3">
              {/* Advanced Search - Only show for authenticated users */}
              {isAuthenticated && (
                <div className="relative hidden lg:block">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative">
                      <Input
                        ref={searchRef}
                        type="text"
                        placeholder="Search jobs, companies, skills..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        className="w-80 pl-12 pr-4 py-2.5 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <Filter className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </form>
                  
                  {/* Search Suggestions */}
                  {isSearchFocused && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                          onClick={() => {
                            setSearchQuery(suggestion)
                            setIsSearchFocused(false)
                          }}
                        >
                          <Search className="w-3 h-3 inline mr-3 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notifications - Only show for authenticated users */}
              {isAuthenticated && (
                <div className="relative hidden md:block" ref={notificationRef}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  </Button>
                  
                  {/* Notifications Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-xs text-gray-500">{notifications.filter(n => n.unread).length} unread</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                              notification.unread ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Button variant="ghost" size="sm" className="w-full text-purple-600 hover:text-purple-700">
                          View all notifications
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Menu - Dynamic based on auth status */}
              <div className="flex items-center space-x-2">
                {isAuthenticated && user ? (
                  <div className="relative" ref={userMenuRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Premium Member</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>
                    
                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Profile Settings</span>
                          </Link>
                          <Link
                            href="/dashboard"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BarChart3 className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/jobs/saved"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="w-4 h-4" />
                            <span>Saved Jobs</span>
                          </Link>
                          <Link
                            href="/career-tools"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Target className="w-4 h-4" />
                            <span>Career Tools</span>
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-100 py-2">
                          <Link
                            href="/settings"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          <Link
                            href="/help"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <HelpCircle className="w-4 h-4" />
                            <span>Help & Support</span>
                          </Link>
                          <button
                            onClick={() => {
                              logout()
                              router.push('/auth/login')
                              setIsUserMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => router.push('/auth/login')}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:block text-sm font-medium">Sign In</span>
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => router.push('/auth/register')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-3 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        item.badge === 'NEW' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                          : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                      }`}>
                        {String(item.badge)}
                      </span>
                    )}
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {item.children && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Search - Only show for authenticated users */}
              {isAuthenticated && (
                <form onSubmit={handleSearch} className="pt-4 border-t border-gray-200">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search jobs, companies, skills..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-12 pr-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl shadow-lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </form>
              )}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">Premium Member</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        router.push('/profile')
                        setIsMenuOpen(false)
                      }}
                      className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50 rounded-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Button>
                    <Button 
                      onClick={() => {
                        logout()
                        router.push('/auth/login')
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl shadow-sm"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        router.push('/auth/login')
                        setIsMenuOpen(false)
                      }}
                      className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50 rounded-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        router.push('/auth/register')
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl shadow-lg"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer for fixed header */}
      <div className="h-24"></div>
    </>
  )
}