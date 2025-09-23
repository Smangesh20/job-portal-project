'use client'

import React, { useState, useCallback } from 'react'
import { Check, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

// ENTERPRISE-GRADE TOGGLE BUTTON SYSTEM - GOOGLE-STYLE PROFESSIONAL IMPLEMENTATION
// This provides the most intuitive and accessible toggle button experience

interface EnterpriseToggleButtonsProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  className?: string
  variant?: 'default' | 'compact' | 'large' | 'pill'
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray'
  maxSelections?: number
  showClearButton?: boolean
  showCount?: boolean
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical' | 'grid'
}

export function EnterpriseToggleButtons({
  options,
  selectedValues,
  onToggle,
  label,
  className = "",
  variant = 'default',
  color = 'blue',
  maxSelections,
  showClearButton = true,
  showCount = true,
  disabled = false,
  orientation = 'horizontal'
}: EnterpriseToggleButtonsProps) {
  
  const handleToggle = useCallback((option: string) => {
    if (disabled) return
    
    // Check max selections limit
    if (maxSelections && selectedValues.length >= maxSelections && !selectedValues.includes(option)) {
      return
    }
    
    onToggle(option)
  }, [onToggle, maxSelections, selectedValues, disabled])

  const handleClearAll = useCallback(() => {
    if (disabled) return
    selectedValues.forEach(value => onToggle(value))
  }, [selectedValues, onToggle, disabled])

  // PROFESSIONAL: Color scheme definitions
  const getColorStyles = () => {
    switch (color) {
      case 'blue':
        return {
          selected: "bg-blue-500 text-white border-blue-500 shadow-blue-200",
          selectedHover: "hover:bg-blue-600 hover:border-blue-600",
          unselected: "bg-white text-gray-700 border-gray-300 hover:border-blue-300",
          unselectedHover: "hover:bg-blue-50 hover:text-blue-700",
          focus: "focus:ring-blue-500",
          clearButton: "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        }
      case 'green':
        return {
          selected: "bg-green-500 text-white border-green-500 shadow-green-200",
          selectedHover: "hover:bg-green-600 hover:border-green-600",
          unselected: "bg-white text-gray-700 border-gray-300 hover:border-green-300",
          unselectedHover: "hover:bg-green-50 hover:text-green-700",
          focus: "focus:ring-green-500",
          clearButton: "text-green-600 hover:text-green-700 hover:bg-green-50"
        }
      case 'purple':
        return {
          selected: "bg-purple-500 text-white border-purple-500 shadow-purple-200",
          selectedHover: "hover:bg-purple-600 hover:border-purple-600",
          unselected: "bg-white text-gray-700 border-gray-300 hover:border-purple-300",
          unselectedHover: "hover:bg-purple-50 hover:text-purple-700",
          focus: "focus:ring-purple-500",
          clearButton: "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        }
      case 'orange':
        return {
          selected: "bg-orange-500 text-white border-orange-500 shadow-orange-200",
          selectedHover: "hover:bg-orange-600 hover:border-orange-600",
          unselected: "bg-white text-gray-700 border-gray-300 hover:border-orange-300",
          unselectedHover: "hover:bg-orange-50 hover:text-orange-700",
          focus: "focus:ring-orange-500",
          clearButton: "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        }
      case 'gray':
        return {
          selected: "bg-gray-500 text-white border-gray-500 shadow-gray-200",
          selectedHover: "hover:bg-gray-600 hover:border-gray-600",
          unselected: "bg-white text-gray-700 border-gray-300 hover:border-gray-400",
          unselectedHover: "hover:bg-gray-50 hover:text-gray-800",
          focus: "focus:ring-gray-500",
          clearButton: "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        }
      default:
        return {
          selected: "bg-blue-500 text-white border-blue-500 shadow-blue-200",
          selectedHover: "hover:bg-blue-600 hover:border-blue-600",
          unselected: "bg-white text-gray-700 border-gray-300 hover:border-blue-300",
          unselectedHover: "hover:bg-blue-50 hover:text-blue-700",
          focus: "focus:ring-blue-500",
          clearButton: "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        }
    }
  }

  // PROFESSIONAL: Variant-based sizing
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          button: "px-3 py-1.5 text-xs font-medium",
          container: "gap-1.5",
          icon: "h-3 w-3"
        }
      case 'large':
        return {
          button: "px-6 py-3 text-base font-semibold",
          container: "gap-3",
          icon: "h-5 w-5"
        }
      case 'pill':
        return {
          button: "px-4 py-2 text-sm font-medium rounded-full",
          container: "gap-2",
          icon: "h-4 w-4"
        }
      default:
        return {
          button: "px-4 py-2 text-sm font-medium",
          container: "gap-2",
          icon: "h-4 w-4"
        }
    }
  }

  // PROFESSIONAL: Orientation-based layout
  const getOrientationStyles = () => {
    switch (orientation) {
      case 'vertical':
        return "flex-col items-start"
      case 'grid':
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
      default:
        return "flex flex-wrap items-center"
    }
  }

  const colorStyles = getColorStyles()
  const variantStyles = getVariantStyles()
  const orientationStyles = getOrientationStyles()

  return (
    <div className={cn("w-full", className)}>
      {/* PROFESSIONAL HEADER */}
      <div className="flex items-center justify-between mb-3">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        {/* PROFESSIONAL ACTION BUTTONS */}
        <div className="flex items-center space-x-2">
          {/* Selection count */}
          {showCount && selectedValues.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selectedValues.length} selected
            </span>
          )}
          
          {/* Clear all button */}
          {showClearButton && selectedValues.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={disabled}
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                colorStyles.clearButton,
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* PROFESSIONAL TOGGLE BUTTONS */}
      <div className={cn(
        "flex",
        variantStyles.container,
        orientationStyles
      )}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option)
          const isDisabled = disabled || (maxSelections && selectedValues.length >= maxSelections && !isSelected)
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleToggle(option)}
              disabled={isDisabled}
              className={cn(
                // Base styles
                "inline-flex items-center justify-center border transition-all duration-200 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                variantStyles.button,
                
                // Rounded corners based on variant
                variant === 'pill' ? "rounded-full" : "rounded-md",
                
                // Selection states
                isSelected ? [
                  colorStyles.selected,
                  colorStyles.selectedHover,
                  "shadow-sm"
                ] : [
                  colorStyles.unselected,
                  colorStyles.unselectedHover
                ],
                
                // Focus ring
                colorStyles.focus,
                
                // Disabled state
                isDisabled && "cursor-not-allowed opacity-50"
              )}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} ${option}`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <Check className={cn(variantStyles.icon, "mr-1.5")} />
              )}
              
              {/* Button text */}
              <span className="truncate">
                {option}
              </span>
              
              {/* Max selection indicator */}
              {maxSelections && selectedValues.length >= maxSelections && !isSelected && (
                <Plus className={cn(variantStyles.icon, "ml-1.5 opacity-50")} />
              )}
            </button>
          )
        })}
      </div>
      
      {/* PROFESSIONAL FOOTER INFO */}
      {maxSelections && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Select up to {maxSelections} options
        </div>
      )}
    </div>
  )
}

// PROFESSIONAL FILTER CHIP SYSTEM
interface EnterpriseFilterChipsProps {
  filters: Array<{
    label: string
    value: string
    count?: number
  }>
  selectedValues: string[]
  onToggle: (value: string) => void
  onClearAll?: () => void
  className?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray'
  showCounts?: boolean
  maxSelections?: number
}

export function EnterpriseFilterChips({
  filters,
  selectedValues,
  onToggle,
  onClearAll,
  className = "",
  color = 'blue',
  showCounts = true,
  maxSelections
}: EnterpriseFilterChipsProps) {
  
  const handleToggle = useCallback((value: string) => {
    // Check max selections limit
    if (maxSelections && selectedValues.length >= maxSelections && !selectedValues.includes(value)) {
      return
    }
    
    onToggle(value)
  }, [onToggle, maxSelections, selectedValues])

  const handleClearAll = useCallback(() => {
    if (onClearAll) {
      onClearAll()
    } else {
      selectedValues.forEach(value => onToggle(value))
    }
  }, [selectedValues, onToggle, onClearAll])

  // PROFESSIONAL: Color scheme for chips
  const getColorStyles = () => {
    switch (color) {
      case 'blue':
        return {
          selected: "bg-blue-100 text-blue-800 border-blue-200",
          selectedHover: "hover:bg-blue-200",
          unselected: "bg-white text-gray-700 border-gray-200",
          unselectedHover: "hover:bg-gray-50",
          removeButton: "text-blue-600 hover:text-blue-700 hover:bg-blue-200"
        }
      case 'green':
        return {
          selected: "bg-green-100 text-green-800 border-green-200",
          selectedHover: "hover:bg-green-200",
          unselected: "bg-white text-gray-700 border-gray-200",
          unselectedHover: "hover:bg-gray-50",
          removeButton: "text-green-600 hover:text-green-700 hover:bg-green-200"
        }
      case 'purple':
        return {
          selected: "bg-purple-100 text-purple-800 border-purple-200",
          selectedHover: "hover:bg-purple-200",
          unselected: "bg-white text-gray-700 border-gray-200",
          unselectedHover: "hover:bg-gray-50",
          removeButton: "text-purple-600 hover:text-purple-700 hover:bg-purple-200"
        }
      case 'orange':
        return {
          selected: "bg-orange-100 text-orange-800 border-orange-200",
          selectedHover: "hover:bg-orange-200",
          unselected: "bg-white text-gray-700 border-gray-200",
          unselectedHover: "hover:bg-gray-50",
          removeButton: "text-orange-600 hover:text-orange-700 hover:bg-orange-200"
        }
      case 'gray':
        return {
          selected: "bg-gray-100 text-gray-800 border-gray-200",
          selectedHover: "hover:bg-gray-200",
          unselected: "bg-white text-gray-700 border-gray-200",
          unselectedHover: "hover:bg-gray-50",
          removeButton: "text-gray-600 hover:text-gray-700 hover:bg-gray-200"
        }
      default:
        return {
          selected: "bg-blue-100 text-blue-800 border-blue-200",
          selectedHover: "hover:bg-blue-200",
          unselected: "bg-white text-gray-700 border-gray-200",
          unselectedHover: "hover:bg-gray-50",
          removeButton: "text-blue-600 hover:text-blue-700 hover:bg-blue-200"
        }
    }
  }

  const colorStyles = getColorStyles()

  return (
    <div className={cn("w-full", className)}>
      {/* PROFESSIONAL FILTER CHIPS */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isSelected = selectedValues.includes(filter.value)
          const isDisabled = maxSelections && selectedValues.length >= maxSelections && !isSelected
          
          return (
            <div
              key={filter.value}
              className={cn(
                "inline-flex items-center rounded-full border transition-all duration-200 ease-in-out",
                "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1",
                isSelected ? [
                  colorStyles.selected,
                  colorStyles.selectedHover
                ] : [
                  colorStyles.unselected,
                  colorStyles.unselectedHover
                ],
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <button
                type="button"
                onClick={() => handleToggle(filter.value)}
                disabled={isDisabled}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  "focus:outline-none",
                  isDisabled && "cursor-not-allowed"
                )}
              >
                <span className="flex items-center">
                  {filter.label}
                  {showCounts && filter.count !== undefined && (
                    <span className="ml-1.5 text-xs opacity-75">
                      ({filter.count})
                    </span>
                  )}
                </span>
              </button>
              
              {/* Remove button for selected chips */}
              {isSelected && (
                <button
                  type="button"
                  onClick={() => handleToggle(filter.value)}
                  className={cn(
                    "ml-1 mr-1 p-0.5 rounded-full transition-colors",
                    "focus:outline-none",
                    colorStyles.removeButton
                  )}
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )
        })}
      </div>
      
      {/* CLEAR ALL BUTTON */}
      {selectedValues.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={handleClearAll}
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
              colorStyles.removeButton
            )}
          >
            <X className="h-4 w-4 mr-1.5" />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
