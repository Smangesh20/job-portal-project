'use client'

import { motion } from 'framer-motion'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CpuChipIcon,
  BeakerIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  StarIcon,
  EyeIcon,
  BuildingOfficeIcon,
  HeartIcon,
  BookmarkIcon,
  BellAlertIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

const actions = [
  {
    name: 'Search Jobs',
    description: 'Find your next opportunity',
    icon: MagnifyingGlassIcon,
    color: 'blue',
    href: '/jobs'
  },
  {
    name: 'Update Profile',
    description: 'Enhance your visibility',
    icon: DocumentTextIcon,
    color: 'green',
    href: '/profile'
  },
  {
    name: 'Network',
    description: 'Connect with professionals',
    icon: UserGroupIcon,
    color: 'purple',
    href: '/networking'
  },
  {
    name: 'Learn',
    description: 'Upskill and grow',
    icon: AcademicCapIcon,
    color: 'orange',
    href: '/learning'
  }
]

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
}

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
        <p className="text-sm text-slate-500">Get started with these actions</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[action.color as keyof typeof colorClasses]} shadow-lg mb-3`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors mb-1">
              {action.name}
            </h4>
            <p className="text-xs text-slate-500">
              {action.description}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}