'use client'

import { motion } from 'framer-motion'
import { AcademicCapIcon, PlayIcon } from '@heroicons/react/24/outline'

export function LearningRecommendations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
          <AcademicCapIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Learning</h3>
          <p className="text-sm text-slate-500">Upskill and grow</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-900">React Advanced Patterns</p>
          <p className="text-xs text-slate-500">2 hours • 85% complete</p>
        </div>
        
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-900">Quantum Computing Basics</p>
          <p className="text-xs text-slate-500">5 hours • New</p>
        </div>
      </div>
    </motion.div>
  )
}
