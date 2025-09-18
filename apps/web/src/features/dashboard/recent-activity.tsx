'use client'

import { motion } from 'framer-motion'
import { 
  DocumentTextIcon,
  EyeIcon,
  HeartIcon,
  BookmarkIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
  CpuChipIcon,
  BeakerIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

const activities = [
  {
    id: 1,
    type: 'application',
    title: 'Applied to Senior Software Engineer at Google',
    description: 'Your application has been submitted and is under review',
    time: '2 hours ago',
    icon: DocumentTextIcon,
    color: 'blue',
    status: 'pending'
  },
  {
    id: 2,
    type: 'view',
    title: 'Profile viewed by Microsoft Recruiter',
    description: 'Sarah Johnson from Microsoft viewed your profile',
    time: '4 hours ago',
    icon: EyeIcon,
    color: 'green',
    status: 'viewed'
  },
  {
    id: 3,
    type: 'match',
    title: 'New Quantum Computing Job Match Found',
    description: 'Quantum computing found 3 perfect matches based on your skills',
    time: '6 hours ago',
    icon: CpuChipIcon,
    color: 'purple',
    status: 'new'
  },
  {
    id: 4,
    type: 'connection',
    title: 'New connection request from John Doe',
    description: 'Senior Developer at Amazon wants to connect',
    time: '8 hours ago',
    icon: UserGroupIcon,
    color: 'indigo',
    status: 'pending'
  },
  {
    id: 5,
    type: 'research',
    title: 'Research paper published in Quantum Computing',
    description: 'Your paper on quantum algorithms is now live',
    time: '1 day ago',
    icon: BeakerIcon,
    color: 'orange',
    status: 'published'
  },
  {
    id: 6,
    type: 'saved',
    title: 'Saved job: Full Stack Developer at Netflix',
    description: 'Added to your saved jobs list',
    time: '2 days ago',
    icon: BookmarkIcon,
    color: 'yellow',
    status: 'saved'
  }
]

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  orange: 'from-orange-500 to-orange-600',
  yellow: 'from-yellow-500 to-yellow-600',
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  viewed: 'bg-green-100 text-green-800',
  new: 'bg-purple-100 text-purple-800',
  published: 'bg-blue-100 text-blue-800',
  saved: 'bg-gray-100 text-gray-800',
}

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
          <p className="text-sm text-slate-500">Your latest job search activities</p>
        </div>
        <button className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          <span>View All</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50/80 transition-colors group"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[activity.color as keyof typeof colorClasses]} shadow-lg flex-shrink-0`}>
              <activity.icon className="h-5 w-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                  {activity.title}
                </h4>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[activity.status as keyof typeof statusColors]}`}>
                  {activity.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                {activity.description}
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <ClockIcon className="h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 font-medium hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
          <SparklesIcon className="h-4 w-4" />
          <span>View All Activity</span>
        </button>
      </div>
    </motion.div>
  )
}