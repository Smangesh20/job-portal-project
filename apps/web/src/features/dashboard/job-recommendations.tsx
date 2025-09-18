'use client'

import { motion } from 'framer-motion'
import { 
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  HeartIcon,
  BookmarkIcon,
  ArrowRightIcon,
  SparklesIcon,
  CpuChipIcon,
  BeakerIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  EyeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

const recommendations = [
  {
    id: 1,
    title: 'Senior Quantum Computing Engineer',
    company: 'IBM Research',
    location: 'New York, NY',
    salary: '$180,000 - $220,000',
    type: 'Full-time',
    match: 95,
    posted: '2 hours ago',
    description: 'Lead quantum algorithm development and research',
    tags: ['Quantum Computing', 'Python', 'Machine Learning'],
    featured: true,
    quantum: true
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$150,000 - $180,000',
    type: 'Full-time',
    match: 88,
    posted: '4 hours ago',
    description: 'Build scalable streaming platforms',
    tags: ['React', 'Node.js', 'AWS'],
    featured: false,
    quantum: false
  },
  {
    id: 3,
    title: 'Quantum Computing Research Scientist',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    salary: '$200,000 - $250,000',
    type: 'Full-time',
    match: 92,
    posted: '6 hours ago',
    description: 'Advance artificial intelligence research',
    tags: ['Quantum Computing', 'Python', 'TensorFlow'],
    featured: true,
    quantum: true
  }
]

export function JobRecommendations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Job Recommendations</h3>
          <p className="text-sm text-slate-500">Quantum computing-powered matches for you</p>
        </div>
        <button className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          <span>View All</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {recommendations.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
          >
            {job.featured && (
              <div className="absolute -top-2 -right-2 flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                <StarIcon className="h-3 w-3" />
                <span>Featured</span>
              </div>
            )}
            
            {job.quantum && (
              <div className="absolute -top-2 -left-2 flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                <CpuChipIcon className="h-3 w-3" />
                <span>Quantum</span>
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors mb-1">
                  {job.title}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
                  <BuildingOfficeIcon className="h-4 w-4" />
                  <span>{job.company}</span>
                  <span>•</span>
                  <MapPinIcon className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {job.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <CurrencyDollarIcon className="h-3 w-3" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>{job.type}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  <SparklesIcon className="h-3 w-3" />
                  <span>{job.match}% match</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {job.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                    {tag}
                  </span>
                ))}
                {job.tags.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                    +{job.tags.length - 2} more
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                  <HeartIcon className="h-4 w-4" />
                </button>
                <button className="p-1 text-slate-400 hover:text-blue-500 transition-colors">
                  <BookmarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Posted {job.posted}</span>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 font-medium hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
          <MagnifyingGlassIcon className="h-4 w-4" />
          <span>Find More Jobs</span>
        </button>
      </div>
    </motion.div>
  )
}