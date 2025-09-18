'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { QuantumDashboard } from '@/components/quantum/quantum-dashboard'
import { motion } from 'framer-motion'
import { CpuChipIcon, SparklesIcon, BeakerIcon } from '@heroicons/react/24/outline'

export default function QuantumMatchingPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Quantum Matching</h1>
            <p className="text-slate-600">Quantum computing-powered job matching using quantum algorithms</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
                <CpuChipIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-900">Quantum Computing Engine</h3>
                <p className="text-sm text-purple-700">Advanced matching algorithms</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <SparklesIcon className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Quantum Entanglement Matching</span>
                </div>
                <p className="text-xs text-purple-700">Uses quantum entanglement principles to find perfect job matches</p>
              </div>
              
              <div className="p-4 bg-white/60 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <BeakerIcon className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Superposition Analysis</span>
                </div>
                <p className="text-xs text-purple-700">Analyzes multiple career paths simultaneously</p>
              </div>
            </div>
          </motion.div>

          {/* Real Quantum Computing Dashboard */}
          <QuantumDashboard />
        </div>
      </EnterpriseDashboardLayout>
    </ProtectedRoute>
  )
}
