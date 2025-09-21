'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  BriefcaseIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

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
      {/* Hero Section - Clean and Professional */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8">
            AskYaCham
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-light text-gray-600 mb-12">
            Quantum-Powered Job Matching Platform
          </h2>
          
          <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto leading-relaxed">
            Connect with opportunities that match your skills, values, and career aspirations. 
            Our advanced quantum computing technology ensures perfect matches.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto mb-16">
            <Button 
              size="lg" 
              onClick={handleSignIn}
              variant="outline"
              className="w-full sm:w-auto px-8 py-3 text-lg border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
            >
              Sign In
            </Button>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BriefcaseIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Matching</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced quantum algorithms match you with opportunities that align with your skills and career goals.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChartBarIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data-Driven Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Get personalized analytics and recommendations to optimize your job search strategy.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserGroupIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Network</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with industry leaders and expand your professional network for career growth.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-32 text-center">
          <p className="text-lg text-gray-500 mb-8">Trusted by professionals worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-2xl font-bold text-gray-400">50K+</div>
            <div className="text-2xl font-bold text-gray-400">10K+</div>
            <div className="text-2xl font-bold text-gray-400">100K+</div>
            <div className="text-2xl font-bold text-gray-400">95%</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-400 mt-2">
            <div>Active Jobs</div>
            <div>Companies</div>
            <div>Job Seekers</div>
            <div>Match Accuracy</div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2024 AskYaCham. All rights reserved. | 
            <a href="/privacy" className="ml-2 hover:text-blue-600">Privacy</a> | 
            <a href="/terms" className="ml-2 hover:text-blue-600">Terms</a>
          </p>
        </div>
      </footer>
    </div>
  )
}