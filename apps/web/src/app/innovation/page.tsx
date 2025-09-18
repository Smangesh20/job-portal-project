'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { motion } from 'framer-motion'
import { LightBulbIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function InnovationPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Innovation Hub</h1>
            <p className="text-slate-600">Cutting-edge technology and innovation</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                <LightBulbIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-900">Innovation Projects</h3>
                <p className="text-sm text-amber-700">Next-generation technology development</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <RocketLaunchIcon className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">Quantum Neural Networks</span>
                </div>
                <p className="text-xs text-amber-700">Developing quantum-enhanced computing for job matching</p>
              </div>
              
              <div className="p-4 bg-white/60 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <SparklesIcon className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">Blockchain Career Verification</span>
                </div>
                <p className="text-xs text-amber-700">Immutable career history verification system</p>
              </div>
            </div>
          </motion.div>
        </div>
      </EnterpriseDashboardLayout>
    </ProtectedRoute>
  )
}
