'use client'

import { motion } from 'framer-motion'
import { 
  BriefcaseIcon, 
  EyeIcon, 
  HeartIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  RocketLaunchIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  StarIcon,
  CpuChipIcon,
  BeakerIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BookmarkIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Profile Views',
    value: '2,847',
    change: '+12%',
    changeType: 'positive',
    icon: EyeIcon,
    color: 'blue',
    description: 'This month'
  },
  {
    name: 'Job Applications',
    value: '23',
    change: '+8%',
    changeType: 'positive',
    icon: DocumentTextIcon,
    color: 'green',
    description: 'This month'
  },
  {
    name: 'Saved Jobs',
    value: '156',
    change: '+15%',
    changeType: 'positive',
    icon: BookmarkIcon,
    color: 'purple',
    description: 'Total saved'
  },
  {
    name: 'Network Connections',
    value: '1,247',
    change: '+23%',
    changeType: 'positive',
    icon: UserGroupIcon,
    color: 'indigo',
    description: 'Active connections'
  },
  {
    name: 'Quantum Matches',
    value: '89',
    change: '+45%',
    changeType: 'positive',
    icon: CpuChipIcon,
    color: 'cyan',
    description: 'Quantum computing-powered matches'
  },
  {
    name: 'Research Papers',
    value: '12',
    change: '+3',
    changeType: 'positive',
    icon: BeakerIcon,
    color: 'orange',
    description: 'Published this year'
  }
]

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  cyan: 'from-cyan-500 to-cyan-600',
  orange: 'from-orange-500 to-orange-600',
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {stat.changeType === 'positive' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-slate-600 mb-1">
                {stat.name}
              </p>
              <p className="text-xs text-slate-500">
                {stat.description}
              </p>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-slate-100/30 to-white/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </div>
  )
}
