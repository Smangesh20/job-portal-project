'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileFormProps {
  children: ReactNode
  className?: string
  onSubmit?: (e: React.FormEvent) => void
}

export function MobileForm({ children, className, onSubmit }: MobileFormProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className={cn(
        'mobile-container mobile-px mobile-py mobile-gap-4',
        className
      )}
    >
      {children}
    </form>
  )
}

interface MobileFormGroupProps {
  children: ReactNode
  className?: string
  label?: string
  error?: string
  required?: boolean
}

export function MobileFormGroup({ 
  children, 
  className, 
  label, 
  error, 
  required 
}: MobileFormGroupProps) {
  return (
    <div className={cn('mobile-flex-col mobile-gap-2', className)}>
      {label && (
        <label className="mobile-text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mobile-text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  error?: boolean
}

export function MobileInput({ className, error, ...props }: MobileInputProps) {
  return (
    <input
      className={cn(
        'w-full mobile-px mobile-py mobile-text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent mobile-focus-visible mobile-touch-manipulation mobile-transition-all',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  )
}

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  error?: boolean
}

export function MobileTextarea({ className, error, ...props }: MobileTextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full mobile-px mobile-py mobile-text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent mobile-focus-visible mobile-touch-manipulation mobile-transition-all resize-none',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  )
}

interface MobileSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
  error?: boolean
  options: { value: string; label: string }[]
}

export function MobileSelect({ className, error, options, ...props }: MobileSelectProps) {
  return (
    <select
      className={cn(
        'w-full mobile-px mobile-py mobile-text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mobile-focus-visible mobile-touch-manipulation mobile-transition-all',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export function MobileButton({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props 
}: MobileButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg mobile-transition-all mobile-touch-manipulation mobile-focus-visible disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500'
  }
  
  const sizeClasses = {
    sm: 'mobile-px mobile-py mobile-text-xs',
    md: 'mobile-px mobile-py mobile-text-sm',
    lg: 'mobile-px mobile-py mobile-text-base'
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {children}
    </button>
  )
}

interface MobileCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
}

export function MobileCheckbox({ label, className, ...props }: MobileCheckboxProps) {
  return (
    <div className={cn('flex items-center mobile-gap-2', className)}>
      <input
        type="checkbox"
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mobile-focus-visible mobile-touch-manipulation"
        {...props}
      />
      {label && (
        <label className="mobile-text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  )
}

interface MobileRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
}

export function MobileRadio({ label, className, ...props }: MobileRadioProps) {
  return (
    <div className={cn('flex items-center mobile-gap-2', className)}>
      <input
        type="radio"
        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mobile-focus-visible mobile-touch-manipulation"
        {...props}
      />
      {label && (
        <label className="mobile-text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  )
}

interface MobileFieldsetProps {
  children: ReactNode
  className?: string
  legend?: string
}

export function MobileFieldset({ children, className, legend }: MobileFieldsetProps) {
  return (
    <fieldset className={cn('mobile-gap-4', className)}>
      {legend && (
        <legend className="mobile-text-sm font-medium text-gray-700 dark:text-gray-300">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  )
}

interface MobileFormActionsProps {
  children: ReactNode
  className?: string
}

export function MobileFormActions({ children, className }: MobileFormActionsProps) {
  return (
    <div className={cn('flex mobile-flex-col mobile-gap-2', className)}>
      {children}
    </div>
  )
}
