'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Briefcase, 
  Users, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Filter,
  Plus,
  Menu,
  X
} from 'lucide-react'

interface MobileDashboardProps {
  children: ReactNode
  className?: string
}

export function MobileDashboard({ children, className }: MobileDashboardProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 mobile-min-h-screen', className)}>
      {children}
    </div>
  )
}

interface MobileDashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function MobileDashboardHeader({ 
  title, 
  subtitle, 
  actions, 
  className 
}: MobileDashboardHeaderProps) {
  return (
    <div className={cn(
      'mobile-px mobile-py bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mobile-sticky mobile-top-0 mobile-z-40',
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mobile-text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mobile-text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center mobile-gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

interface MobileDashboardContentProps {
  children: ReactNode
  className?: string
}

export function MobileDashboardContent({ children, className }: MobileDashboardContentProps) {
  return (
    <div className={cn('mobile-px mobile-py mobile-container-xl', className)}>
      {children}
    </div>
  )
}

interface MobileCardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  actions?: ReactNode
  onClick?: () => void
}

export function MobileCard({ 
  children, 
  className, 
  title, 
  subtitle, 
  actions, 
  onClick 
}: MobileCardProps) {
  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mobile-px mobile-py mobile-shadow-sm mobile-transition-all',
        onClick && 'cursor-pointer hover:shadow-md active:scale-95',
        className
      )}
      onClick={onClick}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between mobile-my">
          <div>
            {title && (
              <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mobile-text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center mobile-gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

interface MobileStatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
  className?: string
}

export function MobileStatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  className 
}: MobileStatsCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <MobileCard className={cn('mobile-px mobile-py', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="mobile-text-sm text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mobile-text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p className={cn('mobile-text-xs', changeColor[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </MobileCard>
  )
}

interface MobileListProps {
  children: ReactNode
  className?: string
  title?: string
  emptyMessage?: string
}

export function MobileList({ 
  children, 
  className, 
  title, 
  emptyMessage 
}: MobileListProps) {
  return (
    <div className={cn('mobile-gap-2', className)}>
      {title && (
        <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white mobile-my">
          {title}
        </h3>
      )}
      {children || (
        <div className="text-center mobile-py">
          <p className="mobile-text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage || 'No items found'}
          </p>
        </div>
      )}
    </div>
  )
}

interface MobileListItemProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function MobileListItem({ 
  children, 
  className, 
  onClick, 
  leftIcon, 
  rightIcon 
}: MobileListItemProps) {
  return (
    <div 
      className={cn(
        'flex items-center mobile-px mobile-py bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mobile-transition-all mobile-touch-manipulation',
        onClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95',
        className
      )}
      onClick={onClick}
    >
      {leftIcon && (
        <div className="flex-shrink-0 mr-3 text-gray-400">
          {leftIcon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {rightIcon && (
        <div className="flex-shrink-0 ml-3 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  )
}

interface MobileBottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export function MobileBottomNavigation({ 
  activeTab, 
  onTabChange, 
  className 
}: MobileBottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className={cn(
      'mobile-fixed mobile-bottom-0 mobile-left-0 mobile-right-0 mobile-z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mobile-px mobile-py',
      className
    )}>
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center mobile-px mobile-py mobile-gap-1 mobile-transition-all mobile-touch-manipulation',
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <IconComponent className="h-5 w-5 mobile-scale-95" />
              <span className="mobile-text-xs font-medium">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface MobileFloatingActionButtonProps {
  onClick: () => void
  icon: ReactNode
  className?: string
}

export function MobileFloatingActionButton({ 
  onClick, 
  icon, 
  className 
}: MobileFloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'mobile-fixed mobile-bottom-20 mobile-right-4 mobile-z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 mobile-transition-all mobile-touch-manipulation mobile-focus-visible',
        className
      )}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
    </button>
  )
}

interface MobileSearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
}

export function MobileSearchBar({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onSearch,
  className 
}: MobileSearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('mobile-px mobile-py', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent mobile-focus-visible mobile-touch-manipulation"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 mobile-px mobile-py mobile-text-sm text-blue-600 hover:text-blue-700 mobile-transition-all"
        >
          Search
        </button>
      </div>
    </form>
  )
}

interface MobileFilterBarProps {
  filters: Array<{
    id: string
    label: string
    options: Array<{ value: string; label: string }>
    value: string
    onChange: (value: string) => void
  }>
  className?: string
}

export function MobileFilterBar({ filters, className }: MobileFilterBarProps) {
  return (
    <div className={cn('mobile-px mobile-py bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700', className)}>
      <div className="flex items-center mobile-gap-2 overflow-x-auto mobile-scrollbar-hide">
        {filters.map((filter) => (
          <select
            key={filter.id}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="mobile-px mobile-py mobile-text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mobile-focus-visible mobile-touch-manipulation"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  )
}
