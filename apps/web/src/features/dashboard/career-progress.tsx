'use client'

import { motion } from 'framer-motion'
import { TrophyIcon, StarIcon, FireIcon, BoltIcon } from '@heroicons/react/24/outline'

export function CareerProgress() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
          <TrophyIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Career Progress</h3>
          <p className="text-sm text-slate-500">Your professional journey</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Profile Completion</span>
          <span className="text-sm font-bold text-slate-900">85%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Skill Development</span>
          <span className="text-sm font-bold text-slate-900">72%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '72%' }}></div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Network Growth</span>
          <span className="text-sm font-bold text-slate-900">68%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '68%' }}></div>
        </div>
      </div>
    </motion.div>
  )
}
