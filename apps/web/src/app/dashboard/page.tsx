'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { DashboardStats } from '@/features/dashboard/dashboard-stats'
import { RecentActivity } from '@/features/dashboard/recent-activity'
import { JobRecommendations } from '@/features/dashboard/job-recommendations'
import { QuickActions } from '@/features/dashboard/quick-actions'
import { QuantumInsights } from '@/features/dashboard/quantum-insights'
import { CareerProgress } from '@/features/dashboard/career-progress'
import { MarketTrends } from '@/features/dashboard/market-trends'
import { NetworkingOpportunities } from '@/features/dashboard/networking-opportunities'
import { LearningRecommendations } from '@/features/dashboard/learning-recommendations'
import { SuccessStories } from '@/features/dashboard/success-stories'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  RocketLaunchIcon, 
  TrophyIcon, 
  FireIcon,
  BoltIcon,
  StarIcon,
  EyeIcon,
  CpuChipIcon,
  BeakerIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  HeartIcon,
  BookmarkIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-8 bg-white p-6 rounded-lg">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome to Your Quantum Career Hub
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Discover opportunities powered by cutting-edge quantum computing
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                    <SparklesIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Quantum Computing Active</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                    <RocketLaunchIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Premium Member</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </motion.div>

          {/* Stats Overview */}
          <DashboardStats />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Career Progress */}
              <CareerProgress />

              {/* Recent Activity */}
              <RecentActivity />

              {/* Market Trends */}
              <MarketTrends />
            </div>

            {/* Right Column - Sidebar Content */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <QuickActions />

              {/* Job Recommendations */}
              <JobRecommendations />

              {/* Quantum Insights */}
              <QuantumInsights />

              {/* Networking Opportunities */}
              <NetworkingOpportunities />

              {/* Learning Recommendations */}
              <LearningRecommendations />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Success Stories */}
            <SuccessStories />

            {/* Additional Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Premium Features */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                    <TrophyIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900">Premium Features</h3>
                    <p className="text-sm text-amber-700">Unlock advanced capabilities</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-amber-800">Advanced Quantum Computing Job Matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-amber-800">Priority Application Processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-amber-800">Exclusive Networking Events</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-amber-800">Quantum Computing Research Access</span>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <ShieldCheckIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">System Status</h3>
                    <p className="text-sm text-green-700">All systems operational</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">Quantum Computing Engine</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">Job Matching Service</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">Research Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </EnterpriseDashboardLayout>
    </ProtectedRoute>
  )
}