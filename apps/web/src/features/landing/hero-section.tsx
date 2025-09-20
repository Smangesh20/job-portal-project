'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export function HeroSection() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleGetStarted = () => {
    if (email) {
      router.push(`/register?email=${encodeURIComponent(email)}`)
    } else {
      router.push('/register')
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-primary-100/20 to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-secondary-200/30 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent-200/30 rounded-full blur-xl animate-pulse delay-2000" />

      <div className="relative mobile-container-xl mobile-py">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mobile-px mobile-py mobile-text-sm font-medium">
              <SparklesIcon className="w-4 h-4 mr-2 mobile-scale-95" />
              <span className="mobile-hidden">Quantum Computing-Powered Job Matching Platform</span>
              <span className="mobile-only">Quantum Job Matching</span>
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mobile-text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mobile-my"
          >
            <span className="mobile-hidden">
              Find Your{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />
              with Quantum Computing Precision
            </span>
            <span className="mobile-only">
              Find Your{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />
              with Quantum Precision
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mobile-text-lg sm:text-xl md:text-2xl text-gray-600 mobile-my max-w-3xl mx-auto leading-relaxed"
          >
            <span className="mobile-hidden">
              Connect with opportunities that match your skills, values, and career aspirations. 
              Our advanced quantum computing technology ensures perfect matches between talented professionals and innovative companies.
            </span>
            <span className="mobile-only">
              Connect with opportunities that match your skills and career aspirations. 
              Our quantum technology ensures perfect matches.
            </span>
          </motion.p>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mobile-flex-col mobile-gap-4 mobile-justify-center mobile-items-center mobile-my"
          >
            <div className="mobile-flex-col mobile-gap-4 mobile-w-full max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 mobile-focus-visible mobile-touch-manipulation"
              />
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="w-full sm:w-auto mobile-touch-manipulation mobile-scale-95"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2 mobile-scale-95" />
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                50K+
              </div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                1K+
              </div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                95%
              </div>
              <div className="text-gray-600">Match Success</div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Matching
              </h3>
              <p className="text-gray-600">
                Quantum computing-powered algorithms match you with opportunities based on skills, culture, and career goals.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BuildingOfficeIcon className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Top Companies
              </h3>
              <p className="text-gray-600">
                Connect with leading companies and startups that value talent and innovation.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Career Insights
              </h3>
              <p className="text-gray-600">
                Get personalized career guidance and market insights to accelerate your growth.
              </p>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-6">Trusted by professionals worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Company logos would go here */}
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Global Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Quantum Computing-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Data-Driven</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
