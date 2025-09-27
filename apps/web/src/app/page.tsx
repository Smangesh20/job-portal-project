'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRightIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleSignIn = () => {
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Ask Ya Cham</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleSignIn}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Sign In
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Dream Job with
            <span className="text-blue-600"> AI-Powered Matching</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with top companies and discover opportunities that match your skills, 
            experience, and career goals. Our advanced AI ensures you find the perfect fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Start Your Journey
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={handleSignIn}
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Ask Ya Cham?
          </h2>
          <p className="text-lg text-gray-600">
            Professional, enterprise-level job matching platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your profile and matches you with the perfect job opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Enterprise-Level Security
              </h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security and privacy measures.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Career Growth
              </h3>
              <p className="text-gray-600">
                Access resources and opportunities that help you grow and advance your career.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have found their perfect match with Ask Ya Cham.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg"
          >
            Get Started Today
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ask Ya Cham</h3>
            <p className="text-gray-400 mb-4">
              Professional job matching platform for career growth
            </p>
            <div className="flex justify-center space-x-6">
              <Button
                onClick={handleSignIn}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Sign In
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}