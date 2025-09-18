'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  ArrowUpRight, 
  Star, 
  Shield, 
  Zap, 
  TrendingUp,
  Award,
  CheckCircle,
  Sparkles
} from 'lucide-react'

interface EnterpriseCardProps {
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  badgeColor?: string
  highlights?: string[]
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary'
  }
  gradient?: string
  className?: string
  featured?: boolean
  stats?: {
    value: string
    label: string
    trend?: 'up' | 'down' | 'neutral'
  }
}

export function EnterpriseCard({
  title,
  description,
  icon: Icon,
  badge,
  badgeColor = 'bg-green-100 text-green-800',
  highlights = [],
  action,
  gradient = 'from-blue-500/10 to-purple-500/10',
  className,
  featured = false,
  stats
}: EnterpriseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-gray-300/50',
        featured && 'ring-2 ring-green-500/20 shadow-green-500/10',
        className
      )}
    >
      {/* Gradient Background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-300 group-hover:opacity-70',
        gradient
      )} />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                'p-3 rounded-xl transition-all duration-300 group-hover:scale-110',
                featured 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
              )}>
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                {title}
              </h3>
              {badge && (
                <Badge className={cn('mt-1 text-xs font-medium', badgeColor)}>
                  {badge}
                </Badge>
              )}
            </div>
          </div>
          
          {featured && (
            <div className="flex items-center gap-1 text-green-600">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">
          {description}
        </p>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="space-y-2 mb-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.value}</div>
            <div className="text-sm text-gray-600">{stats.label}</div>
            {stats.trend && (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                stats.trend === 'up' && 'text-green-600',
                stats.trend === 'down' && 'text-red-600',
                stats.trend === 'neutral' && 'text-gray-600'
              )}>
                <TrendingUp className={cn(
                  'h-3 w-3',
                  stats.trend === 'down' && 'rotate-180'
                )} />
                {stats.trend === 'up' && '↗'}
                {stats.trend === 'down' && '↘'}
                {stats.trend === 'neutral' && '→'}
              </div>
            )}
          </div>
        )}

        {/* Action */}
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="w-full group-hover:bg-green-600 group-hover:text-white transition-all duration-300"
          >
            {action.label}
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Button>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.div>
  )
}
