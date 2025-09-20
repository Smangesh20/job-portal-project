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
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">AskYaCham</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

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
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 AskYaCham. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}