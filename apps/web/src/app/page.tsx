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
  CheckCircleIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon,
  TrophyIcon,
  HeartIcon,
  EyeIcon,
  PlayIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon
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

  // 🚀 GOOGLE SIGN-IN - WORKS IMMEDIATELY
  const handleGoogleSignIn = () => {
    const googleUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      'client_id=1082042683309-meo1kq8oupj1jkg0bj2e06aecg6nn6gn.apps.googleusercontent.com&' +
      'redirect_uri=' + encodeURIComponent(window.location.origin + '/api/auth/google/callback') + '&' +
      'response_type=code&' +
      'scope=openid%20email%20profile&' +
      'state=' + Math.random().toString(36).substring(2, 15) + '&' +
      'access_type=offline&' +
      'prompt=consent'
    
    window.location.href = googleUrl
  }

  // 🚀 EMAIL TEST - WORKS IMMEDIATELY
  const handleEmailTest = async () => {
    try {
      const response = await fetch('/api/email-bulletproof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pullareddypullareddy20@gmail.com' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ EMAIL SENT SUCCESSFULLY!\n\n📧 Email: ' + data.data.email + '\n📧 Status: ' + data.data.status + '\n📧 Time: ' + data.data.timestamp + '\n\n✅ CHECK YOUR EMAIL NOW!')
      } else {
        alert('❌ Email failed: ' + data.error)
      }
    } catch (error) {
      alert('❌ Email error: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - World-Class Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
            {/* Badge */}
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 px-6 py-2 text-sm font-semibold">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Quantum-Powered Job Matching Platform
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Find Your{' '}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />
              with Quantum Precision
          </h1>
          
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with opportunities that match your skills, values, and career aspirations. 
            Our advanced quantum computing technology ensures perfect matches.
          </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            <Button 
              size="lg" 
              onClick={handleSignIn}
              variant="outline"
                className="border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* 🚀 WORKING GOOGLE SIGN-IN & EMAIL BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              <button
                onClick={handleEmailTest}
                className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Test Email NOW
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center">
                <GlobeAltIcon className="w-5 h-5 mr-2 text-blue-500" />
                <span>Global Reach</span>
              </div>
              <div className="flex items-center">
                <CpuChipIcon className="w-5 h-5 mr-2 text-purple-500" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose AskYaCham?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of job matching with our cutting-edge quantum computing technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <BriefcaseIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Matching</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced quantum algorithms analyze your skills, preferences, and career goals to find the perfect job matches with 95% accuracy.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <ChartBarIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Data-Driven Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized analytics and recommendations to optimize your job search strategy and career development.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Network</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with industry leaders, mentors, and peers to expand your professional network and accelerate career growth.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-6">
                  <BoltIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get instant job matches and real-time notifications. Our quantum computing technology processes millions of possibilities in seconds.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <TrophyIcon className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Stories</h3>
                <p className="text-gray-600 leading-relaxed">
                  Join thousands of professionals who have found their dream jobs through our platform. Average salary increase of 40%.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <HeartIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Experience</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every interaction is tailored to your preferences. Our AI learns from your behavior to provide increasingly better matches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Join thousands of successful professionals who have transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-2">50K+</div>
              <div className="text-purple-100 text-lg">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-2">10K+</div>
              <div className="text-purple-100 text-lg">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-2">100K+</div>
              <div className="text-purple-100 text-lg">Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-2">95%</div>
              <div className="text-purple-100 text-lg">Match Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have already transformed their careers with AskYaCham
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <RocketLaunchIcon className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">AskYaCham</h3>
                  <p className="text-gray-400 text-sm">Quantum Job Matching</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The world's first quantum-powered job matching platform. Find your dream job with precision and speed.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm font-semibold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm font-semibold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="/features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/api" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
          </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 AskYaCham. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
          </div>
          </div>
        </div>
      </footer>
    </div>
  )
}