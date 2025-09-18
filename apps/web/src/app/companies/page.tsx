'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { motion } from 'framer-motion'
import { BuildingOfficeIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline'

const companies = [
  {
    id: 1,
    name: 'Google',
    location: 'Mountain View, CA',
    employees: '190,000+',
    industry: 'Technology'
  },
  {
    id: 2,
    name: 'Netflix',
    location: 'Los Gatos, CA',
    employees: '12,000+',
    industry: 'Entertainment'
  }
]

export default function CompaniesPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
            <p className="text-slate-600">Explore companies and their opportunities</p>
          </motion.div>

          <div className="grid gap-6">
            {companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">{company.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">{company.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <UsersIcon className="h-4 w-4" />
                        <span className="text-sm">{company.employees}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{company.industry}</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View Jobs
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </EnterpriseDashboardLayout>
    </ProtectedRoute>
  )
}
