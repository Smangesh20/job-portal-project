'use client'

import { motion } from 'framer-motion'
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export function MarketTrends() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
          <ChartBarIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Market Trends</h3>
          <p className="text-sm text-slate-500">Industry insights</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-green-900">Software Engineering</p>
            <p className="text-xs text-green-700">+15% job growth</p>
          </div>
          <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-blue-900">Quantum Computing/ML</p>
            <p className="text-xs text-blue-700">+28% job growth</p>
          </div>
          <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-purple-900">Quantum Computing</p>
            <p className="text-xs text-purple-700">+45% job growth</p>
          </div>
          <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
        </div>
      </div>
    </motion.div>
  )
}
