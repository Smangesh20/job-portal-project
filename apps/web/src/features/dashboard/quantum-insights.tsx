'use client'

import { motion } from 'framer-motion'
import { CpuChipIcon, BeakerIcon, LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline'

export function QuantumInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
          <CpuChipIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-900">Quantum Insights</h3>
          <p className="text-sm text-purple-700">Quantum computing-powered career analysis</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 bg-white/60 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <BeakerIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Skill Gap Analysis</span>
          </div>
          <p className="text-xs text-purple-700">Consider learning React Native for mobile development opportunities</p>
        </div>
        
        <div className="p-3 bg-white/60 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <LightBulbIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Market Trend</span>
          </div>
          <p className="text-xs text-purple-700">Quantum computing jobs increased 45% this quarter</p>
        </div>
      </div>
    </motion.div>
  )
}
