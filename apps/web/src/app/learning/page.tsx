'use client'

import { ProtectedRoute } from '@/components/auth/route-guard'
import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'
import { motion } from 'framer-motion'
import { AcademicCapIcon, PlayIcon, ClockIcon } from '@heroicons/react/24/outline'

const courses = [
  {
    id: 1,
    title: 'React Advanced Patterns',
    duration: '2 hours',
    progress: 85,
    instructor: 'John Doe'
  },
  {
    id: 2,
    title: 'Quantum Computing Basics',
    duration: '5 hours',
    progress: 0,
    instructor: 'Dr. Jane Smith'
  }
]

export default function LearningPage() {
  return (
    <ProtectedRoute>
      <EnterpriseDashboardLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Learning</h1>
            <p className="text-slate-600">Upskill and grow with our courses</p>
          </motion.div>

          <div className="grid gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">{course.title}</h3>
                    <p className="text-slate-600">by {course.instructor}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-sm">{course.duration}</span>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{course.progress}% complete</p>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Continue
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
