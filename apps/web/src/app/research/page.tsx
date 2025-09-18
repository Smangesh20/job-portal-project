'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { motion } from 'framer-motion'
import { BeakerIcon, DocumentTextIcon, LightBulbIcon } from '@heroicons/react/24/outline'

export default function ResearchPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Research Lab</h1>
            <p className="text-slate-600">Quantum computing and AI research</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
                <BeakerIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900">Research Papers</h3>
                <p className="text-sm text-blue-700">Published research and findings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Quantum Job Matching Algorithms</span>
                </div>
                <p className="text-xs text-blue-700">Published in Nature Quantum Computing, 2024</p>
              </div>
              
              <div className="p-4 bg-white/60 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <LightBulbIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Quantum Computing-Powered Career Prediction</span>
                </div>
                <p className="text-xs text-blue-700">Published in IEEE Transactions, 2024</p>
              </div>
            </div>
          </motion.div>
        </div>
      </EnterpriseDashboardLayout>
    </ProtectedRoute>
  )
}
