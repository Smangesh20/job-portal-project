'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Star,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { forwardRef } from 'react'

interface EnterpriseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: React.ComponentType<{ className?: string }>
  iconPosition?: 'left' | 'right'
  loading?: boolean
  gradient?: boolean
  glow?: boolean
  animated?: boolean
  enterprise?: boolean
}

const EnterpriseButton = forwardRef<HTMLButtonElement, EnterpriseButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'right',
    loading = false,
    gradient = false,
    glow = false,
    animated = true,
    enterprise = false,
    children,
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg'
    }

    const variantClasses = {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
      outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50',
      ghost: 'hover:bg-gray-100 text-gray-700',
      premium: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl',
      success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl',
      danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
    }

    const iconSizes = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6'
    }

    const enterpriseIcon = enterprise ? (
      <div className="flex items-center gap-1">
        <Sparkles className={iconSizes[size]} />
        <Shield className={iconSizes[size]} />
      </div>
    ) : Icon ? (
      <Icon className={iconSizes[size]} />
    ) : null

    return (
      <motion.div
        whileHover={animated ? { scale: 1.02 } : {}}
        whileTap={animated ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
      >
        <Button
          ref={ref}
          className={cn(
            'relative overflow-hidden font-semibold transition-all duration-300 group',
            sizeClasses[size],
            variantClasses[variant],
            gradient && 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700',
            glow && 'shadow-lg hover:shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40',
            enterprise && 'ring-2 ring-green-500/20 hover:ring-green-500/40',
            loading && 'cursor-not-allowed opacity-70',
            className
          )}
          disabled={loading}
          {...props}
        >
          {/* Background Animation */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <Loader2 className={cn('animate-spin', iconSizes[size])} />
            ) : (
              <>
                {iconPosition === 'left' && enterpriseIcon}
                {children}
                {iconPosition === 'right' && enterpriseIcon}
                {!Icon && !enterprise && iconPosition === 'right' && (
                  <ArrowRight className={cn('transition-transform duration-300 group-hover:translate-x-1', iconSizes[size])} />
                )}
              </>
            )}
          </div>

          {/* Glow Effect */}
          {glow && (
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </Button>
      </motion.div>
    )
  }
)

EnterpriseButton.displayName = 'EnterpriseButton'

export { EnterpriseButton }
