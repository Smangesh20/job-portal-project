'use client'

import { motion } from 'framer-motion'
import { UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline'

export function NetworkingOpportunities() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
          <UserGroupIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Networking</h3>
          <p className="text-sm text-slate-500">Connect with professionals</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-900">Tech Meetup SF</p>
          <p className="text-xs text-slate-500">Tomorrow, 6:00 PM</p>
        </div>
        
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-900">Quantum Computing Conference 2024</p>
          <p className="text-xs text-slate-500">Next week</p>
        </div>
      </div>
    </motion.div>
  )
}
