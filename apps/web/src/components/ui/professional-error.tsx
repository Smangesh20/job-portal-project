'use client'

import { motion } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  WifiIcon,
  ServerIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { ErrorDetails } from '@/lib/error-handler'

interface ProfessionalErrorProps {
  error: ErrorDetails
  onDismiss?: () => void
  onRetry?: () => void
  className?: string
}

export function ProfessionalError({ 
  error, 
  onDismiss, 
  onRetry, 
  className = '' 
}: ProfessionalErrorProps) {
  const getIcon = () => {
    switch (error.type) {
      case 'validation':
        return <ExclamationTriangleIcon className="w-5 h-5" />
      case 'network':
        return <WifiIcon className="w-5 h-5" />
      case 'server':
        return <ServerIcon className="w-5 h-5" />
      case 'authentication':
        return <LockClosedIcon className="w-5 h-5" />
      case 'unknown':
        return <QuestionMarkCircleIcon className="w-5 h-5" />
      default:
        return <ExclamationTriangleIcon className="w-5 h-5" />
    }
  }

  const getSeverityStyles = () => {
    switch (error.severity) {
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-lg border p-4 ${getSeverityStyles()} ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {error.title}
            </h3>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="mt-1">
            <p className="text-sm">
              {error.message}
            </p>
            
            {error.action && (
              <p className="mt-2 text-xs font-medium">
                💡 {error.action}
              </p>
            )}
            
            {error.code && (
              <p className="mt-1 text-xs opacity-75">
                Error Code: {error.code}
              </p>
            )}
          </div>
          
          {onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className="inline-flex items-center text-xs font-medium hover:underline transition-colors"
              >
                <ArrowPathIcon className="w-3 h-3 mr-1" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
