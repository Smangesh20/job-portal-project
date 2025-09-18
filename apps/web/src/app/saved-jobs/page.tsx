'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { motion } from 'framer-motion'
import { BookmarkIcon, HeartIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

const savedJobs = [
  {
    id: 1,
    title: 'Senior Quantum Computing Engineer',
    company: 'IBM Research',
    location: 'New York, NY',
    salary: '$180,000 - $220,000',
    savedDate: '2024-01-15'
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$150,000 - $180,000',
    savedDate: '2024-01-10'
  }
]

export default function SavedJobsPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Saved Jobs</h1>
            <p className="text-slate-600">Your favorite job opportunities</p>
          </motion.div>

          <div className="grid gap-6">
            {savedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-slate-600">{job.company}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <HeartIcon className="h-5 w-5" />
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </EnterpriseDashboardLayout>
    </ProtectedRoute>
  )
}