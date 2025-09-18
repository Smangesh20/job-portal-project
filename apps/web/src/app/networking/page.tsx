'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { motion } from 'framer-motion'
import { UserGroupIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

const events = [
  {
    id: 1,
    title: 'Tech Meetup SF',
    date: '2024-01-20',
    location: 'San Francisco, CA',
    attendees: '150+'
  },
  {
    id: 2,
    title: 'Quantum Computing Conference 2024',
    date: '2024-02-15',
    location: 'San Jose, CA',
    attendees: '500+'
  }
]

export default function NetworkingPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Networking</h1>
            <p className="text-slate-600">Connect with professionals and attend events</p>
          </motion.div>

          <div className="grid gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{event.attendees} attendees</p>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Join Event
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