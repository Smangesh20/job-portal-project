'use client'

import { motion } from 'framer-motion'
import { StarIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline'

export function SuccessStories() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
          <TrophyIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Success Stories</h3>
          <p className="text-sm text-slate-500">Inspiring career journeys</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">JS</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">John Smith</p>
              <p className="text-xs text-blue-700">Software Engineer at Google</p>
            </div>
          </div>
          <p className="text-sm text-blue-800">"Found my dream job through Ask Ya Cham's quantum matching algorithm!"</p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">SM</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-900">Sarah Miller</p>
              <p className="text-xs text-green-700">Quantum Computing Researcher at OpenAI</p>
            </div>
          </div>
          <p className="text-sm text-green-800">"The platform's research features helped me publish 3 papers this year!"</p>
        </div>
      </div>
    </motion.div>
  )
}
