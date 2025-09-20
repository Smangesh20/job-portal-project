'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Home, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Calendar, 
  Bookmark, 
  Star, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Phone, 
  Mail, 
  Globe, 
  Shield, 
  Brain, 
  Target, 
  Zap, 
  Award, 
  TrendingUp, 
  Building, 
  FileText, 
  Heart, 
  Share2, 
  Download, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/use-auth'

interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<any>
  badge?: string
  children?: NavigationItem[]
  description?: string
  featured?: boolean
}

const mainNavigation: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
    description: 'Discover opportunities and get started'
  },
  {
    id: 'jobs',
    label: 'Jobs',
    href: '/jobs',
    icon: Briefcase,
    badge: '12',
    description: 'Find your next career opportunity',
    children: [
      { id: 'search', label: 'Search Jobs', href: '/jobs', description: 'Browse all available positions' },
      { id: 'featured', label: 'Featured Jobs', href: '/jobs/featured', description: 'Top opportunities' },
      { id: 'remote', label: 'Remote Jobs', href: '/jobs/remote', description: 'Work from anywhere' },
      { id: 'part-time', label: 'Part-time', href: '/jobs/part-time', description: 'Flexible schedules' },
      { id: 'contract', label: 'Contract', href: '/jobs/contract', description: 'Project-based work' },
      { id: 'internship', label: 'Internships', href: '/jobs/internship', description: 'Entry-level opportunities' }
    ]
  },
  {
    id: 'companies',
    label: 'Companies',
    href: '/companies',
    icon: Building,
    description: 'Explore top employers',
    children: [
      { id: 'browse', label: 'Browse Companies', href: '/companies', description: 'All companies' },
      { id: 'featured', label: 'Featured Companies', href: '/companies/featured', description: 'Top employers' },
      { id: 'startups', label: 'Startups', href: '/companies/startups', description: 'Growing companies' },
      { id: 'fortune500', label: 'Fortune 500', href: '/companies/fortune500', description: 'Large corporations' },
      { id: 'remote-first', label: 'Remote-First', href: '/companies/remote-first', description: 'Distributed teams' }
    ]
  },
  {
    id: 'careers',
    label: 'Career Tools',
    href: '/careers',
    icon: Target,
    description: 'Advance your career',
    children: [
      { id: 'development', label: 'Career Development', href: '/careers/development', description: 'Skills and growth' },
      { id: 'learning', label: 'Learning Paths', href: '/careers/learning', description: 'Upskill and reskill' },
      { id: 'assessment', label: 'Skill Assessment', href: '/careers/assessment', description: 'Test your skills' },
      { id: 'resume', label: 'Resume Builder', href: '/careers/resume', description: 'Create professional resumes' },
      { id: 'interview', label: 'Interview Prep', href: '/careers/interview', description: 'Ace your interviews' },
      { id: 'salary', label: 'Salary Insights', href: '/careers/salary', description: 'Market compensation data' }
    ]
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    href: '/ai-insights',
    icon: Brain,
    description: 'Quantum-powered matching',
    children: [
      { id: 'matching', label: 'AI Matching', href: '/ai-insights/matching', description: 'How we match you' },
      { id: 'transparency', label: 'Transparency', href: '/ai-insights/transparency', description: 'Fair and explainable AI' },
      { id: 'bias-detection', label: 'Bias Detection', href: '/ai-insights/bias', description: 'Ensuring fairness' },
      { id: 'recommendations', label: 'Recommendations', href: '/ai-insights/recommendations', description: 'Personalized suggestions' }
    ]
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/resources',
    icon: FileText,
    description: 'Help and support',
    children: [
      { id: 'help', label: 'Help Center', href: '/help', description: 'Get support' },
      { id: 'blog', label: 'Blog', href: '/blog', description: 'Latest insights' },
      { id: 'guides', label: 'Job Search Guides', href: '/guides', description: 'Expert advice' },
      { id: 'webinars', label: 'Webinars', href: '/webinars', description: 'Live sessions' },
      { id: 'events', label: 'Events', href: '/events', description: 'Networking opportunities' },
      { id: 'community', label: 'Community', href: '/community', description: 'Connect with peers' }
    ]
  }
]

const userNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Your job search overview'
  },
  {
    id: 'applications',
    label: 'Applications',
    href: '/applications',
    icon: FileText,
    badge: '8',
    description: 'Track your applications'
  },
  {
    id: 'saved',
    label: 'Saved Jobs',
    href: '/saved',
    icon: Bookmark,
    description: 'Your bookmarked positions'
  },
  {
    id: 'messages',
    label: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    badge: '3',
    description: 'Communicate with employers'
  },
  {
    id: 'interviews',
    label: 'Interviews',
    href: '/interviews',
    icon: Calendar,
    description: 'Upcoming interviews'
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Manage your profile'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Account preferences'
  }
]

const supportNavigation: NavigationItem[] = [
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    icon: Phone,
    description: 'Get in touch with us'
  },
  {
    id: 'help',
    label: 'Help',
    href: '/help',
    icon: HelpCircle,
    description: 'Find answers and support'
  },
  {
    id: 'privacy',
    label: 'Privacy',
    href: '/privacy',
    icon: Shield,
    description: 'Privacy policy and data protection'
  },
  {
    id: 'terms',
    label: 'Terms',
    href: '/terms',
    icon: FileText,
    description: 'Terms of service'
  }
]

export function EnterpriseHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white shadow-sm'
    }`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Quantum-Powered Job Matching</span>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <a href="mailto:info@askyacham.com" className="flex items-center space-x-1 hover:text-blue-200">
                  <Mail className="h-3 w-3" />
                  <span>info@askyacham.com</span>
                </a>
                <a href="tel:+1-555-ASK-YACH" className="flex items-center space-x-1 hover:text-blue-200">
                  <Phone className="h-3 w-3" />
                  <span>+1 (555) ASK-YACH</span>
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Globe className="h-3 w-3" />
                <span>English</span>
                <ChevronDown className="h-3 w-3" />
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-gray-900">AskYaCham</div>
                <div className="text-xs text-gray-500">Quantum Job Matching</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavigation.map((item) => (
              <div key={item.id} className="relative dropdown-container">
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`flex items-center space-x-1 px-3 py-2 ${
                    isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {item.children && <ChevronDown className="h-3 w-3" />}
                </Button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === item.id && item.children && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      onMouseEnter={() => setActiveDropdown(item.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{child.label}</div>
                              <div className="text-sm text-gray-600">{child.description}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">{user?.name || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-900">{user?.name || 'User'}</div>
                        <div className="text-sm text-gray-600">{user?.email}</div>
                      </div>
                      <div className="py-2">
                        {userNavigation.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {item.icon && <item.icon className="h-4 w-4 text-gray-400" />}
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-4 space-y-4">
                {mainNavigation.map((item) => (
                  <div key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                        isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                    {item.children && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Support Links */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Support
                  </div>
                  {supportNavigation.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
