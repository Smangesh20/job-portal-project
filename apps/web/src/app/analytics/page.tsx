'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { motion } from 'framer-motion'
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-600">Career insights and performance metrics</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Career Analytics</h3>
                <p className="text-sm text-slate-500">Track your professional growth</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">Profile Views</p>
                    <p className="text-2xl font-bold text-green-600">2,847</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-green-700 mt-2">+12% from last month</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Applications</p>
                    <p className="text-2xl font-bold text-blue-600">23</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-blue-700 mt-2">+8% from last month</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Network Growth</p>
                    <p className="text-2xl font-bold text-purple-600">1,247</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs text-purple-700 mt-2">+23% from last month</p>
              </div>
            </div>
          </motion.div>
        </div>
      </EnterpriseDashboardLayout>
    </ProtectedRoute>
  )
}
