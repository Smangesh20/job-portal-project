'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Home, 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  AlertCircle,
  ExternalLink,
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
  Calendar,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Brain,
  Award,
  Zap,
  Lightbulb,
  GraduationCap,
  Network,
  Target
} from 'lucide-react'
import Link from 'next/link'

// GOOGLE-STYLE 404 PAGE - NEVER FAILS, ALWAYS HELPFUL
export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    // Google-style intelligent suggestions based on the URL
    const generateSuggestions = () => {
      const path = pathname.toLowerCase()
      const suggestions = []

      // Job-related suggestions
      if (path.includes('job')) {
        suggestions.push(
          { title: 'All Jobs', href: '/jobs', icon: Briefcase, description: 'Browse all available job opportunities' },
          { title: 'Applied Jobs', href: '/jobs/applied', icon: FileText, description: 'Track your job applications' },
          { title: 'Saved Jobs', href: '/jobs/saved', icon: BookOpen, description: 'View your saved job listings' },
          { title: 'Recommended Jobs', href: '/jobs/recommended', icon: Target, description: 'AI-powered job recommendations' }
        )
      }

      // Company-related suggestions
      if (path.includes('compan')) {
        suggestions.push(
          { title: 'All Companies', href: '/companies', icon: Building2, description: 'Explore all companies' },
          { title: 'Top Companies', href: '/companies/top', icon: BarChart3, description: 'Leading companies in the industry' },
          { title: 'Startups', href: '/companies/startups', icon: Zap, description: 'Innovative startup companies' },
          { title: 'Fortune 500', href: '/companies/fortune-500', icon: Award, description: 'Fortune 500 companies' }
        )
      }

      // Application-related suggestions
      if (path.includes('applicat')) {
        suggestions.push(
          { title: 'All Applications', href: '/applications', icon: FileText, description: 'View all your applications' },
          { title: 'Pending Applications', href: '/applications/pending', icon: RefreshCw, description: 'Applications under review' },
          { title: 'Interviewed', href: '/applications/interviewed', icon: Calendar, description: 'Applications with interviews' },
          { title: 'Rejected', href: '/applications/rejected', icon: AlertCircle, description: 'Rejected applications' }
        )
      }

      // AI and insights suggestions
      if (path.includes('ai') || path.includes('insight') || path.includes('quantum')) {
        suggestions.push(
          { title: 'AI Insights', href: '/ai-insights', icon: Brain, description: 'AI-powered career insights' },
          { title: 'Quantum Matching', href: '/quantum-matching', icon: Zap, description: 'Advanced job matching technology' },
          { title: 'Resume Matching', href: '/resume-matching', icon: Lightbulb, description: 'Smart resume analysis' }
        )
      }

      // Career tools suggestions
      if (path.includes('career') || path.includes('tool') || path.includes('resume') || path.includes('interview')) {
        suggestions.push(
          { title: 'Resume Builder', href: '/career-tools/resume', icon: FileText, description: 'Build your professional resume' },
          { title: 'Interview Prep', href: '/career-tools/interview', icon: Calendar, description: 'Prepare for interviews' },
          { title: 'Skills Assessment', href: '/career-tools/skills', icon: Target, description: 'Assess your skills' },
          { title: 'Career Path', href: '/career-tools/path', icon: User, description: 'Plan your career path' }
        )
      }

      // Resources suggestions
      if (path.includes('resource') || path.includes('learn') || path.includes('network') || path.includes('research') || path.includes('innovation')) {
        suggestions.push(
          { title: 'Learning', href: '/learning', icon: GraduationCap, description: 'Educational resources' },
          { title: 'Networking', href: '/networking', icon: Network, description: 'Professional networking tools' },
          { title: 'Research', href: '/research', icon: Search, description: 'Industry research and insights' },
          { title: 'Innovation', href: '/innovation', icon: Lightbulb, description: 'Innovation and trends' }
        )
      }

      // Default suggestions if no specific match
      if (suggestions.length === 0) {
        suggestions.push(
          { title: 'Dashboard', href: '/dashboard', icon: Home, description: 'Your main dashboard' },
          { title: 'All Jobs', href: '/jobs', icon: Briefcase, description: 'Browse job opportunities' },
          { title: 'Companies', href: '/companies', icon: Building2, description: 'Explore companies' },
          { title: 'Applications', href: '/applications', icon: FileText, description: 'Track your applications' },
          { title: 'Messages', href: '/messages', icon: MessageSquare, description: 'Your messages' },
          { title: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Your analytics' },
          { title: 'Profile', href: '/profile', icon: User, description: 'Your profile' },
          { title: 'Settings', href: '/settings', icon: Settings, description: 'Account settings' },
          { title: 'Help', href: '/help', icon: HelpCircle, description: 'Get help and support' }
        )
      }

      setSuggestions(suggestions.slice(0, 6)) // Show top 6 suggestions
    }

    generateSuggestions()
  }, [pathname])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <code className="text-sm text-gray-600 dark:text-gray-400">
                {pathname}
              </code>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => router.push('/dashboard')}>
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button onClick={() => router.push('/jobs')} variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Jobs
              </Button>
            </div>

            {/* Intelligent Suggestions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                You might be looking for:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion, index) => (
                  <Link
                    key={index}
                    href={suggestion.href}
                    className="group p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <suggestion.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {suggestion.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Need Help?
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                If you can't find what you're looking for, our support team is here to help.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => router.push('/help')}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push('/contact')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

















