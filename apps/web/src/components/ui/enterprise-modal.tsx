'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Shield, 
  Sparkles,
  Zap,
  Star
} from 'lucide-react'

interface EnterpriseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'premium' | 'enterprise'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  actions?: {
    primary?: {
      label: string
      onClick: () => void
      loading?: boolean
      disabled?: boolean
    }
    secondary?: {
      label: string
      onClick: () => void
      disabled?: boolean
    }
  }
  badge?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl'
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    borderColor: 'border-blue-200',
    titleColor: 'text-gray-900'
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    borderColor: 'border-green-200',
    titleColor: 'text-green-900'
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    titleColor: 'text-yellow-900'
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    borderColor: 'border-red-200',
    titleColor: 'text-red-900'
  },
  premium: {
    icon: Star,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    titleColor: 'text-yellow-900'
  },
  enterprise: {
    icon: Shield,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    borderColor: 'border-green-200',
    titleColor: 'text-green-900'
  }
}

export function EnterpriseModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  variant = 'default',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  actions,
  badge,
  icon: CustomIcon,
  className
}: EnterpriseModalProps) {
  const config = variantConfig[variant]
  const Icon = CustomIcon || config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          'sm:max-w-md',
          sizeClasses[size],
          'border-0 shadow-2xl bg-white/95 backdrop-blur-sm',
          config.borderColor,
          className
        )}
        onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <DialogHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'p-2 rounded-lg',
                  config.iconBg
                )}>
                  <Icon className={cn('h-5 w-5', config.iconColor)} />
                </div>
                <div>
                  <DialogTitle className={cn(
                    'text-xl font-bold',
                    config.titleColor
                  )}>
                    {title}
                  </DialogTitle>
                  {badge && (
                    <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  )}
                </div>
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {description && (
              <DialogDescription className="text-gray-600 leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Content */}
          {children && (
            <div className="py-4">
              {children}
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              {actions.secondary && (
                <Button
                  variant="outline"
                  onClick={actions.secondary.onClick}
                  disabled={actions.secondary.disabled}
                  className="min-w-[100px]"
                >
                  {actions.secondary.label}
                </Button>
              )}
              {actions.primary && (
                <Button
                  onClick={actions.primary.onClick}
                  disabled={actions.primary.disabled || actions.primary.loading}
                  className={cn(
                    'min-w-[100px]',
                    variant === 'premium' && 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600',
                    variant === 'enterprise' && 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  )}
                >
                  {actions.primary.loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {actions.primary.label}
                      {variant === 'enterprise' && <Shield className="h-4 w-4" />}
                      {variant === 'premium' && <Star className="h-4 w-4" />}
                    </div>
                  )}
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
