'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleGetStarted = () => {
    if (email) {
      router.push(`/auth/register?email=${encodeURIComponent(email)}`)
    } else {
      router.push('/auth/register')
    }
  }

  const handleSignIn = () => {
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Badge variant="secondary" className="mb-8">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Quantum-Powered Job Matching
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Find Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dream Job
            </span>
            <br />
            with Quantum Precision
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with opportunities that match your skills, values, and career aspirations. 
            Our advanced quantum computing technology ensures perfect matches.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="w-full sm:w-auto"
            >
              Get Started
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Smart Job Matching</CardTitle>
              <CardDescription>
                Our quantum algorithms analyze your profile and match you with the perfect opportunities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Get insights into your job search performance and optimize your applications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Professional Network</CardTitle>
              <CardDescription>
                Connect with industry professionals and expand your career network.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Job Search Section */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Your Next Opportunity
            </h2>
            <p className="text-lg text-gray-600">
              Search through thousands of jobs matched to your skills and preferences
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <Input placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input placeholder="e.g. San Francisco, CA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Any Level</option>
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Search Jobs
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Remote</Badge>
                <Badge variant="secondary">Full-time</Badge>
                <Badge variant="secondary">Tech</Badge>
                <Badge variant="secondary">Startup</Badge>
                <Badge variant="secondary">AI/ML</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Jobs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
            <div className="text-gray-600">Companies</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
            <div className="text-gray-600">Job Seekers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
            <div className="text-gray-600">Match Accuracy</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AskYaCham</h3>
              <p className="text-gray-600 text-sm">
                Quantum-powered job matching platform connecting talented professionals with innovative companies.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/jobs" className="hover:text-blue-600">Browse Jobs</a></li>
                <li><a href="/career-tools" className="hover:text-blue-600">Career Tools</a></li>
                <li><a href="/resources" className="hover:text-blue-600">Resources</a></li>
                <li><a href="/ai-insights" className="hover:text-blue-600">AI Insights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/companies" className="hover:text-blue-600">Post Jobs</a></li>
                <li><a href="/pricing" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="/solutions" className="hover:text-blue-600">Solutions</a></li>
                <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/help" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="/contact" className="hover:text-blue-600">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 AskYaCham. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}